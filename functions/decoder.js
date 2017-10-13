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
    //const allData = this._event //assumes data has alraedy undergone .val() 
    // get last value
    const keys = Object.keys(this._event)

    // console.log(allData)
    const motionData = this._event[keys[keys.length-1]]
    this._event.splice(keys.length-1,1)

    // getting length of motion
    let motionLength = parseFloat(motionData.end) - parseFloat(motionData.start)
    console.log(motionLength)
    // converting to seconds
    motionLength = motionLength / 1000

    // if signal is a gap
    if (motionData.type === "gap") {
        // end of letter
        if (motionLength >= 3.0 && motionLength < 7.0) {
            console.log("Short gap detected")

            // only add letter if it is valid, otherwise ignore
            if (morseTable.hasOwnProperty(this._currentWord)) {
                this._decodedWord += morseTable[this._currentWord]
                this._currentWord = ""
            } 
        // end of word
        } else if (motionLength => 7.0) {
            console.log("Long gap detected")

            if (morseTable.hasOwnProperty(this._currentWord)) {
                this._decodedWord += morseTable[this._currentWord] + " "
                this._currentWord = ""
            }
            if (this._admin) {
                return this._admin.database().ref("/morse").push({"word": this._decodedWord})
            } else {
                // console.log("DECODED WORD: " + decodedWord)
            }
        }
    } else if (motionData.type == "mark") {
        // short mark
        if (motionLength < 3.0) {
            console.log("Short mark detected")
            this._currentWord += "S"
        // long mark
        } else if (motionLength => 3.0 && motionLength <= 7.0) {
            console.log("Long mark detected")
            this._currentWord += "L"
        }
    }
    console.log("Morse code: " + this._currentWord + ", Decoded: " + this._decodedWord)
}

Decoder.prototype.decodeAll = function() {
    while(this._event.length > 0) {
        this.decode();
    }
}


module.exports = Decoder;

/*
module.exports = {
    decode: function(event, admin) {
        const allData = event.val() 
        // get last value
        const keys = Object.keys(allData)
        // console.log(allData)
        const motionData = allData[keys[keys.length-1]]

        // getting length of motion
        let motionLength = parseFloat(motionData.end) - parseFloat(motionData.start)
        // converting to seconds
        motionLength = motionLength / 1000

        // if signal is a gap
        if (motionData.type === "gap") {
            // end of letter
            if (motionLength >= 3.0 && motionLength < 7.0) {
                console.log("Short gap detected")

                // only add letter if it is valid, otherwise ignore
                if (morseTable.hasOwnProperty(currentWord)) {
                    decodedWord += morseTable[currentWord]
                    currentWord = ""
                } 
            // end of word
            } else if (motionLength => 7.0) {
                console.log("Long gap detected")

                if (morseTable.hasOwnProperty(currentWord)) {
                    decodedWord += morseTable[currentWord] + " "
                    currentWord = ""
                }
                if (admin) {
                    return admin.database().ref("/morse").push({"word": decodedWord})
                } else {
                    // console.log("DECODED WORD: " + decodedWord)
                }
            }
        } else if (motionData.type == "mark") {
            // short mark
            if (motionLength < 3.0) {
                console.log("Short mark detected")
                currentWord += "S"
            // long mark
            } else if (motionLength => 3.0 && motionLength <= 7.0) {
                console.log("Long mark detected")
                currentWord += "L"
            }
        }
        console.log("Morse code: " + currentWord + ", Decoded: " + decodedWord)
    }
}*/
