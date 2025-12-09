/**
 * Project_Logic-gates - Main JavaScript
 * Pure vanilla JS, no frameworks
 */

// ========================================
// Navigation
// ========================================
const nav = document.getElementById('navigation');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================================
// Hero Dots Animation
// ========================================
function createHeroDots() {
  const container = document.getElementById('hero-dots');
  if (!container) return;
  
  for (let i = 0; i < 15; i++) {
    const dot = document.createElement('div');
    dot.className = 'hero-dot';
    dot.style.left = `${10 + Math.random() * 80}%`;
    dot.style.top = `${10 + Math.random() * 80}%`;
    dot.style.animationDelay = `${i * 0.2}s`;
    container.appendChild(dot);
  }
}

createHeroDots();

// ========================================
// Gallery Video Controls
// ========================================
document.querySelectorAll('.mute-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const video = btn.closest('.gallery-media').querySelector('video');
    const iconMuted = btn.querySelector('.icon-muted');
    const iconUnmuted = btn.querySelector('.icon-unmuted');
    
    if (video) {
      video.muted = !video.muted;
      iconMuted.style.display = video.muted ? 'block' : 'none';
      iconUnmuted.style.display = video.muted ? 'none' : 'block';
    }
  });
});

// Video autoplay on visibility
const videos = document.querySelectorAll('.gallery-media video');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.5 });

videos.forEach(video => videoObserver.observe(video));

// ========================================
// Binary Calculator
// ========================================
const calculator = {
  bitMode: 4,
  mode: 'calculator',
  
  init() {
    this.bindEvents();
    this.generateProblem();
  },
  
  bindEvents() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
        
        document.getElementById('calc-panel').style.display = this.mode === 'calculator' ? 'block' : 'none';
        document.getElementById('training-panel').style.display = this.mode === 'training' ? 'block' : 'none';
        
        if (this.mode === 'training') {
          this.generateProblem();
        }
      });
    });
    
    // Bit mode buttons
    document.querySelectorAll('.bit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.bitMode = parseInt(btn.dataset.bits);
        
        document.getElementById('input-a').maxLength = this.bitMode;
        document.getElementById('input-b').maxLength = this.bitMode;
        document.getElementById('input-a').placeholder = '0'.repeat(this.bitMode);
        document.getElementById('input-b').placeholder = '0'.repeat(this.bitMode);
        
        if (this.mode === 'training') {
          this.generateProblem();
        }
      });
    });
    
    // Calculator inputs
    ['input-a', 'input-b'].forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^01]/g, '').slice(0, this.bitMode);
        const decimal = this.fromBinary(e.target.value);
        document.getElementById(id === 'input-a' ? 'decimal-a' : 'decimal-b').textContent = `= ${decimal}`;
      });
    });
    
    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', () => this.calculate());
    
    // Training buttons
    document.getElementById('check-answer').addEventListener('click', () => this.checkAnswer());
    document.getElementById('new-problem').addEventListener('click', () => this.generateProblem());
  },
  
  toBinary(num, bits) {
    if (num < 0) {
      return ((1 << bits) + num).toString(2).padStart(bits, '0');
    }
    return num.toString(2).padStart(bits, '0');
  },
  
  fromBinary(str) {
    return parseInt(str || '0', 2);
  },
  
  calculate() {
    const inputA = document.getElementById('input-a').value;
    const inputB = document.getElementById('input-b').value;
    const operation = document.getElementById('operation').value;
    const resultEl = document.getElementById('calc-result');
    const errorEl = document.getElementById('calc-error');
    
    resultEl.style.display = 'none';
    errorEl.style.display = 'none';
    
    if (!inputA || !inputB) {
      errorEl.textContent = 'Please enter both binary numbers';
      errorEl.style.display = 'block';
      return;
    }
    
    const numA = this.fromBinary(inputA);
    const numB = this.fromBinary(inputB);
    let result;
    
    switch (operation) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '*': result = numA * numB; break;
    }
    
    const maxValue = this.bitMode === 4 ? 15 : 255;
    
    if (result > maxValue) {
      const truncated = result & maxValue;
      document.getElementById('result-value').textContent = this.toBinary(truncated, this.bitMode) + ' (overflow)';
      document.getElementById('result-decimal').textContent = `= ${truncated} (truncated from ${result})`;
    } else if (result < 0) {
      document.getElementById('result-value').textContent = this.toBinary(result, this.bitMode);
      document.getElementById('result-decimal').textContent = `= ${result} (two's complement)`;
    } else {
      document.getElementById('result-value').textContent = this.toBinary(result, this.bitMode);
      document.getElementById('result-decimal').textContent = `= ${result} (decimal)`;
    }
    
    resultEl.style.display = 'block';
  },
  
  generateProblem() {
    const max = this.bitMode === 4 ? 7 : 127;
    const num1 = Math.floor(Math.random() * max);
    const num2 = Math.floor(Math.random() * max);
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let answer;
    switch (op) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
    }
    
    this.currentProblem = {
      num1: this.toBinary(num1, this.bitMode),
      num2: this.toBinary(num2, this.bitMode),
      dec1: num1,
      dec2: num2,
      op,
      answer: answer < 0 ? this.toBinary(answer, this.bitMode) : this.toBinary(Math.abs(answer) & (this.bitMode === 4 ? 15 : 255), this.bitMode * 2)
    };
    
    document.getElementById('problem-num1').textContent = this.currentProblem.num1;
    document.getElementById('problem-num2').textContent = this.currentProblem.num2;
    document.getElementById('problem-op').textContent = op;
    document.getElementById('problem-dec1').textContent = `(${num1})`;
    document.getElementById('problem-dec-op').textContent = op;
    document.getElementById('problem-dec2').textContent = `(${num2})`;
    
    document.getElementById('training-answer').value = '';
    document.getElementById('training-feedback').style.display = 'none';
  },
  
  checkAnswer() {
    const userAnswer = document.getElementById('training-answer').value.replace(/^0+/, '') || '0';
    const correctAnswer = this.currentProblem.answer.replace(/^0+/, '') || '0';
    const feedbackEl = document.getElementById('training-feedback');
    
    if (userAnswer === correctAnswer) {
      feedbackEl.className = 'training-feedback correct';
      feedbackEl.innerHTML = '<div class="feedback-icon">✓</div>Correct! Well done!';
    } else {
      const { dec1, dec2, op, answer } = this.currentProblem;
      let expected;
      switch (op) {
        case '+': expected = dec1 + dec2; break;
        case '-': expected = dec1 - dec2; break;
        case '*': expected = dec1 * dec2; break;
      }
      
      feedbackEl.className = 'training-feedback incorrect';
      feedbackEl.innerHTML = `<div class="feedback-icon">✗</div>Incorrect. ${dec1} ${op} ${dec2} = ${expected} (${answer})`;
    }
    
    feedbackEl.style.display = 'block';
  }
};

calculator.init();

// ========================================
// Image/Video Error Handling
// ========================================
document.querySelectorAll('.gallery-media img, .gallery-grid-item img').forEach(img => {
  img.addEventListener('error', () => {
    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='253' fill='%232c323b'%3E%3Crect width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233e454f' font-family='monospace' font-size='14'%3EImage Placeholder%3C/text%3E%3C/svg%3E`;
  });
});

document.querySelectorAll('.gallery-media video').forEach(video => {
  video.addEventListener('error', () => {
    // Replace with poster or placeholder
    const poster = video.poster;
    if (poster) {
      const img = document.createElement('img');
      img.src = poster;
      img.alt = 'Video placeholder';
      img.className = 'video-placeholder';
      video.parentNode.replaceChild(img, video);
    }
  });
});

// ========================================
// Mascot Image Error Handling
// ========================================
const mascotImg = document.querySelector('.mascot img');
if (mascotImg) {
  mascotImg.addEventListener('error', () => {
    document.querySelector('.mascot').style.display = 'none';
  });
}