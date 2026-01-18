// 游戏配置
const config = {
  size: 4, // 4x4网格
  colors: {
    // 墨绿色和墨蓝色主题
    background: "#1a3c34", // 深墨绿背景
    grid: "#2a5c54", // 网格背景
    empty: "#2a4c44", // 空格子颜色
    text: "#ffffff", // 文字颜色
    // 方块颜色 - 从浅墨绿到墨蓝渐变
    tileColors: [
      "#3a7c6c", // 2
      "#2a6c5c", // 4
      "#1a5c4c", // 8
      "#0a4c3c", // 16
      "#2a5c7c", // 32
      "#1a4c6c", // 64
      "#0a3c5c", // 128
      "#2a4c8c", // 256
      "#1a3c7c", // 512
      "#0a2c6c", // 1024
      "#1a2c9c", // 2048
      "#0a1c8c", // 超过2048
    ],
  },
};

// 游戏状态
let grid = [];
let score = 0;
let bestScore = localStorage.getItem("2048-best-score") || 0;
let gameOver = false;
let canvas, ctx;

// DOM元素
const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const restartButton = document.getElementById("restart");
const tryAgainButton = document.getElementById("tryAgain");
const gameOverElement = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");

// 初始化游戏
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // 设置最佳分数
  bestElement.textContent = bestScore;

  // 初始化网格
  grid = Array(config.size)
    .fill()
    .map(() => Array(config.size).fill(0));

  // 添加两个初始方块
  addRandomTile();
  addRandomTile();

  // 绘制初始状态
  draw();

  // 添加事件监听器
  document.addEventListener("keydown", handleKeyPress);
  restartButton.addEventListener("click", resetGame);
  tryAgainButton.addEventListener("click", resetGame);

  // 隐藏游戏结束画面
  gameOverElement.style.display = "none";
}

// 重置游戏
function resetGame() {
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  grid = Array(config.size)
    .fill()
    .map(() => Array(config.size).fill(0));
  addRandomTile();
  addRandomTile();
  gameOverElement.style.display = "none";
  draw();
}

// 添加随机方块
function addRandomTile() {
  const emptyCells = [];

  // 收集所有空格子
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      if (grid[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  // 如果有空格子，随机选择一个并放置2或4
  if (emptyCells.length > 0) {
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

// 绘制游戏
function draw() {
  // 清空画布
  ctx.fillStyle = config.colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制网格背景
  const cellSize = canvas.width / config.size;
  const padding = 10;
  const cellSizeWithPadding = cellSize - padding;

  ctx.fillStyle = config.colors.grid;
  ctx.fillRect(
    padding / 2,
    padding / 2,
    canvas.width - padding,
    canvas.height - padding,
  );

  // 绘制每个格子
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      const value = grid[r][c];
      const x = c * cellSize + padding / 2;
      const y = r * cellSize + padding / 2;

      // 绘制格子背景
      ctx.fillStyle = value === 0 ? config.colors.empty : getTileColor(value);
      ctx.fillRect(x, y, cellSizeWithPadding, cellSizeWithPadding);

      // 绘制圆角
      ctx.strokeStyle = config.colors.background;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellSizeWithPadding, cellSizeWithPadding);

      // 如果有数字，绘制数字
      if (value > 0) {
        ctx.fillStyle = config.colors.text;
        ctx.font = getFontSize(value) + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          value,
          x + cellSizeWithPadding / 2,
          y + cellSizeWithPadding / 2,
        );
      }
    }
  }
}

// 根据方块值获取颜色
function getTileColor(value) {
  const index = Math.min(
    Math.log2(value) - 1,
    config.colors.tileColors.length - 1,
  );
  return config.colors.tileColors[index];
}

// 根据方块值获取字体大小
function getFontSize(value) {
  if (value < 100) return 36;
  if (value < 1000) return 30;
  return 24;
}

// 处理键盘输入
function handleKeyPress(e) {
  if (gameOver) return;

  let moved = false;

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moved = moveUp();
      break;
    case "ArrowDown":
    case "s":
    case "S":
      moved = moveDown();
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      moved = moveLeft();
      break;
    case "ArrowRight":
    case "d":
    case "D":
      moved = moveRight();
      break;
    default:
      return; // 忽略其他按键
  }

  if (moved) {
    addRandomTile();
    draw();

    // 检查游戏是否结束
    if (isGameOver()) {
      gameOver = true;
      finalScoreElement.textContent = score;
      gameOverElement.style.display = "flex";

      // 更新最高分
      if (score > bestScore) {
        bestScore = score;
        bestElement.textContent = bestScore;
        localStorage.setItem("2048-best-score", bestScore);
      }
    }
  }
}

// 向上移动
function moveUp() {
  let moved = false;

  for (let c = 0; c < config.size; c++) {
    // 收集当前列的所有非零值
    const column = [];
    for (let r = 0; r < config.size; r++) {
      if (grid[r][c] !== 0) {
        column.push(grid[r][c]);
      }
    }

    // 合并相同数字
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        score += column[i];
        scoreElement.textContent = score;
        column.splice(i + 1, 1);
      }
    }

    // 填充空格子
    while (column.length < config.size) {
      column.push(0);
    }

    // 更新网格
    for (let r = 0; r < config.size; r++) {
      if (grid[r][c] !== column[r]) {
        moved = true;
        grid[r][c] = column[r];
      }
    }
  }

  return moved;
}

// 向下移动
function moveDown() {
  let moved = false;

  for (let c = 0; c < config.size; c++) {
    // 收集当前列的所有非零值
    const column = [];
    for (let r = config.size - 1; r >= 0; r--) {
      if (grid[r][c] !== 0) {
        column.push(grid[r][c]);
      }
    }

    // 合并相同数字
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        score += column[i];
        scoreElement.textContent = score;
        column.splice(i + 1, 1);
      }
    }

    // 填充空格子
    while (column.length < config.size) {
      column.push(0);
    }

    // 更新网格
    for (let r = config.size - 1; r >= 0; r--) {
      const newValue = column[config.size - 1 - r];
      if (grid[r][c] !== newValue) {
        moved = true;
        grid[r][c] = newValue;
      }
    }
  }

  return moved;
}

// 向左移动
function moveLeft() {
  let moved = false;

  for (let r = 0; r < config.size; r++) {
    // 收集当前行的所有非零值
    const row = [];
    for (let c = 0; c < config.size; c++) {
      if (grid[r][c] !== 0) {
        row.push(grid[r][c]);
      }
    }

    // 合并相同数字
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        scoreElement.textContent = score;
        row.splice(i + 1, 1);
      }
    }

    // 填充空格子
    while (row.length < config.size) {
      row.push(0);
    }

    // 更新网格
    for (let c = 0; c < config.size; c++) {
      if (grid[r][c] !== row[c]) {
        moved = true;
        grid[r][c] = row[c];
      }
    }
  }

  return moved;
}

// 向右移动
function moveRight() {
  let moved = false;

  for (let r = 0; r < config.size; r++) {
    // 收集当前行的所有非零值
    const row = [];
    for (let c = config.size - 1; c >= 0; c--) {
      if (grid[r][c] !== 0) {
        row.push(grid[r][c]);
      }
    }

    // 合并相同数字
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        scoreElement.textContent = score;
        row.splice(i + 1, 1);
      }
    }

    // 填充空格子
    while (row.length < config.size) {
      row.push(0);
    }

    // 更新网格
    for (let c = config.size - 1; c >= 0; c--) {
      const newValue = row[config.size - 1 - c];
      if (grid[r][c] !== newValue) {
        moved = true;
        grid[r][c] = newValue;
      }
    }
  }

  return moved;
}

// 检查游戏是否结束
function isGameOver() {
  // 检查是否有空格子
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      if (grid[r][c] === 0) {
        return false;
      }
    }
  }

  // 检查是否有可合并的相邻方块
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      const value = grid[r][c];

      // 检查右侧
      if (c < config.size - 1 && grid[r][c + 1] === value) {
        return false;
      }

      // 检查下方
      if (r < config.size - 1 && grid[r + 1][c] === value) {
        return false;
      }
    }
  }

  return true;
}

// 页面加载完成后初始化游戏
document.addEventListener("DOMContentLoaded", init);
