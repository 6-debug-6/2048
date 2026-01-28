// 获取弹窗
var modal2 = document.getElementById("myModal2");

// 获取打开弹窗的按钮
var btn2 = document.getElementById("myBtn2");

// 获取关闭弹窗的<span>元素
var span2 = document.getElementsByClassName("close1")[1]; // 注意：这里是第二个close1按钮

// 当点击按钮打开弹窗
btn2.onclick = function () {
  modal2.style.display = "block";
  // 延迟初始化俄罗斯方块游戏，确保弹窗已显示
  setTimeout(() => {
    if (typeof initTetrisGame === "function") {
      initTetrisGame();
    }
  }, 100);
};

// 当点击关闭按钮关闭弹窗
span2.onclick = function () {
  modal2.style.display = "none";
};

//关闭弹幕的功能集成到最后一个弹窗脚本里去了
