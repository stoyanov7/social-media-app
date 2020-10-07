const admin = require('firebase-admin');
const serviceAccount = require('../utils/serviceKey')

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://social-media-app-fafc6.firebaseio.com",
   storageBucket: "gs://social-media-app-fafc6.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };