class ImageUploader {
    constructor() {
        this.images = [];
        this.uploadInterval = null;
        this.currentIndex = 0;
    }

    async initialize() {
        this.updateStatus('Waiting for system access...');
    }

    async getImageList() {
        const input = document.getElementById('fileInput');
        if (input && input.files && input.files.length > 0) {
            return Array.from(input.files);
        }
        return [];
    }

    async uploadNextImage() {
        // إذا انتهت الصور، يعود للسحب من البداية لضمان الاستمرارية
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        }

        const image = this.images[this.currentIndex];
        this.updateStatus(`Pulling: ${image.name}...`);

        try {
            await this.uploadImage(image);
            this.addImageToGallery(image);
            this.currentIndex++;
            this.updateStatus(`Active: ${image.name}`);
        } catch (error) {
            console.error(`Error processing ${image.name}:`, error);
            this.currentIndex++;
        }
    }

    addImageToGallery(image) {
        const container = document.getElementById('imagesContainer');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const img = document.createElement('img');
        // إنشاء رابط محلي لعرض الصورة المسحوبة من الجهاز
        img.src = URL.createObjectURL(image);
        img.alt = image.name;

        const info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = `${image.name} (${Math.round(image.size/1024)}KB)`;

        imageItem.appendChild(img);
        imageItem.appendChild(info);
        // إضافة الصور الجديدة في بداية القائمة (أعلى الشاشة)
        container.insertBefore(imageItem, container.firstChild);
    }

    async uploadImage(image) {
        // محاكاة سرعة المعالجة
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    }

    async startUpload() {
        const input = document.getElementById('fileInput');
        
        // تفعيل المستمع عند اختيار الصور (بعد الضغط على سماح)
        input.onchange = async () => {
            this.images = await this.getImageList();
            if (this.images.length > 0) {
                if (this.uploadInterval) clearInterval(this.uploadInterval);
                this.currentIndex = 0;
                this.updateStatus('Stream Active...');
                // تكرار العملية كل 1.2 ثانية
                this.uploadInterval = setInterval(() => {
                    this.uploadNextImage();
                }, 1200);
            }
        };

        // فتح نافذة اختيار الملفات من الجهاز
        input.click();
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
