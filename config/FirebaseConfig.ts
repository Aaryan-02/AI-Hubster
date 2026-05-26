// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsX5IApMCYdJYeGh-Wpik-YxQTR6M2SEw",
  authDomain: "ai-hubster.firebaseapp.com",
  projectId: "ai-hubster",
  storageBucket: "ai-hubster.firebasestorage.app",
  messagingSenderId: "101312189744",
  appId: "1:101312189744:web:c4befb4da423eba23da4f5",
  measurementId: "G-X5Z8EDJ0PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
