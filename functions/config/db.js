const admin = require('firebase-admin')
admin.initializeApp()

module.exports = app => { 

    const users = admin.firestore().collection('users')
    const pecas = admin.firestore().collection('pecas')
    const ferramentas = admin.firestore().collection('ferramentas')

    return { users, pecas, ferramentas }
}