var textToSpeech = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
var player = require('play-sound')(opts = {});


var text_to_speech = new textToSpeech({
    "username": "20ee7483-ea2a-4536-b0f4-05611510ff1c",
    "password": "DZ4nzrTgscLM"
});


function Speech() {
    this.queue = []
    this.params = {
        text: 'Hello from IBM Watson',
        voice: 'en-US_AllisonVoice', // Optional voice
        accept: 'audio/wav'
    };
    
}

Speech.prototype.play = function($item) {
    var newParams = this.params
    newParams.text = $item
    var stream = text_to_speech.synthesize(newParams). //generate audio
        pipe(fs.createWriteStream($item+'-audio.wav'));//write audio to file 
    stream.on('finish', function () { //play file when write is done
        player.play($item+'-audio.wav', function(err) {
        if(err) {
            throw err
        }
    })
    })
}

Speech.prototype.playAll = function() {
    while(this.queue.length) { //while there are items in the array
        this.play(this.queue.shift()) //remove from array and play it
    }
}

Speech.prototype.add = function($item) {
    this.queue.push($item)
    if(this.queue.length == 1) { //if list was previously empty, start playing again
        this.playAll()
    }
}

module.exports = Speech;