var textToSpeech = require('watson-developer-cloud/text-to-speech/v1');
var ogg = require('ogg');
var opus = require('node-opus');
var Speaker = require('speaker');

var text_to_speech = new textToSpeech({
    //"url": "https://gateway.watsonplatform.net/language-translator/api",
    "username": "8996e846-c292-44f4-9dd5-bea3a97e1a19",
    "password": "J86Il1wBdchQ"
});


function Speech() {
    this.queue = []
    this.params = {
        text: 'Hello from IBM Watson',
        voice: 'en-US_AllisonVoice', // Optional voice
        accept: 'audio/ogg; codec=opus'
    };
    
}

//https://github.com/watson-developer-cloud/node-tts-player
Speech.prototype.play = function($item) {
    text_to_speech.synthesize(this.params)
        .pipe(new ogg.Decoder())
        .on('stream', function(opusStrream) {
            opusStream.pipe(new opus.Decoder())
                .pipe(new Speaker())
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

module.exports = Speech;