//待会测试不同脚本的变量会不会互相影响
//有4个弹窗元素名会出问题，不能直接引用
// 获取弹窗
var modal4 = document.getElementById("myModal4");

// 打开弹窗的按钮对象
var btn4 = document.getElementById("myBtn4");

// 获取 <span> 元素，用于关闭弹窗 that closes the modal
//close的数量有问题，记得注意一下
var span4 = document.getElementsByClassName("close1")[3];

// 点击按钮打开弹窗
btn4.onclick = function () {
  modal4.style.display = "block";
};

// 点击 <span> (x), 关闭弹窗
span4.onclick = function () {
  modal4.style.display = "none";
};
// 在用户点击其他地方时，关闭弹窗，集成了所以弹窗脚本的关闭功能
window.onclick = function (event) {
  if (event.target == modal4) {
    modal4.style.display = "none";
  }
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
  if (event.target == modal1) {
    modal1.style.display = "none";
  }

  if (event.target == modal) {
    modal.style.display = "none";
  }
};
