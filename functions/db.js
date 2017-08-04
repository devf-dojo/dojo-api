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
	const root = db.ref("/users");
	const newUser = root.child(uid);
	newUser.set(cvdata);

}