var admin = require("firebase-admin")
var serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fit3140-a5.firebaseio.com"
})

var db = admin.database()
var ref = db.ref("/motionCount")

ref.on("value", function (snapshot) {
    console.log("new val!")
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code)
})

const mock = [
    { type: "start" },
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

function test(n) {
    if (n < mock.length - 1) {
        setTimeout(() => {
            ref.push(mock[n])
            test(++n)
        }, 0)
    }
}

setTimeout(() => {
    ref.push(mock[mock.length - 1])
}, 7000)

test(0)