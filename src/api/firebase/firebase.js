// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhViTn6WsEYBY74mwbmGmFvYJEs2DahBg",
  authDomain: "dweb-91793.firebaseapp.com",
  projectId: "dweb-91793",
  storageBucket: "dweb-91793.firebasestorage.app",
  messagingSenderId: "564344164179",
  appId: "1:564344164179:web:f9f0a159781ceceadd9ba6",
  measurementId: "G-8QVNG9T2K4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
