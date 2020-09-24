const admin = require('firebase-admin');
const serviceAccount = require("C:\\Users\\georg\\Downloads\\social-media-app-fafc6-firebase-adminsdk-l3epd-d5ecff228b.json");

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://social-media-app-fafc6.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };