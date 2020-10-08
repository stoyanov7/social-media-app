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
   getUserDetails,
   markNotificationsRead 
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
app.post('/notifications', firebaseAuth, markNotificationsRead);

exports.api = functions.region('europe-west3').https.onRequest(app);

exports.createNotificationOnLike = functions
   .region('europe-west3')
   .firestore
   .document('likes/{id}')
   .onCreate((snapshot) => {
      return db
         .doc(`/screams/${snapshot.data().screamId}`)
         .get()
         .then((doc) => {
            if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
         .catch((err) => console.log(err));
   })

exports.deleteNotificationOnUnlike = functions
   .region('europe-west3')
   .firestore
   .document('likes/{id}')
   .onCreate((snapshot) => { 
      return db
         .doc(`/notifications/${snapshot.id}`)
         .delete()
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
      return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
         if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
      .catch((err) => {
         console.log(err);
         return;
      })
   });

exports.onUserImageChange = functions
   .region('europe-west3')
   .firestore
   .document('/users/{userId}')
   .onUpdate((change) => {
      if (change.before.data().imageUrl !== change.after.data().imageUrl) {
         let batch = db.batch();

         return db
            .collection('screams')
            .where('userHandle', '==', change.before.data().handle)
            .get()
            .then((data) => {
               data.forEach(doc => {
                  const scream = db.doc(`/screams/${doc.id}`);
                  batch.update(scream, { userImage: change.after.data().imageUrl });
               });

               return batch.commit();
            });
      } else {
         return true;
      }
   });

exports.onScreamDelete = functions
   .region('europe-west3')
   .firestore
   .document('/screams/{screamId}')
   .onDelete((snapshot, context) => {
      const screamId = context.params.screamId;
      const batch = db.batch();

      return db
         .collection('comments')
         .where('screamId', '==', screamId)
         .get()
         .then(data => {
            data.forEach(doc => {
               batch.delete(db.doc(`/comments/${doc.id}`))
            });

            return db.collection('likes').where('screamId', '==', screamId).get();
         })
         .then(data => {
            data.forEach(doc => {
               batch.delete(db.doc(`/likes/${doc.id}`))
            });

            return db.collection('notifications').where('screamId', '==', screamId).get();
         })
         .then(data => {
            data.forEach(doc => {
               batch.delete(db.doc(`/notifications/${doc.id}`))
            });

            return batch.commit();
         })
         .catch(err => console.log(err));
   })