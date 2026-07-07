const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function test() {
  try {
    await signInWithEmailAndPassword(auth, "beginner032@gmail.com", "password123");
    console.log("Logged in as", auth.currentUser.uid);
  } catch(e) {
    console.error("Login failed:", e.message);
    return;
  }
  
  try {
    const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
    console.log("User doc:", d.exists());
  } catch (e) {
    console.error("User doc error:", e.message);
  }

  try {
    const q = query(collection(db, 'events'), where('uid', '==', auth.currentUser.uid));
    const snap = await getDocs(q);
    console.log("Events:", snap.size);
  } catch (e) {
    console.error("Events error:", e.message);
  }
}
test();
