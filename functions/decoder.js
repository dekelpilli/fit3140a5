var winston = require('winston')

var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
var language_translator = new LanguageTranslatorV2({
    "url": "https://gateway.watsonplatform.net/language-translator/api",
    "username": "8996e846-c292-44f4-9dd5-bea3a97e1a19",
    "password": "J86Il1wBdchQ"
});

const morseTable = {
    'SL': 'A', 'LSSS': 'B', 'LSLS': 'C', 'LSS': 'D', 'S': 'E', 'SSLS': 'F', 'LLS': 'G', 
    'SSSS': 'H', 'SS': 'I', 'SLLL': 'J', 'LSL': 'K', 'SLSS': 'L', 'LL': 'M', 'LS': 'N', 
    'LLL': 'O', 'SLLS': 'P', 'LLSL': 'Q', 'SLS': 'R', 'SSS': 'S', 'L': 'T', 'SSL': 'U', 
    'SSSL': 'V', 'SLL': 'W', 'LSSL': 'X', 'LSLL': 'Y', 'LLSS': 'Z', 'LLLLL': '0', 'SLLLL': '1',
    'SSLLL': '2', 'SSSLL': '3', 'SSSSL':'4', 'SSSSS':'5', 'LSSSS': '6', 'LLSSS': '7',
    'LLLSS': '8', 'LLLLS': '9', 'SSSLSL': 'SK'
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

    console.log(motionLength)

    if(this._delete) {
        this._decodedWord = ""
        this._delete = false
    }

    // if signal is a gap
    if (motionData.type === "gap") {
        // end of letter
        if (motionLength >= 3.0 && motionLength < 7.0) {
            winston.info("Short gap detected")

            // only add letter if it is valid, otherwise ignore
            if (morseTable.hasOwnProperty(this._currentWord)) {
                this._decodedWord += morseTable[this._currentWord]
                this._currentWord = ""
            } else {
                winston.debug(this._currentWord + " is not a valid word")
                this._currentWord = ""
            }
        // end of word
        } else if (motionLength => 7.0) {
            winston.info("Long gap detected")
            
            if (morseTable.hasOwnProperty(this._currentWord)) {
                addition = morseTable[this._currentWord]
                if(addition == "SK") {
                    this._decodedWord = addition
                    return true //end
                } 
                this._decodedWord += addition
                this._currentWord = ""
            } else {
                winston.debug(this._currentWord + " is not a valid word")
                this._currentWord = ""
            }
            if (this._admin) {
                write = this._decodedWord
                this._decodedWord = ""
                if(write.length > 0) {
                    this.pushWithTranslation(write, this._admin.database().ref("/morseDecoded"), motionData.end)
                }
                winston.info("Pushed")
                return
            } else {
                winston.info("DECODED WORD: " + this._decodedWord)
                this._delete = true;
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
        if(this.decode()) {
            console.log("FINISHED:")
            console.log(this._event)
            break
        }
    }
}

Decoder.prototype.pushWithTranslation = function(msg, ref, time) {
    language_translator.translate({
        text: msg, source : 'en', target: 'fr' },
        function (err, translation) {
          if (err)
            console.log('error:', err);
          else
            french = translation['translations'][0]['translation']
            ref.push(
                {
                    "wordEnd": time,
                    "English": msg,
                    "French": french
                })
            winston.info("Pushed " + msg + " to firebase.")
      });
}

module.exports = Decoder;