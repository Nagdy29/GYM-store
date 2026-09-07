import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfOhGomwOQyd_x40YMswjMVEJofZqG2vo",
  authDomain: "post-74139.firebaseapp.com",
  projectId: "post-74139",
  storageBucket: "post-74139.firebasestorage.app",
  messagingSenderId: "424712625842",
  appId: "1:424712625842:web:7f346fcda068ea83b373ab",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;