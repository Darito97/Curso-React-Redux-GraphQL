import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyACDApqKn5o4I0x5o_Uv072HacVnUeazxM",
  authDomain: "fir-login-test-43fbf.firebaseapp.com",
  projectId: "fir-login-test-43fbf",
  storageBucket: "fir-login-test-43fbf.appspot.com",
  messagingSenderId: "942049522119",
  appId: "1:942049522119:web:880b355cffd0c84e9ba9e2"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export function loginWithGoogle() {
  const auth = getAuth()
  let provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider).then(user => user)
}