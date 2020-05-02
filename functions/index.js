const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./Utility/fbAuth');



const { db } = require('./Utility/admin');

const { getAllScreams, postOneScream}
    = require('./Handlers/screams');

const { signup, login} = require('./Handlers/users');


//Scream routes
app.get('/screams', getAllScreams);
app.post(`/scream`, FBAuth, postOneScream);

//users routes
app.post('/signup', signup);
app.post('/login', login);





exports.api = functions.region("europe-west1").https.onRequest(app);

