/*
 * @Author: your name
 * @Date: 2020-12-25 10:41:29
 * @LastEditTime: 2021-01-04 11:03:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /urtc-common-demo/src/util/cookie.js
 */
function setCookie(_name, _val, expires) {
  var d = new Date();
  d.setDate(d.getDate() + expires);
  document.cookie = _name + "=" + _val + ";expires=" + d;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
       var  c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
           var c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function removeCookie(_name, _val) {
  setCookie(_name, _val, -1);
}
export { setCookie, getCookie, removeCookie };
