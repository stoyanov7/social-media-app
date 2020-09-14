const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("C:\\Users\\georg\\Downloads\\social-media-app-fafc6-firebase-adminsdk-l3epd-d5ecff228b.json");

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://social-media-app-fafc6.firebaseio.com"
});

const express = require('express');
const app = express();

app.get('/screams', (req, res) => {
   admin
      .firestore()
      .collection('screams')
      .orderBy('createdAt', 'desc')
      .get()
      .then(data => {
         let screams = [];
         data.forEach(doc => {
            screams.push({
               screamId: doc.id,
               ...doc.data()
            })
         });

         return res.json(screams);
      })
      .catch(err => console.log(err));
});

app.post('/scream', (req, res) => {
   const newScream = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: new Date().toISOString()
   };

   admin
      .firestore()
      .collection('screams')
      .add(newScream)
      .then(doc => {
         res.json({ message: `document with ${doc.id} created successfully!` });
      })
      .catch(err => {
         console.log(err);
      })
});

exports.api = functions.region('europe-west3').https.onRequest(app);