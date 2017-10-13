var express = require("express")
var app = express()
var server = require("http").Server(app)
var io = require("socket.io")(server)
var admin = require("firebase-admin")
var sensor = require("./sensor.js")
var five = require("johnny-five")

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140-a5.firebaseio.com"
});

var db = admin.database()
var ref = db.ref('/rawData')

app.use("/", express.static(__dirname + '/')); 

server.listen(8000, function() {
  console.log('Listening on port 8000') 
})

sensor(io, five, ref)