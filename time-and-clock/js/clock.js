class ClockManager {
    constructor() {
        this.is24Hour = false;
        this.isDragging = false;
        this.isUserSet = false; // Persistent flag to prevent auto-ticking after user interaction
        this.currentTime = new Date();
        this.intervalId = null; // Store interval reference for stopping
        this.init();
    }

    init() {
        this.setupDigitalClock();
        this.setupAnalogClock();
        this.setupEventListeners();
        this.startClock();
    }

    setupDigitalClock() {
        this.digitalClock = document.getElementById('digital-clock');
        this.formatButton = document.getElementById('toggle-format');
        
        if (this.formatButton) {
            this.formatButton.addEventListener('click', () => {
                this.is24Hour = !this.is24Hour;
                this.updateDigitalClock();
            });
        }
    }

    setupAnalogClock() {
        this.canvas = document.getElementById('analog-clock');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;
    }

    setupEventListeners() {
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
            this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            this.canvas.addEventListener('touchend', () => this.handleTouchEnd());
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.centerX;
        const y = e.clientY - rect.top - this.centerY;
        this.startDrag(x, y);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.centerX;
        const y = e.clientY - rect.top - this.centerY;
        this.updateDrag(x, y);
    }

    handleMouseUp() {
        this.isDragging = false;
        this.dragTarget = null;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left - this.centerX;
        const y = touch.clientY - rect.top - this.centerY;
        this.startDrag(x, y);
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left - this.centerX;
        const y = touch.clientY - rect.top - this.centerY;
        this.updateDrag(x, y);
    }

    handleTouchEnd() {
        this.isDragging = false;
        this.dragTarget = null;
    }

    startDrag(x, y) {
        const distance = Math.sqrt(x * x + y * y);
        
        if (distance < this.radius * 0.5) {
            this.dragTarget = 'hour';
            this.isDragging = true;
            this.isUserSet = true; // Set persistent flag when user starts dragging
        } else if (distance < this.radius * 0.7) {
            this.dragTarget = 'minute';
            this.isDragging = true;
            this.isUserSet = true; // Set persistent flag when user starts dragging
        }
    }

    updateDrag(x, y) {
        const angle = Math.atan2(y, x);
        const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;
        
        if (this.dragTarget === 'hour') {
            const hours = Math.floor(degrees / 30);
            this.currentTime.setHours(hours);
        } else if (this.dragTarget === 'minute') {
            const minutes = Math.floor(degrees / 6);
            this.currentTime.setMinutes(minutes);
        }
        
        this.drawAnalogClock();
        this.updateDigitalClock();
    }

    startClock() {
        this.updateClock();
        this.intervalId = setInterval(() => {
            // Only update to current time if user hasn't set the time manually
            if (!this.isDragging && !this.isUserSet) {
                this.currentTime = new Date();
            }
            this.updateClock();
        }, 1000);
    }

    updateClock() {
        this.updateDigitalClock();
        this.drawAnalogClock();
    }

    updateDigitalClock() {
        if (!this.digitalClock) return;
        
        const hours = this.currentTime.getHours();
        const minutes = this.currentTime.getMinutes();
        const seconds = this.currentTime.getSeconds();
        
        let displayHours = hours;
        let period = '';
        
        if (!this.is24Hour) {
            period = hours >= 12 ? ' PM' : ' AM';
            displayHours = hours % 12 || 12;
        }
        
        const timeString = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}${period}`;
        this.digitalClock.textContent = timeString;
    }

    drawAnalogClock() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawClockFace();
        this.drawNumbers();
        this.drawHands();
        this.drawCenterDot();
    }

    drawClockFace() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.strokeStyle = '#5e72e4';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        for (let i = 0; i < 60; i++) {
            const angle = (i * 6 - 90) * Math.PI / 180;
            const x1 = this.centerX + Math.cos(angle) * (this.radius - 5);
            const y1 = this.centerY + Math.sin(angle) * (this.radius - 5);
            const x2 = this.centerX + Math.cos(angle) * (this.radius - (i % 5 === 0 ? 15 : 10));
            const y2 = this.centerY + Math.sin(angle) * (this.radius - (i % 5 === 0 ? 15 : 10));
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = i % 5 === 0 ? '#5e72e4' : '#ddd';
            this.ctx.lineWidth = i % 5 === 0 ? 2 : 1;
            this.ctx.stroke();
        }
    }

    drawNumbers() {
        // Draw AM numerals (1-12) - inner ring
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#5e72e4';
        
        for (let num = 1; num <= 12; num++) {
            const angle = (num * 30 - 90) * Math.PI / 180;
            const x = this.centerX + Math.cos(angle) * (this.radius - 30);
            const y = this.centerY + Math.sin(angle) * (this.radius - 30);
            this.ctx.fillText(num.toString(), x, y);
        }
        
        // Draw PM numerals (13-24) - outer ring
        this.ctx.font = 'bold 16px Arial'; // Larger font for better visibility
        this.ctx.fillStyle = '#e74c3c'; // Red color for better distinction and visibility
        
        for (let num = 13; num <= 24; num++) {
            // Use same angles as AM numerals (13->1, 14->2, etc.)
            const hourPosition = num - 12;
            const angle = (hourPosition * 30 - 90) * Math.PI / 180;
            const x = this.centerX + Math.cos(angle) * (this.radius + 8); // Position just outside the clock circle within canvas bounds
            const y = this.centerY + Math.sin(angle) * (this.radius + 8);
            this.ctx.fillText(num.toString(), x, y);
        }
    }

    drawHands() {
        const hours = this.currentTime.getHours();
        const minutes = this.currentTime.getMinutes();
        const seconds = this.currentTime.getSeconds();
        
        const hourAngle = (hours % 12 + minutes / 60) * 30 - 90;
        this.drawHand(hourAngle, this.radius * 0.5, 6, '#333');
        
        const minuteAngle = (minutes + seconds / 60) * 6 - 90;
        this.drawHand(minuteAngle, this.radius * 0.7, 4, '#666');
        
        const secondAngle = seconds * 6 - 90;
        this.drawHand(secondAngle, this.radius * 0.9, 2, '#ff6b6b');
    }

    drawHand(angle, length, width, color) {
        const angleRad = angle * Math.PI / 180;
        const x = this.centerX + Math.cos(angleRad) * length;
        const y = this.centerY + Math.sin(angleRad) * length;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    drawCenterDot() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#5e72e4';
        this.ctx.fill();
    }
}

function drawSmallClock(canvas, hours, minutes) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#5e72e4';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = centerX + Math.cos(angle) * (radius - 5);
        const y1 = centerY + Math.sin(angle) * (radius - 5);
        const x2 = centerX + Math.cos(angle) * (radius - 10);
        const y2 = centerY + Math.sin(angle) * (radius - 10);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#5e72e4';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#5e72e4';
    
    for (let num = 1; num <= 12; num++) {
        const angle = (num * 30 - 90) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * (radius - 20);
        const y = centerY + Math.sin(angle) * (radius - 20);
        ctx.fillText(num.toString(), x, y);
    }
    
    const hourAngle = ((hours % 12 + minutes / 60) * 30 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(hourAngle) * (radius * 0.5),
        centerY + Math.sin(hourAngle) * (radius * 0.5)
    );
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    const minuteAngle = (minutes * 6 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(minuteAngle) * (radius * 0.7),
        centerY + Math.sin(minuteAngle) * (radius * 0.7)
    );
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#5e72e4';
    ctx.fill();
}

window.ClockManager = ClockManager;
window.drawSmallClock = drawSmallClock;