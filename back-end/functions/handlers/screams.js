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