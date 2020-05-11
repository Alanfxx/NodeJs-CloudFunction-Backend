module.exports = app => {

    const save = async (req, res) => {
        const peca = {
            name: req.body.name,
            ref: req.body.ref,
            quant: req.body.quant,
        }
        if (req.params.id) peca.id = req.params.id

        if (peca.id) {
            let documentRef = app.config.db.pecas.doc(peca.id)
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