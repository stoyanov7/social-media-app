const functions = require('firebase-functions');
const app = require('express')();
const firebaseAuth = require('./utils/firebaseAuth');

const { db } = require('./utils/admin');

const { 
   getAllScreams, 
   postOneScream, 
   getScream, 
   commentOnScream,
   likeScream,
   unlikeScream, 
   deleteScreams
} = require('./handlers/screams');

const { 
   signup, 
   login, 
   uploadImage, 
   addUserDetails, 
   getAuthenticatedUser,
   getUserDetails 
} = require('./handlers/users');

app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', firebaseAuth, commentOnScream);
app.get('/scream/:screamId/like',firebaseAuth, likeScream);
app.get('/scream/:screamId/unlike',firebaseAuth, unlikeScream);
app.delete('/scream/:screamId', firebaseAuth, deleteScreams)

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage);
app.post('/user', firebaseAuth, addUserDetails);
app.get('/user', firebaseAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
//app.post('/notifications', firebaseAuth, markNotificationsRead);

exports.api = functions.region('europe-west3').https.onRequest(app);

exports.createNotificationOnLike = functions
   .region('europe-west3')
   .firestore
   .document('likes/{id}')
   .onCreate((snapshot) => {
      db
         .doc(`/screams/${snapshot.data().screamId}`)
         .get()
         .then((doc) => {
            if (doc.exists) {
               return db.doc(`/notifications/${snapshot.id}`).set({
                  createdAt: new Date().toISOString(),
                  recipient: doc.data().userHandle,
                  sender: snapshot.data().userHandle,
                  type: 'like',
                  read: false,
                  screamId: doc.id
               });
            }
         })
         .then(() => {
            return;
         })
         .catch((err) => {
            console.log(err);
            return;
         })
   })

exports.deleteNotificationOnUnlike = functions
   .region('europe-west3')
   .firestore
   .document('likes/{id}')
   .onCreate((snapshot) => { 
      db
         .doc(`/notifications/${snapshot.id}`)
         .delete()
         .then(() => {
            return;
         })
         .catch((err) => {
            console.log(err);
            return;
         })
   });

exports.createNotificationOnComment = functions
   .region('europe-west3')
   .firestore
   .document('comments/{id}')
   .onCreate((snapshot) => {
      db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
         if (doc.exists) {
            return db.doc(`/notifications/${snapshot.id}`).set({
               createdAt: new Date().toISOString(),
               recipient: doc.data().userHandle,
               sender: snapshot.data().userHandle,
               type: 'comment',
               read: false,
               screamId: doc.id
            });
         }
      })
      .then(() => {
         return;
      })
      .catch((err) => {
         console.log(err);
         return;
      })
   });