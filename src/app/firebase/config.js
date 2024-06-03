// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBuBgOfdD0k_QtunUVZY4wXdfVm-t8onRQ",
  authDomain: "hadiary-5e17e.firebaseapp.com",
  projectId: "hadiary-5e17e",
  storageBucket: "hadiary-5e17e.appspot.com",
  messagingSenderId: "162213869252",
  appId: "1:162213869252:web:cdf5b327fe7b0ad633fb91",
  measurementId: "G-5SNMZXWZFY",
};

const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);
const auth = getAuth(firebase_app);

export { auth, firebase_app, db, storage };
