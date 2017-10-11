var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fit3140-a5.firebaseio.com"
});

var db = admin.database()
var ref = db.ref('/rawData')

var five = require("johnny-five")
var board = new five.Board()

var timeUnit = 1000 //on time unit, in ms. Seven of these mark a word end.
var gap = false

board.on("ready", function () {
  // interfaces for led and motion detector
  var led = new five.Led(13)
  var motion = new five.Motion(6)
  // used to measure time
  var startTime = null
  var endTime = null
  var latestMotion = null

  // turn LED on and measure starting time
  motion.on("motionstart", function () {
      console.log("Start")
      led.on()
      startTime = new Date().getTime()
      if(gap) { //gaps get pushed with the next motion start
        ref.push({
          start: latestMotion,
          end: startTime,
          type: "gap"
        })
      }
      latestMotion = startTime
      gap = false
  })

  // calculate time motion was detected using end time of motion
  motion.on("motionend", function () {
      console.log("End")
      led.off()
      endTime = new Date().getTime()
      latestMotion = endTime      
      if (startTime != null) {
        //add to firebase
            ref.push({
              start: startTime,
              end: endTime,
              type: "mark"
            })
            startTime = null
            endTime = null
          }
  })
  motion.on("data", function(data) {
    //gaps can only occur while there isn't a mark motion going
    if(!(latestMotion === null) && startTime === null && gap === false) { 
      //gaps are only recorded if they are at least 3 time units long
      if((data['timestamp']-latestMotion)>=(3*timeUnit)) {
        console.log("Gap will be added to fb on next start")
        gap = true  
      }
      else {
        gap = false
      }
    }
  })  
})