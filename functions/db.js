const admin = require('firebase-admin');




module.exports.getUser = function(uid, func) {
	admin.auth().getUser(uid).then(function(userRecord) {
		func(userRecord)
	}).catch(function(error) {
		func({ "error": error })
	})
}

module.exports.saveCv = function(uid, cvdata, database){
	const db = database;
	admin.auth().getUser(uid).then((userRecord) => {
		const cv = db.ref(`/users/${uid}/cv`);
		cvdata.id = userRecord.providerData[0].uid
		cv.set(cvdata);

	}).catch(function(error) {
		console.log({ "error": error })
	})

}

module.exports.getCv = (uid, database, callback) => {
	var ref =  database.ref(`/users/${uid}/cv`);

	ref.on("value", callback, (error) => {
		console.log(error);
	});
}