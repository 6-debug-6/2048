const canvas1 = document.getElementById("particleCanvas");
const ctx1 = canvas1.getContext("2d");

// 粒子系统
const particles = [];
let gravityEnabled = false;
let interactionEnabled = true;

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.life = 100; // 粒子寿命
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (gravityEnabled) {
      this.speedY += 0.05; // 重力
    }

    // 边界反弹
    if (this.x <= 0 || this.x >= canvas1.width) {
      this.speedX = -this.speedX * 0.9; // 能量损失
    }
    if (this.y <= 0 || this.y >= canvas1.height) {
      this.speedY = -this.speedY * 0.9;
    }

    // 粒子寿命减少
    this.life -= 0.5;
    this.size *= 0.995; // 逐渐缩小
  }

  draw() {
    ctx1.fillStyle = this.color;
    ctx1.beginPath();
    ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx1.fill();

    // 添加发光效果
    ctx1.shadowColor = this.color;
    ctx1.shadowBlur = 10;
    ctx1.fill();
    ctx1.shadowBlur = 0;
  }
}

// 添加粒子
function addParticles(count) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas1.width;
    const y = Math.random() * canvas1.height;
    particles.push(new Particle(x, y));
  }
}

// 绘制粒子间的连线
function drawConnections() {
  const connectionDistance = 100;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance;
        ctx1.beginPath();
        ctx1.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx1.lineWidth = 1;
        ctx1.moveTo(particles[i].x, particles[i].y);
        ctx1.lineTo(particles[j].x, particles[j].y);
        ctx1.stroke();
      }
    }
  }
}

// 动画循环
function animateParticles() {
  // 半透明黑色背景，产生拖尾效果
  ctx1.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

  // 更新和绘制粒子
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // 移除生命周期结束的粒子
    if (particles[i].life <= 0 || particles[i].size < 0.1) {
      particles.splice(i, 1);
      i--;
    }
  }

  // 绘制粒子间的连线
  drawConnections();

  requestAnimationFrame(animateParticles);
}

// 鼠标交互
canvas1.addEventListener("mousemove", function (event) {
  if (!interactionEnabled) return;

  const rect = canvas1.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // 鼠标附近添加粒子
  for (let i = 0; i < 3; i++) {
    particles.push(
      new Particle(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10),
    );
  }

  // 给附近的粒子施加力
  for (let particle of particles) {
    const dx = particle.x - x;
    const dy = particle.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      const force = 100 / distance;
      particle.speedX += (dx / distance) * force * 0.1;
      particle.speedY += (dy / distance) * force * 0.1;
    }
  }
});

// 控制函数
function clearAllParticles() {
  particles.length = 0;
}

function toggleGravity() {
  gravityEnabled = !gravityEnabled;
}

function toggleInteraction() {
  interactionEnabled = !interactionEnabled;
}

// 初始添加一些粒子
addParticles(50);

// 开始动画
animateParticles();
