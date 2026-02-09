$(function () {
  /**
   * HARPS Model
   */

  // タイル画像のサイズ[px]
  TILE_SIZE = 256;

  // ズーム率とタイル数の定義
  ZOOM_TILE = {
    "0": 1,
    "1": 2,
    "2": 4,
    "3": 8,
    "4": 16,
    "5": 32,
    "6": 64,
    "7": 128,
    "8": 256,
    "9": 512,
    "10": 1024,
    "11": 2048,
    "12": 4096,
    "13": 8192,
    "14": 16384,
    "15": 32768,
    "16": 65536,
    "17": 131072,
  };

  // AutoRunのdirection値の定義
  const TIME_FORWARD = 1;
  const TIME_BACKWARD = -1;

  // AutoRunのloop値の定義
  const LOOP_ON = true;
  const LOOP_OFF = false;

  // 自動再生設定のステータス(ViewURL用)
  const AR_PANNEL_OFF = false;
  const AR_PANNEL_ON = 1;
  const AR_RUNNING = 2;

  // ViewURLのデータ選択情報の区切り文字
  const SI_DELIMITER = "-";
  // ViewURLのデータ選択情報の選択ON/OFF
  const SI_ON = 1;
  const SI_OFF = 0;

  // ローカルストレージ
  var _storage = localStorage;
  // ローカルストレージに保存するキー文字列
  const STORAGE_KEY = "localHIMAWARI";
  // ローカルストレージに保存するためのJSON
  var _storageJson = {};

  // データを非表示期間
  var _disable = {};
  var _disableTiles = [];

  $.harpsModel = {
    /**
     * GoogleMap Object
     */
    map: null,
    // 2019.02.26 dol-add
    baseMapGroup: null,
    overlayGroup: null,
    overlayTiles: [],
    // 2019.02.26 dol-end

    // MIERUNE : レイヤーを独自に管理する
    overlayMapTypes : [],

    mapOpt: {},
    /**
     * 現在地緯度経度のgoogle.maps.Markerオブジェクト
     */
    currentPos: null,
    status: {
      date: "",
      data: {},
      posi: {
        lon: "",
        lat: "",
        z: "",
      },
    },
    /**
     * Map styleの設定
     */
    mapStyle: {
      provinceLine: {
        on: false,
        style: {
          featureType: "administrative.province",
          elementType: "geometry.stroke",
          stylers: [
            { hue: "#0000FF" },
            { visibility: "on" },
            { saturation: 100 },
            { weight: 4 },
          ],
        },
        add: function () {
          this.on = true;
          var mapStyles = $.extend(true, [], $.harpsModel.mapOpt.styles);
          mapStyles.push($.harpsModel.mapStyle.provinceLine.style);
          // MIERUNE : TODO $.harpsModel.map.setOptions({styles : mapStyles});
        },
        remove: function () {
          this.on = false;
          var mapStyles = $.extend(true, [], $.harpsModel.mapOpt.styles);
          // MIERUNE : TODO $.harpsModel.map.setOptions({styles : mapStyles});
        },
      },
      currentStyle: 0,
      chgStyle: function () {
        if (this.currentStyle >= $.harpsEnv.mapStyle.length - 1) {
          this.currentStyle = 0;
        } else {
          this.currentStyle++;
        }
        var mapStyles = $.extend(true, [], $.harpsEnv.mapStyle[this.currentStyle]);
        if (this.provinceLine.on == true) {
          mapStyles.push(this.provinceLine.style);
        }
        $.extend(true, $.harpsModel.mapOpt.styles, $.harpsEnv.mapStyle[this.currentStyle]);
        // コメントアウト 2019.02.26 dol-add
        // $.harpsModel.map.setOptions({styles : mapStyles});
      },
    },
    /**
     * GoogleMap overlayMapTypes
     */
    overlayMaps: {
      chkAll : function(){
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        for (var j = 0; j < objMapSize; j++){
          console.log(j +  "-" + $.harpsModel.overlayMapTypes[j].name);
        }
      },
      get : function(tileName){
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        for (var j = 0; j < objMapSize; j++){
          if ($.harpsModel.overlayMapTypes[j].name == tileName){
            return $.harpsModel.overlayMapTypes[j];
          }
        }
        return false; 
      },
      circles : {
        circle : {},
        center : {},
        add : function(tile) {
          console.log("overlayMaps circles add ", tile);
          if(!tile.hasOwnProperty("circle")){
            return;
          }
          if(this.circle.hasOwnProperty(tile.circle.cname)){
            var iconSize = parseInt(tile.circle.icon.size[$.harpsModel.map.getZoom()]);
            this.center[tile.circle.cname].obj.icon.size.width = iconSize;
            this.center[tile.circle.cname].obj.icon.size.height = iconSize;
            this.circle[tile.circle.cname].obj.setMap($.harpsModel.map);
            //this.circle[tile.circle.cname].obj.setVisible(true);
            this.circle[tile.circle.cname].count++;
            this.center[tile.circle.cname].obj.setVisible(true);
            this.center[tile.circle.cname].count++;
          } else {
            var center = tile.circle.center;
            console.log('tile.circle.center :', center)
            const latlng = new mapboxgl.LngLat(parseFloat(center.lng), parseFloat(center.lat));
            const sw = new mapboxgl.LngLat(tile.latlng.lngW, tile.latlng.latS);
            const ne = new mapboxgl.LngLat(tile.latlng.lngE, tile.latlng.latN);
            const bounds = new mapboxgl.LngLatBounds(sw, ne);
  
            var iconSize = parseInt(tile.circle.icon.size[$.harpsModel.map.getZoom()]);
            var anchorX = tile.circle.icon.anchor.x(iconSize);
            var anchorY = tile.circle.icon.anchor.y(iconSize);
          }
        },
        remove : function(tile){
          if(tile.hasOwnProperty("circle") && this.circle.hasOwnProperty(tile.circle.cname)){
            this.circle[tile.circle.cname].count--;
            if(this.circle[tile.circle.cname].count == 0){
              this.circle[tile.circle.cname].obj.remove();
              //this.circle[tile.circle.cname].obj.setVisible(false);
            }
            this.center[tile.circle.cname].count--;
            if(this.center[tile.circle.cname].count == 0){
              this.center[tile.circle.cname].obj.setVisible(false);
            }
          }
        },
        zoomChange : function(tile){
          if(tile.hasOwnProperty("circle") && this.center.hasOwnProperty(tile.circle.cname)){
            if(this.circle[tile.circle.cname].obj.visible == true && this.center[tile.circle.cname].obj.visible == true) {
              var iconSize = parseInt(tile.circle.icon.size[$.harpsModel.map.getZoom()]);
              this.center[tile.circle.cname].obj.icon.size.width = iconSize;
              this.center[tile.circle.cname].obj.icon.size.height = iconSize;
              this.center[tile.circle.cname].obj.setVisible(true);
            }
          }
        }
      },
      add: function (tileName) {
        var tile = $.harpsModel.tiles.get(tileName);
        console.log("MIERUNE: overlayMaps add ", tileName);

        if (tile == false) {
          return false;
        }
        var overlayMapType = {
          getTile: function (tileXY, zoom, ownerDocument) {
            if ($.harpsModel.tiles.inLatLng(tile) == false || $.harpsModel.tiles.isExistTime(tile, $.harpsModel.time.now) == false){
              return $("<div />");
            }
            if (tile.getTile == undefined) {
              return $.harpsModel.overlayMaps._getTile(tileXY, zoom, ownerDocument, tileName, this);
            } else {
              return tile.getTile(tileXY, zoom, ownerDocument, tileName, this);
            }
          },
          getTileUrl: function (tileXY, zoom, tileSetting) {
            var intSec = $.harpsModel.time.now.getTime() / 1000;
            var dataSec = intSec - (intSec % tile.interval());
            var time = new Date(dataSec * 1000);
            return tileSetting.url(tileXY, zoom, time);
          },
          tileSize: [TILE_SIZE, TILE_SIZE], //new google.maps.Size(TILE_SIZE, TILE_SIZE),
          name: tileName,
          alt: tile.alt,
          interval: tile.interval(),
          zindex: $.harpsModel.tiles.info[tileName]["zindex"],

          updateImg: function (lock) {
            console.log("add.overlayMapType.updateImg");
            lockFlg = lock || true;
            // 操作ボタンロック
            $.harpsModel.overlayMaps.lockControl();
            var tName = this.name;
            var tileSetting = $.harpsModel.tiles.get(tileName);
            var zoom = $.harpsModel.map.getZoom();
            var intSec = $.harpsModel.time.now.getTime() / 1000;
            var dataSec = intSec - (intSec % tile.interval());
            var time = new Date(dataSec * 1000);
            var $tileImgs = $("#map div.tile_image[data-type=" + tName + "]");
            var $parentDiv = $tileImgs.eq(0).parent();

            console.log("add.overlayMapType.updateImg tName : " + tName + ", " + "$tileImgs.length = " + $tileImgs.length);
            var outFlg = !$.harpsModel.tiles.isExistTime(tileSetting, time);
            // タイル画像のURLを更新する
            for (var l = 0; l < $tileImgs.length; l++) {
              var $tileImg = $tileImgs.eq(l);
              var tileXY = {
                x: $tileImg.attr("tile-x"),
                y: $tileImg.attr("tile-y"),
              };

              var url = $.harpsModel.overlayMaps._getTileUrlEnlarge(tileXY, zoom, tileSetting, this);
              console.log("add.overlayMapType.updateImg url : " + url);
              if (outFlg == false) {
                $tileImg.css("background-image", "url(" + url + ")");
                $tileImg.error(function () {
                  $(this).css("background", "url(" + $.harpsEnv.blankImg + ") no-repeat");
                });
              } else {
                // disableの期間内にある場合はblank画像を表示
                $tileImg.css("background", "url(" + $.harpsEnv.blankImg + ") no-repeat");
              }
            }
            // 操作ボタンロック解除
            $.harpsModel.overlayMaps.unlockControl();
            if (lockFlg == true) {
              $.harpsModel.overlayMaps.updateLocks--;
            }

            // 凡例の追加
            if (tileSetting.addLegend != undefined && $.harpsModel.tiles.inDisablePeriod(tileSetting, $.harpsModel.time.now) == false && $("#legend ." + tileName).length == 0) {
              console.log("tileSetting.addLegend " + tileName);
              tileSetting.addLegend($.harpsModel.tiles.info[tileName]);
              $("#wwarn_list").removeClass("no_legend");
            } else if ($.harpsModel.tiles.inDisablePeriod(tileSetting, $.harpsModel.time.now) == true && $("#legend ." + tileName).length != 0) {
              console.log("tileSetting.removeLegend " + tileName);
              $("#legend ." + tileName).remove();
              $("#wwarn_list").addClass("no_legend");
            }
          },
          updateImgWithCache: function (updateTimeController, callBack) {
            $.harpsModel.overlayMaps.lockControl();
            var updateFlg = updateTimeController || true;
            var callBackFunc =
              callBack ||
              function () {
                return true;
              };
            var tName = this.name;
            var tileSetting = $.harpsModel.tiles.get(tileName);
            var zoom = $.harpsModel.map.getZoom();
            var intSec = $.harpsModel.time.now.getTime() / 1000;
            var dataSec = intSec - (intSec % tile.interval());
            var time = new Date(dataSec * 1000);
            var $tileImgs = $("#map div.tile_image[data-type=" + tName + "]");
            var $parentDiv = $tileImgs.eq(0).parent();
            var outFlg = !$.harpsModel.tiles.isExistTime(tileSetting, time);
            var tnum = $tileImgs.length;
            if (outFlg == true || tnum == 0) {
              // データが表示期間外、表示する画像が存在しない場合
              $.harpsModel.overlayMaps.updateLocks--;
              return;
            }
            var tcount = 0;
            var overlayMap = this;
            $.harpsModel.overlayMaps._cacheImg[tName] = [];
            // 全てのタイル画像のキャッシュを取得した後で表示を更新する
            for (var l = 0; l < tnum; l++) {
              var $tileImg = $tileImgs.eq(l);
              var tileXY = {
                x: $tileImg.attr("tile-x"),
                y: $tileImg.attr("tile-y"),
              };
              var url = tileSetting.url(tileXY, zoom, time);
              if (outFlg == false) {
                  console.log("updateImgWithCache outFlg == false ");
                $img = $("<img>").attr("src", url);
                $img.on({
                  load: function () {
                    tcount++;
                    if (tcount >= tnum) {
                      if (callBackFunc() == true) {
                        overlayMap.updateImg(true);
                      } else {
                        $.harpsModel.overlayMaps.unlockControl();
                      }
                    }
                  },
                  error: function () {
                    tcount++;
                    if (tcount >= tnum) {
                      if (callBackFunc() == true) {
                        overlayMap.updateImg(true);
                      } else {
                        $.harpsModel.overlayMaps.unlockControl();
                      }
                    }
                  },
                });
                $.harpsModel.overlayMaps._cacheImg[tName].push($img);
              } else {
                $.harpsModel.overlayMaps.updateLocks--;
                break;
              }
            }
          },
        }; //overlayMapType

        // データをzindexの順番に表示
        var zindexList = [];
        var objMapSize = $.harpsModel.overlayMapTypes.length;

        for (var j = 0; j < objMapSize; j++) {
          var name = $.harpsModel.overlayMapTypes[j].name;
          zindexList.push($.harpsModel.tiles.info[name]["zindex"]);
        }
        zindexList.push($.harpsModel.tiles.info[tileName]["zindex"]);
        $.harpsModel.util.isort(zindexList);
        var iat;
        var length = zindexList.length;
        for (var i = length - 1; i >= 0; i--) {
          iat = i;
          if (zindexList[i] == $.harpsModel.tiles.info[tileName]["zindex"]) {
            break;
          }
        }
        $.harpsModel.overlayMapTypes.splice(iat, 0, overlayMapType);

        const layers = $.harpsModel.map.getStyle().layers;

        var layerExists = false;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].id == tileName) {
            layerExists = true;
            break;
          }
        }
        if (!layerExists) {
          $.harpsModel.overlayMaps.updateTileURL();

          $.harpsModel.map.addLayer({
            id: tileName,
            type: "raster",
            source: tileName,
            minzoom: 0,
            maxzoom: 20,
            paint: {
              "raster-opacity":  $.harpsModel.tiles.get(tileName).style.opacity,
            },
          });
        }
        // console.log($.harpsModel.map);
        // console.log(tileName);
        //$.harpsModel.map.moveLayer(tileName, "3d-buildings");
        //$.harpsModel.map.moveLayer(tileName, "3d-pole");
        // MIERUNE

        setTimeout($.harpsModel.overlayMaps.sortAll, 200);
        $("#data_select_box #" + tileName).addClass("on");
        // 凡例の追加
        if (tile.addLegend != undefined && $.harpsModel.tiles.inDisablePeriod(tile, $.harpsModel.time.now) == false) {
          // 二重表示防止
          if ($("#legend").children("." + tileName).length == 0) {
            tile.addLegend($.harpsModel.tiles.info[tileName]);
            $("#wwarn_list").removeClass("no_legend");
          }
        }
        console.log("overlayMaps.add : objMapSize = " + $.harpsModel.overlayMapTypes.length);
        // 円表示の追加（レーダデータ向け）
        //$.harpsModel.overlayMaps.circles.add(tile);
      },
      remove: function (tileName) {
        var intMapID = -1;
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        for (var j = 0; j < objMapSize; j++) {
          if ($.harpsModel.overlayMapTypes[j].name == tileName) {
            intMapId = j;
            break;
          }
        }
        if (intMapId != -1) {
          console.log("MIERUNE: overlayMaps remove: ", tileName);
	  // $.harpsModel.overlayMapTypes[intMapId]の削除
          $.harpsModel.overlayMapTypes.splice(intMapId, 1);

          $.harpsModel.map.removeLayer(tileName);

          setTimeout($.harpsModel.overlayMaps.sortAll, 200);
        } else {
          return false;
        }

        $("#data_select_box #" + tileName).removeClass("on");
        // 凡例の削除
        $("#legend").children("." + tileName).remove();
        $("#wwarn_list").addClass("no_legend");
        // 円の削除
        var tile = $.harpsModel.tiles.get(tileName);
        $.harpsModel.overlayMaps.circles.remove(tile);

        console.log("overlayMaps.remove : objMapSize = " + $.harpsModel.overlayMapTypes.length);
        $.harpsModel.overlayMaps.chkAll();
      },

      // MIERUNE 追加
      updateTileURL: function () {
        console.log("***** updateTileURL [in] zoom = " + $.harpsModel.map.getZoom());
        var oldLayers = $.harpsModel.map.getStyle().layers;
        var tiles = $.harpsEnv.tiles;

        for (var i = 0; i < tiles.length; i++) {
          if(tiles[i].display != "tile"){
            continue;
          }
          // const tileSetting = $.harpsModel.tiles.get(tileInfo.name);
          const intSec = $.harpsModel.time.now.getTime() / 1000;
          const dataSec = intSec - (intSec % tiles[i].interval());
          const time = new Date(dataSec * 1000);
          const tileURL = tiles[i].url($.harpsModel.map.getZoom(), time);
          //const tileURL2 = "tiles/amjp/2021/03/01/18/40/{z}/{x}/{y}.png";
          var tileSource = $.harpsModel.map.getSource(tiles[i].name);

          if (tileSource == null) {
            tileSource = {
              type: "raster",
              tileSize: 256,
              minzoom: 0,
              maxzoom: 20,
              tiles: [tileURL],
            };
            $.harpsModel.map.addSource(tiles[i].name, tileSource);
          } else {
            tileSource.tiles = [tileURL];
          }
          const layerIndex = oldLayers.findIndex((l) => l.id === tiles[i].name);
          console.log("***** updateTileURL " + tiles[i].name + " - layerIndex = " + layerIndex + " - url = " + tileURL + " *****");
          if (layerIndex > 0) {
            const layerDef = oldLayers[layerIndex];
            const before = oldLayers[layerIndex + 1] && oldLayers[layerIndex + 1].id;
            if($.harpsModel.map.getLayer(tiles[i].name)){
              console.log("***** updateTileURL $.harpsModel.map.removeLayer " + tiles[i].name);
              $.harpsModel.map.removeLayer(tiles[i].name);
              $.harpsModel.map.removeSource(tiles[i].name);
            }
            $.harpsModel.map.addSource(tiles[i].name, tileSource);
            $.harpsModel.map.addLayer(layerDef, before);
            

            // Remove the tiles for a particular source
            //$.harpsModel.map.style.sourceCaches[tiles[i].name].clearTiles();
            // Load the new tiles for the current viewport (map.transform -> viewport)
            //$.harpsModel.map.style.sourceCaches[tiles[i].name].update($.harpsModel.map.transform);
            // Force a repaint, so that the map will be repainted without you having to touch the map
            //$.harpsModel.map.triggerRepaint();

            //$.harpsModel.map.addLayer(layerDef, before);
	    //$.harpsModel.overlayMaps.remove(tiles[i].name);
	    //$.harpsModel.overlayMaps.add(tiles[i].name);
          }
        }
        console.log("***** updateTileURL [out] *****");
      },
      update: function () {
        console.log("overlayMaps.update");
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        var names = [];
        for (var j = 0; j < objMapSize; j++) {
          overlay = $.harpsModel.overlayMapTypes[j];
          names.push(overlay.name);
        }
        for (var k = 0; k < names.length; k++) {
          var name = names[k];
          $.harpsModel.overlayMaps.remove(name);
          $.harpsModel.overlayMaps.add(name);
        }
      },
      updateImg: function () {
        console.log("overlayMaps.updateImg : objMapSize = " + $.harpsModel.overlayMapTypes.length);
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        for (var j = 0; j < objMapSize; j++) {
          $.harpsModel.overlayMapTypes[j].updateImg();
        }
      },
      updateLocks: -1,
      updateAllImgWithCache: function (callBack) {
        var objMapSize = $.harpsModel.overlayMapTypes.length;
        var callBackFunc = callBack || function () {};
        $.harpsModel.overlayMaps.updateLocks = objMapSize;
        for (var j = 0; j < objMapSize; j++) {
          $.harpsModel.overlayMapTypes[j].updateImgWithCache(true, callBackFunc);
        }
      },
      /* 20200608_mapbox_code */

      sortAll: function () {
        var dlist = [];
        $("#data_select_box .data").each(function () {
          dlist.push($(this).attr("id"));
        });
        $.harpsModel.overlayMaps.sort(dlist);
      },
      sort: function (sortArr) {
        var alen = sortArr.length;
        var zindex = 1;
        for (var i = alen - 1; i >= 0; i--) {
          var item = sortArr[i];
          var children = $.harpsModel.tiles.getChildren(item);
          if (children.length > 0) {
            var clen = children.length;
            for (var j = 0; j < clen; j++) {
              zindex = this.chZindex(children[j].name, zindex);
            }
          } else {
            zindex = this.chZindex(item, zindex);
          }
        }
      },
      chZindex: function (item, zindex) {
        if ($("#map .leaflet-tile-pane ." + item).eq(0)) {
          var $layer = $("#map .leaflet-tile-pane ." + item);
          if ($layer.length == 0) {
            zindex++;
            return zindex;
          }
          $layer.css("z-index", zindex);
        }
        // 2019.03.20 dol-end
        $.harpsModel.tiles.info[item]["zindex"] = zindex;
        zindex++;
        return zindex;
      },
      lockedControl: false,
      lockControl: function () {
        /*
        L.setOptions($.harpsModel.map, {
          scrollWheelZoom: false,
          dragging: false,
          doubleClickZoom: true,
        });
        */
        // 2019.03.07 dol-end
        $("#gps_button").trigger("lock");
        $("#playback_button").trigger("lock");
        $("#center_button").trigger("lock");
        $("#time_controller").trigger("lock");
        $("#zoom_button").trigger("lock");
        $.harpsModel.overlayMaps.lockedControl = true;
      },
      unlockControl: function () {
        // コメントアウト 2019.03.07 dol-add
        // $.harpsModel.map.setOptions({
        //   scrollwheel : true,
        //   draggable : true,
        //   disableDoubleClickZoom : false
        // });
        // コメントアウト 2019.03.07 dol-end
        // 2019.03.07 dol-add
        /*
        L.setOptions($.harpsModel.map, {
          scrollWheelZoom: true,
          dragging: true,
          doubleClickZoom: false,
        });
         */
        // 2019.03.07 dol-end
        $("#gps_button").trigger("unlock");
        $("#playback_button").trigger("unlock");
        $("#center_button").trigger("unlock");
        $("#time_controller").trigger("unlock");
        $("#zoom_button").trigger("unlock");
        $.harpsModel.overlayMaps.lockedControl = false;
          console.log("$.harpsModel.overlayMaps.unlockControl");
      },
      _getTileUrl: function (tileXY, zoom, tileSetting) {
        var intSec = $.harpsModel.time.now.getTime() / 1000;
        var dataSec = intSec - (intSec % tileSetting.interval());
        var time = new Date(dataSec * 1000);
        return tileSetting.url(tileXY, zoom, time);
      },
      _getTileUrlEnlarge: function (tileXY, zoom, tileSetting, overlayMap) {
        if (zoom > tileSetting.zoom_enlarge_src) {
          var diffZ = zoom - tileSetting.zoom_enlarge_src;
          var factor = Math.pow(2, diffZ);
          var divX = tileXY.x / factor;
          var divY = tileXY.y / factor;
          var newX = Math.floor(divX);
          var newY = Math.floor(divY);
          var offsetX = (divX - newX) * factor;
          var offsetY = (divY - newY) * factor;
          var newXY = {
            x: newX,
            y: newY,
          };
          return $.harpsModel.overlayMaps._getTileUrl(
            newXY,
            tileSetting.zoom_enlarge_src,
            tileSetting
          );
        } else {
          return $.harpsModel.overlayMaps._getTileUrl(
            tileXY,
            zoom,
            tileSetting
          );
        }
      },
      _getTile: function (tileXY, zoom, ownerDocument, tileName, overlayMap) {
        var tile = $.harpsModel.tiles.get(tileName);
        // tiles.infoのdisabled=trueの場合は画像を取得しない
        if (
          $.harpsModel.tiles.info[tileName]["disabled"] &&
          $.harpsModel.tiles.info[tileName]["disabled"] == true
        ) {
          return "";
        }
        var url = overlayMap.getTileUrl(tileXY, zoom, tile);
        var tileImage = ownerDocument.createElement("div");
        tileImage.style.background = "url(" + url + ") no-repeat";
        tileImage.className = "tile_image";
        tileImage.setAttribute("data-type", tileName);
        tileImage.setAttribute("tile-x", tileXY.x);
        tileImage.setAttribute("tile-y", tileXY.y);
        tileImage.style.width = overlayMap.tileSize.width + "px";
        tileImage.style.height = overlayMap.tileSize.height + "px";
        $(tileImage).addClass(
          "opacity_" + $.harpsModel.tiles.info[tileName]["opacity"].toString()
        );
        tileImage.onerror = function () {
          this.style.background = "url(" + $.harpsEnv.blankImg + ") no-repeat";
        };
        return tileImage;
      },
/*
      _getTileEnlarge: function (
        tileXY,
        zoom,
        ownerDocument,
        tileName,
        overlayMap
      ) {
        var tile = $.harpsModel.tiles.get(tileName);
        // tiles.infoのdisabled=trueの場合は画像を取得しない
        if (
          $.harpsModel.tiles.info[tileName]["disabled"] &&
          $.harpsModel.tiles.info[tileName]["disabled"] == true
        ) {
          return "";
        }

        // ズームレベル=zoom_enlarge_srcの画像を引き伸ばして表示する
        var url;
        var bgSize;
        var bgPos;
        if (zoom > tile.zoom_enlarge_src) {
          var diffZ = zoom - tile.zoom_enlarge_src;
          var factor = Math.pow(2, diffZ);
          var divX = tileXY.x / factor;
          var divY = tileXY.y / factor;
          var newX = Math.floor(divX);
          var newY = Math.floor(divY);
          var offsetX = (divX - newX) * factor;
          var offsetY = (divY - newY) * factor;
          var newXY = {
            x: newX,
            y: newY,
          };
          url = overlayMap.getTileUrl(newXY, tile.zoom_enlarge_src, tile);
          bgSize = 100 * Math.pow(2, diffZ) + "%";
          bgPosX = -1 * TILE_SIZE * offsetX;
          bgPosY = -1 * TILE_SIZE * offsetY;
          bgPos = bgPosX + "px " + bgPosY + "px";
        } else {
          url = overlayMap.getTileUrl(tileXY, zoom, tile);
          bgSize = 100 + "%";
          bgPos = "0px 0px";
        }
        var tileImage = ownerDocument.createElement("div");
        tileImage.style.background = "url(" + url + ") no-repeat";
        tileImage.style.backgroundSize = bgSize;
        tileImage.style.backgroundPosition = bgPos;
        //tileImage.src           = url;
        tileImage.className = "tile_image";
        tileImage.setAttribute("data-type", tileName);
        tileImage.setAttribute("tile-x", tileXY.x);
        tileImage.setAttribute("tile-y", tileXY.y);
        tileImage.style.width = overlayMap.tileSize.width + "px";
        tileImage.style.height = overlayMap.tileSize.height + "px";

        $(tileImage).addClass(
          "opacity_" + $.harpsModel.tiles.info[tileName]["opacity"].toString()
        );
        tileImage.onerror = function () {
          this.style.background = "url(" + $.harpsEnv.blankImg + ") no-repeat";
        };
        return tileImage;
      },
      _cacheImg: {},
      _cacheTimer: {},
*/
    },

    marker: {
      add: function (tileName) {
        console.log("marker add " + tileName);
        var tileSetting = $.harpsModel.tiles.get(tileName);
        var zoom = $.harpsModel.map.getZoom();
        tileSetting.addMarker(zoom, tileSetting);
        $("#data_select_box #" + tileName).addClass("on");
      },
      remove: function (tileName) {
        var tileSetting = $.harpsModel.tiles.get(tileName);
        var zoom = $.harpsModel.map.getZoom();
        tileSetting.removeMarker(zoom, tileSetting);
        $("#data_select_box #" + tileName).removeClass("on");
      },
    },
    /**
     * データ情報
     */
    tiles: {
      info: {},
      // データ情報の初期化
      init: function (index, tile, start, latest) {
        console.log('tiles init #' + index + ' name = ' + tile.name + ', latest = ' + latest);
        $.harpsModel.tiles.info[tile.name] = {};
        $.harpsModel.time.getTileLatest(tile);
        if ("latest" in $.harpsModel.tiles.info[tile.name] && latest < $.harpsModel.tiles.info[tile.name]["latest"]){
          // latestの値は各データの最新時刻の中で最も新しい時刻とする
          latest = $.harpsModel.tiles.info[tile.name]["latest"];
        }
        if (tile.start && tile.start < start) {
          // startの値は各データの開始時刻の中で最も新しい時刻とする
          start = tile.start;
        }

        // disabled設定の初期化
        $.harpsModel.tiles.info[tile.name]["disabled"] = {
          zoom: false,
          period: false,
          position: false,
        };

        // opacityの初期化
        if (tile.style && tile.style.opacity) {
          $.harpsModel.tiles.info[tile.name]["opacity"] =
            tile.style.opacity * 10;
        }

        // zindexの初期化
        var zindex = $.harpsModel.tiles.getAll().length - index;
        $.harpsModel.tiles.info[tile.name]["zindex"] = zindex;

        // cTypeの初期化
        if (tile.cType != undefined) {
          $.harpsModel.tiles.info[tile.name]["cType"] = tile.cType.defval;
        }

        // tileごとにinit処理が定義されていた場合は実行
        if (tile.init) {
          tile.init(tile);
        }

        if (tile.start) {
          _disable[tile.name] = [];
          _disableTiles.push(tile);
          var from = new Date($.harpsEnv.startDate);
          var to = new Date(tile.start);
          _disable[tile.name].push({ from: from, to: to });
        }
        if (tile.disable) {
          if (_disable[tile.name] == undefined) {
            _disable[tile.name] = [];
          }
          if (_disableTiles.indexOf(tile) < 0) {
            _disableTiles.push(tile);
          }
          for (var j = 0; j < tile.disable.length; j++) {
            var from;
            var to;
            if (tile.disable[j].from != undefined) {
              from = new Date(tile.disable[j].from);
            } else {
              from = new Date(tile.start.getTime());
            }
            if (tile.disable[j].to != undefined) {
              to = new Date(tile.disable[j].to);
            } else {
              to = new Date($.harpsModel.time.end.getTime());
            }
            _disable[tile.name].push({ from: from, to: to });
          }
        }
        return [start, latest];
      },
      getAll: function () {
        var tiles = [];
        var tlen = $.harpsEnv.tiles.length;
        for (var i = 0; i < tlen; i++) {
          if ($.harpsEnv.tiles[i].children) {
            Array.prototype.push.apply(
              tiles,
              $.harpsEnv.tiles[i].children.getNode()
            );
          } else {
            tiles.push($.harpsEnv.tiles[i]);
          }
        }
        return tiles;
      },
      getAllParent: function () {
        return $.harpsEnv.tiles;
      },
      get: function (tileName) {
        var tlen = $.harpsEnv.tiles.length;
        for (var i = 0; i < tlen; i++) {
          if ($.harpsEnv.tiles[i].name === tileName) {
            return $.harpsEnv.tiles[i];
          }
          if ($.harpsEnv.tiles[i].children) {
            var children;
            if ($.harpsEnv.tiles[i].children.getNode != undefined) {
              children = $.harpsEnv.tiles[i].children.getNode();
            }
            var clen = children.length;
            for (var j = 0; j < clen; j++) {
              if (children[j].name === tileName) {
                return children[j];
              }
            }
          }
        }
        return false;
      },
      getChildren: function (tile) {
        var parent;
        if (typeof tile === "string") {
          parent = this.get(tile);
        } else {
          parent = tile;
        }
        var children = [];
        if (parent.children) {
          children = parent.children.getNode();
        }
        return children;
      },
      execAllChildren: function (tile, func, param) {
        if (tile.children) {
          var clen = tile.children.getNode().length;
          for (var i = 0; i < clen; i++) {
            func(tile.children.getNode()[i], param);
          }
        }
      },
      execAll: function (func, param) {
        paramArr = param || [];
        var tiles = $.harpsModel.tiles.getAll();
        for (var i = 0; i < tiles.length; i++) {
          //console.log("execAll func " + param);
          func(tiles[i], paramArr);
          //console.log("execAll func end " + param);
        }
      },
      enable: function (tileName, key) {
        var disabled = $.harpsModel.tiles.info[tileName]["disabled"];
        disabled[key] = false;
        // disabledの全てのキーの値がfalseになっていた場合はデータ選択を有効化する
        if (!disabled["zoom"] && !disabled["period"] && !disabled["latlng"]) {
          var $item = $("#data_select_box #" + tileName + ".data");
          $item.removeClass("out");
          if ($item.hasClass("sub_data")) {
            $item.parents(".parent").removeClass("out");
          }
        }
      },
      disable: function (tileName, key) {
        console.log("disable tileName = " + tileName);
        $.harpsModel.tiles.info[tileName]["disabled"][key] = true;
        var $item = $("#data_select_box #" + tileName + ".data");
        $item.addClass("out");
        if (
          $item.hasClass("sub_data") &&
          $item.parent().find(".out").length ==
            $item.parent().find(".sub_data").length
        ) {
          $item.parent().removeClass("active");
          $item.parents(".parent").addClass("out");
        }
      },
      chkZoomLevel: function () {
        // zoom_min - zoom_maxの間にないデータは選択不可にする
        var chk = function (tile) {
          var zoom = $.harpsModel.map.getZoom();
          if (zoom > tile.zoom_max || zoom < tile.zoom_min) {
            $.harpsModel.tiles.disable(tile.name, "zoom");
          } else {
            $.harpsModel.tiles.enable(tile.name, "zoom");
          }
        };
        $.harpsModel.tiles.execAll(chk);
        // 更新 20200703
        console.log("chkZoomLevel zoom = " + $.harpsModel.map.getZoom());
        $.harpsModel.overlayMaps.updateTileURL();
        // タイル画像以外のデータのアップデート
        $.harpsModel.tiles.updateOther();

      },
      isExistTime: function (tile, time) {
        // timeが[データの最終時刻+データ間隔]より大きいの場合は最新データが存在しないと判断する

        // 2017.06.22 村永
        // h8jpの画像がズームインアウトしないと表示されない問題の暫定対処としてコメントアウト
        //if($.harpsModel.tiles.info[tile.name]["latest"]){
        //  var latest = $.harpsModel.tiles.info[tile.name]["latest"];
        //  if((latest.getTime()/1000 + tile.interval()) < time.getTime() / 1000){
        //    return false;
        //  }
        //}
        // ここまで

        // harpsEnvに設定されているdisable期間のチェック
        if ($.harpsModel.tiles.inDisablePeriod(tile, time) == true) {
          return false;
        } else {
          return true;
        }
      },
      chkTileTime: function (tile, paramArr) {
        var time = paramArr[0];
        if ($.harpsModel.tiles.isExistTime(tile, time) == true) {
          $.harpsModel.tiles.enable(tile.name, "period");
        } else {
          $.harpsModel.tiles.disable(tile.name, "period");
        }
      },
      chkTimePeriod: function () {
        $.harpsModel.tiles.execAll(this.chkTileTime, [$.harpsModel.time.now]);
      },
      inDisablePeriod: function (tile, date) {
        // harpsEnvに設定されているdisable期間のチェック
        if (_disable[tile.name]) {
          var disable = _disable[tile.name];
          var dlen = disable.length;
          for (var i = 0; i < dlen; i++) {
            if (date.getTime() >= disable[i].from.getTime() && date.getTime() <= disable[i].to.getTime()){
              return true;
            }
          }
        }
        return false;
      },
      chkLatLngTiles: function () {
        var chk = function (tile) {
          // harpsEnvに設定されているlatlngと表示領域のチェック
          if ($.harpsModel.tiles.inLatLng(tile) == false) {
            $.harpsModel.tiles.disable(tile.name, "latlng");
          } else {
            $.harpsModel.tiles.enable(tile.name, "latlng");
          }
        };
        console.log("chkLatLngTiles - execAll");
        $.harpsModel.tiles.execAll(chk);
        console.log("chkLatLngTiles - end");
      },
      inLatLng: function (tile) {
        if (tile.latlng) {
          var bounds = $.harpsModel.util.getBounds();

          var latlng = tile.latlng;
          if (latlng.latN <= bounds.latS || latlng.latS >= bounds.latN || latlng.lngW >= bounds.lngE || latlng.lngE <= bounds.lngW) {
            return false;
          }
        }
        return true;
      },
      setZindex: function () {
        var dlen = $("#data_select_box .data").length;
        var zindex = 1;
        for (var i = dlen - 1; i >= 0; i--) {
          var $ditem = $("#data_select_box .data").eq(i);
          var tileName = $ditem.attr("id");
          if ($.harpsModel.tiles.info[tileName]) {
            $.harpsModel.tiles.info[tileName]["zindex"] = zindex;
          }
          zindex++;
        }
      },
      updateOther: function () {
        var tiles = $.harpsModel.tiles.getAll();
        for (var i = 0; i < tiles.length; i++) {
          console.log("updateOther : " + tiles[i].name); 
          if (tiles[i].updateMethod != undefined && $("#" + tiles[i].name).hasClass("on")) {
            tiles[i].updateMethod($.harpsModel.map.getZoom(), tiles[i]);
          } else if(tiles[i].updateMethod != undefined && $("#" + tiles[i].name).hasClass("out")){
            // 20210811
            // マップのズーム可能範囲の変更に伴い、マーカー表示可能なズーム範囲を超えた場合は
            // マーカーを非表示にする
            console.log("updateOther : " + tiles[i].name); 
            tiles[i].removeMarker($.harpsModel.map.getZoom(), tiles[i]);  
	  }
        }
      },
      updateLock: function () {
        var tiles = $.harpsModel.tiles.getAll();
        var lock = false;
        for (var i = 0; i < tiles.length; i++) {
          if (tiles[i].updateLock != undefined) {
            lock = lock || tiles[i].updateLock();
          }
        }
        return lock;
      },
      chkCalender: function () {
        $("div.picker__day:not(.picker__day--disabled)").each(function () {
          var isExist = true;
          var date1 = new Date(parseInt($(this).attr("data-pick")));
          var date2 = new Date(parseInt($(this).attr("data-pick")) + 86399000);
          for (var i = 0; i < _disableTiles.length; i++) {
            if (!$("#" + _disableTiles[i].name).hasClass("on")) {
              continue;
            }
            if ($.harpsModel.tiles.isExistTime(_disableTiles[i], date1) == false && $.harpsModel.tiles.isExistTime(_disableTiles[i], date2) == false) {
              $(this).addClass(_disableTiles[i].name);
              isExist = false;
            }
          }
          if (isExist == false) {
            $(this).addClass("not_exist");
          }
        });
      },
    },
    /**
     * ロゴ設定の変更処理
     */
    logo: {
      on: function (tileSetting) {
        if (tileSetting.logo) {
          var llen = tileSetting.logo.length;
          for (var i = 0; i < llen; i++) {
            var $logo = $("#logo").find(tileSetting.logo[i]);
            $logo.addClass("on");
          }
        }
      },
      off: function (tileSetting) {
        if (tileSetting.logo) {
          var llen = tileSetting.logo.length;
          for (var i = 0; i < llen; i++) {
            var $logo = $("#logo").find(tileSetting.logo[i]);
            $logo.removeClass("on");
          }
        }
      },
    },
    /**
     * ズームレベル
     */
    zoom: {
      zoomIn: function () {
        $.harpsModel.zoom.set($.harpsModel.map.getZoom() + 1);
      },
      zoomOut: function () {
        $.harpsModel.zoom.set($.harpsModel.map.getZoom() - 1);
      },
      set: function (zoom) {
        $.harpsModel.map.setZoom(zoom);
      },
    },
    /**
     * 画面表示領域
     */
    position: {
      default: function () {
        console.log("mapOpt.center: " + $.harpsEnv.mapOpt.center);
        console.log("mapOpt.zoom: " + $.harpsEnv.mapOpt.zoom);
        $.harpsModel.map.panTo($.harpsEnv.mapOpt.center);
        $.harpsModel.map.setZoom($.harpsEnv.mapOpt.zoom);
      },
    },
    /**
     * 時刻
     */
    time: {
      now: null,
      start: null,
      end: null,
      init: function (start, latest) {
        // 開始時刻の設定
        $.harpsModel.time.start = new Date(start.getTime());
        // 最新時刻の設定
        if ($.harpsEnv.timeIndicator in $.harpsModel.tiles.info && "latest" in $.harpsModel.tiles.info[$.harpsEnv.timeIndicator]) {
          // timeIndicatorが指定されている場合はtimeIndicatorに指定されたデータの
          // 最新時刻をWebアプリの最新時刻とする
          $.harpsModel.time.end = new Date($.harpsModel.tiles.info[$.harpsEnv.timeIndicator]["latest"]);
        } else {
          // timeIndicatorが指定されていない場合はlatestをWebアプリの最新時刻とする
          $.harpsModel.time.end = new Date(latest.getTime());
        }

        // 初期表示最新時刻の設定
        var defaultTime = $.harpsModel.time.end;
        for (var i = 0; i < $.harpsEnv.defaultMaps.length; i++) {
          dtileName = $.harpsEnv.defaultMaps[i];
          if ("latest" in $.harpsModel.tiles.info[dtileName]) {
            var time = $.harpsModel.tiles.info[dtileName]["latest"];
            if (time < defaultTime) {
              defaultTime = time;
            }
          }
        }
        // viewURLの時刻指定がある場合はその時刻を初期表示時刻とする
        var searchStr = "";
        if(window.parent){
          searchStr = window.parent.location.search.substring(1);
        } else {
          searchStr = window.location.search.substring(1);
        }

        var objGetQueryString = {};
        var arrParameters     = searchStr.split("&");
        for( var i = 0; i < arrParameters.length; i++) {
          objGetQueryString[decodeURIComponent(arrParameters[i].split("=")[0])] = decodeURIComponent(arrParameters[i].split("=")[1]);
        }

        if ( typeof objGetQueryString.ct == "string" && objGetQueryString.ct.match(/^[\d\-]+$/)) defaultTime = new Date(parseInt( objGetQueryString.ct, 10 ));
        if ( typeof objGetQueryString.st == "string" && objGetQueryString.st.match(/^[\d\-]+$/)) $.harpsModel.time.start = new Date(parseInt(objGetQueryString.st, 10));
        if ( typeof objGetQueryString.et == "string" && objGetQueryString.et.match(/^[\d\-]+$/)) $.harpsModel.time.end = new Date(parseInt(objGetQueryString.et, 10));

        $.harpsModel.time.setDate(defaultTime);
        $.harpsModel.time.update(defaultTime);
        $.harpsModel.time.startChkLatest();
        console.log("$.harpsModel.viewurl.params.sD - $.harpsModel.time.now = " +  $.harpsModel.time.now);
      },
      setNow: function (date) {
        if (date.getTime() > $.harpsModel.time.end.getTime()) {
          date = new Date($.harpsModel.time.end.getTime());
        }
        if (date.getTime() < $.harpsModel.time.start.getTime()) {
          date = new Date($.harpsModel.time.start.getTime());
        }
        $.harpsModel.time.now = date;
        $.harpsModel.tiles.chkTimePeriod();
        return date;
      },
      setDate: function (date) {
        console.log("setDate : " + date);
        date = $.harpsModel.time.setNow(date);
      },
      update : function (date) {
        if (date > $.harpsModel.time.end) {
          return;
        } else if (date < $.harpsModel.time.start) {
          return;
        } else if (date == $.harpsModel.time.now) {
          // 時刻変更がないためupdateは実行しない
          return;
        }
        $.harpsModel.time.setDate(date);
        $.harpsModel.overlayMaps.updateTileURL();   // タイル画像のアップデート
        $.harpsModel.tiles.updateOther();           // タイル画像以外のデータのアップデート
      },
      latestTimer: null,
      startChkLatest: function () {
        //定期的に最新時刻を取得する
        $.harpsModel.time.latestTimer = setTimeout(function () {
          // 2017.08.15 muranaga
          //$.harpsModel.time.getLatest();
          if ($.harpsView.dataCtrl.getDataType() == "h8jp") {
            $.harpsModel.time.getLatestH8jp();
          } else {
            $.harpsModel.time.getLatest();
          }
          // 2017.08.15 muranaga-end
          //$("header .date .reload_button").trigger("update");
          //$("#time_controller").trigger("unlock");
          $.harpsModel.time.startChkLatest();
        }, $.harpsEnv.autoupdate_interval);
      },
      stopChkLatest: function () {
        if ($.harpsModel.time.latestTimer != null) {
          clearTimeout($.harpsModel.time.latestTimer);
          $.harpsModel.time.latestTimer = null;
        }
      },
      getLatest: function () {
        var latest = $.harpsModel.time.start;
        var tiles = $.harpsModel.tiles.getAll();
        var isLatest = false;
        for (var i = 0; i < tiles.length; i++) {
          $.harpsModel.time.getTileLatest(tiles[i]);
          if (tiles[i].name === $.harpsEnv.timeIndicator && "latest" in $.harpsModel.tiles.info[tiles[i].name]) {
            latest = $.harpsModel.tiles.info[tiles[i].name]["latest"];
            isLatest = true;
          } else {
            if (isLatest == false && "latest" in $.harpsModel.tiles.info[tiles[i].name]) {
              latest = $.harpsModel.tiles.info[tiles[i].name]["latest"];
            }
          }
        }
        $.harpsModel.time.end = new Date(latest.getTime());
      },

      // 2017.08.15 村永
      // h8jpのlatestの時刻(通常amjpより古い)を取ってきて、not_latestにする。
      // クリックすると、h8jpのlatest時刻のデータを表示する
      getLatestH8jp: function () {
        var latest = $.harpsModel.time.start;
        var tiles = $.harpsModel.tiles.getAll();
        var isLatest = false;
        for (var i = 0; i < tiles.length; i++) {
          $.harpsModel.time.getTileLatest(tiles[i]);
          if (tiles[i].name == "h8jp" && "latest" in $.harpsModel.tiles.info[tiles[i].name]) {
            latest = $.harpsModel.tiles.info[tiles[i].name]["latest"];
            isLatest = true;
          }
        }
        $.harpsModel.time.end = new Date(latest.getTime());
      },
      // 2017.08.15 村永-end

      getTileLatest: function (tile) {
        if (tile.update == undefined || tile.update == false) {
          // update=falseの場合はendを最新時刻として取得する
          // endが指定されていない場合は何もしない
          if (tile.end != undefined) {
            $.harpsModel.tiles.info[tile.name]["latest"] = tile.end;
          }
          return;
        }
        if (tile.children) {
          // childrenノードがある場合はchildren側の設定でlatest.jsonを取得する
          return;
        }
        $.ajax({
          async: false,
          type: "GET",
          url: tile.latest_json + "?uid=" + new Date().getTime().toString(),
          dataType: "json",
        }).done(function (pJson) {
          $.harpsModel.tiles.info[tile.name]["latest"] = new Date(
            pJson.date.replace(/\-/g, "/")
          );
        }).fail(function (pXMLHttpRequest, pTextStatus, pErrorThrown) {
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
      },
    },
    /**
     * ViewURL
     */
    viewurl: {
      params: {},
      get: function () {
        var search = $.harpsModel.viewurl.getSearch();
        var url =
          location.protocol +
          "//" +
          location.host +
          location.pathname.replace($.harpsEnv.indexHTML, "");
        return url + "?" + search;
      },
      getParamURL: function(){
        var search = $.harpsModel.viewurl.getSearch();
        return search;
      },
      getSearch: function (time) {
        var tFlg = time != undefined ? time : true;
        var params = {};
        for (key in $.harpsModel.viewurl._get) {
          if (
            tFlg == false &&
            (key === "ar" ||
              key === "arD" ||
              key === "arSp" ||
              key === "arRp" ||
              key === "sD")
          ) {
            continue;
          }
          params[key] = $.harpsModel.viewurl._get[key]();
        }
        return $.harpsModel.viewurl.compose(params);
      },
      set: function () {
        var paramLen = $.harpsModel.viewurl.params.length;
        for (var key in $.harpsModel.viewurl.params) {
          if ($.harpsModel.viewurl._set[key] != undefined) {
            $.harpsModel.viewurl._set[key]($.harpsModel.viewurl.params[key]);
          }
        }
      },
      save: function () {
        var search = $.harpsModel.viewurl.getSearch(false);
        $.harpsModel.storage.set("viewurl", search);
      },
      compose: function (query) {
        var search = "";
        for (var key in query) {
          if (query[key] != false) {
            search += key + "=" + query[key] + "&";
          }
        }
        search = search.substr(0, search.length - 1);
        return search;
      },
      parse: function (searchStr) {
        var search = searchStr.split("&");
        var searchLen = search.length;
        var query = {};
        for (var i = 0; i < searchLen; i++) {
          split = search[i].split("=");
          var key = decodeURIComponent(split[0]);
          var val = decodeURIComponent(split[1]);
          if (!val.match(/^[a-zA-Z0-9\.,_-]+$/)) {
            continue;
          }
          if (!key.match(/^[a-zA-Z0-9]+$/)) {
            continue;
          }
          query[key] = val;
        }
        $.harpsModel.viewurl.params = query;
      },
      parseUrl: function () {
        // GETパラメタから取得
        //var searchStr = window.location.search.substring(1);
        var searchStr = "";
        if(window.parent){
          searchStr = window.parent.location.search.substring(1);
        } else {
          searchStr = window.location.search.substring(1);
        }
        this.parse(searchStr);
      },
      parseStorage: function () {
        // ローカルストレージから取得
        var searchStr = $.harpsModel.storage.get("viewurl");
        if (searchStr == null) {
          return;
        }
        this.parse(searchStr);
      },
      _get: {
        // データ選択情報
        sI: function () {
          var sI = "";
          var data = $("#data_select_box .data");
          var dLen = data.length;
          for (var i = 0; i < dLen; i++) {
            var $datum = data.eq(i);
	    console.log("viewurl._get.sI : " + i + " - " + $datum.attr("id"));
            if ($datum.hasClass("parent")) {
              // サブメニューが存在する場合はサブメニュー単位のデータ名を使用する
              continue;
            }
            if ($datum.children("div").hasClass("tnBox2")) {
              // exclude設定がtrueの場合は、選択されているデータ名を使用する
              if ($datum.find(".on").length > 0) {
                $datum = $datum.find(".on");
              }
            }
            var select = SI_DELIMITER;
            if ($datum.hasClass("on")) {
              select += SI_ON;
            } else {
              select += SI_OFF;
            }
            var transparent;
            if ($.harpsModel.util.isMobileWindow()) {
              var $slider = $(".slider[data-name=" + $datum.attr("id") + "]");
              if ($slider.length == 1) {
                transparent =
                  SI_DELIMITER +
                  $slider.find(".opacity_slider").slider("value");
              } else {
                transparent = "";
              }
            } else {
              if ($datum.find("input[type='range']").length == 1) {
                transparent =
                  SI_DELIMITER + $datum.find("input[type='range']").val();
              } else {
                transparent = "";
              }
            }
            var ctype = "";
            if ($datum.find(".time.ctype_1").length != 0) {
              ctype = SI_DELIMITER + "1";
            }

            sI += $datum.attr("id") + select + transparent + ctype + ",";
          }
          return sI.substr(0, sI.length - 1);
        },
        // 地図種別
        sM: function () {
          if ($("#map_select_box").hasClass("map_color_chg")) {
            return $("#map_select_box").find(".on").eq(0).attr("map-type-c0");
          } else {
            return $("#map_select_box").find(".on").eq(0).attr("map-type-c1");
          }
        },
        // サイドメニューの表示状態
        sMS: function () {
          return String($(".side-menu").hasClass("open"));
        },
        // ズーム率
        sS: function () {
          return $.harpsModel.map.getZoom().toString();
        },
        // 中心座標の緯度
        sLt: function () {
          // コメントアウト 2019.02.25 dol-add
          // return $.harpsModel.map.getCenter().lat();
          // 2019.02.25 dol-add
          return $.harpsModel.map.getCenter().lat;
        },
        // 中心座標の経度
        sLg: function () {
          // コメントアウト 2019.02.25 dol-add
          // return $.harpsModel.map.getCenter().lng();
          // 2019.02.25 dol-add
          return $.harpsModel.map.getCenter().lng;
        },
        // 地図の回転角
        sBr: function () {
          return $.harpsModel.map.getBearing();
        },
        // 地図の仰俯角
        sPt: function () {
          return $.harpsModel.map.getPitch();
        },
        // ウィンドウ幅
        wW: function () {
          return window.innerWidth;
        },
        // ウィンドウ高さ
        wH: function () {
          return window.innerHeight;
        },
      },
      /**
       * ViewURLに設定されたパラメタから表示内容を設定する
       * ただし、sD(時刻), sLt,sLg(表示位置), sS(ズーム率)については
       * init時に初期設定を行うため、本メソッドでは設定を行わない
       */
      _set: {
        // データ選択情報
        sI: function (val) {
	  console.log("viewurl._set.sI " + val);	
          var vals = val.split(",");
          var vLen = vals.length;
          var dlist = [];
          var clickList = [];
          for (var i = vLen - 1; i >= 0; i--) {
            var dat = vals[i].split(SI_DELIMITER);
            var dname = dat[0];
            var isOn = parseInt(dat[1]);
            var $dctrl = $("#" + dname);
            var $dsort;
            if ($dctrl.hasClass("exclude")) {
              $dsort = $dctrl.parents(".data");
            } else {
              $dsort = $dctrl;
            }
            if ($dctrl.length == 0) {
              continue;
            }
            // データのON/OFF
            if (
              (!$dctrl.hasClass("on") && isOn == SI_ON) ||
              ($dctrl.hasClass("on") && isOn == SI_OFF)
            ) {
              clickList.push($dctrl);
            }
            dlist.unshift(dname);

            // データの透明度の変更
            if (dat.length >= 3) {
              let opacity = parseInt(dat[2]);
              $.harpsModel.tiles.get(dname).style.opacity = opacity / 10.0;
              $.harpsModel.tiles.info[dname]["opacity"] = opacity;
              if ($.harpsModel.util.isMobileWindow()) {
                $(".slider[data-name=" + $dctrl.attr("id") + "] .opacity_slider").slider("value", opacity);
              } else {
                var $input = $dctrl.find("input[type='range']");
                console.log("$input", $input);
                $input.val(opacity);
                $input.trigger("ch_opacity");
              }
            }

            // ctypeの変更
            if (dat.length == 4 && dat[3] == 1) {
              $dctrl.find(".ctrl_enabled .time").trigger("click");
            }

            // データの表示順の変更
            $("#data_select_box .data").prepend($dsort);
          }
          setTimeout(
            function (clickList) {
              var clen = clickList.length;
              for (var j = 0; j < clen; j++) {
                if (clickList[j].hasClass("sub_data")) {
                  var parentNode = clickList[j].parents(".parent");
                  parentNode.trigger("open_box");
                  parentNode.find(".sub-range").addClass("active");
                }
                if (clickList[j].hasClass("exclude")) {
                  clickList[j]
                    .parent(".tnBox2")
                    .trigger("open_box_" + clickList[j].attr("box-index"));
                  $.harpsModel.overlayMaps.add(clickList[j].attr("id"));
                } else {
                  if ($.harpsModel.util.isMobileWindow()) {
                    clickList[j].trigger("click");
                  } else {
                    clickList[j].trigger("select_data");
                    //clickList[j].find(".turnBoxButton.off").trigger("click");
                  }
                }
              }
            },
            300,
            clickList
          );
          // 遅延実行させることでタイル画像のレイヤーが表示されるのを待つ
          setTimeout(
            function (dlist) {
              $.harpsModel.overlayMaps.sort(dlist);
              $.harpsView.dataCtrl.sort(dlist);
            },
            200,
            dlist
          );
        },
        // 地図種別
        /*
        sM: function (val) {
          var mapTypeName = "map-type-c0";
          if (val === "m3" || val === "m4") {
            $("#map_select_box .map_name").eq(0).trigger("chg_map_style");
            mapTypeName = "map-type-c1";
          }
          $("#map_select_box input[type='radio']").each(function () {
            if ($(this).attr(mapTypeName) === val) {
              $(this).next(".map_name").trigger("set_map_type");
            }
          });
        },
*/
        // サイドメニューの表示状態
        sMS: function (val) {
          if (val === "false") {
            $(".side-menu").trigger("close_quick");
          } else {
            $(".side-menu").trigger("open_quick");
          }
        },
      },
    },
    /**
     * map option取得
     */
    getMapOpt: function () {
      $.harpsModel.mapOpt = $.extend(true, {}, $.harpsEnv.mapOpt);
      $.harpsModel.mapOpt = $.extend(true, $.harpsModel.mapOpt, {
        styles: $.harpsEnv.mapStyle[0],
      });
      if ($.harpsModel.viewurl.params.sS) {
        $.harpsModel.mapOpt.zoom = parseFloat($.harpsModel.viewurl.params.sS);
      }
      if ($.harpsModel.viewurl.params.sBr) {
        $.harpsModel.mapOpt.bearing = parseFloat($.harpsModel.viewurl.params.sBr);
      }
      if ($.harpsModel.viewurl.params.sPt) {
        $.harpsModel.mapOpt.pitch = parseFloat($.harpsModel.viewurl.params.sPt);
      }
      if ($.harpsModel.viewurl.params.sLt && $.harpsModel.viewurl.params.sLg) {
        $.harpsModel.mapOpt.center = [
          parseFloat($.harpsModel.viewurl.params.sLt),
          parseFloat($.harpsModel.viewurl.params.sLg),
        ];
        $.harpsModel.mapOpt.center = new mapboxgl.LngLat(
          parseFloat($.harpsModel.viewurl.params.sLg),
          parseFloat($.harpsModel.viewurl.params.sLt)
        );
      }
      return $.harpsModel.mapOpt;
    },
    /**
     * Model初期化処理
     */
    init: function () {
      $.harpsModel.storage.parse();
      $.harpsModel.viewurl.parseUrl();
      if (Object.keys($.harpsModel.viewurl.params).length == 0) {
        $.harpsModel.viewurl.parseStorage();
      }

      // MIERUNE : mapboxglの初期化処理
      //mapboxgl.accessToken = 'pk.eyJ1IjoidGFrYWhpcm8wMTI5IiwiYSI6ImNqdHpiMW1vbzI5Nzk0NG1wcXNiZGdoc3QifQ.Q2NF3B1NKJJ4GnWhsGq5Fg';
      mapboxgl.accessToken = "pk.eyJ1IjoiaGFsbG93ZWVuamFjayIsImEiOiJjazFoOHI4dHAwOXR6M21ucjc5bzBndDVqIn0.OgSEffoZwfR5b2-9QmcQKA";
      const mapOpt = $.harpsModel.getMapOpt();
      $.harpsModel.map = new mapboxgl.Map({
        container: "map",
        //style: "mapbox://styles/mapbox/streets-v11",
        //style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
        style: "mapbox://styles/halloweenjack/ck3bcbey60mdk1csw5d5v07a9",
        //地理院地図を背景にする場合
        /*
        style:{
          "version":8,
          "sources":{
            "gsi-std":{
              "type":"raster",
              //"tiles":["https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"],
              "tiles":["https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"],
              "tileSize": 256,
              "attribution":'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
            }
          },
          "layers":[
            {
              "id":"gsi-std",
              "type":"raster",
              "source":"gsi-std",
              "minzoom":5,
              "maxzoom":18,
              "paint":{
                "raster-opacity":0.9
              }
            }
          ]
        },
        */
        //center: [parseFloat($.harpsModel.viewurl.params.sLg), parseFloat($.harpsModel.viewurl.params.sLt)],

        center: mapOpt.center,
        zoom: mapOpt.zoom,
        bearing: mapOpt.bearing,
        pitch: mapOpt.pitch,
      });

      //$.harpsModel.map.setLayoutProperty('country-label', 'text-field', ['get', "name_ja"]);
      $.harpsModel.map.on("style.load", function () {
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        var popup2 = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
        });

        $.harpsModel.map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
        });
        $.harpsModel.map.setTerrain({'source': 'mapbox-dem'});

      //タイル設定の初期化
      var start = new Date();
      var latest = new Date();
      var tilesAll = $.harpsModel.tiles.getAll();
      var talen = tilesAll.length;
      for (var i = 0; i < talen; i++) {
        var tile = tilesAll[i];
        var ret = $.harpsModel.tiles.init(i, tile, start, latest);
        if (start.getTime() > ret[0].getTime()) {
          start = ret[0];
        }
        if (latest.getTime() > ret[0].getTime()) {
          latest = ret[1];
        }
        // console.log("initModel $.harpsModel.overlayMapTypes.length = " + $.harpsModel.overlayMapTypes.length);
      }

      // データ選択ボタンの初期化
      var tiles = $.harpsModel.tiles.getAllParent();
      var tLen = tiles.length;
      if ($.harpsModel.util.isMobileWindow()) {
        // モバイルメニューの場合
        for (var i = 1; i <= tLen; i++) {
          var tile = tiles[i - 1];
          if (tile.mobileOn && tile.mobileOn == true) {
            $.harpsView.dataCtrl.mobileTmpl.create(tile, i);
          }
        }
        $.harpsView.dataCtrl.mobileTmpl.slider();
      } else {
        // PCメニューの場合
        for (var i = 1; i <= tLen; i++) {
          var tile = tiles[i - 1];
          $.harpsView.dataCtrl.pcTmpl.create(tile, i);
        }
        $.harpsView.dataCtrl.pcTmpl.format();
        $.harpsView.dataCtrl.pcTmpl.slider();
      }

      //表示開始時刻、最新時刻、初期表示時刻の初期設定
      $.harpsModel.time.init(start, latest);

      // タイル画像描画
      }); // $.harpsModel.map.on("style.load", function () 

      $.harpsModel.map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 200,
        unit: 'metric'
        //position: 'top-right'
      }), 'top-right');
    },
    storage: {
      parse: function () {
        try {
          _storageJson = JSON.parse(_storage[STORAGE_KEY]);
        } catch (e) {
          _storageJson = {};
        }
      },
      save: function () {
        _storage[STORAGE_KEY] = JSON.stringify(_storageJson);
      },
      get: function (key) {
        if (_storageJson[key] != undefined) {
          // 2018.06.08 LocalStorageへの保存を再開
          // 2018.05.28 LocalStorageへの保存を一旦解除
          //        return _storageJson[key];
          return null;
          // 2018.06.08 end
        } else {
          return null;
        }
      },
      set: function (key, val) {
        _storageJson[key] = val;
        this.save();
      },
    },
    util: {
      d202d: function (val) {
        return ("0" + val).slice(-2);
      },
      date2str: function (date, format, timezone) {
        datestr = format;
        timezone = timezone ? timezone : "local";
        if (timezone === "local") {
          datestr = datestr.replace(/%Y/g, date.getFullYear());
          datestr = datestr.replace(/%m/g, $.harpsModel.util.d202d(date.getMonth() + 1));
          datestr = datestr.replace(/%d/g, $.harpsModel.util.d202d(date.getDate()));
          datestr = datestr.replace(/%H/g, $.harpsModel.util.d202d(date.getHours()));
          datestr = datestr.replace(/%M/g, $.harpsModel.util.d202d(date.getMinutes()));
          datestr = datestr.replace(/%S/g, $.harpsModel.util.d202d(date.getSeconds()));
          datestr = datestr.replace(/%s/g, date.getTime());
        } else if (timezone === "utc") {
          datestr = datestr.replace(/%Y/g, date.getUTCFullYear());
          datestr = datestr.replace(/%m/g, $.harpsModel.util.d202d(date.getUTCMonth() + 1));
          datestr = datestr.replace(/%d/g, $.harpsModel.util.d202d(date.getUTCDate()));
          datestr = datestr.replace(/%H/g, $.harpsModel.util.d202d(date.getUTCHours()));
          datestr = datestr.replace(/%M/g, $.harpsModel.util.d202d(date.getUTCMinutes()));
          datestr = datestr.replace(/%S/g, $.harpsModel.util.d202d(date.getUTCSeconds()));
          datestr = datestr.replace(/%s/g, date.getTime());
        } else if (timezone === "utc-amao") {
          // アジアオセアニア域用の時刻Format (10分おきにデータ収集される)
          datestr = datestr.replace(/%Y/g, date.getUTCFullYear());
          datestr = datestr.replace(/%m/g, $.harpsModel.util.d202d(date.getUTCMonth() + 1));
          datestr = datestr.replace(/%d/g, $.harpsModel.util.d202d(date.getUTCDate()));
          datestr = datestr.replace(/%H/g, $.harpsModel.util.d202d(date.getUTCHours()));
          datestr = datestr.replace(/%M/g, $.harpsModel.util.d202d(date.getUTCMinutes()).slice(0, 1) + "0");
          datestr = datestr.replace(/%S/g, $.harpsModel.util.d202d(date.getUTCSeconds()));
	}
        return datestr;
      },
      isort: function (arr) {
        arr.sort(function (a, b) {
          return a - b;
        });
      },
      isMobileAgent: function () {
        var ua = {};
        ua.name = window.navigator.userAgent.toLowerCase();
        ua.isIE = ua.name.indexOf("msie") >= 0 || ua.name.indexOf("trident") >= 0;
        ua.isiPhone = ua.name.indexOf("iphone") >= 0;
        ua.isiPod = ua.name.indexOf("ipod") >= 0;
        ua.isiPad = ua.name.indexOf("ipad") >= 0;
        ua.isiOS = ua.isiPhone || ua.isiPod || ua.isiPad;
        ua.isAndroid = ua.name.indexOf("android") >= 0;
        return ua.isiOS || ua.isAndroid;
      },
      isMobileWindow: function () {
        if ($.harpsEnv.mobile) {
          switch (Math.abs(window.orientation)) {
            case 0:
              if (
                window.innerWidth < $.harpsEnv.mobile.windowThreshould.width
              ) {
                return true;
              }
              break;
            case 90:
              if (
                window.innerHeight < $.harpsEnv.mobile.windowThreshould.height
              ) {
                return true;
              }
              break;
            default:
              break;
          }
        }
        return false;
      },
      getBounds: function () {
        var pos = $.harpsModel.map.getBounds();
        return {
          // コメントアウト 2019.02.25 dol-add
          // latN : pos.getNorthEast().lat(),
          // latS : pos.getSouthWest().lat(),
          // lngE : pos.getNorthEast().lng(),
          // lngW : pos.getSouthWest().lng()
          // コメントアウト 2019.02.25 dol-end
          // 2019.02.25 dol-add
          latN: pos.getNorthEast().lat,
          latS: pos.getSouthWest().lat,
          lngE: pos.getNorthEast().lng,
          lngW: pos.getSouthWest().lng,
          // 2019.02.25 dol-end
        };
      },
      pos2LatLng: function (pos, offset) {
        // 画面上の任意のピクセル座標をgooglemap上の緯度経度に変換する
        var projection = $.harpsModel.map.getProjection();
        var bounds = $.harpsModel.util.getBounds();
        // コメントアウト 2019.02.20 dol-add
        // var boundsXY = projection.fromLatLngToPoint(new google.maps.LatLng(bounds.latN, bounds.lngW));
        // 2019.02.20 dol-add
        var boundsXY = projection.fromLatLngToPoint(bounds.latN, bounds.lngW);

        // ブラウザ上のピクセル距離->googleMapの世界座標へ変換する定数(現在のズーム率に依存)
        var w = Math.pow(2, $.harpsModel.map.getZoom());
        // fromLatLngToPointの値はgoogleMap上での世界座標となるため、
        // left, topを世界座標上の距離に変換して計算する
        var newXY = {
          x: boundsXY.x + (pos.x + offset.x) / w,
          y: boundsXY.y + (pos.y + offset.y) / w,
        };
        return projection.fromPointToLatLng(newXY);
      },
    },
    tileInfo: {
      getTile: function (tileXY, zoom, ownerDocument) {
        var tileDiv = ownerDocument.createElement("div");
        var text =
          "(" +
          tileXY.x.toString() +
          "," +
          tileXY.y.toString() +
          ") [" +
          zoom.toString() +
          "]";

        tileDiv.textContent = text;
        tileDiv.style.border = "solid 1px red";
        tileDiv.style.width = "254px";
        tileDiv.style.height = "254px";
        tileDiv.style.position = "relative";

        return tileDiv;
      },
    },
    sortTimer: null,
    consoleTimer: {
      startTime: null,
      start: function (str) {
        this.startTime = new Date();
        console.log("#timer start : " + str + " :" + this.startTime);
      },
      output: function (str) {
        if (this.startTime == null) {
          return;
        }
        var current = new Date();
        var time = current.getTime() - this.startTime.getTime();
        console.log("#timer chk   : " + str + " : " + time + "ms");
      },
    },
  };
});
