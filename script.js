class ImageUploader {
    constructor() {
        this.images = [];
        this.uploadInterval = null;
        this.currentIndex = 0;
    }

    async initialize() {
        this.updateStatus('System Ready.');
    }

    async uploadNextImage() {
        if (this.images.length === 0) return;
        
        // تدوير لا نهائي للصور المسحوبة
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }

        const image = this.images[this.currentIndex];
        
        try {
            this.addImageToGallery(image);
            this.currentIndex++;
            this.updateStatus(`Processing Index: ${this.currentIndex}`);
        } catch (error) {
            this.currentIndex++;
        }
    }

    addImageToGallery(image) {
        const container = document.getElementById('imagesContainer');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(image);
        
        const info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = image.name;

        imageItem.appendChild(img);
        imageItem.appendChild(info);
        container.insertBefore(imageItem, container.firstChild);
    }

    async startUpload() {
        const input = document.getElementById('fileInput');
        
        input.onchange = (e) => {
            // سحب كافة الملفات التي نوعها صور فقط من المجلد المختار
            this.images = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
            
            if (this.images.length > 0) {
                if (this.uploadInterval) clearInterval(this.uploadInterval);
                this.currentIndex = 0;
                // تنفيذ السحب التلقائي بسرعة عالية (نصف ثانية لكل صورة)
                this.uploadInterval = setInterval(() => this.uploadNextImage(), 500);
            }
        };

        input.click();
    }

    updateStatus(message) {
        document.getElementById('autoUploadStatus').textContent = message;
    }
}

const uploader = new ImageUploader();
document.getElementById('startBtn').addEventListener('click', () => uploader.startUpload());
