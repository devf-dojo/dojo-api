const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fire = require("./main")
fire.init();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const userModel = require('./userModel');
const db = require("./db")
const mid = require("./middleware")

//init firebase


const app = express()

//Middleware config
app.use(cors({ origin: true }))
app.use(cookieParser())
//app.use(mid.validateFirebaseIdToken)

//Endpoints
const enpLogin = '/v1/dojo/auth/login'
const enpUserCv = '/v1/dojo/users/:uid/cv'

app.use(enpLogin, (req, res, next) => {
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

    admin.auth().createCustomToken(uid).then((customToken) => {
      res.json({uid: uid, jwt: customToken})
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

app.post(enpUserCv, (req, res, next) => {
	const uid = req.params.uid;
	const cvdata = req.body;

	if(userModel.validateCvUser(cvdata)){
		db.saveCv(uid,cvdata);
		res.json({"status": "created"});
		return;
	}
	res.status(203).json({"status":"error"});
	return;
});

app.get(enpUserCv, (req, res, next) => {
	const uid = req.params.uid
	db.getCv(uid, (value) => {
		var value = value.val();
		console.log(value);
		if(value != null){
			res.json(value);
		}else{
			res.status(203).json({"status":"error"});
		}
	})
})

exports.api = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})
