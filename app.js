var chai = require('chai')
var expect = chai.expect;

var dc = require('./functions/decoder')

describe('decoder testing', function() {
it('One word',
    function() {
        obj = new dc([
            // gap between words
            { end: "29000", start: "22000", type: "gap" },
            // S
            { end: "2000", start: "1000", type: "mark" },
            { end: "3000", start: "2000", type: "mark" },
            { end: "4000", start: "3000", type: "mark" },
            // gap between letters
            { end: "8000", start: "4000", type: "gap" },
            // O
            { end: "10000", start: "7000", type: "mark" },
            { end: "13000", start: "10000", type: "mark" },
            { end: "16000", start: "13000", type: "mark" },
            // gap between letters
            { end: "19000", start: "16000", type: "gap" },
            // S                      
            { end: "20000", start: "19000", type: "mark" },
            { end: "21000", start: "20000", type: "mark" },
            { end: "22000", start: "21000", type: "mark" }
            ], null)
        obj.decodeAll()

        expect(obj._decodedWord).to.equal("SOS")
    })

it('Seperate words',
    function() {
        obj = new dc([
            { end: 107500, start: 100500, type: 'gap' },
            { end: 100500, start: 96000, type: 'mark' },
            { end: 96000, start: 93000, type: 'gap' },
            { end: 93000, start: 91500, type: 'mark' },
            { end: 90500, start: 89000, type: 'mark' },
            { end: 88000, start: 86500, type: 'mark' },
            { end: 86500, start: 83500, type: 'gap' },
            { end: 83500, start: 82000, type: 'mark' },
            { end: 82000, start: 79000, type: 'gap' },
            { end: 79000, start: 74500, type: 'mark' },
            { end: 74500, start: 67500, type: 'gap' },
            { end: 67500, start: 63000, type: 'mark' },
            { end: 62000, start: 60500, type: 'mark' },
            { end: 60500, start: 53500, type: 'gap' },
            { end: 53500, start: 52000, type: 'mark' },
            { end: 51000, start: 49500, type: 'mark' },
            { end: 48500, start: 47000, type: 'mark' },
            { end: 47000, start: 44000, type: 'gap' },
            { end: 44000, start: 42500, type: 'mark' },
            { end: 41500, start: 40000, type: 'mark' },
            { end: 40000, start: 33000, type: 'gap' },
            { end: 33000, start: 31500, type: 'mark' },
            { end: 30500, start: 29000, type: 'mark' },
            { end: 28000, start: 26500, type: 'mark' },
            { end: 26500, start: 23500, type: 'gap' },
            { end: 23500, start: 22000, type: 'mark' },
            { end: 21000, start: 19500, type: 'mark' },
            { end: 19500, start: 16500, type: 'gap' },
            { end: 16500, start: 15000, type: 'mark' },
            { end: 14000, start: 12500, type: 'mark' },
            { end: 11500, start: 10000, type: 'mark' },
            { end: 9000, start: 7500, type: 'mark' },
            { end: 7500, start: 4500, type: 'gap' },
            { end: 4500, start: 0, type: 'mark' }
        ], null)
        obj.decodeAll()

        expect(obj._decodedWord).to.equal("TEST")
    })

it('One word with invalid letter',
    function() {
        obj = new dc([
            // gap between words
            { end: "29000", start: "22000", type: "gap" },
            // S
            { end: "2000", start: "1000", type: "mark" },
            { end: "3000", start: "2000", type: "mark" },
            { end: "4000", start: "3000", type: "mark" },
            // gap between letters
            { end: "8000", start: "4000", type: "gap" },
            // O
            { end: "10000", start: "7000", type: "mark" },
            { end: "13000", start: "10000", type: "mark" },
            { end: "15000", start: "14000", type: "mark" },
            { end: "16000", start: "15000", type: "mark" },
            // gap between letters
            { end: "19000", start: "16000", type: "gap" },
            // S                      
            { end: "20000", start: "19000", type: "mark" },
            { end: "21000", start: "20000", type: "mark" },
            { end: "22000", start: "21000", type: "mark" }
            ], null)
        obj.decodeAll()

        expect(obj._decodedWord).to.equal("SS")
    })
})