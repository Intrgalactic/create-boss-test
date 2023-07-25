
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClXCppWPMESOkfMromjypzf6zMQ1WV_tM",
  authDomain: "createboss-cfe24.firebaseapp.com",
  projectId: "createboss-cfe24",
  storageBucket: "createboss-cfe24.appspot.com",
  messagingSenderId: "947878864126",
  appId: "1:947878864126:web:a0711d5de0092db79771af",
  measurementId: "G-KQQSXGQVXC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);