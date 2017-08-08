var myfunctions = require("../index")
var MockExpress = require('mock-express'),
	assert = require('assert');

var app = MockExpress(); // notice there's no "new"
const enpoint = '/api/v1/dojo/users/caTdznCemngTmnFxMDCZeUUXRNk1/cv'
const host = 'http://localhost:5002/devf-dojo-admin/us-central1'

const data = {
    "bio": "Ya casi termino mi api dsdsd",
    "email": "e.beltran@gmail.com",
    "id": "9815363",
    "name": "Emmanuel Beltran Fuentes",
    "photo": "http://www.google.com",
    "social": {
        "github": "http://www.google.com"
    },
    "telefono": "5560793169",
    "website": "http://www.google.com"
}



var req = app.makeRequest({ 'host': host });
var res = app.makeResponse(function(err, sideEffects) {
	assertEqual(sideEffects.model, data);
	done(); // this is the callback used by mocha to indicate test completion
});

app.invoke('get', enpoint, req, res);