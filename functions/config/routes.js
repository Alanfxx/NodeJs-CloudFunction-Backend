const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save)) //consign providencia isso
        .get(admin(app.api.user.get))
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save)) //administrador requerido
        .delete(admin(app.api.user.remove))
    
    app.route('/pecas')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.pecas.save))
        .get(admin(app.api.pecas.get))
    app.route('/pecas/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.pecas.save))
        .delete(admin(app.api.pecas.remove))

    app.route('/ferramentas')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.ferramentas.save))
        .get(admin(app.api.ferramentas.get))
    app.route('/ferramentas/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.ferramentas.save))
        .delete(admin(app.api.ferramentas.remove))

    app.route('/aparelhos')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.aparelhos.save))
        .get(admin(app.api.aparelhos.get))
    app.route('/aparelhos/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.aparelhos.save))
        .delete(admin(app.api.aparelhos.remove))
        
    app.route('/clientes')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.clientes.save))
        .get(admin(app.api.clientes.get))
    app.route('/clientes/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.clientes.save))
        .delete(admin(app.api.clientes.remove))
}