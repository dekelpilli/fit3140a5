var winston = require('winston')

const morseTable = {
    'SL': 'A', 'LSSS': 'B', 'LSLS': 'C', 'LSS': 'D', 'S': 'E', 'SSLS': 'F', 'LLS': 'G', 
    'SSSS': 'H', 'SS': 'I', 'SLLL': 'J', 'LSL': 'K', 'SLSS': 'L', 'LL': 'M', 'LS': 'N', 
    'LLL': 'O', 'SLLS': 'P', 'LLSL': 'Q', 'SLS': 'R', 'SSS': 'S', 'L': 'T', 'SSL': 'U', 
    'SSSL': 'V', 'SLL': 'W', 'LSSL': 'X', 'LSLL': 'Y', 'LLSS': 'Z'
}

let currentWord = ""
let decodedWord = ""

function Decoder(event, admin) {
    this._currentWord = ""
    this._decodedWord = ""
    this._event = event
    this._admin = admin
}

Decoder.prototype.decode = function() {
    // get last value
    const keys = Object.keys(this._event)

    const motionData = this._event[keys[keys.length-1]]
    this._event.splice(keys.length-1,1)

    // getting length of motion
    let motionLength = parseFloat(motionData.end) - parseFloat(motionData.start)
    // converting to seconds
    motionLength = motionLength / 1000

    // if signal is a gap
    if (motionData.type === "gap") {
        // end of letter
        if (motionLength >= 3.0 && motionLength < 7.0) {
            winston.info("Short gap detected")

            // only add letter if it is valid, otherwise ignore
            if (morseTable.hasOwnProperty(this._currentWord)) {
                this._decodedWord += morseTable[this._currentWord]
                this._currentWord = ""
            } 
        // end of word
        } else if (motionLength => 7.0) {
            winston.info("Long gap detected")
            
            if (morseTable.hasOwnProperty(this._currentWord)) {
                this._decodedWord += morseTable[this._currentWord] + " "
                this._currentWord = ""
            }
            if (this._admin) {
                this._admin.database().ref("/morseDecoded").push(
                    {
                        "wordEnd": motionData.end,
                        "Value": this._decodedWord
                    })
                winston.info("Pushed")
                return
            } else {
                winston.info("DECODED WORD: " + decodedWord)
            }
        }
    } else if (motionData.type == "mark") {
        // short mark
        if (motionLength < 3.0) {
            winston.info("Short mark detected")
            this._currentWord += "S"
        // long mark
        } else if (motionLength => 3.0 && motionLength <= 7.0) {
            winston.info("Long mark detected")
            this._currentWord += "L"
        }
    }
    winston.info("Morse code: " + this._currentWord + ", Decoded: " + this._decodedWord)
}

Decoder.prototype.decodeAll = function() {
    winston.info("Reading started")
    console.log(this._event)
    console.log(Object.keys(this._event).length)
    while(Object.keys(this._event).length > 0) {
        this.decode();
    }
}



var dbAdmin = require("firebase-admin")

var serviceAccount = require("../serviceAccountKey.json")
dbAdmin.initializeApp({
  credential: dbAdmin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140-a5.firebaseio.com"
});
var snap;
var values =[]
var keys;
dbAdmin.database().ref('/rawData').on('value', function(snapshot) {
    values = []
    winston.info("Update received")
    snap = snapshot.val()

    keys = Object.keys(snap)
    for(var i = 0; i< keys.length; i++) {
        values.push(snap[keys[i]])
    }

    dc = new Decoder(values, dbAdmin)

    dc.decodeAll()
})

module.exports = Decoder;