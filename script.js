const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
let gravity = parseFloat(document.getElementById('gravity').value);
let baseSize = parseInt(document.getElementById('size').value);
let currentColor = '#ffe66d';
let drawing = false;

// UI bindings
const gravitySlider = document.getElementById('gravity');
gravitySlider.addEventListener('input', () => {
  gravity = parseFloat(gravitySlider.value);
});

const sizeSlider = document.getElementById('size');
sizeSlider.addEventListener('input', () => {
  baseSize = parseInt(sizeSlider.value);
});

document.querySelectorAll('.swatch').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentColor = btn.dataset.color;
    document.querySelectorAll('.swatch').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  particles.length = 0;
});

class Particle {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.radius = size + Math.random() * size;
    this.life = this.maxLife = 200;
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -0.8;
    }
    if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.vx *= -0.8;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -0.8;
    }
    if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.vy *= -0.8;
    }

    this.life--;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.restore();
  }
}

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  addParticle(e);
});
canvas.addEventListener('mousemove', (e) => {
  if (drawing) addParticle(e);
});
window.addEventListener('mouseup', () => {
  drawing = false;
});

function addParticle(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  particles.push(new Particle(x, y, currentColor, baseSize));
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'c') {
    particles.length = 0;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(animate);
}

animate();
