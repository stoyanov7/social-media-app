const { db } = require('../utils/admin');

exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
   const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString()
   };

   db
      .collection('screams')
      .add(newScream)
      .then(doc => {
         return res.json({ message: `document with ${doc.id} created successfully!` });
      })
      .catch(err => {
         console.log(err);

         return res.json({ error: "Something went wrong" });
      })
};

exports.getScream = (req, res) => {
   let screamData = {};

   db
      .doc(`/screams/${req.params.screamId}`)
      .get()
      .then((doc) => { 
         if (!doc.exists) {
            return res.status(404).json({ message: 'Scream not found' });
         }

         screamData = doc.data();
         screamData.screamId = doc.id;

         return db.collection('comments')
               .orderBy('createdAt', 'desc')
               .where('screamId', '==', req.params.screamId)
               .get();
      })
      .then((data) => {
         screamData.comments = [];

         data.forEach((doc) => {
            screamData.comments.push(doc.data());
         });

         return res.json(screamData);
      })
      .catch(err => {
         console.log(err);

         return res.status(500).json({ error: err.code });
      });
}

exports.commentOnScream = (req, res) => {
   if (req.body.body.trim() === '') {
      return res.status(400).json({ comment: 'Comment must not be empty!' });
   }

   const newComment = {
      body: req.body.body,
      createdAt: new Date().toISOString(),
      screamId: req.params.screamId,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl
   };

   db
      .doc(`/screams/${req.params.screamId}`)
      .get()
      .then((doc) => {
         if (!doc.exists) {
            return res.status(404).json({ error: 'Scream not found!' });
         }

         return db.collection('comments').add(newComment);
      })
      .then(() => {
        return res.json(newComment);
      })
      .catch((err) => {
         console.log(err);

        return response.status(500).json({ error: "Something went wrong!" });
   });
};