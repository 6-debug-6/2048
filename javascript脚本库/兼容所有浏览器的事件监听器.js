/*
 * 参数：
 *     obj：要绑定事件的对象
 *     eventStr：事件(注意：这里不要on)
 *      callback：回调函数
 */
function bind(obj, eventStr, callback) {
  if (obj.addEventListener) {
    //大部分浏览器
    obj.addEventListener(eventStr, callback, false);
  } else {
    //IE8及以下
    obj.attachEvent("on" + eventStr, function () {
      //在匿名函数中调用回调函数
      callback.call(obj);
    });
  }
}
