const admin = require('firebase-admin');


module.exports.getUser = function(uid){
	record = admin.auth().getUser(uid).then(function(userRecord){
	 console.log("Successfully fetched user data:", userRecord.toJSON());
	}).catch(function(error){
		console.log("Error", error);
	})

	return record

}