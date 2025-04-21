
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDp59_V56RYa_bAgRBW3U5MwrSAl6sD95s",
  authDomain: "gpa-mate-836c5.firebaseapp.com",
  projectId: "gpa-mate-836c5",
  storageBucket: "gpa-mate-836c5.firebasestorage.app",
  messagingSenderId: "726046666954",
  appId: "1:726046666954:web:ad93f19bc87e4f35288433",
  measurementId: "G-3H1Y1SVRLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
