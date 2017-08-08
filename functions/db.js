const admin = require('firebase-admin');
const functions = require('firebase-functions');
functions.config()

const database = admin.database(); //database object

const defaultModel = {		
	"name":"",
	"email":"",
	"photo" : "",
	"cintas" : [
		{"cinta":"", "batch":0}
	],

	"skills": [],
	"bio": "",
	"telefono": "",
	"interests": [],
	"hoobies": [],
	"website": "",
	"social": {
			"github":""
		},
	"lenguages": []
	};


module.exports.getUser = function(uid, func) {
	admin.auth().getUser(uid).then(function(userRecord) {
		func(userRecord)
	}).catch(function(error) {
		func({ "error": error })
	})
}

module.exports.saveCv = function(uid, cvdata){
	
	admin.auth().getUser(uid).then((userRecord) => {
		const cv = database.ref(`/users/${uid}/cv`);
		cvdata.id = userRecord.providerData[0].uid
		cv.set(cvdata);

	}).catch(function(error) {
		console.log({ "error": error })
	})
}

module.exports.getCv = (uid, callback) => {
	const ref =  database.ref(`/users/${uid}/cv`);
	ref.on("value", callback, (error) => {
		ref.set(defaultModel);
	});
}