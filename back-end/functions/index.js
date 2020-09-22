const functions = require('firebase-functions');
const admin = require('firebase-admin');
var serviceAccount = require("C:\\Users\\georg\\Downloads\\social-media-app-fafc6-firebase-adminsdk-l3epd-d5ecff228b.json");
const app = require('express')();

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://social-media-app-fafc6.firebaseio.com"
});

var firebaseConfig = {
   apiKey: "AIzaSyCrtMnh0hSPmTSM2sFzRFT1PGe0OpnEXgY",
   authDomain: "social-media-app-fafc6.firebaseapp.com",
   databaseURL: "https://social-media-app-fafc6.firebaseio.com",
   projectId: "social-media-app-fafc6",
   storageBucket: "social-media-app-fafc6.appspot.com",
   messagingSenderId: "555719432446",
   appId: "1:555719432446:web:cc1f8021852ff496202daf",
   measurementId: "G-CGLJP5NG0R"
};

 const firebase = require('firebase');
 firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
   db
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

   db
      .collection('screams')
      .add(newScream)
      .then(doc => {
         res.json({ message: `document with ${doc.id} created successfully!` });
      })
      .catch(err => {
         console.log(err);
      })
});

app.post('/signup', (req, res) => {
   const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle
   };

   let token, userId;
   db
      .doc(`/users/${newUser.handle}`)
      .get()
      .then(doc => {
         if (doc.exists) {
            return res.status(400).json({ hadle: 'this handle is already taken!' });
         } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
         }
      })
      .then(data => {
         userId = data.user.uid;
         return data.user.getIdToken();
      })
      .then(idToken => {
         token = idToken;
         var userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
         };

         return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
         return res.status(201).json({ token });
      })
      .catch(err => {
         console.log(err);
         if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: "Email already is use." });
         } else {
            return res.status(500).json({ error: err.code });
         }
      });
})

exports.api = functions.region('europe-west3').https.onRequest(app);