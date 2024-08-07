// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCYSa-G0-z9NvrOO6_eAUnieBwE1KykbRI",
    authDomain: "sistema-chamadas-527b6.firebaseapp.com",
    projectId: "sistema-chamadas-527b6",
    storageBucket: "sistema-chamadas-527b6.appspot.com",
    messagingSenderId: "401519456656",
    appId: "1:401519456656:web:d8a0fcf0ac74ea9baf0315",
    measurementId: "G-5P91HRBD8J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
