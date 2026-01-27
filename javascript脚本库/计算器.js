// 计算器状态管理
class Calculator {
  constructor() {
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.waitingForNewInput = false;
    this.calculationString = "";

    this.init();
  }

  init() {
    this.updateDisplay();
    this.setupEventListeners();
    this.setupKeyboardSupport();
  }

  // 更新显示
  updateDisplay() {
    const resultDisplay = document.getElementById("resultDisplay");
    const calculationDisplay = document.getElementById("calculationDisplay");

    resultDisplay.textContent = this.formatDisplayNumber(this.currentInput);
    calculationDisplay.textContent = this.calculationString;
  }

  // 格式化显示的数字（添加千位分隔符）
  formatDisplayNumber(numStr) {
    if (numStr === "") return "0";

    // 如果是小数，分开处理整数部分和小数部分
    if (numStr.includes(".")) {
      const [integerPart, decimalPart] = numStr.split(".");
      return this.addThousandsSeparator(integerPart) + "." + decimalPart;
    }

    return this.addThousandsSeparator(numStr);
  }

  // 添加千位分隔符
  addThousandsSeparator(numStr) {
    // 处理负数
    const isNegative = numStr.startsWith("-");
    const absoluteNumStr = isNegative ? numStr.slice(1) : numStr;

    // 添加千位分隔符
    const parts = absoluteNumStr.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (isNegative ? "-" : "") + parts.join(".");
  }

  // 处理数字输入
  inputNumber(number) {
    // 如果等待新输入（刚刚执行完计算或按了运算符）
    if (this.waitingForNewInput) {
      this.currentInput = number;
      this.waitingForNewInput = false;
    } else {
      // 防止输入多个小数点
      if (number === "." && this.currentInput.includes(".")) {
        return;
      }

      // 防止输入多个前导零
      if (this.currentInput === "0" && number !== ".") {
        this.currentInput = number;
      } else {
        this.currentInput += number;
      }
    }

    this.updateDisplay();
  }

  // 处理操作符
  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);

    // 如果已经有操作符，先执行计算
    if (this.operator && !this.waitingForNewInput) {
      this.calculate();
    }

    // 更新操作符
    this.operator = nextOperator;

    // 更新计算字符串
    if (this.calculationString === "") {
      this.calculationString = `${this.formatDisplayNumber(this.currentInput)} ${this.operator}`;
    } else {
      this.calculationString = `${this.previousInput} ${this.operator}`;
    }

    // 保存当前输入，并等待新输入
    this.previousInput = this.currentInput;
    this.waitingForNewInput = true;

    this.updateDisplay();
  }

  // 执行计算
  calculate() {
    const prevValue = parseFloat(this.previousInput);
    const currentValue = parseFloat(this.currentInput);

    if (isNaN(prevValue) || isNaN(currentValue)) return;

    let result;

    switch (this.operator) {
      case "+":
        result = prevValue + currentValue;
        break;
      case "-":
        result = prevValue - currentValue;
        break;
      case "×":
        result = prevValue * currentValue;
        break;
      case "÷":
        if (currentValue === 0) {
          alert("错误：不能除以零");
          this.clear();
          return;
        }
        result = prevValue / currentValue;
        break;
      default:
        return;
    }

    // 处理浮点数精度问题
    result = Math.round(result * 100000000) / 100000000;

    // 更新显示
    this.currentInput = result.toString();
    this.operator = null;
    this.previousInput = "";
    this.calculationString = "";
    this.waitingForNewInput = true;

    this.updateDisplay();
  }

  // 清除计算器
  clear() {
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.waitingForNewInput = false;
    this.calculationString = "";

    this.updateDisplay();
  }

  // 退格
  backspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = "0";
    }

    this.updateDisplay();
  }

  // 设置事件监听
  setupEventListeners() {
    // 数字按钮
    document.querySelectorAll("[data-number]").forEach((button) => {
      button.addEventListener("click", () => {
        this.inputNumber(button.dataset.number);
      });
    });

    // 操作符按钮
    document.querySelectorAll("[data-operator]").forEach((button) => {
      button.addEventListener("click", () => {
        this.inputOperator(button.dataset.operator);
      });
    });

    // 等号按钮
    document
      .querySelector('[data-action="equals"]')
      .addEventListener("click", () => {
        this.calculate();
      });

    // 清除按钮
    document
      .querySelector('[data-action="clear"]')
      .addEventListener("click", () => {
        this.clear();
      });

    // 退格按钮
    document
      .querySelector('[data-action="backspace"]')
      .addEventListener("click", () => {
        this.backspace();
      });
  }

  // 键盘支持
  setupKeyboardSupport() {
    document.addEventListener("keydown", (event) => {
      // 防止事件冒泡影响其他组件
      event.stopPropagation();

      const key = event.key;

      // 数字键
      if (key >= "0" && key <= "9") {
        this.inputNumber(key);
        return;
      }

      // 小数点
      if (key === ".") {
        this.inputNumber(".");
        return;
      }

      // 操作符
      if (["+", "-", "*", "/"].includes(key)) {
        let operator = key;
        if (key === "*") operator = "×";
        if (key === "/") operator = "÷";
        this.inputOperator(operator);
        return;
      }

      // 等号或回车
      if (key === "=" || key === "Enter") {
        this.calculate();
        return;
      }

      // 退格
      if (key === "Backspace") {
        this.backspace();
        return;
      }

      // 清除 (Escape 或 Delete)
      if (key === "Escape" || key === "Delete") {
        this.clear();
        return;
      }
    });
  }
}

// 初始化计算器
document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();

  // 添加简单的使用说明提示（可选）
  console.log(
    "计算器已初始化。支持键盘输入：数字键、+-*/、Enter(=)、Backspace、Escape(AC)",
  );
});
