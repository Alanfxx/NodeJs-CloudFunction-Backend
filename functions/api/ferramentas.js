module.exports = app => {

    const save = async (req, res) => {
        const ferramenta = {
            name: req.body.name,
            quant: req.body.quant,
        }
        //VALIDAÇÕES
        try {
            existsOrError(ferramenta.name, 'Nome não informado')
            existsOrError(ferramenta.quant, 'Quantidade não informada')

            if (!req.params.id) {
                let ferramentaFromDB
                await app.config.db.ferramentas.get()
                    .then(docs => {
                        docs.forEach(doc => {
                            if (doc.data().name === ferramenta.name) {
                                ferramentaFromDB = doc.data()
                            }
                        })
                    })
                notExistsOrError(ferramentaFromDB, 'Ferramenta já cadastrada')
            }
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) ferramenta.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.ferramentas.doc(req.params.id)
            await documentRef.update(ferramenta)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            await app.config.db.ferramentas.add(ferramenta)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        app.config.db.ferramentas.get()
            .then(docs => {
                let ferramentas = []
                docs.forEach(doc => {
                    ferramentas.push({
                        id: doc.id,
                        name: doc.data().name,
                        quant: doc.data().quant
                    })
                })
                res.status(200).json(ferramentas)
            })
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.ferramentas.doc(req.params.id)
        documentRef.delete().then(() => {
            res.status(204).send()
        }).catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}