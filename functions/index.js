const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fire = require("./main")
fire.init();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const request = require('request');
const userModel = require('./userModel');
const db = require("./db")
const mid = require("./middleware")


//init firebase

const app = express()

//Middleware config
app.use(cors({ origin: true }))
app.use(cookieParser())
app.use(mid.validateFirebaseIdToken)


// Enpoint for login with Android
app.get('/v1/dojo/auth/github/login', (req, res, next) => {
  const code = req.param("code", "");
  if(code == "") {
    res.json(403, { error: "Bad request" })
    return;
  }
  request.post({
    url: `https://github.com/login/oauth/access_token?client_id=${functions.config().github.public}&` +
    `client_secret=${functions.config().github.secret}&` +
    `code=${code}&accept=json`,
    headers: {
      'Accept': 'application/json',
    },

  }, function(error, response, body) {
    if(response && response.statusCode == 200) {
      const json = JSON.parse(response.body);
      if(json.access_token != null) {
        res.json(json);
      } else {
        res.json(403, json);
      }
      return;
    }

    res.json(403, { error: "code not valid or was expired" })
  });
});




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
      res.json(401, user_info)
      return;
    }
    var uid = user_info.uid;

    admin.auth().createCustomToken(uid).then((customToken) => {
      res.json({ uid: uid, jwt: customToken })
    }).catch((error) => {
      console.error("Error creating custom token:", error);

      res.json(500, {
        error: {
          code: "Error creating custom token",
          message: error
        }
      })
    })
  });
})

app.put(enpUserCv, (req, res, next) => {
  const uid = req.params.uid;
  const cvdata = req.body;

  if(req.user.user_id != uid) {
    res.json(403, { "status": "Unauthorized" });
    return;
  }

  if(cvdata == null || (cvdata.constructor === Object && Object.keys(cvdata).length === 0)) {
    res.json(400, { "status": "Bad Request" });
    return;
  }

  if(userModel.validateCvUser(cvdata)) {
    db.updateCv(uid, cvdata);
    db.getCv(uid, (value) => {
      let val = value.val();
      //console.log(val);
      if(val != null) {
        res.json(201, val);
      } else {
        res.json(404, {
          error:  "the cv info was not found in the database"
        });
      }
    })
    return;
  }
  res.status(403).json({ "status": "invalid cv\nthe changes not have effects" });
})

app.post(enpUserCv, (req, res, next) => {
  const uid = req.params.uid;
  const cvdata = req.body;

  if(userModel.validateCvUser(cvdata)) {
    db.saveCv(uid, cvdata);
    db.getCv(uid, (value) => {
      let val = value.val();
      //console.log(val);
      if(val != null) {
        res.json(201, val);
      } else {
        res.json(404, {
          error:  "the cv info was not found in the database"
        });
      }
    });
    return;
  }
  res.status(403).json({ "status": "invalid cv" });
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
  if(!request.path) {
    request.url = `/${request.url}` // prepend '/' to keep query params if any
  }
  return app(request, response)
})
