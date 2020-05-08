const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        let user
        await app.config.db.users.get()
            .then(docs => {
                docs.forEach(doc => {
                    if (doc.data().email == req.body.email) {
                        user = doc.data()
                    }
                })
            })
        if(!user) return res.status(400).send('Usuário não encontrado!')
        
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3) //Expiração pra 3 dias
        }

        res.json({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            admin: payload.admin,
            iat: payload.iat,
            exp: payload.exp,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = res.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            //problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}