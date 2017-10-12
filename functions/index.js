const functions = require('firebase-functions')
const admin = require('firebase-admin')
const decoder = require("./decoder.js")

exports.updateData = functions.database.ref('/motionCount')
    .onWrite(event => {
        decoder.decode(event.data)
    })
