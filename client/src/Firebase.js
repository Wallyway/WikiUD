import { getAuth, OAuthProvider } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wikiud-3b1c0.firebaseapp.com",
  projectId: "wikiud-3b1c0",
  storageBucket: "wikiud-3b1c0.firebasestorage.app",
  messagingSenderId: "438212874041",
  appId: "1:438212874041:web:13b125e07a6a369dea62e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new OAuthProvider("microsoft.com");

export { auth, provider };
