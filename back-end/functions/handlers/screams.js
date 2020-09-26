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