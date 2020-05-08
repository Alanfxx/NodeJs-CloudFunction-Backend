const admin = require('firebase-admin')
admin.initializeApp()

module.exports = app => { 

    const users = admin.firestore().collection('users')

    return { users }
}