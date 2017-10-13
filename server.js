var admin = require("firebase-admin")
var serviceAccount = require("./serviceAccountKey.json")
var decoder = require("./functions/decoder.js")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fit3140-a5.firebaseio.com"
})

var db = admin.database()
var ref = db.ref("/rawData")

ref.on("value", function (snapshot) {
    decoder.decode(snapshot, admin)
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code)
})

const mock = [
    { end: "2", start: "1", type: "mark" },
    { end: "3", start: "2", type: "mark" },
    { end: "4", start: "3", type: "mark" },
    // gap between letters
    { end: "7", start: "4", type: "gap" },
    // O
    { end: "10", start: "7", type: "mark" },
    { end: "13", start: "10", type: "mark" },
    { end: "16", start: "13", type: "mark" },
    // gap between letters
    { end: "19", start: "16", type: "gap" },
    // S
    { end: "20", start: "19", type: "mark" },
    { end: "21", start: "20", type: "mark" },
    { end: "22", start: "21", type: "mark" },
    // gap between words
    { end: "29", start: "22", type: "gap" }
]

// function pushMock(counter) {
//     if (counter < mock.length) {
//         let motionLength = parseInt(mock[counter].end) - parseInt(mock[counter].start)
//         motionLength = motionLength*1000*2
//         setTimeout(() => {
//             counter++
//             pushMock(counter)
//         }, motionLength)
//         ref.push(mock[counter])
//     }
// }

// pushMock(0)