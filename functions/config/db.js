const admin = require('firebase-admin')
admin.initializeApp()

module.exports = app => { 

    const users = admin.firestore().collection('users')
    const pecas = admin.firestore().collection('pecas')
    const ferramentas = admin.firestore().collection('ferramentas')
    const aparelhos = admin.firestore().collection('aparelhos')
    const clientes = admin.firestore().collection('clientes')

    return { users, pecas, ferramentas, aparelhos, clientes }
}