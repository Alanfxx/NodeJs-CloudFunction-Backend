module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, positiveOrError } = app.api.validation

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
            if(peca.quant !== 0)
                if(!peca.quant) {
                    existsOrError(peca.quant, 'Quantidade não informada')
                }
            positiveOrError(peca.quant, 'Quantidade não pode ser negativa')

            let pecaFromDB
            await app.config.db.pecas.get().then(docs => {
                docs.forEach(doc => {
                    if (doc.data().ref.toUpperCase() === peca.ref.toUpperCase()) {
                        pecaFromDB = {
                            id: doc.id,
                            name: doc.data().name,
                            ref: doc.data().ref,
                            quant: doc.data().quant
                        }
                    }
                })
            })
            if (!req.params.id) {
                notExistsOrError(pecaFromDB, 'Já existe peça com essa referência')
            } else {
                if(pecaFromDB){
                    equalsOrError(pecaFromDB.id, req.params.id,'Já existe peça com essa referência')
                }
            }
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) peca.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.pecas.doc(req.params.id)
            return await documentRef.update(peca)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            return await app.config.db.pecas.add(peca)
                .then(ref => res.status(201).send(ref.id))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        return await app.config.db.pecas.get().then(docs => {
            let pecas = []
            docs.forEach(doc => {
                pecas.push({
                    id: doc.id,
                    name: doc.data().name,
                    ref: doc.data().ref,
                    quant: doc.data().quant
                })
            })
            return res.status(200).json(pecas)
        }).catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.pecas.doc(req.params.id)
        return await documentRef.delete()
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}