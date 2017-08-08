const functions = require('firebase-functions');
const admin = require('firebase-admin');


exports.init = function(){
	const serviceAccount = require("./serviceAccountKey.json");
	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://devf-dojo-admin.firebaseio.com"
	});
}
// init express
