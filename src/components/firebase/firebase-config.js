// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYbWO_Wu0SbOmheiJHkKjEh5E0gKRPK4w",
  authDomain: "react-firebase-34f42.firebaseapp.com",
  projectId: "react-firebase-34f42",
  storageBucket: "react-firebase-34f42.firebasestorage.app",
  messagingSenderId: "957830847037",
  appId: "1:957830847037:web:c29aa4cb1acbd336722854",
  measurementId: "G-6B2KHCWZJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export {auth};
// const analytics = getAnalytics(app);