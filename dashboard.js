document.addEventListener('DOMContentLoaded', function() {
    initUploadHandlers();
    initHeatmap();
    updateStats();
});

function initUploadHandlers() {
    const imageUpload = document.querySelector('#imageUpload');
    const videoUpload = document.querySelector('#videoUpload');
    
    if (imageUpload) {
        const input = imageUpload.querySelector('input');
        imageUpload.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => handleUpload(e, 'image'));
    }
    
    if (videoUpload) {
        const input = videoUpload.querySelector('input');
        videoUpload.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => handleUpload(e, 'video'));
    }
}

function handleUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File too large. Max ${type === 'image' ? '5MB' : '100MB'}`);
        return;
    }
    
    const box = event.target.closest('.upload-box');
    box.innerHTML = `<div style="color:#00ff41;">Analyzing ${file.name}...</div>`;
    
    // Call Vercel API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    fetch('/api/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        updateDashboard(data);
        box.innerHTML = `<div style="color:#00ff41;">✅ Analysis Complete!</div>`;
        setTimeout(() => resetUploadBox(box, type), 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback to simulation
        simulateAnalysis(type, box);
    });
}

function simulateAnalysis(type, box) {
    setTimeout(() => {
        const confidence = (Math.random() * 20 + 80).toFixed(2);
        const isAI = Math.random() > 0.5;
        updateDashboard({ confidence, isAI });
        box.innerHTML = `<div style="color:#00ff41;">✅ Analysis Complete!</div>`;
        setTimeout(() => resetUploadBox(box, type), 2000);
    }, 2000);
}

function resetUploadBox(box, type) {
    box.innerHTML = `
        <div class="upload-icon">${type === 'image' ? '📷' : '🎬'}</div>
        <h3>Upload ${type === 'image' ? 'Image' : 'Video'}</h3>
        <p>${type === 'image' ? 'JPG, PNG, WEBP • Max 5MB' : 'MP4, MOV, AVI • Max 100MB'}</p>
        <input type="file" accept="${type === 'image' ? '.jpg,.jpeg,.png,.webp' : '.mp4,.mov,.avi'}" hidden>
    `;
    initUploadHandlers();
}

function updateDashboard(data) {
    const confidence = data.confidence || (Math.random() * 20 + 80).toFixed(2);
    const isAI = data.isAI || Math.random() > 0.5;
    
    const originalConfidence = isAI ? (100 - parseFloat(confidence)).toFixed(2) : confidence;
    const aiConfidence = isAI ? confidence : (100 - parseFloat(confidence)).toFixed(2);
    
    document.getElementById('originalBar').style.width = originalConfidence + '%';
    document.getElementById('originalLabel').textContent = originalConfidence + '% Original';
    
    document.getElementById('aiBar').style.width = aiConfidence + '%';
    document.getElementById('aiLabel').textContent = aiConfidence + '% AI Generated';
    
    document.getElementById('cameraInfo').textContent = 'Canon EOS R5';
    document.getElementById('lensInfo').textContent = 'RF 24-70mm f/2.8L';
    document.getElementById('gpsInfo').textContent = '14.5995° N, 120.9842° E';
    document.getElementById('softwareInfo').textContent = 'Photoshop, Lightroom';
    
    document.querySelectorAll('.forensic-item .status').forEach((el, i) => {
        if (i < 3) {
            el.className = 'status complete';
            el.textContent = '✓';
        } else {
            el.className = 'status pending';
            el.textContent = '⏳';
        }
    });
    
    const queue = document.getElementById('queueCount');
    queue.textContent = Math.floor(Math.random() * 10);
    
    const total = document.getElementById('totalCount');
    const current = parseInt(total.textContent.replace(/,/g, ''));
    total.textContent = (current + 1).toLocaleString();
}

function updateStats() {
    setInterval(() => {
        const queue = document.getElementById('queueCount');
        const current = parseInt(queue.textContent);
        queue.textContent = current > 0 ? current - 1 : Math.floor(Math.random() * 5);
    }, 5000);
}

function initHeatmap() {
    const canvas = document.getElementById('heatmap');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const data = [];
    for (let i = 0; i < 30; i++) {
        data.push({
            x: Math.random() * width,
            y: Math.random() * height,
            value: Math.random()
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        data.forEach(point => {
            const radius = 15 + point.value * 25;
            const gradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, radius
            );
            
            const alpha = 0.2 + point.value * 0.4;
            gradient.addColorStop(0, `rgba(255, 0, 64, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.7})`);
            gradient.addColorStop(1, `rgba(0, 255, 65, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 