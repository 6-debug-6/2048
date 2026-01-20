// 实时显示当前时间
//脚本对放置顺序有要求

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds(); // 在小于10的数字前加一个‘0’
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("time").innerHTML =
    "当前时间：" + h + ":" + m + ":" + s;
  setTimeout(function () {
    startTime();
  }, 500);
}
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
//onload要放在body标签里
