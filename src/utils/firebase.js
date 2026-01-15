// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFhnixnxq7CDWdeJJNK3lAf2_sK_-vM_E",
    authDomain: "sigongplan.firebaseapp.com",
    projectId: "sigongplan",
    storageBucket: "sigongplan.firebasestorage.app",
    messagingSenderId: "53261199202",
    appId: "1:53261199202:web:a1c565c780c04742662e3b",
    measurementId: "G-R3RY8WFL2W"
};

import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, provider };
