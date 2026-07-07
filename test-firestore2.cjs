const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
const auth = getAuth(app);

async function test() {
  try {
    await signInWithEmailAndPassword(auth, "beginner032@gmail.com", "password123");
    console.log("Logged in as", auth.currentUser.uid);
  } catch(e) {
    console.error("Login failed:", e.message);
  }
}
test();
