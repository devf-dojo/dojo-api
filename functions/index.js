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

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
// init firebase

const app = express()

const database = admin.database(); //database object

// Middleware config
app.use(cors({ origin: true }))
app.use(cookieParser())


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


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type Belt {
  belt: String
  batch: Int
}

input BeltInput {
  belt: String
  batch: Int
}

type Cv {
  name: String
  email: String
  photo: String
  belts: [Belt]
  skills: [String]
  biography: String
  phone: String
  interests: [String]
  hobbies: [String]
  website: String
  facebook: String
  twitter: String
  linkedin: String
  github: String

  languages: [String]
}

input CvInput {
  name: String
  email: String
  photo: String
  belts: [BeltInput]
  skills: [String]
  biography: String
  phone: String
  interests: [String]
  hobbies: [String]
  website: String
  facebook: String
  twitter: String
  linkedin: String
  github: String

  languages: [String]
}

type Query {
  hello: String
  cv(uid: String!): Cv
}

type Mutation {
  updateCv(uid: String!, input: CvInput!): Cv
  CreateCv(uid: String!): Cv
}
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  cv: (args, _, context) => {
    const ref = database.ref(`/users/${args.uid}/cv`);
    return ref.once('value').then((value) => {
      return value.val()
    })
  },
  updateCv: (args, _, context) => {
    if(args.token == undefined || context.user.user_id != args.uid){
      return null;
    }
    const ref = database.ref(`/users/${args.uid}/cv`);
    ref.update(args.input);
    return ref.once('value').then((value) => {
      return value.val()
    })
  },
  createCv: (args, _, context) => {
    if(args.token == undefined || context.user.user_id != args.uid){
      return null;
    }
    const ref = database.ref(`/users/${args.uid}/cv`);
    ref.set(args.input);
    return ref.once('value').then((value) => {
      return value.val()
    })
  },
};

app.use(mid.getFirebaseIdToken)

app.use('/graphql', graphqlHTTP((request) => ({
  schema: schema,
  rootValue: Object.assign({}, root, {context: request }),
  graphiql: true
})));

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
