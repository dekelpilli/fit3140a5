# Assignment 5, Team 2

### Testing
To run the tests, from the main folder, enter the following command:  
`mocha app.js`

### Decoding
`index.js` reads data from from the firebase, then calls `decoder.js` to convert the data into words. This is all handled via firebase functions.

Alternatively, you may use `auth-server.js` to do this locally, although this should not be necessary.

### Viewing & Listening
Use `node client-side-reader.js` from the *functions* folder to view data on the firebase. This will update with any new morseDecoded pushes.  
Additionally, this will trigger `text-to-speech.js` to create .wav files and play them when you first open `cient-side-reader.js` and every time it senses new data.

### Sensor & Authentication
To use the sensor, you must be logged in with a Monash email. To do so, run `auth-server.js` in the *functions* and load `localhost:8000`, then log in. Once you have logged in with a Monash email, the system will open up the sensor. The sensor will automatically connect to the firebase and send the motion information.  

This is handled in `index.html` and `sensor.js`.
