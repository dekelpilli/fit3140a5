var decoder = require("./functions/decoder.js")

const snapshot = {
    signals: {
    },
    val: function() {
        return this.signals
    },
    count: 0
}

function morseSimulator(msg, callBack) {
    var morseCharacterToEncodingTable = {
        'A': 'SL',
        'B': 'LSSS',
        'C': 'LSLS',
        'D': 'LSS',
        'E': 'S',
        'F': 'SSLS',
        'G': 'LLS',
        'H': 'SSSS',
        'I': 'SS',
        'J': 'SLLL',
        'K': 'LSL',
        'L': 'SLSS',
        'M': 'LL',
        'N': 'LS',
        'O': 'LLL',
        'P': 'SLLS',
        'Q': 'LLSL',
        'R': 'SLS',
        'S': 'SSS',
        'T': 'L',
        'U': 'SSL',
        'V': 'SSSL',
        'W': 'SLL',
        'X': 'LSSL',
        'Y': 'LSLL',
        'Z': 'LLSS',
        'SK': 'LLSSLL'

    };

    var INTER_CODE = 1000;
    var INTER_LETTER = 3000;
    var INTER_WORDS = 7000;
    var words = msg.split(" ");
    while(words.indexOf("") > -1) {
        words.splice(words.indexOf(""), 1);
    }
    console.log('I got ' + words.length + ' words');
    var word = "";
    var codeIndex = 0;
    var letterCode = [];
    var letters = [];
    var ptn;
    var events = [];
    var startDate = 0//Date.now();

    function buildEvents() {

        for (var i = 0; i < words.length; i++) {

            word = words[i]; // get a word
            console.log(word);
            letters = word.split(""); // split the word in to an array of letters
            for (var j = 0; j < letters.length; j++) {
                letterCode = morseCharacterToEncodingTable[letters[j]].split(""); // split the code
                for (var k = 0; k < letterCode.length - 1; k++) {
                    events.push({ code: letterCode[k], time: INTER_CODE });
                }
                if ((j === letters.length - 1)) { // if this is the last code in the last word or last letter in a word
                    events.push({ code: letterCode[letterCode.length - 1], time: INTER_WORDS });
                } else {
                    events.push({ code: letterCode[letterCode.length - 1], time: INTER_LETTER });
                }
            }
        }

        // putting data in firebase-like format
        let time = 0
        let count = 0
        for (let i = 0; i < events.length; i++) {
            let signalLen = 0
            // short or long motion
            if (events[i].code == "S") {
                signalLen = 1500
            } else {
                signalLen = 4500
            }
            // adding motion to object
            snapshot.signals[count.toString()] = {
                "end": time + signalLen,
                "start": time,
                "type": "mark"
            }
            snapshot.count++
            count++
            time = time + signalLen

            // short or long gap
            if (events[i].time != 1000) {
                snapshot.signals[count.toString()] = {
                    "end": time + events[i].time,
                    "start": time,
                    "type": "gap"
                }
                snapshot.count++
                count++
            }
            time = time + events[i].time
        }
    }


    function loop() {
        if (codeIndex === snapshot.count) {
            clearInterval(ptn);
        } else {

            let mock = {
                signals: {
                },
                val: function() {
                    return this.signals
                }
            }

            // passing in objects from snapshot
            // just like the input it would receive from firebase
            for (let i = 0; i <= codeIndex; i++) {
                mock.signals[i.toString()] = snapshot.signals[i.toString()]
            }

            callBack(mock);
            codeIndex++

            if (codeIndex != snapshot.count) {
                ptn = setTimeout(loop, snapshot.signals[codeIndex.toString()].end - snapshot.signals[codeIndex.toString()].start);
            }
        }
    }

    buildEvents();
    console.log(events)
    loop();
}

function dc(signal) {
    decoder.decode(signal, null)
}

function idk(test, testing) {
    console.log("input = " + test)
}

module.exports = idk;

morseSimulator("THIS IS A TEST", decoder);














