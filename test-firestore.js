import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function test() {
  await signInWithEmailAndPassword(auth, "beginner032@gmail.com", "password123");
  console.log("Logged in as", auth.currentUser.uid);
  
  try {
    const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
    console.log("User doc:", d.exists());
  } catch (e) {
    console.error("User doc error:", e);
  }

  try {
    const q = query(collection(db, 'events'), where('uid', '==', auth.currentUser.uid));
    const snap = await getDocs(q);
    console.log("Events:", snap.size);
  } catch (e) {
    console.error("Events error:", e);
  }
}
test();
