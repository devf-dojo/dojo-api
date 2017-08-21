const admin = require('firebase-admin');
const functions = require('firebase-functions');
functions.config()

exports.getFirebaseIdToken = (req, res, next) => {
  const authorization = req.header("Authorization");
  if ((!authorization || !authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    next();
    return;
  }

  let idToken;
  if (authorization && authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = authorization.split('Bearer ')[1];
  } else {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }

  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch((error) => {
    req.user_error = error;
    next();
  });
};

exports.validateFirebaseIdToken = (req, res, next) => {
  if (req.user_error != undefined) {
    res.status(500).json(req.user_error);
    return;
  }

  if (req.user === undefined) {
    res.status(403).json({ "error": "you need a access Token" });
    return;
  }
};