// 俄罗斯方块游戏 - 修改版本，解决弹窗中Canvas尺寸问题
(function () {
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
      this.dropInterval = 1000;
      this.dropCounter = 0;
      this.lastTime = 0;

      // 游戏板尺寸
      this.boardWidth = 10;
      this.boardHeight = 20;
      this.cellSize = 40;

      // 游戏板状态
      this.board = Array.from({ length: this.boardHeight }, () =>
        Array(this.boardWidth).fill(0),
      );

      // 当前方块和下一个方块
      this.currentPiece = null;
      this.nextPiece = null;

      // 方块类型和颜色
      this.pieces = [
        {
          shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ],
          color: "#00f5ff",
        },
        {
          shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
          ],
          color: "#4361ee",
        },
        {
          shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
          ],
          color: "#f8961e",
        },
        {
          shape: [
            [1, 1],
            [1, 1],
          ],
          color: "#ffd166",
        },
        {
          shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
          ],
          color: "#06d6a0",
        },
        {
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
          ],
          color: "#9d4edd",
        },
        {
          shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
          ],
          color: "#ef476f",
        },
      ];

      // Canvas元素和上下文
      this.canvas = null;
      this.ctx = null;
      this.nextCanvas = null;
      this.nextCtx = null;

      // 游戏是否已初始化
      this.initialized = false;
    }

    // 初始化游戏
    init() {
      // 获取Canvas元素
      this.canvas = document.getElementById("tetrisCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.nextCanvas = document.getElementById("nextPieceCanvas");
      this.nextCtx = this.nextCanvas.getContext("2d");

      if (!this.canvas || !this.ctx) {
        console.error("Canvas元素未找到！");
        return;
      }

      // 设置Canvas尺寸
      this.setCanvasSize();

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

      this.initialized = true;

      // 更新显示
      this.updateDisplay();
    }

    // 设置Canvas尺寸
    setCanvasSize() {
      // 使用固定尺寸而不是基于容器计算
      // 因为弹窗可能隐藏，容器尺寸可能不正确
      const container = document.getElementById("gameCanvasContainer");

      // 设置主Canvas尺寸
      this.canvas.width = 400;
      this.canvas.height = 800;
      this.cellSize = this.canvas.width / this.boardWidth;

      // 设置下一个方块Canvas尺寸
      this.nextCanvas.width = 150;
      this.nextCanvas.height = 150;

      // 如果容器存在，调整Canvas样式以适应容器
      if (container) {
        // 确保Canvas在容器内正确显示
        this.canvas.style.width = "100%";
        this.canvas.style.height = "auto";

        // 如果容器高度限制，调整Canvas高度
        const containerHeight = container.clientHeight;
        if (containerHeight && containerHeight < 800) {
          const aspectRatio = 400 / 800;
          const newHeight = containerHeight - 10; // 减去一些边距
          const newWidth = newHeight * aspectRatio;

          this.canvas.style.width = newWidth + "px";
          this.canvas.style.height = newHeight + "px";
        }
      }
    }

    // 创建随机方块
    createRandomPiece() {
      const pieceType = Math.floor(Math.random() * this.pieces.length);
      return {
        shape: this.pieces[pieceType].shape,
        color: this.pieces[pieceType].color,
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

      // 检查游戏是否结束
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

    // 检查碰撞
    checkCollision(x, y, shape) {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const newX = x + col;
            const newY = y + row;

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

    // 绘制游戏板
    drawBoard() {
      if (!this.ctx) return;

      // 清空Canvas
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
            const pieceIndex = this.board[y][x] - 1;
            this.ctx.fillStyle = this.pieces[pieceIndex].color;
            this.ctx.fillRect(
              x * this.cellSize,
              y * this.cellSize,
              this.cellSize,
              this.cellSize,
            );

            this.ctx.strokeStyle = "#ffffff";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
              x * this.cellSize,
              y * this.cellSize,
              this.cellSize,
              this.cellSize,
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
            this.ctx.fillRect(
              (piece.x + x) * this.cellSize,
              (piece.y + y) * this.cellSize,
              this.cellSize,
              this.cellSize,
            );

            this.ctx.strokeStyle = "#ffffff";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
              (piece.x + x) * this.cellSize,
              (piece.y + y) * this.cellSize,
              this.cellSize,
              this.cellSize,
            );
          }
        }
      }
    }

    // 绘制下一个方块预览
    drawNextPiece() {
      if (!this.nextCtx) return;

      this.nextCtx.fillStyle = "#0f0f1a";
      this.nextCtx.fillRect(
        0,
        0,
        this.nextCanvas.width,
        this.nextCanvas.height,
      );

      if (!this.nextPiece) return;

      const piece = this.nextPiece;
      const blockSize = 30;
      const offsetX =
        (this.nextCanvas.width - piece.shape[0].length * blockSize) / 2;
      const offsetY =
        (this.nextCanvas.height - piece.shape.length * blockSize) / 2;

      this.nextCtx.fillStyle = piece.color;

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            this.nextCtx.fillRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize,
              blockSize,
            );

            this.nextCtx.strokeStyle = "#ffffff";
            this.nextCtx.lineWidth = 2;
            this.nextCtx.strokeRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize,
              blockSize,
            );
          }
        }
      }
    }

    // 合并方块到游戏板
    mergePieceToBoard() {
      for (let y = 0; y < this.currentPiece.shape.length; y++) {
        for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
          if (this.currentPiece.shape[y][x]) {
            const boardY = this.currentPiece.y + y;
            if (boardY >= 0) {
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
        if (this.board[y].every((cell) => cell !== 0)) {
          this.board.splice(y, 1);
          this.board.unshift(Array(this.boardWidth).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        const linePoints = [0, 100, 300, 500, 800];
        this.score += linePoints[linesCleared] * this.level;
        this.lines += linesCleared;

        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
          this.level = newLevel;
          this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }

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

      const shape = this.currentPiece.shape;
      const rows = shape.length;
      const cols = shape[0].length;
      const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          rotated[x][rows - 1 - y] = shape[y][x];
        }
      }

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

      while (this.movePiece(0, 1)) {}

      this.mergePieceToBoard();
      this.clearLines();
      this.spawnNewPiece();
      this.drawBoard();
    }

    // 更新游戏显示
    updateDisplay() {
      const scoreElement = document.getElementById("scoreValue");
      const levelElement = document.getElementById("levelValue");
      const linesElement = document.getElementById("linesValue");
      const gameStatusElement = document.getElementById("gameStatus");

      if (scoreElement) scoreElement.textContent = this.score;
      if (levelElement) levelElement.textContent = this.level;
      if (linesElement) linesElement.textContent = this.lines;

      if (gameStatusElement) {
        gameStatusElement.textContent = this.gameActive
          ? `游戏中 - 等级 ${this.level}`
          : '点击"开始游戏"按钮开始';
      }
    }

    // 游戏主循环
    gameLoop(time) {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;

      if (this.gameActive && !this.gamePaused && !this.gameOver) {
        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
          if (!this.movePiece(0, 1)) {
            this.mergePieceToBoard();
            this.clearLines();
            this.spawnNewPiece();
          }

          this.dropCounter = 0;
          this.drawBoard();
        }
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

      const pauseOverlay = document.getElementById("pauseOverlay");
      if (pauseOverlay) pauseOverlay.style.display = "none";

      const startBtn = document.getElementById("startBtn");
      const pauseBtn = document.getElementById("pauseBtn");

      if (startBtn) startBtn.textContent = "继续";
      if (pauseBtn) pauseBtn.textContent = "暂停";

      this.updateDisplay();
    }

    // 暂停游戏
    pauseGame() {
      if (!this.gameActive || this.gameOver) return;

      this.gamePaused = !this.gamePaused;

      const pauseOverlay = document.getElementById("pauseOverlay");
      const pauseBtn = document.getElementById("pauseBtn");

      if (this.gamePaused) {
        if (pauseOverlay) pauseOverlay.style.display = "flex";
        if (pauseBtn) pauseBtn.textContent = "继续";
      } else {
        if (pauseOverlay) pauseOverlay.style.display = "none";
        if (pauseBtn) pauseBtn.textContent = "暂停";
      }

      this.updateDisplay();
    }

    // 重置游戏
    resetGame() {
      this.gameActive = false;
      this.gamePaused = false;
      this.gameOver = false;

      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.dropInterval = 1000;
      this.dropCounter = 0;

      this.board = Array.from({ length: this.boardHeight }, () =>
        Array(this.boardWidth).fill(0),
      );

      this.nextPiece = this.createRandomPiece();
      this.spawnNewPiece();

      this.updateDisplay();
      this.drawBoard();

      const pauseOverlay = document.getElementById("pauseOverlay");
      const gameOverOverlay = document.getElementById("gameOverOverlay");
      const startBtn = document.getElementById("startBtn");
      const pauseBtn = document.getElementById("pauseBtn");

      if (pauseOverlay) pauseOverlay.style.display = "none";
      if (gameOverOverlay) gameOverOverlay.style.display = "none";
      if (startBtn) startBtn.textContent = "开始游戏";
      if (pauseBtn) pauseBtn.textContent = "暂停";
    }

    // 显示游戏结束
    showGameOver() {
      this.gameActive = false;

      const finalGameScoreElement = document.getElementById("finalGameScore");
      const gameOverOverlay = document.getElementById("gameOverOverlay");

      if (finalGameScoreElement) finalGameScoreElement.textContent = this.score;
      if (gameOverOverlay) gameOverOverlay.style.display = "flex";

      this.updateDisplay();
    }

    // 设置事件监听
    setupEventListeners() {
      // 键盘控制
      document.addEventListener("keydown", (e) => {
        // 检查是否在俄罗斯方块弹窗中
        const tetrisModal = document.getElementById("myModal2");
        if (!tetrisModal || tetrisModal.style.display !== "block") {
          return; // 不在俄罗斯方块弹窗中，不处理按键
        }

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
      const startBtn = document.getElementById("startBtn");
      const pauseBtn = document.getElementById("pauseBtn");
      const restartBtn = document.getElementById("restartBtn");
      const restartAfterGameOverBtn = document.getElementById(
        "restartAfterGameOver",
      );

      if (startBtn) {
        startBtn.addEventListener("click", () => {
          this.startGame();
        });
      }

      if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
          this.pauseGame();
        });
      }

      if (restartBtn) {
        restartBtn.addEventListener("click", () => {
          this.resetGame();
        });
      }

      if (restartAfterGameOverBtn) {
        restartAfterGameOverBtn.addEventListener("click", () => {
          this.resetGame();
          this.startGame();
        });
      }

      // 窗口大小改变时重新绘制
      window.addEventListener("resize", () => {
        this.drawBoard();
        this.drawNextPiece();
      });
    }

    // 重新调整Canvas尺寸（在弹窗显示时调用）
    resizeCanvas() {
      if (this.initialized) {
        this.setCanvasSize();
        this.drawBoard();
        this.drawNextPiece();
      }
    }
  }

  // 创建游戏实例
  let tetrisGame = null;

  // 初始化函数，在弹窗显示时调用
  function initTetrisGame() {
    if (!tetrisGame) {
      tetrisGame = new TetrisGame();
      tetrisGame.init();
    } else {
      tetrisGame.resizeCanvas();
    }
  }

  // 暴露给全局
  window.initTetrisGame = initTetrisGame;
  window.tetrisGame = tetrisGame;

  // 页面加载后延迟初始化，确保DOM已加载
  setTimeout(() => {
    // 检查弹窗是否已经显示
    const tetrisModal = document.getElementById("myModal2");
    if (tetrisModal && tetrisModal.style.display === "block") {
      initTetrisGame();
    }
  }, 500);
})();
