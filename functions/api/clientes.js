module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = async (req, res) => {
        const cliente = {
            nome: req.body.nome,
            apelido: req.body.apelido,
            cidade: req.body.cidade,
            tels: req.body.tels,
            aparelhos: req.body.aparelhos,
        }
        //VALIDAÇÕES
        try {
            existsOrError(cliente.nome, 'Nome não informado')
            existsOrError(cliente.tels, 'Telefone não informado')
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) cliente.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.clientes.doc(req.params.id)
            return await documentRef.update(cliente)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            return await app.config.db.clientes.add(cliente)
                .then(ref => res.status(201).send(ref.id))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        return await app.config.db.clientes.get().then(docs => {
            let clientes = []
            docs.forEach(doc => {
                clientes.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    apelido: doc.data().apelido,
                    cidade: doc.data().cidade,
                    tels: doc.data().tels,
                    aparelhos: doc.data().aparelhos
                })
            })
            return res.status(200).json(clientes)
        }).catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        const clienteId = req.params.id
        let documentRef = app.config.db.clientes.doc(clienteId)
        return await documentRef.delete()
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}