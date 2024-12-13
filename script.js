document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.querySelector('.preview-container');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 处理文件拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 处理图片文件
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        // 显示原始图片大小
        originalSize.textContent = formatFileSize(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(e.target.result);
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(dataUrl) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const quality = qualitySlider.value / 100;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            compressedImage.src = compressedDataUrl;
            
            // 计算压缩后的大小
            const compressedBytes = atob(compressedDataUrl.split(',')[1]).length;
            compressedSize.textContent = formatFileSize(compressedBytes);
        };
        img.src = dataUrl;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        if (compressedImage.src) {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedImage.src;
            link.click();
        }
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 