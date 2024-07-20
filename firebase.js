// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwglNhuYbeRlvh44ntsaBYY4yRW_t1_lY",
  authDomain: "moto-app-f2fc8.firebaseapp.com",
  databaseURL: "https://moto-app-f2fc8-default-rtdb.firebaseio.com", // Add this line
  projectId: "moto-app-f2fc8",
  storageBucket: "moto-app-f2fc8.appspot.com",
  messagingSenderId: "557304146214",
  appId: "1:557304146214:web:702521850d7817911c39e7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
