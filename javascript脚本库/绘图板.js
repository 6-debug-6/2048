const canvas3 = document.getElementById("drawingCanvas");
const ctx3 = canvas3.getContext("2d");

// 初始化画布为白色
ctx3.fillStyle = "white";
ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

// 绘画状态
const drawingState = {
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  brushColor: "#000000",
  brushSize: 5,
  brushType: "round",
};

// 更新画笔大小显示
document.getElementById("brushSize").addEventListener("input", function (e) {
  drawingState.brushSize = parseInt(e.target.value);
  document.getElementById("brushSizeValue").textContent = e.target.value + "px";
});

// 更新颜色
document.getElementById("colorPicker").addEventListener("input", function (e) {
  drawingState.brushColor = e.target.value;
});

// 鼠标事件处理
canvas3.addEventListener("mousedown", startDrawing);
canvas3.addEventListener("mousemove", draw);
canvas3.addEventListener("mouseup", stopDrawing);
canvas3.addEventListener("mouseout", stopDrawing);

// 触摸屏支持
canvas3.addEventListener("touchstart", function (e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas3.dispatchEvent(mouseEvent);
});

canvas3.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas3.dispatchEvent(mouseEvent);
});

canvas3.addEventListener("touchend", function (e) {
  e.preventDefault();
  const mouseEvent = new MouseEvent("mouseup", {});
  canvas3.dispatchEvent(mouseEvent);
});

function startDrawing(e) {
  drawingState.isDrawing = true;
  [drawingState.lastX, drawingState.lastY] = getMousePos(canvas3, e);
}

function draw(e) {
  if (!drawingState.isDrawing) return;

  e.preventDefault();

  const [currentX, currentY] = getMousePos(canvas3, e);

  // 设置绘图样式
  ctx3.strokeStyle = drawingState.brushColor;
  ctx3.lineWidth = drawingState.brushSize;
  ctx3.lineCap = "round";
  ctx3.lineJoin = "round";

  // 橡皮擦模式
  if (drawingState.brushType === "eraser") {
    ctx3.globalCompositeOperation = "destination-out";
    ctx3.lineWidth = drawingState.brushSize * 2;
  } else {
    ctx3.globalCompositeOperation = "source-over";
  }

  // 开始绘制路径
  ctx3.beginPath();
  ctx3.moveTo(drawingState.lastX, drawingState.lastY);
  ctx3.lineTo(currentX, currentY);
  ctx3.stroke();

  // 如果是方形笔刷，额外绘制矩形
  if (drawingState.brushType === "square") {
    ctx3.fillStyle = drawingState.brushColor;
    if (drawingState.brushType === "eraser") {
      ctx3.globalCompositeOperation = "destination-out";
    }
    ctx3.fillRect(
      currentX - drawingState.brushSize / 2,
      currentY - drawingState.brushSize / 2,
      drawingState.brushSize,
      drawingState.brushSize,
    );
  }

  // 更新最后位置
  [drawingState.lastX, drawingState.lastY] = [currentX, currentY];
}

function stopDrawing() {
  drawingState.isDrawing = false;
}

// 获取鼠标在canvas上的位置
function getMousePos(canvas3, evt) {
  const rect = canvas3.getBoundingClientRect();
  return [evt.clientX - rect.left, evt.clientY - rect.top];
}

// 改变笔刷类型
function changeBrushType(type) {
  drawingState.brushType = type;
}

// 清空画布
function clearCanvas() {
  ctx3.fillStyle = "white";
  ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
}
