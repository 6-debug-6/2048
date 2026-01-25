//设置名字cookie的函数
function setCookie(cname, cvalue, exdays, path) {
  var d = new Date();
  if (exdays === undefined) {
    exdays = 30; // 默认过期时间为30天
  }
  if (path === undefined) {
    path = "/"; // 默认路径为根路径
  }
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  var cpath = "path=" + path;
  document.cookie = cname + "=" + cvalue + "; " + expires + ";" + cpath;
}
//获取名字cookie的函数
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    //trim() 方法用于去除字符串两端的空白字符
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//检查名字cookie的函数
function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    alert("欢迎 " + user + " 再次访问");
  } else {
    user = prompt("请输入你的名字:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 30);
    }
  }
}
