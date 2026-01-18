// 实时显示当前时间
//脚本对放置顺序有要求
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
let timeString = `当前时间：${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
document.getElementById("time").innerHTML = timeString;

let now = setInterval(function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let timeString = `当前时间：${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
  document.getElementById("time").innerHTML = timeString;
}, 1000);
