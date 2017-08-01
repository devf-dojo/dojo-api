const functions = require('firebase-functions');
const userModel = require('./userModel');
const db = require("./db")
const admin = require('firebase-admin');

try {
  const serviceAccount = require("../certs/serviceAccountKey.json");

  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://devf-dojo-admin.firebaseio.com"
    }
  );
} catch(e) {
  admin.initializeApp(functions.config().firebase);
}

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
  const user = req.body.uid;

  db.getUser(user, (user_info) =>{
    if(user_info["error"] !== undefined) {
      res.json(403, user_info)
    } else {
      res.json(user_info)
    }
  });
})

exports.usercv = functions.https.onRequest((req, res) => {
  const data = req.body;
  const is_valid = userModel.validateCvUser(data)
  if(!is_valid) {
    res.json(400, {
      error: {
        code: "CvUser/invalid",
        message: "The CvUser malformated or invalid"
      }
    })
    return;
  }
  res.json(data)
})