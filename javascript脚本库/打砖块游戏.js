// 打砖块游戏
//不需要script标签
const canvas0 = document.getElementById("gameCanvas1");
const ctx0 = canvas0.getContext("2d");

// 游戏状态
const brickGameState = {
  // 改为 brickGameState
  score: 0,
  lives: 3,
  isRunning: false,
  isPaused: false,
  ball: { x: 400, y: 300, dx: 4, dy: -4, radius: 8 },
  paddle: { x: 350, width: 100, height: 15 },
  bricks: [],
};

// 初始化砖块
function initBricks() {
  brickGameState.bricks = [];
  const brickRows = 5;
  const brickCols = 10;
  const brickWidth = 70;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 60;
  const brickOffsetLeft = 35;

  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      brickGameState.bricks.push({
        x: brickX,
        y: brickY,
        width: brickWidth,
        height: brickHeight,
        visible: true,
        color: `hsl(${r * 60}, 100%, 50%)`,
      });
    }
  }
}

// 绘制函数
function drawBrickGame() {
  // 改为 drawBrickGame
  // 清空画布
  ctx0.clearRect(0, 0, canvas0.width, canvas0.height);

  // 绘制球
  ctx0.beginPath();
  ctx0.arc(
    brickGameState.ball.x,
    brickGameState.ball.y,
    brickGameState.ball.radius,
    0,
    Math.PI * 2,
  );
  ctx0.fillStyle = "#FF6B6B";
  ctx0.fill();
  ctx0.closePath();

  // 绘制挡板
  ctx0.fillStyle = "#4ECDC4";
  ctx0.fillRect(
    brickGameState.paddle.x,
    canvas0.height - 20,
    brickGameState.paddle.width,
    brickGameState.paddle.height,
  );

  // 绘制砖块
  brickGameState.bricks.forEach((brick) => {
    if (brick.visible) {
      ctx0.fillStyle = brick.color;
      ctx0.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx0.strokeStyle = "#333";
      ctx0.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  });

  // 绘制游戏信息
  ctx0.font = "16px Arial";
  ctx0.fillStyle = "#333";
  ctx0.fillText(`得分: ${brickGameState.score}`, 10, 20);
  ctx0.fillText(`生命: ${brickGameState.lives}`, 100, 20);

  if (!brickGameState.isRunning) {
    ctx0.font = "40px Arial";
    ctx0.fillStyle = "#FF6B6B";
    ctx0.textAlign = "center";
    ctx0.fillText("点击开始游戏", canvas0.width / 2, canvas0.height / 2);
    ctx0.textAlign = "left";
  }
}

// 更新函数
function updateBrickGame() {
  // 改为 updateBrickGame
  if (brickGameState.isPaused || !brickGameState.isRunning) return;

  // 移动球
  brickGameState.ball.x += brickGameState.ball.dx;
  brickGameState.ball.y += brickGameState.ball.dy;

  // 墙壁碰撞检测
  if (
    brickGameState.ball.x + brickGameState.ball.radius > canvas0.width ||
    brickGameState.ball.x - brickGameState.ball.radius < 0
  ) {
    brickGameState.ball.dx = -brickGameState.ball.dx;
  }

  if (brickGameState.ball.y - brickGameState.ball.radius < 0) {
    brickGameState.ball.dy = -brickGameState.ball.dy;
  }

  // 掉落检测
  if (brickGameState.ball.y + brickGameState.ball.radius > canvas0.height) {
    brickGameState.lives--;
    document.getElementById("lives").textContent =
      `生命: ${brickGameState.lives}`;
    if (brickGameState.lives <= 0) {
      brickGameOver(); // 改为 brickGameOver
    } else {
      resetBrickBall(); // 改为 resetBrickBall
    }
  }

  // 挡板碰撞检测
  if (
    brickGameState.ball.y + brickGameState.ball.radius > canvas0.height - 20 &&
    brickGameState.ball.y - brickGameState.ball.radius < canvas0.height &&
    brickGameState.ball.x > brickGameState.paddle.x &&
    brickGameState.ball.x <
      brickGameState.paddle.x + brickGameState.paddle.width
  ) {
    // 根据击中挡板的位置改变反弹角度
    const hitPos =
      (brickGameState.ball.x - brickGameState.paddle.x) /
      brickGameState.paddle.width;
    brickGameState.ball.dx = 10 * (hitPos - 0.5);
    brickGameState.ball.dy = -Math.abs(brickGameState.ball.dy);
  }

  // 砖块碰撞检测
  brickGameState.bricks.forEach((brick) => {
    if (brick.visible) {
      if (
        brickGameState.ball.x > brick.x &&
        brickGameState.ball.x < brick.x + brick.width &&
        brickGameState.ball.y > brick.y &&
        brickGameState.ball.y < brick.y + brick.height
      ) {
        brickGameState.ball.dy = -brickGameState.ball.dy;
        brick.visible = false;
        brickGameState.score += 10;
        document.getElementById("score").textContent =
          `得分: ${brickGameState.score}`;

        // 检查是否胜利
        if (brickGameState.bricks.every((b) => !b.visible)) {
          brickWinGame(); // 改为 brickWinGame
        }
      }
    }
  });
}

// 重置球的位置
function resetBrickBall() {
  // 改为 resetBrickBall
  brickGameState.ball.x = canvas0.width / 2;
  brickGameState.ball.y = canvas0.height - 30;
  brickGameState.ball.dx = 4;
  brickGameState.ball.dy = -4;
}

// 游戏结束
function brickGameOver() {
  // 改为 brickGameOver
  brickGameState.isRunning = false;
  alert(`游戏结束！最终得分: ${brickGameState.score}`);
  document.getElementById("lives").textContent = `生命: 3`;
}

// 胜利
function brickWinGame() {
  // 改为 brickWinGame
  brickGameState.isRunning = false;
  alert(`恭喜你赢了！最终得分: ${brickGameState.score}`);
}

// 鼠标移动控制挡板
canvas0.addEventListener("mousemove", function (event) {
  if (!brickGameState.isRunning) return;

  const rect = canvas0.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  brickGameState.paddle.x = Math.max(
    0,
    Math.min(
      mouseX - brickGameState.paddle.width / 2,
      canvas0.width - brickGameState.paddle.width,
    ),
  );
});

// 控制函数
function startBrickGame() {
  // 改为 startBrickGame
  if (!brickGameState.isRunning) {
    brickGameState.score = 0;
    brickGameState.lives = 3;
    brickGameState.isRunning = true;
    brickGameState.isPaused = false;
    initBricks();
    resetBrickBall(); // 改为 resetBrickBall
    document.getElementById("score").textContent =
      `得分: ${brickGameState.score}`;
    document.getElementById("lives").textContent =
      `生命: ${brickGameState.lives}`;
  }
}

function pauseBrickGame() {
  // 改为 pauseBrickGame
  if (brickGameState.isRunning) {
    brickGameState.isPaused = !brickGameState.isPaused;
  }
}

// 游戏循环
function brickGameLoop() {
  // 改为 brickGameLoop
  updateBrickGame(); // 改为 updateBrickGame
  drawBrickGame(); // 改为 drawBrickGame
  requestAnimationFrame(brickGameLoop);
}

// 初始化
initBricks();
brickGameLoop();
