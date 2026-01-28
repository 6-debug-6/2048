// 翻牌匹配游戏
class CardMatchGame {
  constructor() {
    // 游戏状态
    this.gameStarted = false;
    this.canFlip = true;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.hintCount = 3;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedTime = 0;

    // 游戏难度设置
    this.difficulty = "easy";
    this.difficultySettings = {
      easy: { pairs: 8, gridColumns: 4 },
      medium: { pairs: 12, gridColumns: 4 },
      hard: { pairs: 16, gridColumns: 4 },
    };

    // ============================================
    // 牌面内容设置 - 您可以在这里自定义卡片内容
    // ============================================
    // 您可以替换这里的文本内容，但需要确保数量足够
    // 每种难度需要对应数量的不同内容（每种内容会出现两次）
    this.cardContents = {
      easy: ["😊", "🐱喵~", "🐶", "🐼", "🐯", "🦁", "🐨", "功德减10"],
      medium: [
        "😊",
        "🐱",
        "🐶汪~",
        "🐼",
        "🐯",
        "🦁",
        "🐨",
        "🐰",
        "把你的寿命转让给楷子1年",
        "🐵",
        "🦊",
        "🐻",
      ],
      hard: [
        "逢考必过",
        "🐱",
        "�",
        "🐼",
        "🐯",
        "🦁",
        "�",
        "🐰",
        "🐸呱~",
        "🐵",
        "🦊",
        "🐻",
        "🐮：我不是黄牛！",
        "🐷",
        "🐔~只因~",
        "🐦",
      ],
    };
    // ============================================

    this.init();
  }

  init() {
    this.createCards();
    this.setupEventListeners();
    this.updateGameInfo();
  }

  // 创建卡片
  createCards() {
    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    const settings = this.difficultySettings[this.difficulty];
    const pairs = settings.pairs;
    const gridColumns = settings.gridColumns;

    // 更新网格列数
    cardsContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;

    // 获取当前难度的卡片内容
    const contents = this.cardContents[this.difficulty].slice(0, pairs);

    // 创建卡片对（每个内容出现两次）
    let cardValues = [];
    contents.forEach((content) => {
      cardValues.push(content, content);
    });

    // 洗牌算法
    this.shuffleArray(cardValues);

    // 生成卡片HTML
    cardValues.forEach((content, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.index = index;
      card.dataset.value = content;

      card.innerHTML = `
                        <div class="card-back">?</div>
                        <div class="card-front">
                            <div class="card-content">${content}</div>
                        </div>
                    `;

      // 为每张卡片添加点击事件监听
      card.addEventListener("click", () => this.handleCardClick(card));

      cardsContainer.appendChild(card);
    });

    // 更新总对数显示
    document.getElementById("totalPairs").textContent = pairs;
  }

  // 洗牌算法
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 处理卡片点击
  handleCardClick(card) {
    // 如果游戏未开始，则开始游戏
    if (!this.gameStarted) {
      this.startGame();
    }

    // 如果现在不能翻牌，则返回
    if (!this.canFlip) return;

    // 如果卡片已经匹配或已经翻开，则返回
    if (
      card.classList.contains("matched") ||
      card.classList.contains("flipped")
    )
      return;

    // 翻开卡片
    card.classList.add("flipped");
    this.flippedCards.push(card);

    // 如果翻开了两张卡片，检查是否匹配
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateGameInfo();

      const card1 = this.flippedCards[0];
      const card2 = this.flippedCards[1];

      if (card1.dataset.value === card2.dataset.value) {
        // 匹配成功
        setTimeout(() => {
          card1.classList.add("matched");
          card2.classList.add("matched");
          this.flippedCards = [];
          this.matchedPairs++;
          this.score += 50; // 匹配成功加分

          // 检查游戏是否结束
          this.checkGameEnd();
          this.updateGameInfo();
        }, 500);
      } else {
        // 匹配失败，翻回去
        this.canFlip = false;
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          this.flippedCards = [];
          this.canFlip = true;
          this.score = Math.max(0, this.score - 5); // 匹配失败扣分
          this.updateGameInfo();
        }, 1000);
      }
    }
  }

  // 开始游戏
  startGame() {
    this.gameStarted = true;
    this.startTime = Date.now();

    // 启动计时器
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  // 检查游戏是否结束
  checkGameEnd() {
    const settings = this.difficultySettings[this.difficulty];
    if (this.matchedPairs === settings.pairs) {
      // 游戏结束
      clearInterval(this.timerInterval);

      // 计算最终分数（基于时间和步数）
      const timeBonus = Math.max(0, 500 - this.elapsedTime * 5);
      const movesBonus = Math.max(0, 500 - this.moves * 10);
      this.score += timeBonus + movesBonus;

      // 更新弹窗内容
      document.getElementById("gameTime").textContent = this.elapsedTime;
      document.getElementById("finalMoves").textContent = this.moves;
      document.getElementById("finalScore").textContent = this.score;

      // 显示游戏结束弹窗
      setTimeout(() => {
        document.getElementById("gameOverModal").classList.add("show");
      }, 1000);
    }
  }

  // 提示功能
  showHint() {
    if (this.hintCount <= 0) return;

    // 找到所有未匹配的卡片
    const allCards = document.querySelectorAll(
      "#cardMatchGame .card:not(.matched)",
    );
    const unflippedCards = Array.from(allCards).filter(
      (card) => !card.classList.contains("flipped"),
    );

    if (unflippedCards.length < 2) return;

    // 找到一对尚未匹配且内容相同的卡片
    let foundPair = null;

    // 先找到所有可能的配对
    const valueMap = {};
    for (const card of unflippedCards) {
      const value = card.dataset.value;
      if (valueMap[value]) {
        foundPair = [valueMap[value], card];
        break;
      } else {
        valueMap[value] = card;
      }
    }

    if (!foundPair) return;

    const [card1, card2] = foundPair;

    // 短暂翻开这两张卡片
    card1.classList.add("flipped");
    card2.classList.add("flipped");

    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 1000);

    // 减少提示次数
    this.hintCount--;
    document.getElementById("hintCount").textContent = this.hintCount;

    // 扣分
    this.score = Math.max(0, this.score - 20);
    this.updateGameInfo();
  }

  // 重新开始游戏
  restartGame() {
    // 重置游戏状态
    this.gameStarted = false;
    this.canFlip = true;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.hintCount = 3;
    this.elapsedTime = 0;

    // 清除计时器
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // 隐藏游戏结束弹窗
    document.getElementById("gameOverModal").classList.remove("show");

    // 重新创建卡片
    this.createCards();

    // 更新游戏信息
    this.updateGameInfo();
  }

  // 更新游戏信息显示
  updateGameInfo() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("matchedPairs").textContent = this.matchedPairs;
    document.getElementById("moves").textContent = this.moves;
    document.getElementById("hintCount").textContent = this.hintCount;
  }

  // 更改难度
  changeDifficulty(difficulty) {
    // 更新难度按钮状态
    document
      .querySelectorAll("#cardMatchGame .difficulty-btn")
      .forEach((btn) => {
        btn.classList.remove("active");
      });

    // 设置新难度
    this.difficulty = difficulty;
    event.target.classList.add("active");

    // 重新开始游戏
    this.restartGame();
  }

  // 设置事件监听
  setupEventListeners() {
    // 重新开始按钮
    document.getElementById("restartBtn").addEventListener("click", () => {
      this.restartGame();
    });

    // 提示按钮
    document.getElementById("hintBtn").addEventListener("click", () => {
      this.showHint();
    });

    // 再玩一次按钮
    document.getElementById("playAgainBtn").addEventListener("click", () => {
      this.restartGame();
    });

    // 难度选择按钮
    document
      .querySelectorAll("#cardMatchGame .difficulty-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (event) => {
          this.changeDifficulty(event.target.dataset.difficulty);
        });
      });
  }
}

// 初始化游戏
document.addEventListener("DOMContentLoaded", () => {
  const game = new CardMatchGame();

  // 添加游戏启动提示
  console.log("翻牌匹配游戏已初始化。点击卡片开始游戏！");
});
