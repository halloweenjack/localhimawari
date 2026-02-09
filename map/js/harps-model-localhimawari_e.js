$(function(){
/**
 * HARPS Model
 * require jquery, harps-model
 */

// 拠点毎のAMeDASのDataID有無の指定値
const DATA_ID_ON  = 1;
const DATA_ID_OFF = 1;
// 警報が発令されていない場合のwarn_level値
const WARN_SAFE = 0;

$.harpsModelLocalHIMAWARI = {
  /**
   * アメダス
   */
  amedas : {
    markers : null,
    jsons : null,
    infoWindow : null,
    addMarker : function(zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.amedas.invisibleMarker();
      if($.harpsModelLocalHIMAWARI.amedas.jsons == null){
        $.harpsModelLocalHIMAWARI.amedas.getJson(zoom, tileSetting);
      } else {
        $.harpsModelLocalHIMAWARI.amedas.visibleMarker(zoom);
      }
    },
    removeMarker : function(zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.amedas.invisibleMarker();
    },
    visibleMarker : function(zoom){
      if($.harpsModelLocalHIMAWARI.amedas.markers[0].getVisible() == false){
        var markerSize = $.harpsEnv.amedas.iconImg.size[zoom] ;
        for(var i=0; i<$.harpsModelLocalHIMAWARI.amedas.markers.length; i++){
          $.harpsModelLocalHIMAWARI.amedas.markers[i].icon.size.width = markerSize;
          $.harpsModelLocalHIMAWARI.amedas.markers[i].icon.size.height = markerSize;
          $.harpsModelLocalHIMAWARI.amedas.markers[i].setVisible(true);
        }
      }
    },
    invisibleMarker : function(){
      if($.harpsModelLocalHIMAWARI.amedas.markers == null){
        return;
      }
      if($.harpsModelLocalHIMAWARI.amedas.markers[0].getVisible() == true){
        for(var i=0; i<$.harpsModelLocalHIMAWARI.amedas.markers.length; i++){
          $.harpsModelLocalHIMAWARI.amedas.markers[i].setVisible(false); 
        }
      }
    },
    jsonAjax : null,
    getJson : function(zoom, tileSetting){
      if($.harpsModelLocalHIMAWARI.amedas.jsonAjax != null){
        return;
      }
      $.harpsModelLocalHIMAWARI.amedas.jsonAjax = $.ajax({
        async : true,
        type  : "GET",
        url   : tileSetting.json + "?uid=" + (new Date()).getTime().toString(),
        dataType : "json"
      }).done(function(pJson){
        $.harpsModelLocalHIMAWARI.amedas.jsons = pJson;
        $.harpsModelLocalHIMAWARI.amedas.createMarkers(zoom);
        //$.harpsModelLocalHIMAWARI.amedas.createMarkers(level);
      }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
        console.log(pXMLHttpRequest);
        console.log(pTextStatus);
        console.log(pErrorThrown);
      });
    },
    createMarkers : function(zoom){
      $.harpsModelLocalHIMAWARI.amedas.markers = []
      var markerSize = $.harpsEnv.amedas.iconImg.size[zoom] ;
      for(var i=0; i<$.harpsModelLocalHIMAWARI.amedas.jsons.length; i++){
        $.harpsModelLocalHIMAWARI.amedas.markers[i] = $.harpsModelLocalHIMAWARI.amedas.createMarker($.harpsModelLocalHIMAWARI.amedas.jsons[i], markerSize);
      }
    },
    createMarker : function(base, markerSize){
      // コメントアウト 2019.03.22 dol-add
      // var marker = new google.maps.Marker({
      //   map : $.harpsModel.map,
      //   position : new google.maps.LatLng(
      //     parseFloat(base.latitude), 
      //     parseFloat(base.longitude)
      //   ),
      //   title : base.prefectures + " - " + base.place,
      //   icon : {
      //     url : $.harpsEnv.amedas.iconImg.url[base.status],
      //     scaledSize : new google.maps.Size(markerSize, markerSize)
      //   },
      //   cursor : "default"
      // });
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var icon = L.icon({
          iconUrl: $.harpsEnv.amedas.iconImg.url[base.status],
          iconRetinaUrl: $.harpsEnv.amedas.iconImg.url[base.status],
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize*0.5, markerSize],
          popupAnchor: [0, -markerSize],
      });
      var marker = L.marker([parseFloat(base.latitude), parseFloat(base.longitude)], {icon: icon}).bindTooltip(base.prefectures + " - " + base.place).addTo($.harpsModel.map);
      // 2019.03.22 dol-end
      
      if(base.status != 0){
        // コメントアウト 2019.03.22 dol-add
        // marker.setOptions({cursor:"pointer"});
        // google.maps.event.addListener(marker, "click", function(event){
        //   var dheight = $(window).height() * 0.9;
        //   if(dheight > $.harpsEnv.amedas.dialogHeightMax){
        //     dheight = $.harpsEnv.amedas.dialogHeightMax
        //   }
        //   var url = $.harpsModelLocalHIMAWARI.amedas.createURL(base);
        //   $("#amedas_dialog iframe").attr("src", url);
        //   $("#amedas_dialog").dialog({
        //     title : AMEDAS_TITLE.replace("%s", base.place),
        //     //width : "400px",
        //     width : "90%",
        //     height : dheight,
        //     dialogClass : "amedas_dialog",
        //     //modal : true,
        //     closeText : "",
        //     open : function(){
        //       $(".ui-dialog-titlebar-close").blur();
        //     }
        //   });
        // });
        // コメントアウト 2019.03.22 dol-end
        // 2019.03.22 dol-add
        marker.on( 'click', function(event){
          var dheight = $(window).height() * 0.9;
          if(dheight > $.harpsEnv.amedas.dialogHeightMax){
            dheight = $.harpsEnv.amedas.dialogHeightMax
          }
          var url = $.harpsModelLocalHIMAWARI.amedas.createURL(base);
          $("#amedas_dialog iframe").attr("src", url);
          $("#amedas_dialog").dialog({
            title : AMEDAS_TITLE.replace("%s", base.place),
            //width : "400px",
            width : "90%",
            height : dheight,
            dialogClass : "amedas_dialog",
            //modal : true,
            closeText : "",
            open : function(){
              $(".ui-dialog-titlebar-close").blur();
            }
          });
        });
        // 2019.03.22 dol-end
      }
      return marker;
    },
    createURL : function(base){
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      var date;
      if(now.getTime() - $.harpsModel.time.now.getTime() < now.getTime() - today.getTime()){
        date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      } else {
        date = new Date($.harpsModel.time.now.getTime());
      }
      return $.nictSTARSViewURL.createURL({
        "base_url"         : $.harpsEnv.amedas.linePlotURL,
        "show_date"        : Date.parse($.harpsModel.util.date2str(date, "%Y/%m/%d %H:%M:%S", "utc")),
        //"show_date"        : Date.parse($.harpsModel.util.date2str($.harpsModel.time.now, "%Y/%m/%d %H:%M:%S", "utc")),
        "show_x_scale"     : "24h",
        "show_marker_left" : "999999px",
        "show_list"        : $.harpsModelLocalHIMAWARI.amedas.createShowList(base),
      })
    },
    createShowList : function(base){
      var missionID = $.harpsEnv.amedas.viewURL.missionID;
      var teamID = $.harpsEnv.amedas.viewURL.teamID;
      var showList = [];
      var dataID = $.harpsEnv.amedas.viewURL.dataID;
      var subComponent = $.harpsEnv.amedas.viewURL.subComponent;
      componentBase = base.prec_no + "_" + base.block_no + "_";
      if(base.D910201 && base.D910201 == DATA_ID_ON){
        showList.push({
          "mission" : missionID,
          "team"    : teamID,
          "data"    : dataID.rainfall,
          "component" : componentBase + subComponent.mean
        });
      }
      if(base.D910202 && base.D910202 == DATA_ID_ON){
        showList.push({
          "mission" : missionID,
          "team"    : teamID,
          "data"    : dataID.temperature,
          "component" : componentBase + subComponent.mean
        });
      }
      if(base.D910203 && base.D910203 == DATA_ID_ON){
        showList.push({
          "mission" : missionID,
          "team"    : teamID,
          "data"    : dataID.windSpeed,
          "component" : componentBase + subComponent.mean
        });
        showList.push({
          "mission" : missionID,
          "team"    : teamID,
          "data"    : dataID.windSpeed,
          "component" : componentBase + subComponent.max
        });
      }
      if(base.D910204 && base.D910204 == DATA_ID_ON){
        showList.push({
          "mission" : missionID,
          "team"    : teamID,
          "data"    : dataID.dayLength,
          "component" : componentBase + subComponent.mean
        });
      }
      showList.push(
        {"mission":"TimeAxis","team":"TimeAxis","data":"TimeAxis"}
      );
      return showList
    }
  },
  /**
   * 注意報・警報
   */
  wwarn : {
    locations : {
      wide : null,
      local : null,
    },
    warnings : null,
    warningsCurrentField : {
      list : {},
      add : function(warning){
        var wLen = warning.warning.length;
        for(var i=0; i<wLen; i++){
          var wCode = warning.warning[i].code;
          if(!this.list.hasOwnProperty(wCode)){
            this.list[wCode] = [];
          }
          this.list[wCode].push(warning);
        }
      },
      clear : function(){
        this.list = {};
      },
      show : function(){
        if(Object.keys(this.list).length == 0){
          $("#wwarn_list").trigger("update_nowarn");
        } else {
          $("#wwarn_list").trigger("hide_nowarn");
        }
        var i = 0;
        $("#wwarn_list .wwarn_box").each(function(){
          var wCode = $(this).attr("wcode").substr(1,2); 
          if($.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.list.hasOwnProperty(wCode)){
            $("#wwarn_list").trigger("update", [wCode, $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.list[wCode], i]);
            i++;
          } else {
            if($(this).hasClass("visible")){
              $("#wwarn_list").trigger("hide", [wCode]);
            }
          }
        });
      }
    },
    markers : {
      wide  : [],
      local : [],
    },
    imarkers : {
      wide  : [],
      local : [],
    },
    windowTimer : null,
    infoWindow : null,
    init : function(zoom, tileSetting, func){
      // location.jsonを取得
      var timer = null;
      timer = setInterval(function(zoom, tileSetting){
        if($.harpsModelLocalHIMAWARI.wwarn.locations.local != null &&
          $.harpsModelLocalHIMAWARI.wwarn.locations.wide != null){
          clearInterval(timer);
          timer = null;
          func(zoom, tileSetting);
        }
      }, 200, zoom, tileSetting);

      if($.harpsModelLocalHIMAWARI.wwarn.locations.wide == null){
        $.ajax({
          type  : "GET",
          url   : tileSetting.locations[0] + "?uid=" + (new Date()).getTime().toString(),
          dataType : "json"
        }).done(function(pJson){
          $.harpsModelLocalHIMAWARI.wwarn.locations.wide = pJson["location"];
        }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
          clearInterval(timer);
          timer = null;
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
      }
      if($.harpsModelLocalHIMAWARI.wwarn.locations.local == null){
        $.ajax({
          type  : "GET",
          url   : tileSetting.locations[1] + "?uid=" + (new Date()).getTime().toString(),
          dataType : "json"
        }).done(function(pJson){
          $.harpsModelLocalHIMAWARI.wwarn.locations.local = pJson["location"];
        }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
          clearInterval(timer);
          timer = null;
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
      }

      // コメントアウト 2019.03.22 dol-add
      // 背景をクリックした場合にinfoWindowを閉じる処理を追加
      // google.maps.event.addListener($.harpsModel.map, "click", function(){
      //   if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != null){
      //     $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      //   }
      // });

      // 地図のドラッグ時にマーカーの詳細情報が表示されないようにする
      // google.maps.event.addListener($.harpsModel.map, "dragstart", function(e){
      //   if($.harpsModelLocalHIMAWARI.wwarn.windowTimer != null){
      //     clearTimeout($.harpsModelLocalHIMAWARI.wwarn.windowTimer);
      //     $.harpsModelLocalHIMAWARI.wwarn.windowTimer = null;
      //   }
      // }); 
      // コメントアウト 2019.03.22 dol-end
    },
    addMarker : function(zoom, tileSetting){
      if($.harpsModelLocalHIMAWARI.wwarn.locations.local == null ||
        $.harpsModelLocalHIMAWARI.wwarn.locations.wide == null){
        this.init(zoom, tileSetting, this._addMarker);
      } else {
        this._addMarker(zoom, tileSetting);
      }
    },
    updateLock : false,
    updateWarnings : function(zoom, tileSetting){
      if($("#wwarn").hasClass("out")){
        $("#wwarn_list").trigger("invisible");
        $.harpsModelLocalHIMAWARI.wwarn._remove();
        return;
      }
      this.updateLock = true;
      $.ajax({
        type : "GET",
        url  : tileSetting.jsonurl($.harpsModel.time.now) + "?uid=" + (new Date()).getTime().toString(),
        dataType : "json"
      }).done(function(pJson){
        $.harpsModelLocalHIMAWARI.wwarn.warnings = pJson["area"];
        $.harpsModelLocalHIMAWARI.wwarn._remove();
        $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
        $.harpsModelLocalHIMAWARI.wwarn.updateLock = false;
      }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
        $.harpsModelLocalHIMAWARI.wwarn.updateLock = false;
        console.log(pXMLHttpRequest);
        console.log(pTextStatus);
        console.log(pErrorThrown);
      });
    },
    _addMarker : function(zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.wwarn._remove();
      $("#wwarn_list").trigger("visible");
      $.ajax({
        type : "GET",
        url  : tileSetting.jsonurl($.harpsModel.time.now) + "?uid=" + (new Date()).getTime().toString(),
        //url  : tileSetting.json + "?uid=" + (new Date()).getTime().toString(),
        dataType : "json"
      }).done(function(pJson){
        $.harpsModelLocalHIMAWARI.wwarn.warnings = pJson["area"];
        $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
      }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
        console.log(pXMLHttpRequest);
        console.log(pTextStatus);
        console.log(pErrorThrown);
      });
      $.harpsModel.mapStyle.provinceLine.add();
    },
    zoomMarker : function(zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.wwarn._remove();
      $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
    },
    removeMarker : function(zoom, tileSetting){
      $.harpsModel.mapStyle.provinceLine.remove();
      $("#wwarn_list").trigger("invisible");
      $.harpsModelLocalHIMAWARI.wwarn._remove();
    },
    _remove : function(){
      for(var code in $.harpsModelLocalHIMAWARI.wwarn.markers.local){
        // コメントアウト 2019.03.22 dol-add
        // $.harpsModelLocalHIMAWARI.wwarn.markers.local[code].setMap(null);
        // コメントアウト 2019.03.06 dol-end
        // 2019.03.22 dol-add
        var marker = $.harpsModelLocalHIMAWARI.wwarn.markers.local[code];
        $.harpsModel.map.removeLayer(marker);
        // 2019.03.22 dol-end
      }
      for(var code in $.harpsModelLocalHIMAWARI.wwarn.markers.wide){
        // コメントアウト 2019.03.22 dol-add
        // $.harpsModelLocalHIMAWARI.wwarn.markers.wide[code].setMap(null);
        // コメントアウト 2019.03.06 dol-end
        // 2019.03.22 dol-add
        var marker = $.harpsModelLocalHIMAWARI.wwarn.markers.wide[code];
        $.harpsModel.map.removeLayer(marker);
        // 2019.03.22 dol-end
      }
      $.harpsModelLocalHIMAWARI.wwarn.markers.wide = [];
      $.harpsModelLocalHIMAWARI.wwarn.markers.local = [];
    },
    visibleMarker : function(zoom){
      $("#wwarn_list").trigger("visible");
      var markers = $.harpsModelLocalHIMAWARI.wwarn.markers.local;
      var markerSize = $.harpsEnv.wwarn.iconImg.size[zoom];
      for(var code in markers){
        var marker = markers[code];
        // コメントアウト 2019.03.22 dol-add
        // marker.icon.scaledSize.width = markerSize;
        // marker.icon.scaledSize.height = markerSize;
        // marker.setVisible(false);
        // marker.setVisible(true);
        // コメントアウト 2019.03.22 dol-end
        // 2019.03.22 dol-add
        // console.log("options: "+JSON.stringify(marker.options));
        var icon = marker.options.icon;
        icon.options.iconSize = [markerSize, markerSize];
        icon.options.iconAnchor = [markerSize*0.5, markerSize];
        icon.options.popupAnchor = [0, -markerSize];
        marker.setIcon(icon);
        marker.setOpacity(0);
        marker.setOpacity(1);
        // 2019.03.22 dol-end
      }
    },
    invisibleMarker : function(){
      for(var code in $.harpsModelLocalHIMAWARI.wwarn.markers.local){
        // コメントアウト 2019.03.22 dol-add
        // $.harpsModelLocalHIMAWARI.wwarn.markers.local[code].setVisible(false);
        // コメントアウト 2019.03.22 dol-end
        // 2019.03.22 dol-add
        var marker = $.harpsModelLocalHIMAWARI.wwarn.markers.local[code];
        marker.setOpacity(0);
        // 2019.03.22 dol-end
      }
    },
    updateMarker : function(zoom){
      $.harpsModelLocalHIMAWARI.wwarn.createMarker(zoom);
      $.harpsModelLocalHIMAWARI.wwarn.visibleMarker(zoom);
    },
    createMarker : function(zoom){
      var markers = $.harpsModelLocalHIMAWARI.wwarn.markers.local;
      var bounds = $.harpsModel.util.getBounds();
      var locations
      if(zoom <= $.harpsEnv.wwarn.zoomLevelBorder){
        locations = $.harpsModelLocalHIMAWARI.wwarn.locations.wide;
        $.harpsModelLocalHIMAWARI.wwarn.createWarningMarker.wide(markers, locations, bounds);
      } else {
        locations = $.harpsModelLocalHIMAWARI.wwarn.locations.local;
        $.harpsModelLocalHIMAWARI.wwarn.createWarningMarker.local(markers, locations, bounds);
      }
      $.harpsModelLocalHIMAWARI.wwarn.createNormalMarker(markers, locations, bounds);
    },
    createWarningMarker : {
      local : function(markers, locations, bounds){
        var warnCodes = [];
        $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.clear();
        var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
        for(var i=0; i<warningLen; i++){
          if(!locations.hasOwnProperty($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code)){
            // データjsonから取得した地域コードがlocationsに含まれない場合は次の処理へ
            continue;
          }
          var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
          var locate = locations[warning.code]
          if(locate.longitude == undefined || locate.latitude == undefined){
            continue;
          }
          if(locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE
             && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN){
            $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.add(warning);
            // コメントアウト 2019.03.22 dol-add
            // if($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in markers &&
            //    markers[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code].getVisible() == true){
            //   // マーカーが既に作成されている地域コードかつvisibleがtrueの場合は次の処理へ
            //   continue;
            // }
            // コメントアウト 2019.03.22 dol-end
            // 2019.03.22 dol-add
            var m = markers[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code];
            if($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in markers &&
               m.options['opacity'] == 1){
              // マーカーが既に作成されている地域コードかつvisibleがtrueの場合は次の処理へ
              continue;
            }
            // 2019.03.22 dol-end
            var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.local(warning, locate);
            var warnLevel = ret[0];
            var $content = ret[1];
            var marker = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(locate, warnLevel, $content);
            markers[warning.code] = marker;
          }
        }
        $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.show();
      },
      wide : function(markers, locations, bounds){
        $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.clear();
        var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
        var locateList = []
        for(var i=0; i<warningLen; i++){
          var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
          if(!($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in  $.harpsModelLocalHIMAWARI.wwarn.locations.local)){
            continue;
          }
          var localLocate = $.harpsModelLocalHIMAWARI.wwarn.locations.local[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code]; 
          // warningsCurrentField追加用(表示領域内の一覧表示用)
          if(localLocate.longitude >= bounds.lngW && localLocate.longitude <= bounds.lngE
             && localLocate.latitude >= bounds.latS && localLocate.latitude <= bounds.latN){
            $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.add(warning);
          }
          var locateCode = localLocate.wide_code 
          if(locateCode in markers){
            continue;
          }
          if(locateCode in locateList){
            continue;
          }
          var locate = locations[locateCode]
          if(locate.longitude == null || locate.latitude == null){
            continue;
          }
          if(locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE
             && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN){
            var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.wide(locateCode);
            var warnLevel = ret[0];
            var $content = ret[1];
            var marker = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(locate, warnLevel, $content);
            markers[locateCode] = marker;
          }
          locateList.push(locateCode);
        }
        $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.show();
      }
    },
    createNormalMarker : function(markers, locations, bounds){
      for(var code in locations){
        var locate = locations[code];
        if(code in markers){
          // 警報マーカーを既に表示している場合は何もしない
          continue;
        }
        if(locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE
           && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN){
          markers[code] = $.harpsModelLocalHIMAWARI.wwarn.normalMarker(locate);
        }
      }
    },
    displayWarnings : function(zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.wwarn.initMarkerWide();
      $.harpsModelLocalHIMAWARI.wwarn.markers.wide = $.extend(true, {}, $.harpsModelLocalHIMAWARI.wwarn.imarkers.wide)
      var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
      locations = $.harpsModelLocalHIMAWARI.wwarn.locations.local;
      var warnsCodeWide = [];
      for(var i=0; i<warningLen; i++){
        if($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in locations){
          var localCode = $.harpsModelLocalHIMAWARI.wwarn.warnings[i].code;
          var wideCode = locations[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code].wide_code;
          if(warnsCodeWide.indexOf(wideCode) < 0 ){
            warnsCodeWide.push(wideCode)
            $.harpsModelLocalHIMAWARI.wwarn.warningMarkerWide(i, wideCode);
          }
        }
      } 
      // ズームレベルに合わせて広域表示/地方表示を切り替える
      $.harpsModelLocalHIMAWARI.wwarn.visibleMarker(zoom, tileSetting);
    },
    initMarkerLocal : function(){
      if($.harpsModelLocalHIMAWARI.wwarn.imarkers.local.length == 0){
        $.harpsModelLocalHIMAWARI.wwarn.initMarker($.harpsModelLocalHIMAWARI.wwarn.imarkers.local, $.harpsModelLocalHIMAWARI.wwarn.locations.local);
      }
    },
    initMarkerWide : function(){
      if($.harpsModelLocalHIMAWARI.wwarn.imarkers.wide.length == 0){
        $.harpsModelLocalHIMAWARI.wwarn.initMarker($.harpsModelLocalHIMAWARI.wwarn.imarkers.wide, $.harpsModelLocalHIMAWARI.wwarn.locations.wide);
      }
    },
    initMarker : function(markers, locations){
      for(code in locations){
        var location = locations[code];
        markers[code] = $.harpsModelLocalHIMAWARI.wwarn.normalMarker(location);
      }
    },
    /*
    warningMarkerLocal : function(windex, locationCode){
      var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[windex];
      var location = $.harpsModelLocalHIMAWARI.wwarn.locations.local[locationCode];
      var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.local(warning, location);
      var warnLevel = ret[0];
      var $content = ret[1];
      console.log($.harpsModelLocalHIMAWARI.wwarn.markers.local[locationCode].icon);
      $.harpsModelLocalHIMAWARI.wwarn.markers.local[locationCode] = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(location, warnLevel, $content);
    },
    warningMarkerWide : function(windex, locationCode){
      var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[windex];
      var location = $.harpsModelLocalHIMAWARI.wwarn.locations.wide[locationCode];
      var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.wide(locationCode);
      var warnLevel = ret[0];
      var $content = ret[1];
      $.harpsModelLocalHIMAWARI.wwarn.markers.wide[locationCode] = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(location, warnLevel, $content);
    },
    */
    warningMarker : function(location, level, $content){
      var markerSize = $.harpsEnv.wwarn.iconImg.size["10"];
      // コメントアウト 2019.03.22 dol-add
      // var marker = new google.maps.Marker({
      //   map : $.harpsModel.map,
      //   position : new google.maps.LatLng(
      //     parseFloat(location.latitude), 
      //     parseFloat(location.longitude)
      //   ),
      //   icon : {
      //     url : $.harpsEnv.wwarn.iconImg.url[level],
      //     scaledSize : new google.maps.Size(markerSize, markerSize)
      //   },
      //   visible : false
      // });
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var icon = L.icon({
          iconUrl: $.harpsEnv.wwarn.iconImg.url[level],
          iconRetinaUrl: $.harpsEnv.wwarn.iconImg.url[level],
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize*0.5, markerSize],
          popupAnchor: [0, -markerSize],
      });
      var marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)], {icon: icon}).addTo($.harpsModel.map);
      // 2019.03.22 dol-end

      // マーカをクリック,マウスオーバーすると詳細を表示
      // コメントアウト 2019.03.22 dol-add
      // if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != null){
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      // }
      // var _viewInfo = function(event, clickFlg){
      //   if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != null){
      //     $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      //   }
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow = new google.maps.InfoWindow({
      //     content : $content[0]
      //   });
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.open(marker.getMap(), marker);
      //   onClick = clickFlg | false;
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.onClick = onClick
      // }
      // var _closeInfo = function(event){
      //   if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != undefined && $.harpsModelLocalHIMAWARI.wwarn.infoWindow.onClick == false){
      //     $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      //   }
      // }
      // this.addMarkerEvent(marker, _viewInfo, _closeInfo);
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var popup = L.popup().setContent($content[0]);
      marker.bindPopup(popup);
      // 2019.03.22 dol-end
      return marker;
    },
    normalMarker : function(location){
      var markerSize = $.harpsEnv.wwarn.iconImg.size["10"];
      // コメントアウト 2019.03.22 dol-add
      // var marker = new google.maps.Marker({
      //   map : $.harpsModel.map,
      //   position : new google.maps.LatLng(
      //     parseFloat(location.latitude), 
      //     parseFloat(location.longitude)
      //   ),
      //   icon : {
      //     url : $.harpsEnv.wwarn.iconImg.url[0],
      //     scaledSize : new google.maps.Size(markerSize, markerSize)
      //   },
      //   visible : false
      // });
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var icon = L.icon({
          iconUrl: $.harpsEnv.wwarn.iconImg.url[0],
          iconRetinaUrl: $.harpsEnv.wwarn.iconImg.url[0],
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize*0.5, markerSize],
          popupAnchor: [0, -markerSize],
      });
      var marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)], {icon: icon}).addTo($.harpsModel.map);
      // 2019.03.22 dol-end

      var $content = $("<div class=\"weather_warning_window\" />");
      $content.append("<div class=\"prec_name\" />");
      $content.children(".prec_name").text(location.name+"");
      $content.append("<div class=\"weather_normal\" />");
      $content.children(".weather_normal").text("No alarm and warning.");

      // コメントアウト 2019.03.22 dol-add
      // マーカをクリック,マウスオーバーすると詳細を表示
      // if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != null){
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      // }
      // var _viewInfo = function(event, clickFlg){
      //   if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != null){
      //     $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      //   }
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow = new google.maps.InfoWindow({
      //     content : $content[0],
      //   });
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.open(marker.getMap(), marker);
      //   onClick = clickFlg | false;
      //   $.harpsModelLocalHIMAWARI.wwarn.infoWindow.onClick = onClick
      // }
      // var _closeInfo = function(event){
      //   if($.harpsModelLocalHIMAWARI.wwarn.infoWindow != undefined && $.harpsModelLocalHIMAWARI.wwarn.infoWindow.onClick == false){
      //     $.harpsModelLocalHIMAWARI.wwarn.infoWindow.close();
      //   }
      // }
      // this.addMarkerEvent(marker, _viewInfo, _closeInfo);
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var popup = L.popup().setContent($content[0]);
      marker.bindPopup(popup);
      // 2019.03.22 dol-end
      return marker;
    },
    addMarkerEvent : function(marker, viewFunc, closeFunc){
      if($.harpsModel.util.isMobileWindow() || $.harpsModel.util.isMobileAgent()){
        // コメントアウト 2019.03.22 dol-add
        // google.maps.event.addListener(marker, "mousedown", function(e){
        //   $.harpsModelLocalHIMAWARI.wwarn.windowTimer = setTimeout(function(){viewFunc(e, true)}, 500);
        // }); 
        // google.maps.event.addListener(marker, "mouseout", function(e){closeFunc(e)}); 
        // コメントアウト 2019.03.22 dol-end
      } else {
        // コメントアウト 2019.03.22 dol-add
// // 2018.6.7 村永
// // マウスオーバーが不評なので、PC版でもマウスダウンに変更
//         //google.maps.event.addListener(marker, "mouseover", function(e){viewFunc(e, true)}); 
//         google.maps.event.addListener(marker, "mousedown", function(e){viewFunc(e, true)}); 
// // end
//         google.maps.event.addListener(marker, "mouseout", function(e){closeFunc(e)}); 
        // コメントアウト 2019.03.22 dol-end
      }
    },
    getWarningContent : {
      wide : function(locationCode){
        localCode = []
        for(var code in $.harpsModelLocalHIMAWARI.wwarn.locations.local){
          if(locationCode === $.harpsModelLocalHIMAWARI.wwarn.locations.local[code]["wide_code"]){
            localCode.push(code);
          }
        }
        var warnLevel = 0;
        var warnings = [];
        var warningsCount = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
        for(var i=0; i<warningsCount; i++){
          var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
          if(localCode.indexOf(warning.code) < 0){
            continue;
          }
          var warningCount = warning.warning.length;
          for(var j=0; j<warningCount; j++){
            if($.harpsEnv.wwarn.code[warning.warning[j].code] == undefined){
              continue
            }
            level = $.harpsEnv.wwarn.code[warning.warning[j].code]["level"];
            if(level > warnLevel){
              warnLevel = level;
            }
            if(warnings.indexOf(warning.warning[j].code) < 0){
              warnings.push(warning.warning[j]);
              //code.push(warning.warning[j].code);
            }
          }
        }
        var locate = $.harpsModelLocalHIMAWARI.wwarn.locations.wide[locationCode];
        var $content = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._createContent(locate, warnings);
        return [warnLevel, $content];
      },
      local : function(warning, location){
        var warnLevel = 0;
        var warnings = [];
        var warningCount = warning.warning.length;
        for(var j=0; j<warningCount; j++){
          if($.harpsEnv.wwarn.code[warning.warning[j].code] == undefined){
            continue
          }
          level = $.harpsEnv.wwarn.code[warning.warning[j].code]["level"];
          if(level > warnLevel){
            warnLevel = level;
          }
          if(warnings.indexOf(warning.warning[j].code) < 0){
            warnings.push(warning.warning[j]);
            //code.push(warning.warning[j].code);
          }
        }
        var $content = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._createContent(location, warnings);
        return [warnLevel, $content];
      },
      _createContent : function(location, warnings){
        var $content = $("<div class=\"weather_warning_window\" />");
        $content.append("<div class=\"prec_name\"><div class=\"prec_name_str\"></div><div class=\"sp\">SP-Alarm</div><div class=\"warn\">Alarm</div><div class=\"adovisoly\">Warning</div></div>");
        $content.children(".prec_name").children(".prec_name_str").text(location.name);
        $content.append("<div class=\"warn_icon\" />");
        for(var type in $.harpsEnv.wwarn.displayCode){
          var $warn = $("<div class=\"warning_code\" />");
          $warn.text($.harpsEnv.wwarn.displayCode[type]);
          $warn.addClass($.harpsEnv.wwarn.codeClass[0]);
          $warn.attr("type", type);
          $warn.attr("level", 0);
          $content.children(".warn_icon").append($warn);
        };
        $.each(warnings, function(){
          var type = $.harpsEnv.wwarn.code[this.code].type;
          var $warn = $content.find(".warn_icon div[type='"+type+"']");
          var newLevel = $.harpsEnv.wwarn.code[this.code].level
          var oldLevel = parseInt($warn.attr("level"));
          if(newLevel > oldLevel){
            $warn.text($.harpsEnv.wwarn.code[this.code].name);
            $warn.attr("level", newLevel);
            $warn.removeClass("normal").addClass($.harpsEnv.wwarn.codeClass[$.harpsEnv.wwarn.code[this.code].level]);
            var $warnStart = $("<div class=\"warn_detail\" />");
            var formatWarn = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._format(this);
            $warnStart.text(formatWarn.start_time);
            $warn.append($warnStart);
          }
        });
        $content.on({
          "click" : function(){
            $(this).children(".warn_detail").offset({top : $(this).offset().top - 35});
            $(this).parent().find(".warn_detail").removeClass("display");
            $(this).children(".warn_detail").addClass("display");
          },
          "mouseenter" : function(){
            $(this).children(".warn_detail").offset({top : $(this).offset().top - 35, left : $(this).offset().left - $(this).children(".warn_detail").width() / 2 + 20});
            $(this).parent().find(".warn_detail").removeClass("display");
            $(this).children(".warn_detail").addClass("display");
          },
          "mouseleave" : function(){
            $(this).children(".warn_detail").removeClass("display");
          },
        }, ".warning_code");
        return $content;
      },
      _format : function(warning){
        format = {};
        if(warning.start_time){
          //var start = new Date(warning.start_time.replace(/-/g, "/"));
          var start = new Date(warning.start_time.replace(/-/g, "/").replace("+09", ""));
          format["start_time"] = $.harpsModel.util.date2str(start, WWARN_START_TIME_LABEL);
        }
        return format;
      }
    },
    autoUpdate : function(){
      // 注意報・警報のアップデート
      if($("#wwarn.data").hasClass("on") == true){
        var zoom = $.harpsModel.map.getZoom();
        var tileSetting = $.harpsModel.tiles.get("wwarn");
        $.harpsModelLoalHIMAWARI.wwarn.zoomMarker(zoom, tileSetting); 
      }
    }
  },
  /**
   * 発電所
   */
  elst : {
    markers : {},
    json : null,
    infoWindow : null,
    addMarker : function(zoom, tileSetting){
      if($.harpsModelLocalHIMAWARI.elst.json == null){
        $.harpsModelLocalHIMAWARI.elst.getJson(type, zoom, tileSetting);
        return;
      }
      for(var type in $.harpsModelLocalHIMAWARI.elst.json){
        $.harpsModelLocalHIMAWARI.elst.visibleMarkers(type, zoom, tileSetting);
      }
    },
    zoomMarker : function(zoom, tileSetting){
      for(var type in $.harpsModelLocalHIMAWARI.elst.markers){
        $.harpsModelLocalHIMAWARI.elst.visibleMarkers(type, zoom, tileSetting);
      }
    },
    removeMarker : function(zoom, tileSetting){
      for(var type in $.harpsModelLocalHIMAWARI.elst.markers){
        $.harpsModelLocalHIMAWARI.elst.invisibleMarkers(type);
      }
    },
    getJson : function(type, zoom, tileSetting){
      $.harpsModelLocalHIMAWARI.elst.json = {};
      for(var type in tileSetting.json){
        $.harpsModelLocalHIMAWARI.elst.json[type] = [];
        $.harpsModelLocalHIMAWARI.elst.markers[type] = [];
        $.ajax({
          type  : "GET",
          url   : tileSetting.json[type] + "?uid=" + (new Date()).getTime().toString(),
          dataType : "json"
        }).done(function(pJson){
          for(var key in pJson){
            $.harpsModelLocalHIMAWARI.elst.json[key] = pJson[key];
            $.harpsModelLocalHIMAWARI.elst.createMarkers(type, zoom, tileSetting);
          }
        }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
      }
    },
    visibleMarkers : function(type, zoom, tileSetting){
      var markers = $.harpsModelLocalHIMAWARI.elst.markers[type];
      var stage = tileSetting.zoomStage[zoom.toString()];
      var markerSize = tileSetting.size[zoom.toString()];
      //var markerSize = tileSetting.size[stage];
      var url = tileSetting.icon[type][stage];
      var markerCount = markers.length
      for(var i=0; i<markerCount; i++){
        var marker = markers[i];
        if(url !== marker.icon.url){
          marker.icon.url = url;
        }
        marker.icon.scaledSize.width = markerSize;
        marker.icon.scaledSize.height = markerSize;
        marker.setVisible(false);
        marker.setVisible(true);
      }
    },
    invisibleMarkers : function(type){
      var markers = $.harpsModelLocalHIMAWARI.elst.markers[type];
      var markerCount = markers.length
      for(var i=0; i<markerCount; i++){
        var marker = markers[i];
        marker.setVisible(false);
      }
      if($.harpsModelLocalHIMAWARI.elst.infoWindow != null){
        $.harpsModelLocalHIMAWARI.elst.infoWindow.close();
      }
    },
    createMarkers : function(type, zoom, tileSetting){
      var markerCount = $.harpsModelLocalHIMAWARI.elst.json[type].length;
      for(var i=0; i<markerCount; i++){
        var json = $.harpsModelLocalHIMAWARI.elst.json[type][i];
        $.harpsModelLocalHIMAWARI.elst.createMarker(type, json, zoom, tileSetting);
      }
    },
    createMarker : function(type, json, zoom, tileSetting){
      var stage = tileSetting.zoomStage[zoom.toString()];
      //var markerSize = tileSetting.size[stage];
      var markerSize = tileSetting.size[zoom.toString()];
      var url = tileSetting.icon[type][stage];
      // コメントアウト 2019.03.22 dol-add
      // var marker = new google.maps.Marker({
      //   map : $.harpsModel.map,
      //   position : new google.maps.LatLng(
      //     parseFloat(json.y),
      //     parseFloat(json.x)
      //   ),
      //   title : json.P03_0002,
      //   icon : {
      //     url : url,
      //     scaledSize : new google.maps.Size(markerSize, markerSize)
      //   },
      // });
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var icon = L.icon({
          iconUrl: url,
          iconRetinaUrl: url,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize*0.5, markerSize],
          popupAnchor: [0, -markerSize],
      });
      var marker = L.marker([parseFloat(json.y), parseFloat(json.x)], {icon: icon}).bindTooltip(json.P03_0002).addTo($.harpsModel.map);
      // 2019.03.22 dol-end

      // マーカをクリックすると詳細を表示
      // コメントアウト 2019.03.22 dol-add
      // if($.harpsModelLocalHIMAWARI.elst.infoWindow != null){
      //   $.harpsModelLocalHIMAWARI.elst.infoWindow.close();
      // }
      // google.maps.event.addListener(marker, "click", function(event){
      //   if($.harpsModelLocalHIMAWARI.elst.infoWindow != null){
      //     $.harpsModelLocalHIMAWARI.elst.infoWindow.close();
      //   }
      //   $.harpsModelLocalHIMAWARI.elst.infoWindow = new google.maps.InfoWindow({
      //     content : json.P03_0002
      //   });
      //   $.harpsModelLocalHIMAWARI.elst.infoWindow.open(marker.getMap(), marker);
      // });
      // $.harpsModelLocalHIMAWARI.elst.markers[type].push(marker);
      // コメントアウト 2019.03.22 dol-end
      // 2019.03.22 dol-add
      var popup = L.popup().setContent(json.P03_0002);
      marker.bindPopup(popup);
      // 2019.03.22 dol-end
    },
  },
  sortTimer : null
}
});
