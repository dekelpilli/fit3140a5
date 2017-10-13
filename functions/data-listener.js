var winston = require('winston')
var admin = require("firebase-admin")
var serviceAccount = require("../serviceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140-a5.firebaseio.com"
});

var Decoder = require("./decoder.js")

var snap;
var values =[]
var keys;
admin.database().ref('/rawData').on('value', function(snapshot) {
    values = []
    winston.info("Update received")
    snap = snapshot.val()

    keys = Object.keys(snap)
    for(var i = 0; i< keys.length; i++) {
        values.push(snap[keys[i]])
    }

    dc = new Decoder(values.reverse(), admin)

    dc.decodeAll()
})
