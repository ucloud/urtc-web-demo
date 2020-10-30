function setCookie(_name, _val, expires) {
  var d = new Date();
  d.setDate(d.getDate() + expires);
  document.cookie = _name + "=" + _val + ";expires=" + d;
}

function getCookie(_name) {
  var cookie = document.cookie;
  var arr = cookie.split("; ");
  for (var i = 0; i < arr.length; i++) {
    var newArr = arr[i].split("=");
    if (newArr[0] === _name) {
      return newArr[1];
    }
  }
}
function removeCookie(_name, _val) {
  setCookie(_name, _val, -1);
}
export { setCookie, getCookie, removeCookie };
