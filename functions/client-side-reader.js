var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");

var Speech = require("./text-to-speech.js")
var textSpeaker = new Speech();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140-a5.firebaseio.com"
});

var db = admin.database()
var ref = db.ref('/morseDecoded')

var logged = {}

ref.on('value', function(snapshot) {
    keys = Object.keys(snapshot.val())
    words = {}
    for (i = 0; i < keys.length; i++) { 
        item = snapshot.val()[keys[i]]
        words[item["wordEnd"]] = {"English": item["English"], "French": item["French"]}
        //console.log("wrong log: " + words[item["wordEnd"]])
    }
    wordKeys = Object.keys(words)
    for (i = 0; i < wordKeys.length; i++) { 
        if(!(wordKeys[i] in logged)) {
            console.log("English: " + words[wordKeys[i]].English + ", French: " + words[wordKeys[i]].French)
            textSpeaker.add(words[wordKeys[i]].English)
            logged[wordKeys[i]] = words[wordKeys[i]]
        }
    } 
})