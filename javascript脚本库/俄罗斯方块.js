// 俄罗斯方块游戏
class TetrisGame {
  constructor() {
    // 游戏状态
    this.gameActive = false;
    this.gamePaused = false;
    this.gameOver = false;

    // 游戏数据
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropInterval = 1000; // 初始下落间隔（毫秒）
    this.dropCounter = 0;
    this.lastTime = 0;

    // 游戏板尺寸
    this.boardWidth = 10;
    this.boardHeight = 20;
    this.cellSize = 40;

    // 游戏板状态（0表示空，其他数字表示不同类型的方块）
    this.board = Array.from({ length: this.boardHeight }, () =>
      Array(this.boardWidth).fill(0),
    );

    // 当前方块和下一个方块
    this.currentPiece = null;
    this.nextPiece = null;

    // 方块类型和颜色
    this.pieces = [
      // I 型方块
      {
        shape: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        color: "#00f5ff",
        className: "tetris-block-I",
      },
      // J 型方块
      {
        shape: [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: "#4361ee",
        className: "tetris-block-J",
      },
      // L 型方块
      {
        shape: [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: "#f8961e",
        className: "tetris-block-L",
      },
      // O 型方块
      {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: "#ffd166",
        className: "tetris-block-O",
      },
      // S 型方块
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ],
        color: "#06d6a0",
        className: "tetris-block-S",
      },
      // T 型方块
      {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: "#9d4edd",
        className: "tetris-block-T",
      },
      // Z 型方块
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
        ],
        color: "#ef476f",
        className: "tetris-block-Z",
      },
    ];

    // Canvas 元素
    this.canvas = document.getElementById("tetrisCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.nextPieceCanvas = document.getElementById("nextPieceCanvas");
    this.nextPieceCtx = this.nextPieceCanvas.getContext("2d");

    // 游戏状态元素
    this.scoreElement = document.getElementById("scoreValue");
    this.levelElement = document.getElementById("levelValue");
    this.linesElement = document.getElementById("linesValue");
    this.gameStatusElement = document.getElementById("gameStatus");

    // 游戏控制元素
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.restartBtn = document.getElementById("restartBtn");
    this.restartAfterGameOverBtn = document.getElementById(
      "restartAfterGameOver",
    );

    // 遮罩层元素
    this.pauseOverlay = document.getElementById("pauseOverlay");
    this.gameOverOverlay = document.getElementById("gameOverOverlay");
    this.finalGameScoreElement = document.getElementById("finalGameScore");

    // 初始化游戏
    this.init();
  }

  init() {
    // 设置Canvas尺寸
    this.updateCanvasSize();

    // 创建第一个方块
    this.nextPiece = this.createRandomPiece();
    this.spawnNewPiece();

    // 绘制初始状态
    this.drawBoard();
    this.drawNextPiece();

    // 设置事件监听
    this.setupEventListeners();

    // 开始游戏循环
    this.gameLoop(0);
  }

  // 更新Canvas尺寸
  updateCanvasSize() {
    // 根据窗口大小调整Canvas尺寸
    const container = document.getElementById("gameCanvasContainer");
    const maxWidth = 400;
    const maxHeight = 800;

    // 保持宽高比
    const aspectRatio = maxWidth / maxHeight;
    let canvasWidth = container.clientWidth - 20; // 减去边框和内边距
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }

    // 设置Canvas尺寸
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.cellSize = canvasWidth / this.boardWidth;

    // 重新绘制
    this.drawBoard();
  }

  // 创建随机方块
  createRandomPiece() {
    const pieceType = Math.floor(Math.random() * this.pieces.length);
    return {
      shape: this.pieces[pieceType].shape,
      color: this.pieces[pieceType].color,
      className: this.pieces[pieceType].className,
      x:
        Math.floor(this.boardWidth / 2) -
        Math.floor(this.pieces[pieceType].shape[0].length / 2),
      y: 0,
    };
  }

  // 生成新方块
  spawnNewPiece() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.createRandomPiece();

    // 检查游戏是否结束（新方块无法放置）
    if (
      this.checkCollision(
        this.currentPiece.x,
        this.currentPiece.y,
        this.currentPiece.shape,
      )
    ) {
      this.gameOver = true;
      this.gameActive = false;
      this.showGameOver();
    }

    // 更新下一个方块预览
    this.drawNextPiece();
  }

  // 绘制游戏板
  drawBoard() {
    // 清除Canvas
    this.ctx.fillStyle = "#0f0f1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制网格线
    this.ctx.strokeStyle = "#1a1a2e";
    this.ctx.lineWidth = 1;

    // 绘制垂直线
    for (let x = 0; x <= this.boardWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= this.boardHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.cellSize);
      this.ctx.stroke();
    }

    // 绘制已固定的方块
    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        if (this.board[y][x]) {
          // 根据方块类型获取颜色
          const pieceIndex = this.board[y][x] - 1;
          this.ctx.fillStyle = this.pieces[pieceIndex].color;

          // 绘制方块
          this.ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize,
          );

          // 绘制方块边框
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize,
          );

          // 绘制内部高光效果
          this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          this.ctx.fillRect(
            x * this.cellSize + 2,
            y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4,
          );
        }
      }
    }

    // 绘制当前下落的方块
    if (this.currentPiece && !this.gameOver) {
      this.drawPiece(this.currentPiece);
    }
  }

  // 绘制方块
  drawPiece(piece) {
    this.ctx.fillStyle = piece.color;

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          // 绘制方块
          this.ctx.fillRect(
            (piece.x + x) * this.cellSize,
            (piece.y + y) * this.cellSize,
            this.cellSize,
            this.cellSize,
          );

          // 绘制方块边框
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(
            (piece.x + x) * this.cellSize,
            (piece.y + y) * this.cellSize,
            this.cellSize,
            this.cellSize,
          );

          // 绘制内部高光效果
          this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          this.ctx.fillRect(
            (piece.x + x) * this.cellSize + 2,
            (piece.y + y) * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4,
          );
        }
      }
    }
  }

  // 绘制下一个方块预览
  drawNextPiece() {
    // 清除预览Canvas
    this.nextPieceCtx.fillStyle = "#0f0f1a";
    this.nextPieceCtx.fillRect(
      0,
      0,
      this.nextPieceCanvas.width,
      this.nextPieceCanvas.height,
    );

    if (!this.nextPiece) return;

    const piece = this.nextPiece;
    const blockSize = 30;
    const offsetX =
      (this.nextPieceCanvas.width - piece.shape[0].length * blockSize) / 2;
    const offsetY =
      (this.nextPieceCanvas.height - piece.shape.length * blockSize) / 2;

    this.nextPieceCtx.fillStyle = piece.color;

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          // 绘制方块
          this.nextPieceCtx.fillRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize,
          );

          // 绘制方块边框
          this.nextPieceCtx.strokeStyle = "#ffffff";
          this.nextPieceCtx.lineWidth = 2;
          this.nextPieceCtx.strokeRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize,
          );

          // 绘制内部高光效果
          this.nextPieceCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
          this.nextPieceCtx.fillRect(
            offsetX + x * blockSize + 2,
            offsetY + y * blockSize + 2,
            blockSize - 4,
            blockSize - 4,
          );
        }
      }
    }
  }

  // 检查碰撞
  checkCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          // 检查是否超出边界或与已有方块重叠
          if (
            newX < 0 ||
            newX >= this.boardWidth ||
            newY >= this.boardHeight ||
            (newY >= 0 && this.board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // 合并方块到游戏板
  mergePieceToBoard() {
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const boardY = this.currentPiece.y + y;
          if (boardY >= 0) {
            // 确保不会在顶部之外绘制
            // 找到当前方块对应的类型索引
            const pieceIndex = this.pieces.findIndex(
              (p) => p.color === this.currentPiece.color,
            );
            this.board[boardY][this.currentPiece.x + x] = pieceIndex + 1;
          }
        }
      }
    }
  }

  // 清除完整的行
  clearLines() {
    let linesCleared = 0;

    for (let y = this.boardHeight - 1; y >= 0; y--) {
      // 检查该行是否已满
      if (this.board[y].every((cell) => cell !== 0)) {
        // 移除该行
        this.board.splice(y, 1);
        // 在顶部添加新的空行
        this.board.unshift(Array(this.boardWidth).fill(0));
        linesCleared++;
        y++; // 重新检查同一位置（因为行已下移）
      }
    }

    if (linesCleared > 0) {
      // 更新分数
      const linePoints = [0, 100, 300, 500, 800]; // 根据消除行数获得分数
      this.score += linePoints[linesCleared] * this.level;

      // 更新已消除行数
      this.lines += linesCleared;

      // 更新等级（每消除10行升一级）
      const newLevel = Math.floor(this.lines / 10) + 1;
      if (newLevel > this.level) {
        this.level = newLevel;
        // 每升一级，下落速度加快
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
      }

      // 更新显示
      this.updateDisplay();
    }
  }

  // 移动方块
  movePiece(dx, dy) {
    if (!this.gameActive || this.gamePaused || this.gameOver) return;

    if (
      !this.checkCollision(
        this.currentPiece.x + dx,
        this.currentPiece.y + dy,
        this.currentPiece.shape,
      )
    ) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      this.drawBoard();
      return true;
    }
    return false;
  }

  // 旋转方块
  rotatePiece() {
    if (!this.gameActive || this.gamePaused || this.gameOver) return;

    // 创建旋转后的形状
    const shape = this.currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;

    // 创建新的旋转矩阵
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

    // 旋转矩阵
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = shape[y][x];
      }
    }

    // 检查旋转后是否碰撞
    if (
      !this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)
    ) {
      this.currentPiece.shape = rotated;
      this.drawBoard();
      return true;
    }

    return false;
  }

  // 方块直接落到底部
  hardDrop() {
    if (!this.gameActive || this.gamePaused || this.gameOver) return;

    // 不断向下移动直到碰撞
    while (this.movePiece(0, 1)) {
      // 继续移动
    }

    // 固定方块并生成新方块
    this.mergePieceToBoard();
    this.clearLines();
    this.spawnNewPiece();
    this.drawBoard();
  }

  // 更新游戏显示
  updateDisplay() {
    this.scoreElement.textContent = this.score;
    this.levelElement.textContent = this.level;
    this.linesElement.textContent = this.lines;
  }

  // 游戏主循环
  gameLoop(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.gameActive && !this.gamePaused && !this.gameOver) {
      this.dropCounter += deltaTime;

      if (this.dropCounter > this.dropInterval) {
        // 方块自动下落
        if (!this.movePiece(0, 1)) {
          // 如果不能下落，则固定方块并生成新方块
          this.mergePieceToBoard();
          this.clearLines();
          this.spawnNewPiece();
        }

        this.dropCounter = 0;
        this.drawBoard();
      }

      // 更新游戏状态显示
      this.gameStatusElement.textContent = `游戏中 - 等级 ${this.level}`;
    }

    requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
  }

  // 开始游戏
  startGame() {
    if (this.gameOver) {
      this.resetGame();
    }

    this.gameActive = true;
    this.gamePaused = false;
    this.pauseOverlay.style.display = "none";
    this.gameStatusElement.textContent = `游戏中 - 等级 ${this.level}`;

    // 更新按钮文本
    this.startBtn.textContent = "重新开始";
    this.pauseBtn.textContent = "暂停";
  }

  // 暂停游戏
  pauseGame() {
    if (!this.gameActive || this.gameOver) return;

    this.gamePaused = !this.gamePaused;

    if (this.gamePaused) {
      this.pauseOverlay.style.display = "flex";
      this.gameStatusElement.textContent = "游戏已暂停";
      this.pauseBtn.textContent = "继续";
    } else {
      this.pauseOverlay.style.display = "none";
      this.gameStatusElement.textContent = `游戏中 - 等级 ${this.level}`;
      this.pauseBtn.textContent = "暂停";
    }
  }

  // 重置游戏
  resetGame() {
    // 重置游戏状态
    this.gameActive = false;
    this.gamePaused = false;
    this.gameOver = false;

    // 重置游戏数据
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropInterval = 1000;
    this.dropCounter = 0;

    // 重置游戏板
    this.board = Array.from({ length: this.boardHeight }, () =>
      Array(this.boardWidth).fill(0),
    );

    // 生成新方块
    this.nextPiece = this.createRandomPiece();
    this.spawnNewPiece();

    // 重置显示
    this.updateDisplay();
    this.drawBoard();

    // 隐藏遮罩层
    this.pauseOverlay.style.display = "none";
    this.gameOverOverlay.style.display = "none";

    // 更新按钮文本
    this.startBtn.textContent = "开始游戏";
    this.pauseBtn.textContent = "暂停";
    this.gameStatusElement.textContent = '点击"开始游戏"按钮开始';
  }

  // 显示游戏结束
  showGameOver() {
    this.gameActive = false;
    this.finalGameScoreElement.textContent = this.score;
    this.gameOverOverlay.style.display = "flex";
    this.gameStatusElement.textContent = "游戏结束";
  }

  // 设置事件监听
  setupEventListeners() {
    // 键盘控制
    document.addEventListener("keydown", (e) => {
      // 防止事件冒泡影响其他游戏
      e.stopPropagation();

      if (!this.gameActive || this.gamePaused || this.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          this.movePiece(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          this.movePiece(1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          this.movePiece(0, 1);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          this.rotatePiece();
          break;
        case " ":
          this.hardDrop();
          break;
        case "p":
        case "P":
          this.pauseGame();
          break;
      }
    });

    // 控制按钮事件
    this.startBtn.addEventListener("click", () => {
      this.startGame();
    });

    this.pauseBtn.addEventListener("click", () => {
      this.pauseGame();
    });

    this.restartBtn.addEventListener("click", () => {
      this.resetGame();
    });

    this.restartAfterGameOverBtn.addEventListener("click", () => {
      this.resetGame();
      this.startGame();
    });

    // 窗口大小改变时调整Canvas尺寸
    window.addEventListener("resize", () => {
      this.updateCanvasSize();
    });
  }
}

// 初始化游戏
document.addEventListener("DOMContentLoaded", () => {
  const tetrisGame = new TetrisGame();

  // 添加游戏启动提示
  console.log("俄罗斯方块游戏已初始化。点击开始游戏按钮开始！");
});
