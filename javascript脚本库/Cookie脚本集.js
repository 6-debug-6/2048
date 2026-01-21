//设置名字cookie的函数
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取名字cookie的函数
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
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
