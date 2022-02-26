import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, indexedDBLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDzli9hx8F-8KFT_H_sv0hmBD2m3Kzg7dU",
    authDomain: "fincal-app.firebaseapp.com",
    projectId: "fincal-app",
    storageBucket: "fincal-app.appspot.com",
    messagingSenderId: "401732742159",
    appId: "1:401732742159:web:d5f180d510233e987ac77a",
    measurementId: "G-CG4YMHFHZ4"
};

const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);
const firebaseAuth = initializeAuth(firebaseApp, {
    persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence] ,
});
const firebaseDB = getFirestore(firebaseApp);

export { firebaseAuth, firebaseDB };