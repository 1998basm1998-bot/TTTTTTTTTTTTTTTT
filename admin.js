import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// إعدادات Firebase التي زودتني بها
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

// تهيئة النظام
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تثبيت الدالة عالمياً لتتمكن أزرار HTML من الوصول إليها
window.sendCmd = async (command) => {
    try {
        console.log("ارسال أمر:", command);
        await setDoc(doc(db, "control", "commands"), { 
            cmd: command, 
            time: Date.now() 
        });
        // تغيير لون الزر مؤقتاً للتأكيد
        console.log("تم تنفيذ الأمر بنجاح");
    } catch (e) {
        console.error("فشل في إرسال الأمر:", e);
        alert("تأكد من نشر قواعد البيانات (Publish Rules) في Firebase");
    }
};

console.log("محرك الإدارة جاهز للعمل.");
