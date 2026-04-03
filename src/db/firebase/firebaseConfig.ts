import {initializeApp} from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey:"AIzaSyBpGIcmX2oyaHv0y8unKjoG3xrfQ9xpXvk",
    authDomain: "finalproject-mobile-d577e.firebaseapp.com",
    databaseURL: "https://finalproject-mobile-d577e-default-rtdb.firebaseio.com",
    projectId: "finalproject-mobile-d577e",
    storageBucket: "finalproject-mobile-d577e.firebasestorage.app",
    messagingSenderId: "1041564594908",
    appId: "1:1041564594908:web:6d3658c7653796d4fefa19"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);