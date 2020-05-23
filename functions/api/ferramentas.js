module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, positiveOrError } = app.api.validation

    const save = async (req, res) => {
        const ferramenta = {
            name: req.body.name,
            quant: req.body.quant,
        }
        //VALIDAÇÕES
        try {
            existsOrError(ferramenta.name, 'Nome não informado')
            if(ferramenta.quant !== 0)
                if(!ferramenta.quant) {
                    existsOrError(ferramenta.quant, 'Quantidade não informada')
                }
            positiveOrError(ferramenta.quant, 'Quantidade não pode ser negativa')

            let ferramentaFromDB
            await app.config.db.ferramentas.get().then(docs => {
                docs.forEach(doc => {
                    if (doc.data().name.toUpperCase() === ferramenta.name.toUpperCase()) {
                        ferramentaFromDB = {
                            id: doc.id,
                            name: doc.data().name,
                            quant: doc.data().quant
                        }
                    }
                })
            })
            if (!req.params.id) {
                notExistsOrError(ferramentaFromDB, 'Já existe ferramenta com esse nome')
            } else {
                if(ferramentaFromDB){
                    equalsOrError(ferramentaFromDB.id, req.params.id,'Já existe ferramenta com esse nome')
                }
            }
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) ferramenta.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.ferramentas.doc(req.params.id)
            return await documentRef.update(ferramenta)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            return await app.config.db.ferramentas.add(ferramenta)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        return await app.config.db.ferramentas.get().then(docs => {
            let ferramentas = []
            docs.forEach(doc => {
                ferramentas.push({
                    id: doc.id,
                    name: doc.data().name,
                    quant: doc.data().quant
                })
            })
            res.status(200).json(ferramentas)
        }).catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.ferramentas.doc(req.params.id)
        return await documentRef.delete()
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}