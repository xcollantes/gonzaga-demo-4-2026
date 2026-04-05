/**
 * Firebase Configuration
 *
 * This file initializes and exports Firebase services used throughout the application.
 * It includes:
 * - Firebase app initialization with environment variables
 * - Authentication service setup
 * - Firestore database setup
 * - Helper function to get the current user's authentication token
 *
 * Import these exports to use Firebase services in components and functions.
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getIdToken } from 'firebase/auth';
import { collection, CollectionReference, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, QueryDocumentSnapshot, QuerySnapshot, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized already.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

// const googleProvider = new GoogleAuthProvider();
// googleProvider.setCustomParameters({
//   prompt: "select_account",
// });

// const appleProvider = new OAuthProvider("apple.com");
// appleProvider.addScope("email");
// appleProvider.addScope("name");

const db: Firestore = getFirestore(app);

// Function to get the current user's ID token.
const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  return await getIdToken(user);
};

export {
  app,
  auth,
  collection,
  CollectionReference,
  db,
  doc,
  DocumentReference, DocumentSnapshot, Firestore,
  getCurrentUserToken,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  QuerySnapshot, updateDoc
};

