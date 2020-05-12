module.exports = app => {

    const save = async (req, res) => {
        const peca = {
            name: req.body.name,
            ref: req.body.ref,
            quant: req.body.quant,
        }
        //VALIDAÇÕES
        try {
            existsOrError(peca.name, 'Nome não informado')
            existsOrError(peca.ref, 'Referência não informada')
            existsOrError(peca.quant, 'Quantidade não informada')

            if (!req.params.id) {
                let pecaFromDB
                await app.config.db.pecas.get()
                    .then(docs => {
                        docs.forEach(doc => {
                            if (doc.data().name === peca.name) {
                                pecaFromDB = doc.data()
                            }
                        })
                    })
                notExistsOrError(pecaFromDB, 'Peça já cadastrada')
            }
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) peca.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.pecas.doc(req.params.id)
            await documentRef.update(peca)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            await app.config.db.pecas.add(peca)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        app.config.db.pecas.get()
            .then(docs => {
                let pecas = []
                docs.forEach(doc => {
                    pecas.push({
                        id: doc.id,
                        name: doc.data().name,
                        ref: doc.data().ref,
                        quant: doc.data().quant
                    })
                })
                res.status(200).json(pecas)
            })
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.pecas.doc(req.params.id)
        documentRef.delete().then(() => {
            res.status(204).send()
        }).catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}