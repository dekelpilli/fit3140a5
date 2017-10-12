const morseTable = {
    'SL': 'A', 'LSSS': 'B', 'LSLS': 'C', 'LSS': 'D', 'S': 'E', 'SSLS': 'F', 'LLS': 'G', 
    'SSSS': 'H', 'SS': 'I', 'SLLL': 'J', 'LSL': 'K', 'SLSS': 'L', 'LL': 'M', 'LS': 'N', 
    'LLL': 'O', 'SLLS': 'P', 'LLSL': 'Q', 'SLS': 'R', 'SSS': 'S', 'L': 'T', 'SSL': 'U', 
    'SSSL': 'V', 'SLL': 'W', 'LSSL': 'X', 'LSLL': 'Y', 'LLSS': 'Z'
}

let currentWord = ""
let decodedWord = ""

module.exports = {
    decode: function(event, admin) {
        const allData = event.val()
        // get last value
        const keys = Object.keys(allData)
        console.log(allData)
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
                    decodedWord += morseTable[currentWord]
                    currentWord = ""
                }
                return admin.database().ref("/morse").push({"word": decodedWord})
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
        console.log(currentWord + " " + decodedWord)
    }
}
