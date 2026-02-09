;(function($){ $.harpsAjaxManager = {
/******************************************************************************/
/** NICT STARS Ajax Manager for JQuery Function                               */
/** write:SEC    modify:Inoue Computer Service.                               */
/******************************************************************************/
/*-----* Variable *-----------------------------------------------------------*/
_ajaxBuffer : [],
/******************************************************************************/
/** nictSTARSAjaxManager.ajax                                                 */
/******************************************************************************/
ajax : function(objOptions)
{
  var req = $.ajax(objOptions);
  
  this._ajaxBuffer.push(req);
  
  return req;
},
/******************************************************************************/
/** nictSTARSAjaxManager.abort                                                */
/******************************************************************************/
abort : function()
{
  for (var i01 = 0; i01 < this._ajaxBuffer.length; i01++) this._ajaxBuffer[i01].abort();
  
  this._ajaxBuffer = [];
}
}})(jQuery);
