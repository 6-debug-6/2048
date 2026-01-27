//待会测试不同脚本的变量会不会互相影响
//有4个弹窗元素名会出问题，不能直接引用
// 获取弹窗
var modal1 = document.getElementById("myModal1");

// 打开弹窗的按钮对象
var btn1 = document.getElementById("myBtn1");

// 获取 <span> 元素，用于关闭弹窗 that closes the modal
//close的数量有问题，记得注意一下
var span1 = document.getElementsByClassName("close1")[0];

// 点击按钮打开弹窗
btn1.onclick = function () {
  modal1.style.display = "block";
};

// 点击 <span> (x), 关闭弹窗
span1.onclick = function () {
  modal1.style.display = "none";
};

//关闭弹幕的功能集成到最后一个弹窗脚本里去了
