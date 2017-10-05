var admin = require("firebase-admin")
var serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fit3140-a5.firebaseio.com"
})

var db = admin.database()
var ref = db.ref("/motionCount")

ref.on("value", function (snapshot) {
    console.log(snapshot)
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code)
})

// S
ref.push({end: "2", start: "1", type: "mark" })
ref.push({ end: "3", start: "2", type: "mark" })
ref.push({ end: "4", start: "3", type: "mark" })
// gap between letters
ref.push({ end: "7", start: "4", type: "gap" })
// O
ref.push({ end: "10", start: "7", type: "mark" })
ref.push({ end: "13", start: "10", type: "mark" })
ref.push({ end: "16", start: "13", type: "mark" })
// gap between letters
ref.push({ end: "19", start: "16"type: "gap" })
// S
ref.push({ end: "20", start: "19", type: "mark" })
ref.push({ end: "21", start: "20", type: "mark" })
ref.push({ end: "22", start: "21", type: "mark" })