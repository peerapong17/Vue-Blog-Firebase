import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC-hmSTOp68E_jM4YUvzRHfOwKgFd9NU8s",
  authDomain: "vue-blog-8717e.firebaseapp.com",
  projectId: "vue-blog-8717e",
  storageBucket: "vue-blog-8717e.appspot.com",
  messagingSenderId: "552165872598",
  appId: "1:552165872598:web:d000b666eff269fd0d8a77",
  measurementId: "G-26L1888JCR",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const arrayField = firebase.firestore.FieldValue;
const storage = app.storage();
const storageRef = storage.ref("Blogs").child("Images");
const timeStamp = firebase.firestore.Timestamp.now();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, db, storage, storageRef, timeStamp, googleProvider, arrayField };
