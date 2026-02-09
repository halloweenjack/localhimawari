$(function(){
/**
 * HARPS Help View
 * @require jquery
 */

/**
 * メニューボタンの初期化
 */
var _initMenuBtn = function(){
  $("#menu_area").on({
    "open_quick" : function(){
      $("header .title .menu_button").toggleClass("open");
      $(this).toggleClass("open", true);
    },
    "open" : function(){
      $(this).animate({ left: "0px"}, "swing");
      $("header .title .menu_button").toggleClass("open", true);
      $(this).toggleClass("open", true);
    },
    "close" : function(){
      $(this).animate({ left: "-=" + $(this).width() + "px"}, 200, "swing", function(){
        $("header .title .menu_button").toggleClass("open", false);
        $(this).toggleClass("open", false);
      });
    }
  });
  $("header .title .menu_button").on("click", function(){
    $("#menu_area").trigger("open") 
  });
  $("#menu_area .title .close_button").on("click", function(){
    $("#menu_area").trigger("close") 
  });
//  $("#menu_area").trigger("open_quick");
}

$.harpsView = {
  init : function(){
    _initMenuBtn();
  },
};

// 初期化処理
$(window).on("load", function(){
  $.harpsView.init();
});
});
