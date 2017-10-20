/**
 * Created by Nawfal on 5/12/2017.
 */

function morseSimulator(msg, callBack) {
    var morseCharacterToEncodingTable = {
        'A' : 'SL',
        'B' : 'LSSS',
        'C' : 'LSLS',
        'D' : 'LSS',
        'E' : 'S',
        'F' : 'SSLS',
        'G' : 'LLS',
        'H' : 'SSSS',
        'I' : 'SS',
        'J' : 'SLLL',
        'K' : 'LSL',
        'L' : 'SLSS',
        'M' : 'LL',
        'N' : 'LS',
        'O' : 'LLL',
        'P' : 'SLLS',
        'Q' : 'LLSL',
        'R' : 'SLS',
        'S' : 'SSS',
        'T' : 'L',
        'U' : 'SSL',
        'V' : 'SSSL',
        'W' : 'SLL',
        'X' : 'LSSL',
        'Y' : 'LSLL',
        'Z' : 'LLSS',
        'SK': 'LLSSLL'

    };

    var INTER_CODE   = 1000;
    var INTER_LETTER = 3000;
    var INTER_WORDS  = 7000;
    var words        = msg.split(" ");
    console.log('I got ' + words.length + ' words');
    var word        = "";
    var codeIndex   = 0;
    var letterCode  = [];
    var letters     = [];
    var ptn;
    var events      = [];

    function buildEvents() {

        for (var i = 0; i < words.length; i++) {

            word = words[i]; // get a word
            console.log(word);
            letters = word.split(""); // split the word in to an array of letters
            for (var j = 0; j < letters.length; j++) {
                letterCode = morseCharacterToEncodingTable[letters[j]].split(""); // split the code
                for (var k = 0; k < letterCode.length - 1; k++) {
                    events.push({code: letterCode[k], time: INTER_CODE});
                }
                if ( (j === letters.length-1 )) { // if this is the last code in the last word or last letter in a word
                    events.push({code: letterCode[letterCode.length - 1], time: INTER_WORDS});
                } else {
                    events.push({code: letterCode[letterCode.length - 1], time: INTER_LETTER});
                }
            }
        }
        //Insert the SK
        letterCode = morseCharacterToEncodingTable['SK'].split(""); // split the code
        for (k = 0; k < letterCode.length - 1; k++) {
            events.push({code: letterCode[k], time: INTER_CODE});
        }
        events.push({code: letterCode[letterCode.length - 1], time: INTER_WORDS});
        //  console.log(events);

    }


    function loop() {
        if (codeIndex === events.length) {
            clearInterval(ptn);
        } else {
            //console.log(events[codeIndex].code);
            callBack(events[codeIndex].code);
            ptn = setTimeout(loop, events[codeIndex++].time);
        }
    }


    buildEvents();
    loop();
}
function decoder(signal) {
    console.log(signal)
}
morseSimulator("SOS", decoder);
