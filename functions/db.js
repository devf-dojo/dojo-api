const admin = require('firebase-admin');


module.exports.getUser = function(uid, func) {
	admin.auth().getUser(uid).then(function(userRecord) {
		func(userRecord)
	}).catch(function(error) {
		func({ "error": error })
	})
}