const canvas2 = document.getElementById("animationCanvas");
const ctx2 = canvas2.getContext("2d");

// 球的状态
const ball = {
  x: 100,
  y: 100,
  radius: 30,
  dx: 5, // x轴速度
  dy: 4, // y轴速度
  color: "#FF6B6B",
};

// 动画控制
let animationId = null;
let isAnimating = true;

// 绘制函数
function drawBall() {
  ctx2.beginPath();
  ctx2.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx2.fillStyle = ball.color;
  ctx2.fill();
  ctx2.strokeStyle = "#333";
  ctx2.stroke();
}

// 更新函数
function updateBall() {
  // 清空画布（带透明效果）
  ctx2.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  // 更新球的位置
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 边界检测
  if (ball.x + ball.radius > canvas2.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    ball.color = getRandomColor();
  }

  if (ball.y + ball.radius > canvas2.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    ball.color = getRandomColor();
  }

  drawBall();
}

// 随机颜色
function getRandomColor() {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#EF476F",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 动画循环
function animateBall() {
  updateBall();
  if (isAnimating) {
    animationId = requestAnimationFrame(animateBall);
  }
}

// 控制函数
function toggleBallAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animateBall();
  } else {
    cancelAnimationFrame(animationId);
  }
}

// 鼠标交互：点击改变球的位置
canvas2.addEventListener("click", function (event) {
  const rect = canvas2.getBoundingClientRect();
  ball.x = event.clientX - rect.left;
  ball.y = event.clientY - rect.top;
  ball.color = getRandomColor();
});

// 开始动画
animateBall();
