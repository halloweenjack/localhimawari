;(function($){ 
/**
 * ポップアップメッセージ表示クラス
 * @require jquery
 * $.popupMsg.init({msg : "[メッセージ]", obj_id : "[対象オブジェクトのid]"});
 */

var defaultOpt = {
  // 表示するメッセージ
  msg : null,
  // マウスオーバー対象のid
  obj_id : null,
  // メッセージのスタイル
  styles : null,
  // obj_idからの相対位置
  position : {top : 0, left : 175}
}
var msgs = [];
$.popupMsg = {
  init : function(initOpt){
    var opt = $.extend({}, defaultOpt, initOpt, true);
    if(opt.msg == null || opt.obj_id == null){
      console.warn("failed to init popupMsg");
      return;
    }
    $msg = $("<div id=\"popupmsg__" + opt.obj_id + "\" class=\"popupmsg__\"> />");
    $msg.text(opt.msg);
    if(opt.styles != null){
      for(var style in opt.styles){
        $msg.css(style, opt.styles[style]);
      }
    }
    $msg.attr("msg-top", opt.position.top);
    $msg.attr("msg-left", opt.position.left);
    $("#" + opt.obj_id).on({
      "mouseover" : function(e){
        var target = "#popupmsg__" + $(this).attr("id")
        $(target).css("display", "block");
        var opos = $(this).offset();
        var pos = {
          top  : opos.top  - parseInt($(target).attr("msg-top")),
          left : opos.left - parseInt($(target).attr("msg-left")),
        }
        $(target).css("top", pos.top);
        $(target).css("left", pos.left);
        setTimeout(function(){
          $(target).addClass("popupmsg__visible");
        }, 100);
      },
      "mouseout" : function(){
        var target = "#popupmsg__" + $(this).attr("id")
        $(target).removeClass("popupmsg__visible");
        setTimeout(function(){
          $(target).css("display", "none");
        }, 500);
      }
    });
    $("body").append($msg);
    msgs.push($msg);
  },
};
})(jQuery);
