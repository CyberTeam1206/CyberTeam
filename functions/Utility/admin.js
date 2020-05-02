const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(require('C:\\Users\\Тарас\\Desktop\\cyberteam-functions\\functions\\admin.json'))
   // databaseURL: "https://cyberrr-8219c.firebaseio.com",
});

const db  = admin.firestore();

module.exports = {admin, db};