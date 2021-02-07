import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAF5bKUjVCH0hPCaUBllKM7atwQqpC-jxA",
    authDomain: "niks-slack-clone.firebaseapp.com",
    projectId: "niks-slack-clone",
    storageBucket: "niks-slack-clone.appspot.com",
    messagingSenderId: "1097074646039",
    appId: "1:1097074646039:web:2345a1d995ddb9da54d052",
    measurementId: "G-4DJELMNCDF"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
// Google Authentification
const provider = new firebase.auth.GoogleAuthProvider(); 
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
// For editting the profile image, need to upload new image to storage
const storage = firebase.storage();
export default db;
export { auth, provider, timestamp, storage };