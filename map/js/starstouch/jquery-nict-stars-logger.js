;(function($){ $.nictSTARSLogger = {
TRACE       : "TRACE",
DEBUG       : "DEBUG",
INFO        : "INFO",
WARN        : "WARN",
ERROR       : "ERROR",
FATAL       : "FATAL",
LOG_LEVEL   : { TRACE : 0, DEBUG : 1, INFO : 2, WARN : 3, ERROR : 4, FATAL : 5 },
VERSION     : "1.0",
UID         : (new Date()).getTime(),
_log_buffer : [],
/******************************************************************************/
/** nictSTARSLogger.setup                                                     */
/******************************************************************************/
setup : function()
{
  if (!!$Env.showLogServer && (typeof $Env.logUrl != "undefined"))
  {
    var funcLogServer = function()
    {
      if ($.nictSTARSLogger._log_buffer.length > 0)
      {
        var log     = $.nictSTARSLogger._log_buffer.pop();
        var strMessage = log[0];
        var strDate    = log[1];
        var level      = log[2];
        var param      = log[3];

        if (typeof param == "undefined") param = {};

        var strPage = ($Env.pageName == "image") ? $Env.showImage : $Env.pageName;
        var objData = $.extend(true, { app_name : $Env.logAppName, app_version : $Env.appVersion, log_vertsion : $.nictSTARSLogger.VERSION, info_id : $Env.logOperation, datetime_cli : strDate, datetime_offset : String(-(new Date()).getTimezoneOffset()), message : strMessage, level : level, url : window.location.href, uid : $.nictSTARSLogger.UID }, param);
        $.ajax({
          async       : false,
          type        : "post",
          url         : $Env.logUrl,
          data        : objData,
          dataType    : "json",
          success     : function(pJson) { /* console.log(pJson); */ },
          error       : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
        });
      }

      setTimeout(funcLogServer, 200);
    };

    setTimeout(funcLogServer, 200);
  }
},
/******************************************************************************/
/** nictSTARSLogger.log                                                       */
/******************************************************************************/
log : function(level, msg, param)
{
  if ($.nictSTARSLogger.LOG_LEVEL[level] >= $.nictSTARSLogger.LOG_LEVEL[$Env.logLevel])
  {
    var strDate    = $.nictSTARSLogger.formatDate(new Date(), "%y/%mm/%ddT%H:%M:%S.%000");
    var strMessage = strDate + " - [" + level + "] : " + msg;
    if (!!$Env.showLogConsole) { console.log(strMessage); }

    if (!!$Env.showLogServer && (typeof $Env.logUrl != "undefined"))
    {
      if (typeof param == "undefined") param = {};
      $.nictSTARSLogger._log_buffer.push([strMessage, strDate, level, param]);
    }
  }
},
/******************************************************************************/
/** nictSTARSLogger.trace                                                     */
/******************************************************************************/
trace : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.TRACE, msg, param);
},
/******************************************************************************/
/** nictSTARSLogger.debug                                                     */
/******************************************************************************/
debug : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.DEBUG, msg, param);
},
/******************************************************************************/
/** nictSTARSLogger.info                                                      */
/******************************************************************************/
info : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.INFO, msg, param);
},
/******************************************************************************/
/** nictSTARSLogger.warn                                                      */
/******************************************************************************/
warn : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.WARN, msg, param);
},
/******************************************************************************/
/** nictSTARSLogger.error                                                     */
/******************************************************************************/
error : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.ERROR, msg, param);
},
/******************************************************************************/
/** nictSTARSLogger.fatal                                                     */
/******************************************************************************/
fatal : function(msg, param)
{
  $.nictSTARSLogger.log($.nictSTARSLogger.FATAL, msg, param);
},
/******************************************************************************/
/** nictSTARSImageViewer.formatDate                                           */
/******************************************************************************/
formatDate : function(pDate, pFormatString, pTimeZone)
{
  var objDate   = new Date(pDate.getTime());
  var strResult = pFormatString;

  if (typeof pTimeZone == "string") objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", pTimeZone.replace("+", "-")));

  strResult = strResult.replace(/%y/g  ,          objDate.getFullYear()     .toString()  );
  strResult = strResult.replace(/%mm/g , ("0"  + (objDate.getMonth() + 1)  ).slice   (-2));
  strResult = strResult.replace(/%m/g  ,         (objDate.getMonth() + 1)   .toString()  );
  strResult = strResult.replace(/%dd/g , ("0"  + (objDate.getDate()     )  ).slice   (-2));
  strResult = strResult.replace(/%d/g  ,          objDate.getDate()         .toString()  );
  strResult = strResult.replace(/%H/g  , ("0"  +  objDate.getHours()       ).slice   (-2));
  strResult = strResult.replace(/%M/g  , ("0"  +  objDate.getMinutes()     ).slice   (-2));
  strResult = strResult.replace(/%S/g  , ("0"  +  objDate.getSeconds()     ).slice   (-2));
  strResult = strResult.replace(/%000/g, ("00" +  objDate.getMilliseconds()).slice   (-3));

  return strResult;
}
};})(jQuery);
