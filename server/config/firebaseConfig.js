//import firebase from "firebase/app";
//import "firebase/storage";
//import "firebase/auth"
const UUID = require("uuid/v4");
var upload = (localFile, remoteFile) => {

  let uuid = UUID();

  return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
          contentType: 'image/png',
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
      .then((data) => {

          let file = data[0];

          return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
      });
}


var admin = require("firebase-admin");
var serviceAccount = require("./babashop-801b2-firebase-adminsdk-v2sok-7134e839e9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://babashop-801b2.firebaseio.com",
  storageBucket: "babashop-801b2.appspot.com"
});

var bucket = admin.storage().bucket();
module.exports = { bucket, upload };
/*
const firebase = require('firebase');
const firebaseStorage = require('firebase/firebase-storage');
const firebaseAuth = require('firebase/firebase-auth');
const firebaseApp = require('firebase/firebase-app')

const firebaseConfig = {
    apiKey: "AIzaSyDECdJrxNTPhL6To7qDD92kDDhN_T8a8AY",
    authDomain: "babashop-801b2.firebaseapp.com",
    databaseURL: "https://babashop-801b2.firebaseio.com",
    projectId: "babashop-801b2",
    storageBucket: "babashop-801b2.appspot.com",
    messagingSenderId: "42028548704",
    appId: "1:42028548704:web:3e8d9b24fa9591de8c7905",
    measurementId: "G-F6NEXGGF26"
  };

  firebase.initializeApp(firebaseConfig);
  const email = "carrien1112@gmail.com";
  const password = "carrien1112";
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(firebaseUser) {
        // Success 
    })
    .catch(function(error) {
        // Error Handling
    });

const storage = firebase.storage();

//export { storage, firebase as default };
module.exports = { storage };
*/