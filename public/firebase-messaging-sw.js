// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHpT8yrU63XHjUOKc1rAeh1SjsF5XSOeQ",
  authDomain: "what-to-eat-c0751.firebaseapp.com",
  projectId: "what-to-eat-c0751",
  storageBucket: "what-to-eat-c0751.firebasestorage.app",
  messagingSenderId: "810673032559",
  appId: "1:810673032559:web:209ad8ce77059d20c06c9a",
  measurementId: "G-RJRFJT6E7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);