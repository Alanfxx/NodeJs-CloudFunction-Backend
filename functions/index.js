const functions = require('firebase-functions')
const consign = require('consign')
const app = require('express')()

consign()
    .include('./config/db.js')
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('/api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

//uma magia simples, porém inquebrável
exports.api = functions.https.onRequest(app)