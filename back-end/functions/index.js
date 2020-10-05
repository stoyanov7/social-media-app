const functions = require('firebase-functions');
const app = require('express')();
const firebaseAuth = require('./utils/firebaseAuth');

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
   getAuthenticatedUser 
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

exports.api = functions.region('europe-west3').https.onRequest(app);