// place files you want to import through the `$lib` alias in this folder.

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCVgQWgC9xkIRETMV6tbCuQ6jwb1Sn0UyE',
	authDomain: 'chatify-c290a.firebaseapp.com',
	projectId: 'chatify-c290a',
	storageBucket: 'chatify-c290a.appspot.com',
	messagingSenderId: '51815638195',
	appId: '1:51815638195:web:79eacea2a6e2f46a613cc6'
};

// Initialize Firebase

let firebaseApp;

if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
}

// Auth
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp, firebaseAuth };
