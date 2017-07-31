const functions = require('firebase-functions');
const userModel = require('./userModel');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.addMessage = functions.https.onRequest((req, res) => {
	const original = req.query.text;

	admin.database().ref('/messages').push({original: original}).then(snapshot => {
		res.redirect(303, snapshot.ref);
	})
})

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
	.onWrite(event => {
		const original = event.data.val()
		console.log('Uppercasing', event.params.pushId, original);
		const uppercase = original.toUpperCase();

		return event.data.ref.parent.child('uppercase').set(uppercase)
	})

exports.mirror = functions.https.onRequest((req, res) => {

	res.json(req.body)
})

exports.createuser = functions.https.onRequest((req, res) => {
	const data = req.body;
	console.log(data)

	if(userModel.validateNewUser(data)){
		admin.database().ref('/users').push(data)
		res.json({"status":"User Created"})
	}else {
		res.json({"status":"Bad Request"})
	}

})

exports.usercv = functions.https.onRequest((req, res) => {
	const data = req.body;

	
})