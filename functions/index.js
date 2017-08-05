const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

const userModel = require('./userModel');
const db = require("./db");

// init the admin
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://devf-dojo-admin.firebaseio.com"
});
const database = admin.database();
// init express
const app = express()
app.use(cors({ origin: true }))
app.use(cookieParser())

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.json(403, { error: 'Unauthorized' });
    return;
  }

  let idToken;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    //console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.json(500, { error });
  });
};
app.use(validateFirebaseIdToken)


app.use('/v1/dojo/auth/login', (req, res, next) => {
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
      res.json(401, user_info)
      return;
    }
    var uid = user_info.uid;

    admin.auth().createCustomToken(uid).then((customToken) => {
      res.json({ uid: uid, jwt: customToken })
    }).catch((error) => {
      console.log("Error creating custom token:", error);

      res.json(500, {
        error: {
          code: "Error creating custom token",
          message: error
        }
      })
    })
  });
})

app.use('/v1/dojo/users/:uid/cv', (req, res, next) => {
  var uid = req.params.uid

  if(req.method == 'POST' || req.method == 'PUT') {
    if(req.user.user_id != uid) {
      res.json(403, { "status": "Unauthorized" });
      return;
    }
    var cvdata = req.body;
    if(cvdata == null || (cvdata.constructor === Object && Object.keys(cvdata).length === 0)) {
      res.json(400, { "status": "Bad Request" });
      return;

    }

    if(userModel.validateCvUser(cvdata)) {
      //save data
      if(req.method == 'PUT') {
        db.updateCv(uid, cvdata, database);
        res.json(200, { "status": "updated" });
      } else {
        db.saveCv(uid, cvdata, database);
        res.json(201, { "status": "created" });
      }
      return;
    }
    res.json(400, { "status": "invalid cv" });
    return;
  }

  if(req.method == 'GET') {
    db.getCv(uid, database, (value) => {
      const val = value.val();
      if(val == null) {
        res.json(404, {
          error: {
            code: "data not found",
            message: "the cv info was not found in the database"
          }
        });
        return;
      }
      res.json(val);
    });
  }

})

exports.api = functions.https.onRequest((request, response) => {
  if(!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})
