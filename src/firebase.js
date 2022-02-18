import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyACDApqKn5o4I0x5o_Uv072HacVnUeazxM",
  authDomain: "fir-login-test-43fbf.firebaseapp.com",
  projectId: "fir-login-test-43fbf",
  storageBucket: "fir-login-test-43fbf.appspot.com",
  messagingSenderId: "942049522119",
  appId: "1:942049522119:web:880b355cffd0c84e9ba9e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export function updateDB(array, uid) {
  return setDoc(doc(db, 'favorites', uid), {
    favorites: [...array]
  })
}
export function getFavs(uid) {
  return getDoc(doc(db, 'favorites', uid)).then(snap => {
    return snap.data().favorites
  })
}

export function loginWithGoogle() {
  const auth = getAuth()
  let provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider).then(res => res.user)
}

export function signOutGoogle() {
  const auth = getAuth()
  return signOut(auth)
}