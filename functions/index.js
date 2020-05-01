const functions = require('firebase-functions');
const admin = require("firebase-admin");
const app = require('express')();
//const serviceAccount = require("../admin.json");

admin.initializeApp({
    credential: admin.credential.cert(require('C:\\Users\\Тарас\\Desktop\\cyberteam-functions\\functions\\admin.json'))
   // databaseURL: "https://cyberrr-8219c.firebaseio.com",
});
const config = {
    apiKey: "AIzaSyDNzPoNyKsSxtaU0frqzVlsfKu1sAH55y4",
    authDomain: "cyberrr-8219c.firebaseapp.com",
    databaseURL: "https://cyberrr-8219c.firebaseio.com",
    projectId: "cyberrr-8219c",
    storageBucket: "cyberrr-8219c.appspot.com",
    messagingSenderId: "710526151269",
    appId: "1:710526151269:web:9dbe4b191750be8e61348c",
    measurementId: "G-DTNDER4WCV"
};


const firebase = require('firebase');
firebase.initializeApp(config);

const db  = admin.firestore();
app.get('/screams', (req , res) => {
//exports.getScreams = functions.https.onRequest((req,res) =>{
      db
      .collection('screams')
      .orderBy('createdAt','desc')
      .get()
      .then((data) => {
          let screams =[];
          data.forEach((doc) => {
              screams.push({
                  screamId: doc.id,
                  body: doc.data().body,
                  userHandle: doc.data().userHandle,
                  createdAt: doc.data().createdAt
                  });
          });
          return res.json(screams);
            })
      .catch((err) => console.error(err));
});


app.post('/scream',(req , res) => {
//exports.createScream = functions.https.onRequest((req, res) => {


   const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
};
   db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
                res.json({message: `document ${doc.id} created successfully`});
        })
        .catch(err => {
            res.status(500).json({error: err.toString()});
            console.error(err);

        });

});

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//signUp route
app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors = {};

    if (isEmpty(newUser.email)){
        errors.email = "Email do not be empty"
    }

    // validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({handle: `this handle is already taken`});
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
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === `auth/email-already-in-use`) {
                return res.status(400).json({email: `Email is already in use`})
            } else {
                return res.status(500).json({error: err.code});
            }
        });
});
 /*           token = token;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString();
                userId
            };
            db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if(err.code === `auth/email-already-in-use`) {
                return res.status(400).json({email: `Email is already in use`})
            } else {
                return res.status(500).json({error:err.code});
            }
        });
});
firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
.then((data) => {
    return res.status(201).json({message: `user ${data.user.uid} sighed up successfully`});
})
    .catch((err) => {
        console.err(err);
        return res.status(500).json ({error: err.code});
    });*/

exports.api = functions.https.onRequest(app);

