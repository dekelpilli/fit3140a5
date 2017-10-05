const functions = require('firebase-functions')
const functions = require('firebase-admin')

var morseTable = {
    'SL': 'A', 'LSSS': 'B', 'LSLS': 'C', 'LSS': 'D', 'S': 'E', 'SSLS': 'F', 'LLS': 'G', 
    'SSSS': 'H', 'SS': 'I', 'SLLL': 'J', 'LSL': 'K', 'SLSS': 'L', 'LL': 'M', 'LS': 'N', 
    'LLL': 'O', 'SLLS': 'P', 'LLSL': 'Q', 'SLS': 'R', 'SSS': 'S', 'L': 'T', 'SSL': 'U', 
    'SSSL': 'V', 'SLL': 'W', 'LSSL': 'X', 'LSLL': 'Y', 'LLSS': 'Z'
}

exports.updateData = functions.database.ref('/motionCount')
    .onWrite(event => {
        console.log("Hello from Firebase!")

        // getting length of motion
        let motionLength = parseFloat(event.data.end) - parseFLoat(event.data.start)
        // converting to seconds
        motionLength = motionLength / 1000

        // if signal is a gap
        if (event.data.type === "gap") {
            if (motionLength >= 3.0 && motionLength <= 7.0) {
                
            } else if (motionLength > 7.0) {
                
            }
        } else if (event.data.type == "mark") {
            if (motionLength <= 3.0) {
                
            } else if (motionLength > 3.0 && motionLength <= 7.0) {
                
            }
        }


        // return admin.database().ref("/morse").push({"word": })
    })
