// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sanduestate-85bf9.firebaseapp.com",
  projectId: "sanduestate-85bf9",
  storageBucket: "sanduestate-85bf9.appspot.com",
  messagingSenderId: "278597019131",
  appId: "1:278597019131:web:d3092b9bf112952261175e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);