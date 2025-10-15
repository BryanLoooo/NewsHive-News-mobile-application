// services/firebase.js (compat)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYUrenta2udo7qxTJTkC1WlweaJG-V7pk",
  authDomain: "newshive-1dae5.firebaseapp.com",
  projectId: "newshive-1dae5",
  storageBucket: "newshive-1dae5.firebasestorage.app",
  messagingSenderId: "485293070041",
  appId: "1:485293070041:web:5f0ac46129f9ace8fed0c8",
  measurementId: "G-VTZV4RW9LT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db   = firebase.firestore();