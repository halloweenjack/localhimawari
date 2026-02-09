$(function(){
/**
 * HARPS View for local HIMAWARI
 * @require jquery, harps-view, harps-model
 */
var _initSubMenu = function(){
  $("#submenu_area .realtime_button").on({
    "click" : function(){
      var zoom = $.harpsModel.map.getZoom();
      var latlng = $.harpsModel.map.getCenter();
      // コメントアウト 2019.03.20 dol-add
      // var lat = latlng.lat();
      // var lng = latlng.lng();
      // コメントアウト 2019.03.20 dol-end
      // 2019.03.20 dol-add
      var lat = latlng.lat;
      var lng = latlng.lng;
      // 2019.03.20 dol-end
      var time = $.harpsModel.time.now;
      var url = $.local2realtime.getUrl(time, lat, lng, zoom);
      window.location.href = url;
    }
  });
}

var _initPopupMsg = function(){
  $.popupMsg.init({msg : GPS_POP, obj_id : "gps_button"});
  $.popupMsg.init({msg : INIT_POP, obj_id : "center_button"});
  $.popupMsg.init({msg : PLAYBACK_POP, obj_id : "playback_button"});
  $.popupMsg.init({msg : CALENDAR_POP, obj_id : "date_now", position : {top : 15, left : 175}});
  $.popupMsg.init({msg : UPDATE_POP, obj_id : "reload_button", position : {top : 10, left : 170}});
}

$.harpsViewLocalHIMAWARI = {
  init : function(){
    $.harpsViewLocalHIMAWARI.wwarn.init(); 
    $.harpsViewLocalHIMAWARI.amedas.init(); 
    $.harpsViewLocalHIMAWARI.amjpPoint.init(); 
    $.harpsViewLocalHIMAWARI.elst.init(); 
    _initSubMenu();
    if(!$.harpsModel.util.isMobileWindow()){
      _initPopupMsg();
    }
  },
  // 注意報・警報
  wwarn : {
    init : function(){
      this._initBoundsChange();
      this._initReload();
      this._initWwarnList();
    },
    _initBoundsChange : function(){
      // 領域変更時に表示内容を更新する
      var zoom_old = $.harpsModel.map.getZoom();
      var boundsTimer = null;
      var _wwarnUpdate = function(zoom_old, zoom_new){
        if(zoom_new != zoom_old){
          $.harpsModelLocalHIMAWARI.wwarn._remove();
        }
        var tileSetting = $.harpsModel.tiles.get("wwarn");
        $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom_new, tileSetting); 
      }
      // コメントアウト 2019.02.20 dol-add
      // google.maps.event.addListener($.harpsModel.map, "bounds_changed", function(){
      //   var zoom_new = $.harpsModel.map.getZoom();
      //   if($("#wwarn.data").hasClass("on") == true && $("#wwarn.data").hasClass("out") == false){
      //     if(boundsTimer != null){
      //       clearTimeout(boundsTimer);
      //       boundsTimer = null;
      //     }
      //     boundsTimer = setTimeout(function(zoom_old, zoom_new){
      //      _wwarnUpdate(zoom_old, zoom_new);
      //     }, 100, zoom_old, zoom_new);
      //   }
      //   zoom_old = zoom_new;
      // });
      // コメントアウト 2019.02.20 dol-end
      // 2019.02.21 dol-add
      $.harpsModel.map.on("moveend", function(){
        var zoom_new = $.harpsModel.map.getZoom();
        if($("#wwarn.data").hasClass("on") == true && $("#wwarn.data").hasClass("out") == false){
          if(boundsTimer != null){
            clearTimeout(boundsTimer);
            boundsTimer = null;
          }
          boundsTimer = setTimeout(function(zoom_old, zoom_new){
           _wwarnUpdate(zoom_old, zoom_new);
          }, 100, zoom_old, zoom_new);
        }
        zoom_old = zoom_new;
      });
      // 2019.02.21 dol-end
    },
    _initReload : function(){
      $("header .date .reload_button").on({
        "click" : function(){
    if(!$(this).hasClass("latest") && !$(this).hasClass("auto_update")){
      // 最新時刻の表示
      console.log("click");
      if($.harpsModel.time.now < $.harpsModel.time.end){
        if($("#wwarn.data").hasClass("on") == true && $("#wwarn.data").hasClass("out") == false){
          // 注意報・警報のアップデート
          var zoom = $.harpsModel.map.getZoom();
          var tileSetting = $.harpsModel.tiles.get("wwarn");
          console.log("zoom: "+zoom);
          console.log("tileSetting: "+tileSetting);
          $.harpsModelLocalHIMAWARI.wwarn.addMarker(zoom, tileSetting); 
        }
      }
    }
        },
      });
    },
    _initWwarnList : function(){
      // 注意報・警報の一覧表示の初期化
      var _hide_all = function(quick){
        var isQuick = quick || false;
        $("#wwarn_list .no_wwarn_box").animate({opacity:0}, 200, "easeInOutBack");
        $("#wwarn_list .wwarn_box").animate({opacity:0, top : 0}, 200, "easeInOutBack");
        if(isQuick == true){
          $("#wwarn_list .wwarn_box").removeClass("visible");
              } else {
          setTimeout(function(){
            $("#wwarn_list .no_wwarn_box").removeClass("visible");
            $("#wwarn_list .wwarn_box").removeClass("visible");
          }, 300);
        }
      }
      // 注意報・警報一覧のスクロールバーが表示されている場合はpointer-events:auto
      // にし、表示されていない場合はpointer-events:noneにする
      var _chkScroll = function(){
        setTimeout(function(){
          if($("#wwarn_list").prop("scrollHeight") > $("#wwarn_list").prop("clientHeight")){
              $("#wwarn_list").addClass("scroll");
          } else {
              $("#wwarn_list").removeClass("scroll");
          }
        }, 600);
      }
      $("#wwarn_list").on({
        "visible" : function(){
          $(this).addClass("visible");
        },
        "invisible" : function(){
          _hide_all();
          $(this).removeClass("visible");
        },
        "update" : function(e, wCode, warnings, index){
          var offset
          if($.harpsModel.util.isMobileWindow()){
            offset = 20 * parseInt(index);
          } else {
            offset = 30 * parseInt(index);
          }
          offset += "px";
          $(this).find("[wcode=w" + wCode + "]").addClass("visible");
          $(this).find("[wcode=w" + wCode + "]").animate({opacity:1, top : offset}, 500, "easeInOutBack");
          if($(this).prop("scrollHeight") > $(this).prop("clientHeight")){
            $(this).addClass("scroll");
          }
          _chkScroll();
        },
        "update_nowarn" : function(){
          _hide_all(true);
          $(this).addClass("wide");
          $(this).children(".no_wwarn_box").addClass("visible");
          $(this).children(".no_wwarn_box").animate({opacity:1}, 500, "easeInOutBack");
          _chkScroll();
        },
        "hide" : function(e, wCode){
          $(this).find("[wcode=w" + wCode + "]").animate({opacity:0}, 500, "easeInOutBack");
          setTimeout(function(){
              $("#wwarn_list").find("[wcode=w" + wCode + "]").removeClass("visible");
          }, 600);
          _chkScroll();
        },
        "hide_nowarn" : function(e, wCode){
          $("#wwarn_list .no_wwarn_box").animate({opacity:0}, 500, "easeInOutBack");
          $(this).removeClass("wide");
          setTimeout(function(){
              $("#wwarn_list .no_wwarn_box").removeClass("visible");
          }, 600);
          _chkScroll();
        },
        "hide_all" : function(){
          _hide_all(true);
          _chkScroll();
        }
      });
    }
  },
  // アメダス
  amedas : {
    init : function(){
      // コメントアウト 2019.02.20 dol-add
      // google.maps.event.addListener($.harpsModel.map, "zoom_changed", function(){
      //   var zoom = $.harpsModel.map.getZoom();
      //   if($("#amedas.data").hasClass("on") == true){
      //     var tileSetting = $.harpsModel.tiles.get("amedas");
      //     $.harpsModelLocalHIMAWARI.amedas.addMarker(zoom, tileSetting); 
      //   }
      // });
      // コメントアウト 2019.02.20 dol-end
      // 2019.02.21 dol-add
      $.harpsModel.map.on("moveend", function(){
        var zoom = $.harpsModel.map.getZoom();
        if($("#amedas.data").hasClass("on") == true){
          var tileSetting = $.harpsModel.tiles.get("amedas");
          $.harpsModelLocalHIMAWARI.amedas.updateMarker(zoom, tileSetting);
        }
      });

      $.harpsModel.map.on("zoomend", function(){
        var zoom = $.harpsModel.map.getZoom();
        if($("#amedas.data").hasClass("on") == true){
          var tileSetting = $.harpsModel.tiles.get("amedas");
          $.harpsModelLocalHIMAWARI.amedas.updateMarker(zoom, tileSetting); 
        }
      });
      // 2019.02.21 dol-end
    }
  },
  amjpPoint : {
    init : function(){
      $.harpsModel.map.on("moveend", function(){
        var zoom = $.harpsModel.map.getZoom();
        if($("#amjp_point.data").hasClass("on") == true){
		console.log("amjp_point.data");
          var tileSetting = $.harpsModel.tiles.get("amjp_point");
          $.harpsModelLocalHIMAWARI.amjpPoint.updateMarker(zoom, tileSetting);
        }
      });

      $.harpsModel.map.on("zoomend", function(){
        var zoom = $.harpsModel.map.getZoom();
        if($("#amjp_point.data").hasClass("on") == true){
          var tileSetting = $.harpsModel.tiles.get("amjp_point");
          $.harpsModelLocalHIMAWARI.amjpPoint.updateMarker(zoom, tileSetting);
        }
      });
      // 2019.02.21 dol-end
    }
  },
  elst : {
    init : function(){
      // コメントアウト 2019.02.20 dol-add
      // google.maps.event.addListener($.harpsModel.map, "zoom_changed", function(){
      //   var zoom = $.harpsModel.map.getZoom();
      //   if($("#elst.data").hasClass("on") == true){
      //     var tileSetting = $.harpsModel.tiles.get("elst");
      //     $.harpsModelLocalHIMAWARI.elst.zoomMarker(zoom, tileSetting); 
      //   }
      // });
      // コメントアウト 2019.02.20 dol-end
      // 2019.02.21 dol-add
      $.harpsModel.map.on("zoomend", function(){
        var zoom = $.harpsModel.map.getZoom();
        if($("#elst.data").hasClass("on") == true){
          var tileSetting = $.harpsModel.tiles.get("elst");
          $.harpsModelLocalHIMAWARI.elst.zoomMarker(zoom, tileSetting); 
        }
      });
      // 2019.02.21 dol-end
    }
  },
};
// 初期化処理
//$(window).on("load", function(){//)}
//$(function(){
//  $.harpsViewLocalHIMAWARI.init();
//});
});
