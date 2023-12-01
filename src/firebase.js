import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage"

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHs3daUCRwM_c4tVv63-7P6AhjkowgHuo",
  authDomain: "baat-cheeet-8a991.firebaseapp.com",
  projectId: "baat-cheeet-8a991",
  storageBucket: "baat-cheeet-8a991.appspot.com",
  messagingSenderId: "1051030234506",
  appId: "1:1051030234506:web:8da4408a3cd2577de1d473"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
