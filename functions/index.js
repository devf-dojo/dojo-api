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