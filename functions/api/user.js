const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10) //quantidade de passos para processar os dados
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        }
        if (req.params.id) user.id = req.params.id
        if (req.user && req.user.admin) {
            if (req.body.admin && req.originalUrl.startsWith('/users')) user.admin = req.body.admin
        }

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            if (!user.id) {
                let userFromDB
                await app.config.db.users.get()
                    .then(docs => {
                        docs.forEach(doc => {
                            if (doc.data().email === user.email) {
                                userFromDB = doc.data()
                            }
                        })
                    })
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (mssg) {
            return res.status(400).send(mssg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.id) {
            let documentRef = app.config.db.users.doc(user.id)
            await documentRef.update(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            await app.config.db.users.add(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        app.config.db.users.get()
            .then(docs => {
                let users = []
                docs.forEach(doc => {
                    users.push({
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email
                    })
                })
                res.status(200).json(users)
            })
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.users.doc(req.params.id)
        documentRef.delete().then(() => {
            res.status(204).send()
        }).catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}
//put salva com o id que vem na requisição, o firebase n gera automaticamente
//put insere o id como atributo do user (talvez isso seja util)