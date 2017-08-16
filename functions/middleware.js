const admin = require('firebase-admin');
const functions = require('firebase-functions');
functions.config()

exports.validateFirebaseIdToken = (req, res, next) => {
  const authorization = req.header("Authorization");
  if ((!authorization || !authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    res.status(403).json({ "error": "Token invalid" });
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
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).json({ "error": "Unauthorized" });
  });
};