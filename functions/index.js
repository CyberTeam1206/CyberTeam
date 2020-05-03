const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./Utility/fbAuth');



const { db } = require('./Utility/admin');

const { getAllScreams, postOneScream, getScream}
    = require('./Handlers/screams');

const { signup, login, uploadImage,addUserDetails, getAuthenticatedUser} = require('./Handlers/users');


//Scream routes
app.get('/screams', getAllScreams);
app.post(`/scream`, FBAuth, postOneScream);
app.get('/scream/:screamId',getScream);
//TODO delete scream
//TODO like a scream
//TODO unlike a scream
//TODO comment on scream
//users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user',FBAuth, addUserDetails);
app.get(`/user`, FBAuth, getAuthenticatedUser);





exports.api = functions.region("europe-west1").https.onRequest(app);

