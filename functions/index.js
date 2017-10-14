var winston = require('winston')
var functions = require('firebase-functions')
var admin = require("firebase-admin")

var Decoder = require("./decoder.js")

var snap;
var values = []
var keys;

exports.updateData = functions.database.ref('/rawData')
    .onWrite(event => {
        values = []
        winston.info("Update received")
        snap = event.val()
    
        keys = Object.keys(snap)
        for(var i = 0; i< keys.length; i++) {
            values.push(snap[keys[i]])
        }
    
        dc = new Decoder(values.reverse(), admin)
    
        dc.decodeAll()
    })
