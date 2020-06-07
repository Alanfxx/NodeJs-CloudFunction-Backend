module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = async (req, res) => {
        const aparelho = {
            tipo: req.body.tipo,
            modelo: req.body.modelo,
            marca: req.body.marca,
            dono: req.body.dono,
            estado: req.body.estado,
            dte: req.body.dte,
            dts: req.body.dts,
            descricao: req.body.descricao
        }
        //VALIDAÇÕES
        try {
            existsOrError(aparelho.tipo, 'Tipo não informado')
            existsOrError(aparelho.modelo, 'Modelo não informado')
            existsOrError(aparelho.marca, 'Marca não informada')
            existsOrError(aparelho.estado, 'Estado não informado')
            existsOrError(aparelho.dte, 'Data de entrada não informada')
        } catch (mssg) {
            return res.status(400).send(mssg)
        }
        // if (req.params.id) aparelho.id = req.params.id
        if (req.params.id) {
            let documentRef = app.config.db.aparelhos.doc(req.params.id)
            return await documentRef.update(aparelho)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            return await app.config.db.aparelhos.add(aparelho)
                .then(ref => res.status(201).send(ref.id))
                .catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        return await app.config.db.aparelhos.get().then(docs => {
            let aparelhos = []
            docs.forEach(doc => {
                aparelhos.push({
                    id: doc.id,
                    tipo: doc.data().tipo,
                    modelo: doc.data().modelo,
                    marca: doc.data().marca,
                    dono: doc.data().dono,
                    estado: doc.data().estado,
                    dte: doc.data().dte,
                    dts: doc.data().dts,
                    descricao: doc.data().descricao
                })
            })
            return res.status(200).json(aparelhos)
        }).catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        let documentRef = app.config.db.aparelhos.doc(req.params.id)
        return await documentRef.delete()
            .then(() => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    return { save, get, remove }
}