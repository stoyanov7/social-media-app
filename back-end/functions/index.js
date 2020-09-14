const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("C:\\Users\\georg\\Downloads\\social-media-app-fafc6-firebase-adminsdk-l3epd-d5ecff228b.json");

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://social-media-app-fafc6.firebaseio.com"
});

exports.helloWorld = functions.https.onRequest((request, response) => {
   response.send("Hello from Firebase!");
});

exports.getScreams = functions.https.onRequest((req, res) => {
   admin
      .firestore()
      .collection('screams')
      .get()
      .then(data => {
         let screams = [];
         data.forEach(doc => {
            screams.push(doc.data())
         });

         return res.json(screams);
      })
      .catch(err => console.log(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
   if (req.method !== 'POST') {
      return res.status(400).json({ error: 'Method not allowed! '});
   }

   const newScream = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: admin.firestore.Timestamp.fromDate(new Date())
   };

   admin
      .firestore()
      .collection('screams')
      .add(newScream)
      .then(doc => {
         res.json({message: `document with ${doc.id} created successfully!` });
      })
      .catch(err => {
         console.log(err);
      })
});