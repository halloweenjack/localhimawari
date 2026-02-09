;(function($){ 
/**
 * リアルタイムひまわり遷移ライブラリ
 * @require jquery
 */

var _scales = [
  { width:600, height:480, size:0.5, count:1 },
  { width:600, height:480, size:0.7, count:1 },
  { width:600, height:480, size:1.0, count:1 },
  { width:600, height:480, size:1.4, count:1 },
  { width:600, height:480, size:1.0, count:2 },
  { width:600, height:480, size:1.4, count:2 },
  { width:600, height:480, size:1.0, count:4 },
  { width:600, height:480, size:1.2, count:5 },
  { width:600, height:480, size:2.0, count:5 },
  { width:600, height:480, size:2.8, count:5 },
  { width:600, height:480, size:4.0, count:5 }
];

var _local2realtimeScale = {
"5" : "3",
"6" : "5",
"7" : "6",
"8" : "8",
"9" : "10",
"10" : "10",
"11" : "10",
"12" : "10 ",
"13" : "10",
"14" : "10",
}

const REALTIME_URL = "http://himawari8.nict.go.jp"
const SI = "D531107"

var _calcGpsPosition = function(pLat, pLon, showScale, pOutRange){
  var objReturn = { left:-1, top:-1 };
  var objScale  = _scales[showScale];
  var intX      = (pLon + 180) % 360 - 180;
  var intY      = (pLat +  90) % 180 -  90;
  var intWidth  = objScale.width  * objScale.size * objScale.count;
  var intHeight = objScale.height * objScale.size * objScale.count;

  if (pOutRange || (119 <= intX && intX <= 152 && 21.5 <= intY && intY <= 48.5))
  {
    objReturn.left = intWidth  * (intX - 119.0) / (152.0 - 119.0);
    objReturn.top  = intHeight * (1 - (intY - 21.5) / (48.5 - 21.5));
  }

  return objReturn;
}

var _gpsposi2viewurlposi = function(posi, scale){
  var imgWidth = scale.width * scale.size;
  var imgHeight = scale.height * scale.size;
  var sL = posi.left % imgWidth;
  var sT = posi.top % imgHeight;
  var sNx = (posi.left - sL) / imgWidth;
  var sNy = (posi.top - sT) / imgHeight;
  return {
    sL : -1 * sL,
    sT : -1 * sT,
    sNx : sNx,
    sNy : sNy,
  }
}

$.local2realtime = {
  getUrl : function(time, pLat, pLon, zoom){
    var showScale = parseInt(_local2realtimeScale[zoom.toString()]);
    var posi = _calcGpsPosition(pLat, pLon, showScale);
    var scale = _scales[showScale];
    var posiViewurl = _gpsposi2viewurlposi(posi, scale);
    var opt = {
      sI : SI,
      sS : showScale,
      sNx : posiViewurl.sNx,
      sNy : posiViewurl.sNy,
      sL : posiViewurl.sL,
      sT : posiViewurl.sT,
      sD : time.getTime(),
    };
    var viewUrl = "";
    for(var key in opt){
      viewUrl += key + "=" + opt[key] + "&";
    }
    viewUrl = viewUrl.substr(0, viewUrl.length - 1);
    return REALTIME_URL + "?" + viewUrl;
  },
};
})(jQuery);
