const admin = require('firebase-admin');
const functions = require('firebase-functions');
functions.config()

const database = admin.database(); //database object

const defaultModel = {
	"name": "",
	"email": "",
	"photo": "",
	"cintas": [
	],

	"skills": [],
	"biography": "",
	"phone": "",
	"interests": [],
	"hobbies": [],
	"website": "",
	"github": "",
	"languages": []
};


module.exports.getUser = function(uid, func) {
	admin.auth().getUser(uid).then(function(userRecord) {
		func(userRecord)
	}).catch(function(error) {
		func({ "error": error })
	})
}

module.exports.saveCv = function(uid, cvdata) {

	const cv = database.ref(`/users/${uid}/cv`);
	cv.set(cvdata);

}

module.exports.updateCv = function(uid, cvdata) {

	const cv = database.ref(`/users/${uid}/cv`);
	cv.update(cvdata);

}

module.exports.getCv = (uid, callback) => {
	const ref = database.ref(`/users/${uid}/cv`);
	ref.on("value", callback, (error) => {

		//ref.set(defaultModel);
		callback({ val: () => { return dummydata } })

	});
}