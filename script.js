class ImageUploader {
    constructor() {
        this.images = [];
        this.uploadInterval = null;
        this.currentIndex = 0;
    }

    async initialize() {
        try {
            this.images = await this.getImageList();
            this.updateStatus(`Found ${this.images.length} images`);
        } catch (error) {
            console.error('Error initializing uploader:', error);
        }
    }

    async getImageList() {
        return [
            { name: 'image1.jpg', size: 1024 },
            { name: 'image2.png', size: 2048 },
            { name: 'image3.gif', size: 4096 }
        ];
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
        img.src = `/path/to/${image.name}`;
        img.alt = image.name;

        const info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = `${image.name} (${Math.round(image.size/1024)}KB)`;

        imageItem.appendChild(img);
        imageItem.appendChild(info);
        container.appendChild(imageItem);
    }

    async uploadImage(image) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    startUpload() {
        if (this.uploadInterval) return;
        
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
