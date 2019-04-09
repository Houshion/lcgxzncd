



  /**
   * 获取url参数
   */
  const getUrlParam = function(name, explode, url)
{
  var param = window.location.search.substr(1);
  if (url) {
    if (explode) {
      param = url.substr(url.indexOf(explode) + 1);
    } else {
      param = url.substr(url.indexOf('?') + 1);
    }
  } else {
    if (explode) {
      param = window.location.href.substr(window.location.href.indexOf(explode) + 1);
    }
  }
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = param.match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}


export default getUrlParam;
