class ImageUploader {
    constructor() {
        this.images = [];
        this.uploadInterval = null;
        this.currentIndex = 0;
    }

    async initialize() {
        // تهيئة بسيطة
        this.updateStatus('Please select images to upload');
    }

    async getImageList() {
        // هذا الجزء يجلب الصور التي قمت باختيارها من زر الملفات
        const input = document.getElementById('fileInput');
        if (input && input.files && input.files.length > 0) {
            return Array.from(input.files);
        }
        return [];
    }

    async uploadNextImage() {
        if (this.currentIndex >= this.images.length) {
            this.stopUpload();
            this.updateStatus('Upload complete');
            return;
        }

        const image = this.images[this.currentIndex];
        this.updateStatus(`Uploading ${image.name}...`);

        try {
            await this.uploadImage(image);
            this.addImageToGallery(image);
            this.currentIndex++;
            this.updateStatus(`Uploaded ${image.name}`);
        } catch (error) {
            console.error(`Failed to upload ${image.name}:`, error);
            this.currentIndex++;
        }
    }

    addImageToGallery(image) {
        const container = document.getElementById('imagesContainer');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const img = document.createElement('img');
        // تحويل ملف الصورة المحلي إلى رابط للعرض
        img.src = URL.createObjectURL(image);
        img.alt = image.name;

        const info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = `${image.name} (${Math.round(image.size/1024)}KB)`;

        imageItem.appendChild(img);
        imageItem.appendChild(info);
        container.appendChild(imageItem);
    }

    async uploadImage(image) {
        // محاكاة وقت الرفع
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    async startUpload() {
        if (this.uploadInterval) return;

        // التأكد من وجود صور مختارة
        this.images = await this.getImageList();

        if (this.images.length === 0) {
            alert('Please select images first using the button!');
            return;
        }

        this.currentIndex = 0;
        this.updateStatus('Starting upload...');
        
        this.uploadInterval = setInterval(() => {
            this.uploadNextImage();
        }, 1500);
    }

    stopUpload() {
        if (this.uploadInterval) {
            clearInterval(this.uploadInterval);
            this.uploadInterval = null;
        }
    }

    updateStatus(message) {
        document.getElementById('autoUploadStatus').textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const uploader = new ImageUploader();
    uploader.initialize();

    document.getElementById('startBtn').addEventListener('click', () => {
        uploader.startUpload();
    });
});
