import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATiWlGdVLwwcMRELcKmKZsWBLnIxxL5G4",
  authDomain: "house-marketplace-app-8f1b2.firebaseapp.com",
  projectId: "house-marketplace-app-8f1b2",
  storageBucket: "house-marketplace-app-8f1b2.appspot.com",
  messagingSenderId: "100803267921",
  appId: "1:100803267921:web:562d4968da9f8947f1d770"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()