var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

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
        words[item["wordEnd"]] = item["Value"]
        //console.log("wrong log: " + words[item["wordEnd"]])
    }
    wordKeys = Object.keys(words)
    for (i = 0; i < wordKeys.length; i++) { 
        if(!(wordKeys[i] in logged)) {
            console.log(words[wordKeys[i]])
            logged[wordKeys[i]] = words[wordKeys[i]]
        }
    } 
})