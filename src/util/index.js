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

function isIOS(){
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS;
}

function isSafari() {
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
}
function openFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen){
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

function isFirefox(){
  return navigator.userAgent.indexOf("Firefox")>0
}

//退出全屏方法
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExiFullscreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
export { randNum, copy, isPC, objectToParamString, isWeChat, isSafari,exitFullScreen,openFullscreen,isIOS,isFirefox };
