# assignment-5-team2

### Testing
To run the tests, from the main folder, enter the following command:  
`mocha app.js`

### Decoding
`data-listener.js` reads data from from the firebase, then calls `decoder.js` to convert the data into words.

### Viewing
Use `node client-side-reader.js` from the *functions* folder to view data on the firebase. This will update with any new morseDecoded pushes.

### Sensor
Use `node sensor.js` from the *functions* folder to get data from the Arduino and push to the rawData on the firebase. 

### Authentication
At first, we attempted to implement authentication via `auth-server.js` and `index.html`, but were unable to compelete it. 