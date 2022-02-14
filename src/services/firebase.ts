import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, set, push, get, update, remove, onValue } from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { app, database, ref, set, get, push, update, remove, onValue, signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged }