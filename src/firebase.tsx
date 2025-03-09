// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCg8zZ45FxTrUSw2Ui4oKsYArePdwJDS20",
    authDomain: "chat-app-dfdfa.firebaseapp.com",
    projectId: "chat-app-dfdfa",
    storageBucket: "chat-app-dfdfa.firebasestorage.app",
    messagingSenderId: "951633814428",
    appId: "1:951633814428:web:53f956bd39674912685e59",
    measurementId: "G-SJ7VC3NZBK",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
