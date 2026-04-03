import {initializeApp} from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey:"<API_KEY>",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);