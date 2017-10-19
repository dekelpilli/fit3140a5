var textToSpeech = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
var player = require('play-sound')(opts = {});



var text_to_speech = new textToSpeech({
    //"url": "https://gateway.watsonplatform.net/language-translator/api",
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
    text_to_speech.synthesize(newParams).
        pipe(fs.createWriteStream($item+'-audio.wav'));    
    player.play($item+'-audio.wav', function(err) {
        if(err) {
            throw err
        }
    })
    }

Speech.prototype.playAll = function() {
    while(this.queue.length) {
        this.play(this.queue.shift())
    }
}

Speech.prototype.add = function($item) {
    this.queue.push($item)
    if(this.queue.length == 1) {
        this.play()
    }
}

var a = new Speech()
a.play("whatever")

module.exports = Speech;