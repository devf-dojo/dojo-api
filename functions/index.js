const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');

const userModel = require('./userModel');
const db = require("./db");

// init the admin
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://devf-dojo-admin.firebaseio.com"
});

// init express
const app = express()
app.use(cors({ origin: true }))
/*app.get("*", (request, response) => {
  response.send("Hello from Express on Firebase with CORS! No trailing slash required!")
})*/
app.use('/v1/dojo/get_user', (req, res, next) => {
 if(req.method != "POST") {
    res.json(405, {
      error: {
        code: "method not allowed",
        message: `the method ${req.method} is not allowed, please try again with a post`
      }
    })
    return;
  }
  const user = req.body.uid;

  db.getUser(user, (user_info) => {
    if(user_info["error"] !== undefined) {
      res.json(403, user_info)
      return;
    }
    var uid = user_info.uid;
    //res.json(user_info)

    admin.auth().createCustomToken(uid).then((customToken) => {
      res.json({uid: uid, jwt: customToken})
    }).catch((error) => {
      console.log("Error creating custom token:", error);

      res.json(400, {
        error: {
          code: "Error creating custom token",
          message: error
        }
      })
    })
  });
})

app.use('/v1/dojo/is_cv_valid', (req, res, next) => {
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

exports.api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})
