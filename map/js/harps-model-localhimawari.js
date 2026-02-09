$(function () {
  /**
   * HARPS Model
   * require jquery, harps-model
   */

  // 拠点毎のAMeDASのDataID有無の指定値
  const DATA_ID_ON = 1;
  const DATA_ID_OFF = 1;
  // 警報が発令されていない場合のwarn_level値
  const WARN_SAFE = 0;

  function createAmedasUrl_(pDate, dataType, selectedNumber, keyList, nameList, codeList) {
    //var base_url = "https://sc-gis.nict.go.jp/work/sec/Amedas_ViewURL/";
    var base_url = "https://jh170034-1.kudpc.kyoto-u.ac.jp/charts/Amedas/";
    var now = new Date(pDate);
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    viewURLParam = {
      //bar_left_time        : startDate,
      //bar_right_time       : endDate,
      first                : formatDate(startDate),
      last                 : formatDate(endDate),
      data                 : dataType,
      selected             : selectedNumber,
      place                : keyList.join(","),
      name                 : nameList.join(","),
      code                 : codeList.join(","),
    };
    return $.nictSTARSViewURL.createURL(base_url, viewURLParam);
  }
  function createAmedasUrl(pDate, dataType, selectedNumber, key, name, code) {
    //var base_url = "https://sc-gis.nict.go.jp/work/sec/Amedas_ViewURL/";
    var base_url = "https://jh170034-1.kudpc.kyoto-u.ac.jp/charts/Amedas/";
    var now = new Date(pDate);
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    viewURLParam = {
      //bar_left_time        : startDate,
      //bar_right_time       : endDate,
      first                : formatDate(startDate),
      last                 : formatDate(endDate),
      data                 : dataType,
      selected             : selectedNumber,
      place                : key,
      name                 : name,
      code                 : code,
    };
    return $.nictSTARSViewURL.createURL(base_url, viewURLParam);
  }

  function createAmaterassUrl(pDate, dataType, selectedNumber, key, name, code) {
    var base_url = "https://sc-gis.nict.go.jp/work/sec/Amaterass_ViewURL/place/";
    var now = new Date(pDate);
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    viewURLParam = {
      //bar_left_time        : startDate,
      //bar_right_time       : endDate,
      first                : formatDate(startDate),
      last                 : formatDate(endDate),
      data                 : dataType,
      selected             : selectedNumber,
      place                : key,
      name                 : name,
      code                 : code,
    };
    return $.nictSTARSViewURL.createURL(base_url, viewURLParam);
  }

  function createAmaterassListUrl(pDate, dataType, selectedNumber, keyList, nameList, codeList) {
    var base_url = "https://sc-gis.nict.go.jp/work/sec/Amaterass_ViewURL/place/";
    var now = new Date(pDate);
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    console.log(startDate.toLocaleString())
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    viewURLParam = {
      //bar_left_time        : startDate,
      //bar_right_time       : endDate,
      first                : formatDate(startDate),
      last                 : formatDate(endDate),
      data                 : dataType,
      selected             : selectedNumber,
      place                : keyList.join(","),
      name                 : nameList.join(","),
      code                 : codeList.join(","),
    };
    return $.nictSTARSViewURL.createURL(base_url, viewURLParam);
  }

  function formatDate(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}${month}${day}T${hours}${minutes}`;
  }

  $.harpsModelLocalHIMAWARI = {
    /**
     * アメダス
     */
    amedas: {
      markers: [],//null,
      jsons: null,
      infoWindow: null,
      updateLock: false,
      addMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amedas addMarker");      
        //if ($.harpsModelLocalHIMAWARI.amedas.jsons == null) {
          $.harpsModelLocalHIMAWARI.amedas.getJson(zoom, tileSetting);
        //} else {
        //  $.harpsModelLocalHIMAWARI.amedas.visibleMarker(zoom);
        //}
      },
      removeMarker: function (zoom, tileSetting) {
        $.harpsModelLocalHIMAWARI.amedas._removeMarker(zoom);
      },
      _removeMarker: function (zoom) {
        console.log("LocalHIMAWARI amedas _removeMarker");
        if ($.harpsModelLocalHIMAWARI.amedas.markers == null || $.harpsModelLocalHIMAWARI.amedas.markers.length == 0) {
          return;
        }
        for (var i = 0; i < $.harpsModelLocalHIMAWARI.amedas.markers.length; i++) {
          $.harpsModelLocalHIMAWARI.amedas.markers[i].remove();
        }
        //$.harpsModelLocalHIMAWARI.amedas.markers = [];
      },
      visibleMarker: function (zoom) {
        console.log("LocalHIMAWARI amedas visibleMarker");
        $.harpsModelLocalHIMAWARI.amedas._removeMarker(zoom);
        $.harpsModelLocalHIMAWARI.amedas.createMarkers(zoom);
      },
      invisibleMarker: function () {
        console.log("LocalHIMAWARI amedas invisibleMarker");
        $.harpsModelLocalHIMAWARI.amedas.remove();
      },
      updateMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amedas updateMarker");
	$.harpsModelLocalHIMAWARI.amedas.removeMarker(zoom, tileSetting);
        //$.harpsModelLocalHIMAWARI.amedas.createMarkers(zoom);
        $.harpsModelLocalHIMAWARI.amedas.getJson(zoom, tileSetting);
      },      
      jsonAjax: null,
      getJson: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amedas getJson");

        var width  = $.harpsModel.map.getContainer().offsetWidth
        var height = $.harpsModel.map.getContainer().offsetHeight

        var topLeft     = $.harpsModel.map.unproject([0,     0])
        var topRight    = $.harpsModel.map.unproject([width, 0])
        var bottomRight = $.harpsModel.map.unproject([width, height])
        var bottomLeft  = $.harpsModel.map.unproject([0,     height])

        $.harpsModelLocalHIMAWARI.amedas.jsonAjax = $.ajax({
          async: true,
          type: "GET",
          //url: tileSetting.jsonurl($.harpsModel.time.now)  + "?uid=" + new Date().getTime().toString(),
          url: tileSetting.jsonurl(topLeft, topRight, bottomRight, bottomLeft, $.harpsModel.time.now), //  + "?uid=" + new Date().getTime().toString(),
          dataType: "json",
        }).done(function (pJson) {
            console.log("success get json");
            $.harpsModelLocalHIMAWARI.amedas.jsons = pJson["collection"];
            console.log(pJson);
            $.harpsModelLocalHIMAWARI.amedas.createMarkers(zoom);
            //$.harpsModelLocalHIMAWARI.amedas.createMarkers(level);
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
        });
      },
      createMarkers: function (zoom) {
        console.log("LocalHIMAWARI amedas createMarkers");
        //console.log($.harpsModelLocalHIMAWARI.amedas.jsons["44046"]);
        //$.harpsModelLocalHIMAWARI.amedas.markers = [];
        var markerSize = $.harpsEnv.amedas.iconImg.size[Math.floor(zoom)];

        var nameList = [];
        var codeList = [];
        var keyList = [];
        $.harpsModelLocalHIMAWARI.amedas.jsons.forEach(function(station) {
          keyList.push(station.prefnumber);
          nameList.push(station.kjname);
          codeList.push(station.enname);
        });

        $.harpsModelLocalHIMAWARI.amedas.jsons.forEach(function(station) {
          $.harpsModelLocalHIMAWARI.amedas.markers.push($.harpsModelLocalHIMAWARI.amedas.createMarker(zoom, station, keyList, nameList, codeList, markerSize));
        });
      },
      createMarker: function (zoom, station, keyList, nameList, codeList, markerSize) {
        $content = $('<div class="amedas_popup" />');

/*
        if(keyList.length <= 20){
          $content.append('<div class=\"amedas_link\"> <a href=\"' + createAmedasUrl($.harpsModel.time.now.getTime(), "temp", station.prefnumber, keyList, nameList, codeList) + '\" target="_blank" rel="noopener noreferrer">' + station.kjname + '</a></div>');
        } else {
          $content.append('<div class=\"amedas_link\"> <a id="over_station_num" href=\"javascript:void(0);\">' + station.kjname + '</a></div>');
          $content.on("click", function (event) {
            console.log("amedas marker " + station.kjname + " over 20");
            alert("アメダスの観測局が20以下になるように表示範囲を調整してください。\n　表示拠点数 " + keyList.length + "");
          });
        }
*/
        $content.append('<div class=\"amedas_link\"> <a href=\"' + createAmedasUrl($.harpsModel.time.now.getTime(), "temp", station.prefnumber, station.prefnumber, station.kjname, station.enname) + '\" target="_blank" rel="noopener noreferrer">' + station.kjname + '</a></div>');

        var amedasUrl = "";
        if(keyList.length <= 20){
          amedasUrl = createAmedasUrl($.harpsModel.time.now.getTime(), "temp", station.prefnumber, keyList, nameList, codeList);
        }
        var stationNum = keyList.length;

        var el = document.createElement("div");
        el.className = "amedas_marker";
        el.style.backgroundImage = 'url(' + $.harpsEnv.amedas.iconImg.url[1] + ')';
        el.style.backgroundSize = 'cover';
        el.style.width = markerSize + "px";
        el.style.height = markerSize + "px";

        var marker = null;
        if (zoom >= 9) {
          marker = new amedasMarker(el, amedasUrl, stationNum)
                       .setLngLat(new mapboxgl.LngLat(parseFloat(station.longitude), parseFloat(station.latitude)))
                       .setPopup(new mapboxgl.Popup({closeButton : false, className : "amedas_popup", closeOnClick : false}).setDOMContent($content[0]))
		       .addTo($.harpsModel.map);
          el.markerObject = marker;
          el.markerObject._popup.addTo($.harpsModel.map);
        } else {
          marker = new mapboxgl.Marker(el)
                       .setLngLat(new mapboxgl.LngLat(parseFloat(station.longitude), parseFloat(station.latitude)))
                       .setPopup(new mapboxgl.Popup({closeButton : false, className : "amedas_popup"}).setDOMContent($content[0]))
                       .addTo($.harpsModel.map);
        }
        return marker;
      },
      // アメダス拠点 矩形選択 start
      // 矩形選択の範囲情報からアメダス拠点の情報を取得
      createSelectAmedasUrl: function (jsons) {
        console.log("LocalHIMAWARI amedas getJson");
        var tileSetting = $.harpsModel.tiles.get("amedas");
        var left        = $("#selection-box").offset().left;
        var top         = $("#selection-box").offset().top;
        var width       = $("#selection-box").width();
        var height      = $("#selection-box").height();
        var topLeft     = $.harpsModel.map.unproject([left, top]);
        var topRight    = $.harpsModel.map.unproject([left + width, top]);
        var bottomRight = $.harpsModel.map.unproject([left + width, top + height]);
        var bottomLeft  = $.harpsModel.map.unproject([left, top + height]);
        
        $.harpsModelLocalHIMAWARI.amedas.jsonAjax = null;
        $.harpsModelLocalHIMAWARI.amedas.jsons    = null;

        // json取得処理
        $.harpsModelLocalHIMAWARI.amedas.jsonAjax = $.ajax({
          async: true,
          type: "GET",
          url: tileSetting.jsonurl(topLeft, topRight, bottomRight, bottomLeft, $.harpsModel.time.now),
          dataType: "json",
        }).done(function (pJson) {
            console.log("success get json");
            $.harpsModelLocalHIMAWARI.amedas.jsons = pJson["collection"];
            console.log(pJson);

            // 選択された拠点の件数による処理の分岐
            if($.harpsModelLocalHIMAWARI.amedas.jsons.length > $.harpsEnv.amedas.maxSelect){
              alert("アメダスの観測局が" + $.harpsEnv.amedas.maxSelect + "以下になるように選択範囲を調整してください。\n　選択拠点数 " + $.harpsModelLocalHIMAWARI.amedas.jsons.length + "");
            } else if ($.harpsModelLocalHIMAWARI.amedas.jsons.length <= $.harpsEnv.amedas.maxSelect && $.harpsModelLocalHIMAWARI.amedas.jsons.length != 0){
              // URL生成処理
              var nameList = [];
              var codeList = [];
              var keyList  = [];
              $.harpsModelLocalHIMAWARI.amedas.jsons.forEach(function(station) {
                keyList .push(station.prefnumber);
                nameList.push(station.kjname);
                codeList.push(station.enname);
              });

              var url = createAmedasUrl_($.harpsModel.time.now.getTime(), "temp", keyList[0], keyList, nameList, codeList);
              // 別タブを表示
              window.open(url, '_blank');
            }
            // 矩形選択の解除
            $("#map").children("#selection-box").remove();
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
        });
      },
      // アメダス拠点 矩形選択 end
      openGraph: function(amedasUrl, stationNum){
        if(stationNum <= 20){
          window.open(amedasUrl); 
        } else {
          alert("アメダスの観測局が20以下になるように表示範囲を調整してください。\n　表示拠点数 " + stationNum + "");
        }
        
      },
      createURL: function (base) {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        var date;
        if (now.getTime() - $.harpsModel.time.now.getTime() < now.getTime() - today.getTime()) {
          date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        } else {
          date = new Date($.harpsModel.time.now.getTime());
        }
        return $.nictSTARSViewURL.createURL({
          base_url: $.harpsEnv.amedas.linePlotURL,
          show_date: Date.parse($.harpsModel.util.date2str(date, "%Y/%m/%d %H:%M:%S", "utc")),
          //"show_date"        : Date.parse($.harpsModel.util.date2str($.harpsModel.time.now, "%Y/%m/%d %H:%M:%S", "utc")),
          show_x_scale: "24h",
          show_marker_left: "999999px",
          show_list: $.harpsModelLocalHIMAWARI.amedas.createShowList(base),
        });
      },
      createShowList: function (base) {
        var missionID = $.harpsEnv.amedas.viewURL.missionID;
        var teamID = $.harpsEnv.amedas.viewURL.teamID;
        var showList = [];
        var dataID = $.harpsEnv.amedas.viewURL.dataID;
        var subComponent = $.harpsEnv.amedas.viewURL.subComponent;
        componentBase = base.prec_no + "_" + base.block_no + "_";
        if (base.D910201 && base.D910201 == DATA_ID_ON) {
          showList.push({
            mission: missionID,
            team: teamID,
            data: dataID.rainfall,
            component: componentBase + subComponent.mean,
          });
        }
        if (base.D910202 && base.D910202 == DATA_ID_ON) {
          showList.push({
            mission: missionID,
            team: teamID,
            data: dataID.temperature,
            component: componentBase + subComponent.mean,
          });
        }
        if (base.D910203 && base.D910203 == DATA_ID_ON) {
          showList.push({
            mission: missionID,
            team: teamID,
            data: dataID.windSpeed,
            component: componentBase + subComponent.mean,
          });
          showList.push({
            mission: missionID,
            team: teamID,
            data: dataID.windSpeed,
            component: componentBase + subComponent.max,
          });
        }
        if (base.D910204 && base.D910204 == DATA_ID_ON) {
          showList.push({
            mission: missionID,
            team: teamID,
            data: dataID.dayLength,
            component: componentBase + subComponent.mean,
          });
        }
        showList.push({
          mission: "TimeAxis",
          team: "TimeAxis",
          data: "TimeAxis",
        });
        return showList;
      },
    },
    amjpPoint: {
      markers: [],//null,
      jsons: null,
      infoWindow: null,
      updateLock: false,
      addMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amjpPoint addMarker");
        $.harpsModelLocalHIMAWARI.amjpPoint.getJson(zoom, tileSetting);
      },
      removeMarker: function (zoom, tileSetting) {
        $.harpsModelLocalHIMAWARI.amjpPoint._removeMarker(zoom);
      },
      _removeMarker: function (zoom) {
        console.log("LocalHIMAWARI amjpPoint _removeMarker");
        if ($.harpsModelLocalHIMAWARI.amjpPoint.markers == null || $.harpsModelLocalHIMAWARI.amjpPoint.markers.length == 0) {
          return;
        }
        for (var i = 0; i < $.harpsModelLocalHIMAWARI.amjpPoint.markers.length; i++) {
          $.harpsModelLocalHIMAWARI.amjpPoint.markers[i].remove();
        }
      },
      visibleMarker: function (zoom) {
        console.log("LocalHIMAWARI amjpPoint visibleMarker");
        $.harpsModelLocalHIMAWARI.amjpPoint._removeMarker(zoom);
        $.harpsModelLocalHIMAWARI.amjpPoint.createMarkers(zoom);
      },
      invisibleMarker: function () {
        console.log("LocalHIMAWARI amjpPoint invisibleMarker");
        $.harpsModelLocalHIMAWARI.amjpPoint.remove();
      },
      updateMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amjpPoint updateMarker");
        $.harpsModelLocalHIMAWARI.amjpPoint.removeMarker(zoom, tileSetting);
        $.harpsModelLocalHIMAWARI.amjpPoint.getJson(zoom, tileSetting);
      },
      jsonAjax: null,
      getJson: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI amjpPoint getJson");

        var width  = $.harpsModel.map.getContainer().offsetWidth
        var height = $.harpsModel.map.getContainer().offsetHeight

        var topLeft     = $.harpsModel.map.unproject([0,     0])
        var topRight    = $.harpsModel.map.unproject([width, 0])
        var bottomRight = $.harpsModel.map.unproject([width, height])
        var bottomLeft  = $.harpsModel.map.unproject([0,     height])

        $.harpsModelLocalHIMAWARI.amjpPoint.jsonAjax = $.ajax({
          async: true,
          type: "GET",
          url: tileSetting.jsonurl(topLeft, topRight, bottomRight, bottomLeft, $.harpsModel.time.now), //  + "?uid=" + new Date().getTime().toString(),
          dataType: "json",
        }).done(function (pJson) {
            console.log("success get json");
            $.harpsModelLocalHIMAWARI.amjpPoint.jsons = pJson["collection"];
            console.log(pJson);
            $.harpsModelLocalHIMAWARI.amjpPoint.createMarkers(zoom);
            //$.harpsModelLocalHIMAWARI.amjpPoint.createMarkers(level);
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
        });
      },
      createMarkers: function (zoom) {
        console.log("LocalHIMAWARI amjpPoint createMarkers");
        //console.log($.harpsModelLocalHIMAWARI.amjpPoint.jsons["44046"]);
        //$.harpsModelLocalHIMAWARI.amjpPoint.markers = [];
        var markerSize = $.harpsEnv.amjpPoint.iconImg.size[Math.floor(zoom)];

        var nameList = [];
        var codeList = [];
        var keyList = [];
        $.harpsModelLocalHIMAWARI.amjpPoint.jsons.forEach(function(station) {
          keyList.push(station.place_code);
          nameList.push(station.kjname);
          codeList.push(station.enname);
        });

        $.harpsModelLocalHIMAWARI.amjpPoint.jsons.forEach(function(station) {
          $.harpsModelLocalHIMAWARI.amjpPoint.markers.push($.harpsModelLocalHIMAWARI.amjpPoint.createMarker(zoom, station, keyList, nameList, codeList, markerSize));
        });
      },
      createMarker: function (zoom, station, keyList, nameList, codeList, markerSize) {
        $content = $('<div class="amjpPoint_popup" />');
        $content.append('<div class=\"amjpPoint_link\"> <a href=\"' + createAmaterassUrl($.harpsModel.time.now.getTime(), "sw", station.place_code, station.place_code, station.kjname, station.enname) + '\" target="_blank" rel="noopener noreferrer">' + station.kjname + '</a></div>');

        var amjpPointUrl = "";
        if(keyList.length <= 20){
          amjpPointUrl = createAmaterassUrl($.harpsModel.time.now.getTime(), "sw", station.place_code, keyList, nameList, codeList);
        }
        var stationNum = keyList.length;

        var el = document.createElement("div");
        el.className = "amjpPoint_marker";
        el.style.backgroundImage = 'url(' + $.harpsEnv.amjpPoint.iconImg.url[1] + ')';
        el.style.backgroundSize = 'cover';
        el.style.width = markerSize + "px";
        el.style.height = markerSize + "px";

        var marker = null;
        if (zoom >= 9) {
          marker = new amaterassMarker(el, amjpPointUrl, stationNum)
                       .setLngLat(new mapboxgl.LngLat(parseFloat(station.longitude), parseFloat(station.latitude)))
                       .setPopup(new mapboxgl.Popup({closeButton : false, className : "amjpPoint_popup", closeOnClick : false}).setDOMContent($content[0]))
                       .addTo($.harpsModel.map);
          el.markerObject = marker;
          el.markerObject._popup.addTo($.harpsModel.map);
        } else {
          marker = new mapboxgl.Marker(el)
                       .setLngLat(new mapboxgl.LngLat(parseFloat(station.longitude), parseFloat(station.latitude)))
                       .setPopup(new mapboxgl.Popup({closeButton : false, className : "amjpPoint_popup"}).setDOMContent($content[0]))
                       .addTo($.harpsModel.map);
        }
        return marker;
      },
      // アメダス拠点 矩形選択 start
      // 矩形選択の範囲情報からアメダス拠点の情報を取得
      createSelectAmaterassUrl: function () {
        console.log("LocalHIMAWARI amjpPoint getJson");
        var tileSetting = $.harpsModel.tiles.get("amjp_point");
        var left        = $("#selection-box").offset().left;
        var top         = $("#selection-box").offset().top;
        var width       = $("#selection-box").width();
        var height      = $("#selection-box").height();
        var topLeft     = $.harpsModel.map.unproject([left, top]);
        var topRight    = $.harpsModel.map.unproject([left + width, top]);
        var bottomRight = $.harpsModel.map.unproject([left + width, top + height]);
        var bottomLeft  = $.harpsModel.map.unproject([left, top + height]);

        $.harpsModelLocalHIMAWARI.amjpPoint.jsonAjax = null;
        $.harpsModelLocalHIMAWARI.amjpPoint.jsons    = null;

        // json取得処理
        $.harpsModelLocalHIMAWARI.amjpPoint.jsonAjax = $.ajax({
          async: true,
          type: "GET",
          url: tileSetting.jsonurl(topLeft, topRight, bottomRight, bottomLeft, $.harpsModel.time.now),
          dataType: "json",
        }).done(function (pJson) {
            console.log("success get json");
            $.harpsModelLocalHIMAWARI.amjpPoint.jsons = pJson["collection"];
            console.log(pJson);

            // 選択された拠点の件数による処理の分岐
            if($.harpsModelLocalHIMAWARI.amjpPoint.jsons.length > $.harpsEnv.amjpPoint.maxSelect){
              alert("地点が" + $.harpsEnv.amjpPoint.maxSelect + "以下になるように選択範囲を調整してください。\n　選択拠点数 " + $.harpsModelLocalHIMAWARI.amjpPoint.jsons.length + "");
            } else if ($.harpsModelLocalHIMAWARI.amjpPoint.jsons.length <= $.harpsEnv.amjpPoint.maxSelect && $.harpsModelLocalHIMAWARI.amjpPoint.jsons.length != 0){
              // URL生成処理
              var nameList = [];
              var codeList = [];
              var keyList  = [];
              $.harpsModelLocalHIMAWARI.amjpPoint.jsons.forEach(function(station) {
                keyList .push(station.place_code);
                nameList.push(station.kjname);
                codeList.push(station.enname);
              });

              var url = createAmaterassListUrl($.harpsModel.time.now.getTime(), "sw", keyList[0], keyList, nameList, codeList);
              // 別タブを表示
              window.open(url, '_blank');
            }
            // 矩形選択の解除
            $("#map").children("#selection-box").remove();
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
        });
      },
      // アメダス拠点 矩形選択 end
      openGraph: function(amjpPointUrl, stationNum){
        if(stationNum <= 10){
          window.open(amjpPointUrl);
        } else {
          alert("地点が20以下になるように表示範囲を調整してください。\n　表示拠点数 " + stationNum + "");
        }
      },
    },
    /**
     * 注意報・警報
     */
    wwarn: {
      locations: {
        wide: null,
        local: null,
      },
      warnings: null,
      warningsCurrentField: {
        list: {},
        add: function (warning) {
          var wLen = warning.warning.length;
          for (var i = 0; i < wLen; i++) {
            var wCode = warning.warning[i].code;
            if (!this.list.hasOwnProperty(wCode)) {
              this.list[wCode] = [];
            }
            this.list[wCode].push(warning);
          }
        },
        clear: function () {
          this.list = {};
        },
        show: function () {
          console.log("wwarn.warningsCurrentField.show");
          if (Object.keys(this.list).length == 0) {
            $("#wwarn_list").trigger("update_nowarn");
          } else {
            $("#wwarn_list").trigger("hide_nowarn");
          }
          var i = 0;
          $("#wwarn_list .wwarn_box").each(function () {
            var wCode = $(this).attr("wcode").substr(1, 2);
            if ($.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.list.hasOwnProperty(wCode)) {
              $("#wwarn_list").trigger("update", [wCode, $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.list[wCode], i, ]);
              i++;
            } else {
              if ($(this).hasClass("visible")) {
                $("#wwarn_list").trigger("hide", [wCode]);
              }
            }
          });
        },
      },
      markers: {
        wide: [],
        local: [],
      },
      imarkers: {
        wide: [],
        local: [],
      },
      windowTimer: null,
      infoWindow: null,
      init: function (zoom, tileSetting, func) {
        // location.jsonを取得
        var timer = null;
        timer = setInterval(
          function (zoom, tileSetting) {
            if ($.harpsModelLocalHIMAWARI.wwarn.locations.local != null && $.harpsModelLocalHIMAWARI.wwarn.locations.wide != null) {
              clearInterval(timer);
              timer = null;
              func(zoom, tileSetting);
            }
          },
          200,
          zoom,
          tileSetting
        );

        if ($.harpsModelLocalHIMAWARI.wwarn.locations.wide == null) {
          $.ajax({
            type: "GET",
            url: tileSetting.locations[0] + "?uid=" + new Date().getTime().toString(),
            dataType: "json",
          }).done(function (pJson) {
            $.harpsModelLocalHIMAWARI.wwarn.locations.wide = pJson["location"];
          }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
              clearInterval(timer);
              timer = null;
              console.log(pXMLHttpRequest);
              console.log(pTextStatus);
              console.log(pErrorThrown);
          });
        }
        if ($.harpsModelLocalHIMAWARI.wwarn.locations.local == null) {
          $.ajax({
            type: "GET",
            url: tileSetting.locations[1] + "?uid=" + new Date().getTime().toString(),
            dataType: "json",
          }).done(function (pJson) {
            $.harpsModelLocalHIMAWARI.wwarn.locations.local = pJson["location"];
          }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            clearInterval(timer);
            timer = null;
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
          });
        }

        // コメントアウト 2019.02.20 dol-add
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
        // コメントアウト 2019.02.20 dol-end
      },
      addMarker: function (zoom, tileSetting) {
        console.log("wwarn addMarker");
        if ($.harpsModelLocalHIMAWARI.wwarn.locations.local == null || $.harpsModelLocalHIMAWARI.wwarn.locations.wide == null) {
          //console.log($.harpsModel.map.getBounds());
          this.init(zoom, tileSetting, this._addMarker);
        } else {
          this._addMarker(zoom, tileSetting);
        }
      },
      updateLock: false,
      updateWarnings: function (zoom, tileSetting) {
        if ($("#wwarn").hasClass("out")) {
          $("#wwarn_list").trigger("invisible");
          $.harpsModelLocalHIMAWARI.wwarn._remove();
          return;
        }
        this.updateLock = true;
        $.ajax({
          type: "GET",
          url: tileSetting.jsonurl($.harpsModel.time.now) + "?uid=" + new Date().getTime().toString(),
          dataType: "json",
        })
          .done(function (pJson) {
            $.harpsModelLocalHIMAWARI.wwarn.warnings = pJson["area"];
            $.harpsModelLocalHIMAWARI.wwarn._remove();
            $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
            $.harpsModelLocalHIMAWARI.wwarn.updateLock = false;
          })
          .fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
            $.harpsModelLocalHIMAWARI.wwarn.updateLock = false;
            console.log(pXMLHttpRequest);
            console.log(pTextStatus);
            console.log(pErrorThrown);
          });
      },
      _addMarker: function (zoom, tileSetting) {
        //console.log("LocalHIMAWARI wwarn _addMarker url " + tileSetting.jsonurl($.harpsModel.time.now) + "?uid=" + new Date().getTime().toString());
        $.harpsModelLocalHIMAWARI.wwarn._remove();
        $("#wwarn_list").trigger("visible");
        $.ajax({
          type: "GET",
          url: tileSetting.jsonurl($.harpsModel.time.now) + "?uid=" + new Date().getTime().toString(),
          //url  : tileSetting.json + "?uid=" + (new Date()).getTime().toString(),
          dataType: "json",
        }).done(function (pJson) {
          $.harpsModelLocalHIMAWARI.wwarn.warnings = pJson["area"];
          $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
        $.harpsModel.mapStyle.provinceLine.add();
      },
      zoomMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI wwarn zoomMarker zoom = " + zoom);	      
        $.harpsModelLocalHIMAWARI.wwarn._remove();
        $.harpsModelLocalHIMAWARI.wwarn.updateMarker(zoom);
      },
      removeMarker: function (zoom, tileSetting) {
        console.log("LocalHIMAWARI wwarn removeMarker zoom = " + zoom);	      
        $.harpsModel.mapStyle.provinceLine.remove();
        $("#wwarn_list").trigger("invisible");
        $.harpsModelLocalHIMAWARI.wwarn._remove();
      },
      _remove: function () {
        // console.log($.harpsModelLocalHIMAWARI.wwarn.markers.local);
        for (var code in $.harpsModelLocalHIMAWARI.wwarn.markers.local) {
          // コメントアウト 2019.03.06 dol-add
          // $.harpsModelLocalHIMAWARI.wwarn.markers.local[code].setMap(null);
          // コメントアウト 2019.03.06 dol-end
          // 2019.03.06 dol-add
	  //
	  // マーカーの削除
	  var lnglat = $.harpsModelLocalHIMAWARI.wwarn.markers.local[code].getLngLat();
          $.harpsModelLocalHIMAWARI.wwarn.markers.local[code].remove();
          // 2019.03.06 dol-end
        }
        // console.log($.harpsModelLocalHIMAWARI.wwarn.markers.wide);
        for (var code in $.harpsModelLocalHIMAWARI.wwarn.markers.wide) {
          // コメントアウト 2019.03.06 dol-add
          // $.harpsModelLocalHIMAWARI.wwarn.markers.wide[code].setMap(null);
          // コメントアウト 2019.03.06 dol-end
          // 2019.03.06 dol-add
          $.harpsModelLocalHIMAWARI.wwarn.markers.wide[code].remove();
          // 2019.03.06 dol-end
        }
        $.harpsModelLocalHIMAWARI.wwarn.markers.wide = [];
        $.harpsModelLocalHIMAWARI.wwarn.markers.local = [];
      },
      visibleMarker: function (zoom) {
        console.log("LocalHIMAWARI wwarn visibleMarker zoom = " + zoom);	      
        $("#wwarn_list").trigger("visible");
        var markers = $.harpsModelLocalHIMAWARI.wwarn.markers.local;
        var markerSize = $.harpsEnv.wwarn.iconImg.size[parseInt(zoom)];
        for (var code in markers) {
          //var marker = markers[code];
          // コメントアウト 2019.03.06 dol-add
          // marker.icon.scaledSize.width = markerSize;
          // marker.icon.scaledSize.height = markerSize;
          // marker.setVisible(false);
          // marker.setVisible(true);
          // コメントアウト 2019.03.06 dol-end
          // 2019.03.06 dol-add
          // console.log("options: "+JSON.stringify(marker.options));
          // var icon = marker.options.icon;
          //icon.options.iconSize = [markerSize, markerSize];
          //icon.options.iconAnchor = [markerSize * 0.5, markerSize];
          //icon.options.popupAnchor = [0, -markerSize];
          //marker.setIcon(icon);
          //marker.setOpacity(0);
          //marker.setOpacity(1);
          // 2019.03.06 dol-end
	  // 20200720
	  // var level = $.harpsModelLocalHIMAWARI.wwarn.markers.level[code];
	  var inamgeUrl = $.harpsEnv.wwarn.iconImg.url[1];
	  //$(".marker").css({
          //  'background-image': 'url(' + inamgeUrl + ')',
          //  'background-size': 'cover'
          //});
	  
	}
      },
      invisibleMarker: function () {
        console.log("wwarn. invisibleMarker ");
        // 拡大表示時のみに表示するマーカーを削除
        for (var code in $.harpsModelLocalHIMAWARI.wwarn.markers.local) {
          var marker = $.harpsModelLocalHIMAWARI.wwarn.markers.local[code];
          marker.remove();
        }
      },
      updateMarker: function (zoom) {
        console.log("LocalHIMAWARI wwarn updateMarker zoom = " + zoom);
        $.harpsModelLocalHIMAWARI.wwarn.createMarker(zoom);
        $.harpsModelLocalHIMAWARI.wwarn.visibleMarker(zoom);
      },
      createMarker: function (zoom) {
        console.log("LocalHIMAWARI wwarn createMarker zoom = " + zoom);
        var markers = $.harpsModelLocalHIMAWARI.wwarn.markers.local;
        //var bounds = $.harpsModel.util.getBounds();

        var width = $.harpsModel.map.getContainer().offsetWidth;
        var height = $.harpsModel.map.getContainer().offsetHeight;

        var lngList = [];
        var latList = [];

        lngList.push($.harpsModel.map.unproject([width, height]).lng);
        lngList.push($.harpsModel.map.unproject([    0, height]).lng);
        lngList.push($.harpsModel.map.unproject([width,      0]).lng);
        lngList.push($.harpsModel.map.unproject([    0,      0]).lng);
        latList.push($.harpsModel.map.unproject([width, height]).lat);
        latList.push($.harpsModel.map.unproject([    0, height]).lat);
        latList.push($.harpsModel.map.unproject([width,      0]).lat);
        latList.push($.harpsModel.map.unproject([    0,      0]).lat);
        
        var bounds = {
          latN: Math.max(...latList),
          latS: Math.min(...latList),
          lngE: Math.max(...lngList),
          lngW: Math.min(...lngList)
        };

        var locations;

        if (zoom <= $.harpsEnv.wwarn.zoomLevelBorder) {
          locations = $.harpsModelLocalHIMAWARI.wwarn.locations.wide;
          $.harpsModelLocalHIMAWARI.wwarn.createWarningMarker.wide(markers, locations, bounds);
        } else {
          locations = $.harpsModelLocalHIMAWARI.wwarn.locations.local;
          $.harpsModelLocalHIMAWARI.wwarn.createWarningMarker.local(markers, locations, bounds);
        }
        $.harpsModelLocalHIMAWARI.wwarn.createNormalMarker(markers, locations, bounds);
      },
      createWarningMarker: {
        local: function (markers, locations, bounds) {
          var warnCodes = [];
          $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.clear();
          var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;

          for (var i = 0; i < warningLen; i++) {
            // データjsonから取得した地域コードがlocationsに含まれない場合は次の処理へ
            if (!locations.hasOwnProperty($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code)) {
              continue;
            }

	    // 都市のcode, name, worning(array)を格納
            var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
            var locate = locations[warning.code];
            if (locate.longitude == undefined || locate.latitude == undefined) {
              continue;
            }

	    // 表示領域内に都市が入っている場合、warningsCurrentFieldに都市の情報を追加
            if (locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN) {
              $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.add(warning);

              // マーカーが既に作成されている地域コードの場合はマーカーの作成をスキップ
	      if(markers[warning.code] != undefined){
                continue;
              }

              var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.local(warning, locate);
	      // 警報注意報レベル 
              var warnLevel = ret[0];
              // popup内の表示用dom
              var $content = ret[1];
	      // マーカー作成
              var marker = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(locate, warnLevel, $content);
              markers[warning.code] = marker;
            }
          }
          $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.show();
        },
        wide: function (markers, locations, bounds) {
          $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.clear();
          var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
          var locateList = [];

          for (var i = 0; i < warningLen; i++) {
            var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
            if (!($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in $.harpsModelLocalHIMAWARI.wwarn.locations.local)) {
              continue;
            }
            var localLocate = $.harpsModelLocalHIMAWARI.wwarn.locations.local[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code];
            // warningsCurrentField追加用(表示領域内の一覧表示用)
            if (localLocate.longitude >= bounds.lngW && localLocate.longitude <= bounds.lngE && localLocate.latitude >= bounds.latS && localLocate.latitude <= bounds.latN) {
              $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.add(warning);
            }
            var locateCode = localLocate.wide_code;
            if (locateCode in markers) {
              continue;
            }
            if (locateCode in locateList) {
              continue;
            }
            var locate = locations[locateCode];
            if (locate.longitude == null || locate.latitude == null) {
              continue;
            }
            if (locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN) {
              var ret = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent.wide(locateCode);
              var warnLevel = ret[0];
              var $content = ret[1];
              var marker = $.harpsModelLocalHIMAWARI.wwarn.warningMarker(locate, warnLevel, $content);
              markers[locateCode] = marker;
            }
            locateList.push(locateCode);
          }
          $.harpsModelLocalHIMAWARI.wwarn.warningsCurrentField.show();
        },
      },
      createNormalMarker: function (markers, locations, bounds) {
        for (var code in locations) {
          var locate = locations[code];
          if (code in markers) {
            // 警報マーカーを既に表示している場合は何もしない
            continue;
          }
          if (locate.longitude >= bounds.lngW && locate.longitude <= bounds.lngE && locate.latitude >= bounds.latS && locate.latitude <= bounds.latN) {
            markers[code] = $.harpsModelLocalHIMAWARI.wwarn.normalMarker(locate);
          }
        }
      },
      displayWarnings: function (zoom, tileSetting) {
        $.harpsModelLocalHIMAWARI.wwarn.initMarkerWide();
        $.harpsModelLocalHIMAWARI.wwarn.markers.wide = $.extend(true, {}, $.harpsModelLocalHIMAWARI.wwarn.imarkers.wide);
        var warningLen = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;
        locations = $.harpsModelLocalHIMAWARI.wwarn.locations.local;
        var warnsCodeWide = [];
        for (var i = 0; i < warningLen; i++) {
          if ($.harpsModelLocalHIMAWARI.wwarn.warnings[i].code in locations) {
            var localCode = $.harpsModelLocalHIMAWARI.wwarn.warnings[i].code;
            var wideCode =
              locations[$.harpsModelLocalHIMAWARI.wwarn.warnings[i].code]
                .wide_code;
            if (warnsCodeWide.indexOf(wideCode) < 0) {
              warnsCodeWide.push(wideCode);
              $.harpsModelLocalHIMAWARI.wwarn.warningMarkerWide(i, wideCode);
            }
          }
        }
        // ズームレベルに合わせて広域表示/地方表示を切り替える
        $.harpsModelLocalHIMAWARI.wwarn.visibleMarker(zoom, tileSetting);
      },
      initMarkerLocal: function () {
        if ($.harpsModelLocalHIMAWARI.wwarn.imarkers.local.length == 0) {
          $.harpsModelLocalHIMAWARI.wwarn.initMarker(
            $.harpsModelLocalHIMAWARI.wwarn.imarkers.local,
            $.harpsModelLocalHIMAWARI.wwarn.locations.local
          );
        }
      },
      initMarkerWide: function () {
        if ($.harpsModelLocalHIMAWARI.wwarn.imarkers.wide.length == 0) {
          $.harpsModelLocalHIMAWARI.wwarn.initMarker(
            $.harpsModelLocalHIMAWARI.wwarn.imarkers.wide,
            $.harpsModelLocalHIMAWARI.wwarn.locations.wide
          );
        }
      },
      initMarker: function (markers, locations) {
        for (code in locations) {
          var location = locations[code];
          markers[code] = $.harpsModelLocalHIMAWARI.wwarn.normalMarker(
            location
          );
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
      warningMarker: function (location, level, $content) {
        // 警報・注意報マーカー及びポップアップのDOMを設定
        var markerSize = $.harpsEnv.wwarn.iconImg.size["10"];

        var el = document.createElement("div");
        el.className = "marker";
	el.style.backgroundImage = 'url(' + $.harpsEnv.wwarn.iconImg.url[level] + ')';
	el.style.backgroundSize = 'cover';
        el.style.width = markerSize + "px";
        el.style.height = markerSize + "px";

        // add marker to map
        var marker = new mapboxgl.Marker(el)
            .setLngLat(new mapboxgl.LngLat(parseFloat(location.longitude), parseFloat(location.latitude)))
            .setPopup(new mapboxgl.Popup().setDOMContent($content[0]))
            .addTo($.harpsModel.map);

        return marker;
      },
      normalMarker: function (location) {
        // 発表なしマーカー及びポップアップのDOMを設定
        var markerSize = $.harpsEnv.wwarn.iconImg.size["10"];

        var $content = $('<div class="weather_warning_window" />');
        //$content.append('<div class="prec_name" />');
        //$content.children(".prec_name").text(location.name + " 警報・注意報");
        $content.append('<div class="prec_name"><div class="prec_name_str"></div></div>');
        $content.children(".prec_name").children(".prec_name_str").text(location.name);

        $content.append('<div class="weather_normal" />');
        $content.children(".weather_normal").text("警報・注意報は発表されていません。");

        var el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundImage = 'url(' + $.harpsEnv.wwarn.iconImg.url[0] + ')';
        el.style.backgroundSize = 'cover';
        el.style.width = markerSize + "px";
        el.style.height = markerSize + "px";

        // add marker to map
        var marker = new mapboxgl.Marker(el)
                  .setLngLat(new mapboxgl.LngLat(parseFloat(location.longitude), parseFloat(location.latitude)))
		  .setPopup(new mapboxgl.Popup().setDOMContent($content[0]))
                  .addTo($.harpsModel.map);

        return marker;
      },
      addMarkerEvent: function (marker, viewFunc, closeFunc) {
        if ($.harpsModel.util.isMobileWindow() || $.harpsModel.util.isMobileAgent()) {
          // コメントアウト 2019.02.20 dol-add
          // google.maps.event.addListener(marker, "mousedown", function(e){
          //   $.harpsModelLocalHIMAWARI.wwarn.windowTimer = setTimeout(function(){viewFunc(e, true)}, 500);
          // });
          // google.maps.event.addListener(marker, "mouseout", function(e){closeFunc(e)});
          // コメントアウト 2019.02.20 dol-end
        } else {
          // コメントアウト 2019.02.20 dol-add
          // // 2018.6.7 村永
          // // マウスオーバーが不評なので、PC版でもマウスダウンに変更
          //         //google.maps.event.addListener(marker, "mouseover", function(e){viewFunc(e, true)});
          //         google.maps.event.addListener(marker, "mousedown", function(e){viewFunc(e, true)});
          // // end
          //         google.maps.event.addListener(marker, "mouseout", function(e){closeFunc(e)});
          // コメントアウト 2019.02.20 dol-end
        }
      },
      getWarningContent: {
        wide: function (locationCode) {
          localCode = [];
          for (var code in $.harpsModelLocalHIMAWARI.wwarn.locations.local) {
            if (locationCode === $.harpsModelLocalHIMAWARI.wwarn.locations.local[code]["wide_code"]) {
              localCode.push(code);
            }
          }
          var warnLevel = 0;
          var warnings = [];
          var warningsCount = $.harpsModelLocalHIMAWARI.wwarn.warnings.length;

          // 都市リスト
          for (var i = 0; i < warningsCount; i++) {
            var warning = $.harpsModelLocalHIMAWARI.wwarn.warnings[i];
            if (localCode.indexOf(warning.code) < 0) {
              continue;
            }
            
     　     // 都市で発令されているの警報・注意報リスト
            var warningCount = warning.warning.length;
            for (var j = 0; j < warningCount; j++) {
              if ($.harpsEnv.wwarn.code[warning.warning[j].code] == undefined) {
                continue;
              }
              level = $.harpsEnv.wwarn.code[warning.warning[j].code]["level"];
	      // 警報・注意報リストの内、レベルの最も高い値を設定する
              if (level > warnLevel) {
                warnLevel = level;
              }
              if (warnings.indexOf(warning.warning[j].code) < 0) {
                warnings.push(warning.warning[j]);
                //code.push(warning.warning[j].code);
              }
            }
          }
          var locate = $.harpsModelLocalHIMAWARI.wwarn.locations.wide[locationCode];
          var $content = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._createContent(locate, warnings);
          return [warnLevel, $content];
        },
        local: function (warning, location) {
          var warnLevel = 0;
          var warnings = [];
          var warningCount = warning.warning.length;
          for (var j = 0; j < warningCount; j++) {
            if ($.harpsEnv.wwarn.code[warning.warning[j].code] == undefined) {
              continue;
            }
            level = $.harpsEnv.wwarn.code[warning.warning[j].code]["level"];
            if (level > warnLevel) {
              warnLevel = level;
            }
            if (warnings.indexOf(warning.warning[j].code) < 0) {
              warnings.push(warning.warning[j]);
              //code.push(warning.warning[j].code);
            }
          }
          var $content = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._createContent(location, warnings);
          return [warnLevel, $content];
        },
        _createContent: function (location, warnings) {
          var $content = $('<div class="weather_warning_window" />');
          $content.append(
            '<div class="prec_name"><div class="prec_name_str"></div><div class="sp">特別警報</div><div class="warn">警報</div><div class="adovisoly">注意報</div></div>'
          );
          $content
            .children(".prec_name")
            .children(".prec_name_str")
            .text(location.name);
          $content.append('<div class="warn_icon" />');
          for (var type in $.harpsEnv.wwarn.displayCode) {
            var $warn = $('<div class="warning_code" />');
            $warn.text($.harpsEnv.wwarn.displayCode[type]);
            $warn.addClass($.harpsEnv.wwarn.codeClass[0]);
            $warn.attr("type", type);
            $warn.attr("level", 0);
            $content.children(".warn_icon").append($warn);
          }
          $.each(warnings, function () {
            var type = $.harpsEnv.wwarn.code[this.code].type;
            var $warn = $content.find(".warn_icon div[type='" + type + "']");
            var newLevel = $.harpsEnv.wwarn.code[this.code].level;
            var oldLevel = parseInt($warn.attr("level"));
            if (newLevel > oldLevel) {
              $warn.text($.harpsEnv.wwarn.code[this.code].name);
              $warn.attr("level", newLevel);
              $warn
                .removeClass("normal")
                .addClass(
                  $.harpsEnv.wwarn.codeClass[
                    $.harpsEnv.wwarn.code[this.code].level
                  ]
                );
              var $warnStart = $('<div class="warn_detail" />');
              var formatWarn = $.harpsModelLocalHIMAWARI.wwarn.getWarningContent._format(this);
              $warnStart.text(formatWarn.start_time);
              $warn.append($warnStart);
            }
          });
          $content.on(
            {
              click: function () {
                $(this)
                  .children(".warn_detail")
                  .offset({ top: $(this).offset().top - 35 });
                $(this).parent().find(".warn_detail").removeClass("display");
                $(this).children(".warn_detail").addClass("display");
              },
              mouseenter: function () {
                $(this)
                  .children(".warn_detail")
                  .offset({
                    top: $(this).offset().top - 35,
                    left:
                      $(this).offset().left -
                      $(this).children(".warn_detail").width() / 2 +
                      20,
                  });
                $(this).parent().find(".warn_detail").removeClass("display");
                $(this).children(".warn_detail").addClass("display");
              },
              mouseleave: function () {
                $(this).children(".warn_detail").removeClass("display");
              },
            },
            ".warning_code"
          );
          return $content;
        },
        _format: function (warning) {
          format = {};
          if (warning.start_time) {
            //var start = new Date(warning.start_time.replace(/-/g, "/"));
            var start = new Date(
              warning.start_time.replace(/-/g, "/").replace("+09", "")
            );
            format["start_time"] = $.harpsModel.util.date2str(
              start,
              WWARN_START_TIME_LABEL
            );
          }
          return format;
        },
      },
      autoUpdate: function () {
        // 注意報・警報のアップデート
        if ($("#wwarn.data").hasClass("on") == true) {
          var zoom = $.harpsModel.map.getZoom();
          var tileSetting = $.harpsModel.tiles.get("wwarn");
          $.harpsModelLoalHIMAWARI.wwarn.zoomMarker(zoom, tileSetting);
        }
      },
    },
    /**
     * 発電所
     */
    /*
    elst: {
      markers: {},
      json: null,
      infoWindow: null,
      addMarker: function (zoom, tileSetting) {
        if ($.harpsModelLocalHIMAWARI.elst.json == null) {
          $.harpsModelLocalHIMAWARI.elst.getJson(type, zoom, tileSetting);
          return;
        }
        for (var type in $.harpsModelLocalHIMAWARI.elst.json) {
          $.harpsModelLocalHIMAWARI.elst.visibleMarkers(
            type,
            zoom,
            tileSetting
          );
        }
      },
      zoomMarker: function (zoom, tileSetting) {
        for (var type in $.harpsModelLocalHIMAWARI.elst.markers) {
          $.harpsModelLocalHIMAWARI.elst.visibleMarkers(
            type,
            zoom,
            tileSetting
          );
        }
      },
      removeMarker: function (zoom, tileSetting) {
        for (var type in $.harpsModelLocalHIMAWARI.elst.markers) {
          $.harpsModelLocalHIMAWARI.elst.invisibleMarkers(type);
        }
      },
      getJson: function (type, zoom, tileSetting) {
        $.harpsModelLocalHIMAWARI.elst.json = {};
        for (var type in tileSetting.json) {
          $.harpsModelLocalHIMAWARI.elst.json[type] = [];
          $.harpsModelLocalHIMAWARI.elst.markers[type] = [];
          $.ajax({
            type: "GET",
            url:
              tileSetting.json[type] +
              "?uid=" +
              new Date().getTime().toString(),
            dataType: "json",
          })
            .done(function (pJson) {
              for (var key in pJson) {
                $.harpsModelLocalHIMAWARI.elst.json[key] = pJson[key];
                $.harpsModelLocalHIMAWARI.elst.createMarkers(
                  type,
                  zoom,
                  tileSetting
                );
              }
            })
            .fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
              console.log(pXMLHttpRequest);
              console.log(pTextStatus);
              console.log(pErrorThrown);
            });
        }
      },
      visibleMarkers: function (type, zoom, tileSetting) {
        var markers = $.harpsModelLocalHIMAWARI.elst.markers[type];
        var stage = tileSetting.zoomStage[zoom.toString()];
        var markerSize = tileSetting.size[zoom.toString()];
        //var markerSize = tileSetting.size[stage];
        var url = tileSetting.icon[type][stage];
        var markerCount = markers.length;
        for (var i = 0; i < markerCount; i++) {
          var marker = markers[i];
          if (url !== marker.icon.url) {
            marker.icon.url = url;
          }
          marker.icon.scaledSize.width = markerSize;
          marker.icon.scaledSize.height = markerSize;
          marker.setVisible(false);
          marker.setVisible(true);
        }
      },
      invisibleMarkers: function (type) {
        var markers = $.harpsModelLocalHIMAWARI.elst.markers[type];
        var markerCount = markers.length;
        for (var i = 0; i < markerCount; i++) {
          var marker = markers[i];
          marker.setVisible(false);
        }
        if ($.harpsModelLocalHIMAWARI.elst.infoWindow != null) {
          $.harpsModelLocalHIMAWARI.elst.infoWindow.close();
        }
      },
      createMarkers: function (type, zoom, tileSetting) {
        var markerCount = $.harpsModelLocalHIMAWARI.elst.json[type].length;
        for (var i = 0; i < markerCount; i++) {
          var json = $.harpsModelLocalHIMAWARI.elst.json[type][i];
          $.harpsModelLocalHIMAWARI.elst.createMarker(
            type,
            json,
            zoom,
            tileSetting
          );
        }
      },
      createMarker: function (type, json, zoom, tileSetting) {
        var stage = tileSetting.zoomStage[zoom.toString()];
        var markerSize = tileSetting.size[zoom.toString()];
        var url = tileSetting.icon[type][stage];
        var popup = L.popup().setContent(json.P03_0002);
        marker.bindPopup(popup);
      },
    },
    */
    sortTimer: null,
  };

  class amedasMarker extends mapboxgl.Marker{

    constructor(element, url, num) {
      super(element);
      this.url = url;
      this.num = num;
    }

    _onMapClick(e) {
      const targetElement = e.originalEvent.target;
      const element = this._element;
      if (targetElement === element || element.contains((targetElement))) {
        $.harpsModelLocalHIMAWARI.amedas.openGraph(this.url, this.num);
        //$.harpsEnv.syncMarkerInfo.code = element.id;
        //$.harpsEnv.syncMarkerInfo.lng = this._lngLat.lng;
        //$.harpsEnv.syncMarkerInfo.lat = this._lngLat.lat;
      }
    }
  }

  class amaterassMarker extends mapboxgl.Marker{
    constructor(element, url, num) {
      super(element);
      this.url = url;
      this.num = num;
    }

    _onMapClick(e) {
      const targetElement = e.originalEvent.target;
      const element = this._element;
      if (targetElement === element || element.contains((targetElement))) {
        $.harpsModelLocalHIMAWARI.amjpPoint.openGraph(this.url, this.num);
      }
    }
  }
});
