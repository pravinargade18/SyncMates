import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyDiPtC1D_cQVZDazmIbSZkycW72b4irvEY",
  authDomain: "chatapp-26cff.firebaseapp.com",
  projectId: "chatapp-26cff",
  storageBucket: "chatapp-26cff.appspot.com",
  messagingSenderId: "143585245875",
  appId: "1:143585245875:web:fd87f54d913a84dbe48ec6",
};



const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const storage=getStorage(app);
export const db=getFirestore(app);
