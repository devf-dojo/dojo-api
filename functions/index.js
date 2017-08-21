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

var bodyParser = require('body-parser');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');

// init firebase

const app = express()

// Middleware config
app.use(cors({ origin: true }))
app.use(cookieParser())

var typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  }
};

var schema = makeExecutableSchema({typeDefs, resolvers});

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/devf-dojo-admin/us-central1/api/graphql'}));

// Enpoint for login with Android
app.get('/v1/dojo/auth/github/login', (req, res) => {
  const code = req.param("code", "");
  if(code == "") {
    res.status(403).json({ error: "Bad request" })
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
        res.status(403).json(json);
      }
      return;
    }

    res.status(403).json({ error: "code not valid or was expired" })
  });
});

app.use(mid.validateFirebaseIdToken)

// Endpoints
const enpUserCv = '/v1/dojo/users/:uid/cv'

app.put(enpUserCv, (req, res) => {
  const uid = req.params.uid;
  const cvdata = req.body;

  if(req.user.user_id != uid) {
    res.status(403).json({ "status": "Unauthorized" });
    return;
  }

  if(cvdata == null || (cvdata.constructor === Object && Object.keys(cvdata).length === 0)) {
    res.status(403).json({ "status": "Bad Request" });
    return;
  }

  if(userModel.validateCvUser(cvdata)) {
    db.updateCv(uid, cvdata);
    db.getCv(uid, (value) => {
      let val = value.val();
      //console.log(val);
      if(val != null) {
        res.status(201).json(val);
      } else {

        res.status(404).json({
          error: "the cv info was not found in the database"

        });
      }
    })
    return;
  }
  res.status(403).json({ "status": "invalid cv\nthe changes not have effects" });
})

app.post(enpUserCv, (req, res) => {
  const uid = req.params.uid;
  const cvdata = req.body;

  if(userModel.validateCvUser(cvdata)) {
    db.saveCv(uid, cvdata);
    db.getCv(uid, (value) => {
      let val = value.val();
      //console.log(val);
      if(val != null) {
        res.status(201).json(val);
      } else {
        res.status(404).json({
          error:  "the cv info was not found in the database"
        });
      }
    });
    return;
  }
  res.status(403).json({ "status": "invalid cv" });
});

app.get(enpUserCv, (req, res) => {

  const uid = req.params.uid
  db.getCv(uid, (value) => {
    let val = value.val();
    //console.log(val);
    if(val != null) {
      res.json(val);
    } else {
      res.status(404).json({
        error: "data not found",
        "error-description": "the cv info was not found in the database"
      });
    }
  })

})

exports.api = functions.https.onRequest((request, response) => {
  if(!request.path) {
    request.url = '/' + request.url; // prepend '/' to keep query params if any
  }
  return app(request, response)
})
