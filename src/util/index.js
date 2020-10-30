function randNum(l) {
  let S = "0123456789abcdefghijklmnopqrstuvwxyz";
  let s = "";
  for (let n = 0; n < l; ++n) {
    s = s + S.charAt(Math.floor((Math.random() * 360) % 36));
  }
  return s;
}

function copy(str) {
  var save = function (e) {
    e.clipboardData.setData("text/plain", str); //clipboardData对象
    e.preventDefault(); //阻止默认行为
  };
  document.addEventListener("copy", save);
  document.execCommand("copy"); //使文档处于可编辑状态，否则无效
}
//判断是否为pc打开
function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

function objectToParamString(paramObj) {
  if (!paramObj) {
    return "";
  }
  let paramList = [];
  Object.keys(paramObj) &&
    Object.keys(paramObj).forEach((key) => {
      let val = paramObj[key];
      if (val.constructor === Array) {
        val.forEach((_val) => {
          paramList.push(key + "=" + _val);
        });
      } else {
        paramList.push(key + "=" + val);
      }
    });
  return paramList.join("&");
}

function isWeChat() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) === "micromessenger") {
    return true;
  } else {
    return false;
  }
}

function isSafari() {
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
}

export { randNum, copy, isPC, objectToParamString, isWeChat, isSafari };
