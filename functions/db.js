const admin = require('firebase-admin');

module.exports.getUser = function(uid, func) {
  admin.auth().getUser(uid).then(function(userRecord) {
    func(userRecord)
  }).catch(function(error) {
    func({ "error": error })
  })
}

module.exports.saveCv = function(uid, cvdata, database) {
  const db = database;
  admin.auth().getUser(uid).then((userRecord) => {
    // an empty array or object will be converted to null
    const cv = db.ref(`/users/${uid}/cv`);

    // TODO: really we need an id when the key is the user uid
    cvdata.id = userRecord.providerData[0].uid
    cv.set(cvdata);

  }).catch(function(error) {
    console.error({ "error": error })
  })

}

module.exports.updateCv = (uid, cvdata, database) => {
  // an empty array or object will be converted to null
  const cv = database.ref(`/users/${uid}/cv`);
  cv.update(cvdata);

}

module.exports.getCv = (uid, database, callback) => {
  const ref = database.ref(`/users/${uid}/cv`);
  ref.on("value", callback, (error) => {
    console.error({ "error": error })

    const dummydata = {
      "name": "",
      "email": "",
      "photo": "",
      "cintas": [
        { "cinta": "", "batch": 0 }
      ],

      "skills": [],
      "bio": "",
      "telefono": "",
      "interests": [],
      "hoobies": [],
      "website": "",
      "social": {
        "github": ""
      },
      "lenguages": []
    }
    callback({ val: () => { return dummydata } })
    //ref.set(dummydata);

  });
}