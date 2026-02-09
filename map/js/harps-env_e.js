$(function(){
/**
 * HARPS Environment
 */

/**
 * 地図色の指定
 */
const MCOLOR_DARK = 0;
const MCOLOR_WHITE = 1;

// 2019.03.22 dol-add
// 地理院地図の標準地図タイル
const GSI = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
  {attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"}
);
// 地理院地図の地形図タイル
const GSI_HILL = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', { opacity: 0.5, maxNativeZoom: 16, attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>" });
// 2019.03.22 dol-end

$.harpsEnv = {
  /**
   * アプリケーションバージョン
   */
  appVersion : "1.2.3",

  /**
   * 最終更新日
   */
  lastUpdate : "2019/3/25",

  /**
   * Webアプリ表示開始日
   */
  startDate : "2015/05/11",

  /**
   * HTMLファイル名
   */
  indexHTML : "index.html",
  /**
   * 時間送りの時間間隔[秒]
   */
  interval : [
    60,
    600
//    300
  ],

  /**
   * 最新時刻のチェック間隔,自動更新のチェック間隔
   */
  autoupdate_interval : 60000, // 60秒

  /**
   * タイムゾーン指定
   *  local : PC時間
   *  utc   : 世界時
  */
  timezone : "local",

  /**
   * イベント表示のon/off
   * true:on, false:off
   */
  eventViewer : true,

  /**
   * メニューボタンのon/off
   * true:on, false:off
   */
  menu_button : {
    gps : true,
    center : true,
    playback : true
  },

  mobile : {
    /**
     * モバイル表示でautorunの有効/無効
     * true:有効, false:無効
     */
    autorun : false,

    /**
     * モバイル表示に切り替えるウィンドウサイズの閾値(px単位)
     */
    windowThreshould : {
      height : 640,
      width : 640
    },
  },
  
  // 2019.03.22 dol-add
  baseMaps : {
    gsi : GSI,
    gsiHill : GSI_HILL,
  },
  // 2019.03.22 dol-end

  /**
   * GoogleMapオプション
   */
  // コメントアウト 2019.03.22 dol-add
  // mapOpt : {
  //   zoom : 6,
  //   maxZoom   : 14,
  //   minZoom   : 5,
  //   center    : new google.maps.LatLng(35.541896, 139.250157),
  //   scaleControl : true,
  //   // 航空地図
  //   //mapTypeId : google.maps.MapTypeId.SATELLITE,
  //   // 地図
  //   //mapTypeId : google.maps.MapTypeId.ROADMAP,
  //   // 地形図
  //   mapTypeId : google.maps.MapTypeId.TERRAIN,
  //   disableDefaultUI : true,
  // },
  // コメントアウト 2019.03.22 dol-end
  // 2019.03.22 dol-add
  mapOpt : {
    zoom : 6,
    //maxZoom   : 14,
    maxZoom   : 17,
    minZoom   : 1,
    //center    : [35.541896, 139.250157],
    center    : new mapboxgl.LngLat(139.250157, 35.541896),
    zoomControl : false,
  },
  // 2019.03.22 dol-end
  
  mapStyle : [
    [
      {
        featureType : "water",
        elementType : "all",
        stylers : [
          { lightness : -80 }
        ]
      },
      {
        featureType : "water",
        elementType : "labels",
        stylers : [
          { lightness : 100 }
        ]
      }
    ],
    [
      {
        featureType : "water",
        elementType : "all",
        stylers : [
          { lightness : 0 }
        ]
      },
      {
        featureType : "water",
        elementType : "labels",
        stylers : [
          { lightness : 0 }
        ]
      }
    ],
  ],

  /**
   * AutoRun設定
   */
  autoRun : {
    //autorun_panelがonになるまでのボタン押下時間[milliseconds]
    onInterval : 500,
    //1stepあたりの時間経過秒数[seconds]
    stepVal : 60,
    //更新間隔[milliseconds]
    updateInterval : 1500,
    //画像の読み込み完了チェックを行う処理のインターバル[milliseconds]
    chkImgCompleteInterval : 1000,
    //画像の読み込み完了チェック時にOKと判断する読み込み完了画像数の割合
    //初期起動時のステップ
    defaultStep : 0,
    //AutoRunのステップ定義
    steps : [
      { level : 0, caption : "1min",   step :   1}, 
      { level : 1, caption : "2.5min", step : 2.5}, 
      { level : 2, caption : "5min",   step :   5}, 
      { level : 3, caption : "10min",  step :  10}, 
      { level : 4, caption : "30min",  step :  30}, 
      { level : 5, caption : "1h",     step :  60}, 
      { level : 6, caption : "3h",     step : 180}, 
      { level : 7, caption : "24h",    step :1440}, 
    ],
    /**
     * プレイバックボタンの再生間隔
     * stepsのlevelで指定
     */
    playbackInterval : 2,
    /**
     * プレイバックボタンの再生期間(秒)
     */
    playbackTime : 3600,
  },

  /**
   * タイル画像ディレクトリの日時フォーマット
   */
  dir_date_format : "%Y/%m/%d/%H/%M",

  /**
   * 表示するデータのタイル画像の定義
   * nameに"-"は使用不可(ViewURLの解析時に区切り文字として判別されるため)
   */
  tiles : [
    {
      name  : 'amjp',
      alt   : 'Solar radiation org color',
      label : DATA_AMJP,
      display : "tile",
      mapColor : MCOLOR_WHITE,
      cType : {
        defval : 0,
        max : 1,
      },
      url   : function(tileXY, zoom, time){
        tiles_root = "tiles/amjp/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "tiles/amao/dwn.sw.flx.sfc/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
/*
        switch($.harpsModel.tiles.info[this.name].cType){
          case 0 : 
            return "tiles/amjp/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; 
            break;
          case 1 :
            return "tiles/amjp_nict-color/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; 
            break;
          default :
            return "tiles/amjp/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; 
            break;
        }
*/
      },
/*
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
*/
      addLegend : function(tileInfo){
        var colorbarUrl;
        switch($.harpsModel.tiles.info[this.name].cType){
          case 0 :
            colorbarUrl = "img/amjp_colorbar.png";
            break;
          case 1 : 
            colorbarUrl = "img/amjp_colorbar_test2.png";
            break;
          default :
            colorbarUrl = "img/amjp_colorbar.png";
            break;
        }
        var scaleUrl = "img/amjp_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
        opacity : 0.4,
      },
      mobile : {
        opacity : {
          min : 2,
          max : 6,
        },
      },
      interval : function(){
        if($.harpsModel.time.now > new Date("2016/2/1 00:00:00")){
          return 150;
        } else {
          return 600;
        }
      },
      zindex : 50,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_latest.json",
      // 2019.03.22 dol-add

      // 2022.03.23 村永change
      // amaoをlatestに使う
      //latest_json : "tiles/amao/dwn.sw.flx.sfc/latest.json",
      latest_json : "tiles/amjp/latest.json",
      // 2022.03.23 村永change-end
      
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/1/3 23:59:59" },
        { from : "2018/2/14 00:00:00", to : "2018/2/28 03:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      exclusive : ["h8jp"],
      logo : ["#taiyo", "#ceres"],
      mobileOn : true
    },
    {
      name  : 'h8jp',
      alt   : 'HIMAWARI-8',
      label : DATA_HIMA,
      mapColor : MCOLOR_DARK,
      display : "tile",
      url   : function(zoom, time){
        tiles_root = "tiles/h8jp/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "tiles/h8ao/band13/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },

      url   : function(tileXY, zoom, time){ return "tiles/h8jp/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },

      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 150},
      zindex : 49,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.25 dol-add
      // latest_json : "json/latest/h8jp_latest.json",
      // 2019.03.25 dol-add
      latest_json : "tiles/h8jp/latest.json",
      start : new Date("2016/12/20 09:00:00"),
      disable : [
        { from : "2015/8/2 00:00:00", to : "2018/3/31 23:59:59" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      exclusive : ["amjp"],
      logo : ["#ceres"],
      mobileOn : true
    },
    {
      name  : 'wni',
      alt   : 'WNI',
      label : DATA_WNI,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(tileXY, zoom, time){ return "tiles/wni/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(0,8) + "/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(8,12) + "/" + zoom.toString() + "_" + tileXY.x.toString() + "_" + tileXY.y.toString() + ".png"; },

      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/wni_colorbar.png";
        var scaleUrl = "img/wni_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 1.0
      },
      interval : function(){return 300},
      zindex : 45,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 9,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/wni_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/wni/latest.json",
      start : new Date("2015/05/11 09:00:00"),
      disable : [
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#wni"],
      mobileOn : false 
    },
    {
      name  : 'amjp_temp',
      alt   : 'AMJP_TEMP',
      label : DATA_AMJP_TEMP,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(zoom, time){
        //return "tiles/amjp_veda02_sshfs/tsfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = "tiles/amjp_veda02_sshfs/tsfc/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "tiles/amao/tsfc/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_temp_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 600},
      zindex : 55,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_temp_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/tsfc/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_humidity',
      alt   : 'AMJP_HUMIDITY',
      label : DATA_AMJP_HUMIDITY,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      //url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/rh.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      url   : function(zoom, time){
        //return "tiles/amjp_veda02_sshfs/rh.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = "tiles/amjp_veda02_sshfs/rh.sfc/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "tiles/amao/rh.sfc/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_humidity_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 600},
      zindex : 56,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_humidity_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/rh.sfc/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_wnd',
      alt   : 'AMJP_WND',
      label : DATA_AMJP_WND,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      //url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/wnd/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      url   : function(zoom, time){
        //return "tiles/amjp_veda02_sshfs/wnd/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = "tiles/amjp_veda02_sshfs/wnd/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "tiles/amao/wnd/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/wnd_colorbar.png";
        var scaleUrl = "img/wnd_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 600},
      zindex : 58,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 11,
      sortable : true,
      update : true,
      transparent : true,
      latest_json : "tiles/amjp_veda02_sshfs/wnd/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
/*
    {
      name  : 'amjp_wndmznl',
      alt   : 'AMJP_WNDMZNL',
      label : DATA_AMJP_WNDMZNL,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/wnd.mznl.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_temp_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 600},
      zindex : 57,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_wndmznl_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/wnd.mznl.sfc/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_wndspd',
      alt   : 'AMJP_WNDSPD',
      label : DATA_AMJP_WNDSPD,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/wnd.spd.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_wndspd_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 600},
      zindex : 58,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_wndspd_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/wnd.spd.sfc/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
*/
    {
      name  : 'amjp_pvp',
      alt   : 'AMJP_PVP',
      label : DATA_AMJP_PVP,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/unit.pvp.tc028.ac000.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_pvp_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 150},
      zindex : 59,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_pvp_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/unit.pvp.tc028.ac000.sfc/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/5/22 00:00:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_noct',
      alt   : 'AMJP_NOCT',
      label : DATA_AMJP_NOCT,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(tileXY, zoom, time){ return "tiles/amjp_veda02_sshfs/noct/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
      getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
        return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
      },
      addLegend : function(tileInfo){
        var colorbarUrl = "img/amjp_colorbar.png";
        var scaleUrl = "img/amjp_noct_colorbar_scale.png";
        var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
        $("#legend").append($legend);
      },
      style : {
      opacity : 0.6
      },
      interval : function(){return 150},
      zindex : 60,
      zoom_min : 5,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/amjp_noct_latest.json",
      // 2019.03.22 dol-add
      latest_json : "tiles/amjp_veda02_sshfs/noct/latest.json",
      start : new Date("2016/08/05 03:00:00"),
      disable : [
        { from : "2016/8/6 00:00:00", to : "2016/8/7 23:59:59" },
        { from : "2016/8/10 00:00:00", to : "2016/11/23 23:59:59" },
        { from : "2016/11/25 00:00:00", to : "2017/1/15 23:59:59" },
        { from : "2017/01/17 00:00:00", to : "2017/1/19 23:59:59" },
        { from : "2017/1/21 00:00:00", to : "2017/1/22 23:59:59" },
        { from : "2017/1/25 00:00:00", to : "2017/2/8 23:59:59" },
        { from : "2017/2/10 00:00:00", to : "2018/9/12 23:59:59" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
/* 2018.07.23 反射強度のみにする
      name : "radar",
      alt : "RADAR",
      label : DATA_RADAR,
      sortable : true,
      update : true,
      logo : ["#jrc", "#kochi"],
      children : {
        selected : ["mprd_pv_22", "jrrd_pv_22"],
        getNode : function(){return this.node},
        node : [
          {
            name  : 'mprd_pv_22',
            alt   : 'KOCHI Radar (2.2, dBZ)',
            label : DATA_MPRD_PV,
*/
            name : "radar",
            alt : "RADAR",
            label : DATA_RADAR,
            logo : ["#jrc", "#kochi"],

            display : "tile",
            url   : function(tileXY, zoom, time){
              return "tiles/mprd/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format) + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
            getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
              return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
            },
            addLegend : function(tileInfo){
              var colorbarUrl = "img/radar_colorbar.png";
              var scaleUrl = "img/radar_colorbar_scale.png";
              var $legend = $("<div class=\"" + this.name + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
              $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_" + tileInfo.opacity.toString());
              $("#legend").append($legend);
            },
            style : {
              opacity : 0.4
            },
            interval : function(){return 60},
            zindex : 39,
            zoom_min : 5,
            zoom_max : 14,
            zoom_enlarge_src : 11,
            sortable : true,
            update : true,
            transparent : true,
            circle : {
              cname : "mprd",
              center : {lat : "33.54945", lng : "133.486"},
              icon : {
                url : "img/icon_radar_center.svg",
                size : {
                  "5"  : 15,
                  "6"  : 18,
                  "7"  : 20,
                  "8"  : 20,
                  "9"  : 24,
                  "10" : 26,
                  "11" : 30,
                  "12" : 32,
                  "13" : 36,
                  "14" : 40,
                },
                anchor : {
                  x : function(size){return size / 2;},
                  y : function(size){return size / 4 * 3;}
                }
              },
              img : "img/circle_1024x1024.svg",
            },
            latest_json : "json/latest/mprd_latest.json",
            start : new Date("2016/02/29 15:00:00"),
            disable : [
              { from : "2016/3/18 00:00:00", to : "2016/6/20 10:20:59" },
              { from : "2016/7/12 00:00:00", to : "2017/11/6 23:59:59" },
              { from : "2018/2/14 00:00:00", to : "2018/5/29 23:59:59" },
              { from : "2018/6/1 11:30:00", to : "2018/6/5 12:40:00" }
            ],
            latlng : {
/*
              latN : 34.2681,
              latS : 32.8308,
              lngW : 132.624,
              lngE : 134.348,
*/
// 5レーダ合成画像の四隅
              latN : 34.2788,
              latS : 32.5035,
              lngW : 132.6190,
              lngE : 134.3578,
            },
            //exclusive : ["mprd_rz_22"],
/*
          },
          {
            name  : 'mprd_rz_22',
            alt   : 'KOCHI Radar (2.2, m/s)',
            label : DATA_MPRD_RZ,
            display : "tile",
            url   : function(tileXY, zoom, time){ return "tiles/mprd_rz_2.2/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format) + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
            getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
          return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
            },
            style : {
              opacity : 0.4
            },
            interval : function(){return 600},
            zindex : 38,
            zoom_min : 5,
            zoom_max : 14,
            zoom_enlarge_src : 11,
            sortable : true,
            update : true,
            transparent : true,
            circle : {
              cname : "mprd",
              center : {lat : "33.54945", lng : "133.486"},
              icon : {
                url : "img/icon_radar_center.svg",
                size : {
                  "5"  : 15,
                  "6"  : 18,
                  "7"  : 20,
                  "8"  : 20,
                  "9"  : 24,
                  "10" : 26,
                  "11" : 30,
                  "12" : 32,
                  "13" : 36,
                  "14" : 40,
                },
                anchor : {
                  x : function(size){return size / 2;},
                  y : function(size){return size / 4 * 3;}
                }
              },
              img : "img/circle_1024x1024.svg",
            },
            latest_json : "json/latest/mprd_rzh1_2.2_latest.json",
            start : new Date("2016/02/29 15:00:00"),
            disable : [
              { from : "2016/3/18 00:00:00", to : "2016/6/20 10:20:59" },
              { from : "2016/7/12 00:00:00", to : "2017/11/6 23:59:59" },
              { from : "2018/2/14 00:00:00", to : "2018/5/29 23:59:59" },
              { from : "2018/6/1 11:30:00", to : "2018/6/5 12:40:00" }
            ],
            latlng : {
              latN : 34.2681,
              latS : 32.8308,
              lngW : 132.624,
              lngE : 134.348,
            },
            exclusive : ["mprd_pv_22"],
          },
*/

/*
          {
            name  : 'jrrd_pv_22',
            alt   : 'JRC Radar (2.2, dBZ)',
            label : DATA_JRRD_PV,
            display : "tile",
            url   : function(tileXY, zoom, time){
              return "tiles/jrrd_pv_2.2/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format) + "/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png"; },
            getTile : function(tileXY, zoom, ownerDocument, tileName, overlayMap){
              return $.harpsModel.overlayMaps._getTileEnlarge(tileXY, zoom, ownerDocument, tileName, overlayMap);
            },
            style : {
              opacity : 0.4
            },
            interval : function(){return 60},
            zindex : 29,
            zoom_min : 5,
            zoom_max : 14,
            zoom_enlarge_src : 11,
            sortable : true,
            update : true,
            transparent : true,
            circle : {
              cname : "jrrd",
              center : {lat : "34.99138889", lng : "139.8405556"},
              icon : {
                url : "img/icon_radar_center.svg",
                size : {
                  "5"  : 15,
                  "6"  : 18,
                  "7"  : 20,
                  "8"  : 20,
                  "9"  : 24,
                  "10" : 26,
                  "11" : 30,
                  "12" : 32,
                  "13" : 36,
                  "14" : 40,
                },
                anchor : {
                  x : function(size){return size / 2;},
                  y : function(size){return size / 4 * 3;}
                }
              },
              img : "img/circle_1024x1024.svg",
            },
            latest_json : "json/latest/jrrd_pvh0_2.2_latest.json",
            start : new Date("2016/03/30 12:00:00"),
            disable : [
              {
                from : "2016/4/22 17:23:00",
                to   : "2016/6/7 12:29:59"
              },
              {
                from : "2016/6/24 10:54:00",
                to   : "2016/6/29 12:49:59"
              }
            ],
            latlng : {
              latN : 35.71004083,
              latS : 34.27273639,
              lngW : 138.9633325,
              lngE : 140.7177783,
            },
          },
        ]
      }
*/
    },
    {
      name : "wwarn",
      alt  : "wwarn",
      label : DATA_WEATHER_WARNING,
      display : "marker",
      locations : [
        "json/cps_weather/location-prefecture.json",
        "json/cps_weather/location-all.json",
      ],
      interval : function(){return 300;},
      // コメントアウト 2019.03.22 dol-add
      // latest_json : "json/latest/wwarn_latest-time.json",
      // 2019.03.22 dol-add
      latest_json : "json/cps_weather/latest-time.json",
      jsonname : "%Y/%m/%d/%Y%m%d%H%M.json",
      jsonurl : function(time){
        jtime = new Date(time.getTime() - time.getTime() % 300000)
        return "json/cps_weather/" + $.harpsModel.util.date2str(jtime, this.jsonname); 
      },
      start : new Date("2016/03/15 09:00:00"),
      disable : [],
      addMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.wwarn.addMarker(zoom, tile);
      },
      removeMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.wwarn.removeMarker(zoom, tile);
      },
      updateMethod : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.wwarn.updateWarnings(zoom, tile)
      },
      updateLock : function(){
        return $.harpsModelLocalHIMAWARI.wwarn.updateLock;
      },
      style : {},
      zindex : 1,
      zoom_min : 5,
      zoom_max : 14,
      sortable : false,
      update : true,
      transparent : false,
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#nii"],
      mobileOn : true
    },
    {
      name  : 'dam_map',
      alt   : 'Dam Map',
      label : DATA_DAMM,
      display : "tile",
      url   : function(tileXY, zoom, time){ 
        return "tiles/damm/" + zoom.toString() + "/" + tileXY.x.toString() + "/" + tileXY.y.toString() + ".png";
      },
      style : {
        opacity : 0.4,
      },
      interval : function(){return 0},
      zindex : 18,
      zoom_min : 5,
      zoom_max : 14,
      sortable : true,
      update : false,
      transparent : true,
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#dam"]
    },
    {
      name : "amedas",
      alt  : "amedas",
      label : DATA_AMEDAS,
      display : "marker",
      locations : [
        "json/amedas/test_st.json",
        "json/amedas/test_a.json",
      ],
      interval : function(){
        return 300;
      },
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/wwarn_latest-time.json",
      // 2019.03.06 dol-add
      latest_json : "json/amedas/latest-time.json",
      jsonname : "%Y/%m/%d/%Y%m%d%H%M.json",
      jsonurl : function(time){
        jtime = new Date(time.getTime() - time.getTime() % 300000)
        //return "json/amedas/" + $.harpsModel.util.date2str(jtime, this.jsonname);
        return "json/amedas/location.json";
      },
      start : new Date("2000/01/01 00:00:00"),
      disable : [],
      addMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amedas.addMarker(zoom, tile);
      },
      removeMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amedas.removeMarker(zoom, tile);
      },
      updateMethod : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amedas.updateMarker(zoom, tile)
      },
      updateLock : function(){
        return $.harpsModelLocalHIMAWARI.amedas.updateLock;
      },
      style : {},
      zindex : 1,
      zoom_min : 4,
      zoom_max : 14,
      sortable : true,
      update : false,
      transparent : false,
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      logo : ["#nii"],
      mobileOn : false
    },
  ],
  /**
   * 画像が存在しない場合に出力する画像
   */
  blankImg : 'img/blank.png',
  /**
   * 初期表示データ
   */
  defaultMaps : [
    "amjp", "wwarn"
  ],
  /**
   * 最新時刻を設定するデータ
   */
  timeIndicator : "amjp",
  /**
   * amedas関連の設定
   */
  amedas : {
    /**
     * AMEDAS STARStouchのURL
     */
    linePlotURL : "starstouch",
    /**
     * AMEDAS STARStouchの設定値
     */
    viewURL : {
      missionID : "M910000",
      teamID : "T910100",
      dataID : {
        rainfall : "D910201",
        temperature : "D910202",
        windSpeed : "D910203",
        dayLength : "D910204",
      },
      subComponent : {
        mean : 0,
        max  : 2
      }
    },
    /**
     * AMEDAS STARStouchのダイアログ高さの最大値
     */
    dialogHeightMax : 760,
    /**
     * AMeDASの拠点表示imgファイル
     */
    iconImg : {
      url : [
        "img/marker_icon_gray.svg",
        "img/marker_icon_lightblue.svg",
      ],
      size : {
        "5" : 8, "6" : 8, "7" : 8, "8" : 12, "9" : 12,
        "10" : 16,  "11" : 16, "12" : 24, "13" : 24, "14" : 32
      }
    }
  },
  /**
   * 気象警報関連の設定
   */
  wwarn : {
    /**
     * 広域表示 / 地域詳細表示を切り替えるズームレベル
     * このズームレベルより大きい場合に地域詳細表示になる
     */
    zoomLevelBorder : 7,
    /**
     * 気象警報のcodeと警告レベルの対応
     *  =1 : 注意報
     *  =2 : 警報 
     *  =3 : 特別警報 
     */
    code : {
      "00" : { level : 1, name : "Canceled", type : "normal"}, "02" : { level : 2, name : "Blizzard", type : "snowstorm"},
      "03" : { level : 2, name : "Heavy Rain", type : "rain"}, "04" : { level : 2, name : "Flood", type : "flood"},
      "05" : { level : 2, name : "Windstorm", type : "storm"}, "06" : { level : 2, name : "Heavy Snow", type : "snow"},
      "07" : { level : 2, name : "High Waves", type : "wave"}, "08" : { level : 2, name : "Storm Surge", type : "surge"},
      "10" : { level : 1, name : "Heavy Rain", type : "rain"}, "12" : { level : 1, name : "Heavy Snow", type : "snow"},
      "13" : { level : 1, name : "Snowstorm", type : "snowstorm"}, "14" : { level : 1, name : "Thunderbolt", type : "lightning"},
      "15" : { level : 1, name : "Gale", type : "storm"}, "16" : { level : 1, name : "High Waves", type : "wave"},
      "17" : { level : 1, name : "Snowmelt", type : "snow_melting"}, "18" : { level : 1, name : "Flood", type : "flood"},
      "19" : { level : 1, name : "Storm Surge", type : "surge"}, "20" : { level : 1, name : "Dense Fog", type : "fog"},
      "21" : { level : 1, name : "Dry Air", type : "drying"}, "22" : { level : 1, name : "Snowslide", type : "avalanche"},
      "23" : { level : 1, name : "Low Temperature", type : "low_temp"}, "24" : { level : 1, name : "Hoarfrost", type : "frost"},
      "25" : { level : 1, name : "Ice Accretion", type : "ice_accretion"}, "26" : { level : 1, name : "Snow Accretion", type : "snow_accretion"},
      "27" : { level : 1, name : "Other", type : "other"}, "32" : { level : 3, name : "Blizzard", type : "snowstorm"},
      "33" : { level : 3, name : "Heavy Rain", type : "rain"}, "35" : { level : 3, name : "Windstorm", type : "storm"},
      "36" : { level : 3, name : "Heavy Snow", type : "snow"}, "37" : { level : 3, name : "High Waves", type : "wave"},
      "38" : { level : 3, name : "Storm Surge", type : "surge"},
    },
    /**
     * 注意報・警報が発令されていない場合の表示名
     */
    displayCode : {
      "snowstorm" : "Snowstorm",
      "rain" : "Heavy Rain",
      "flood" : "Flood",
      "storm" : "Gale",
      "snow" : "Heavy Rain",
      "wave" : "High Waves",
      "surge" : "Storm Surge",
      "lightning" : "Thunderbolt",
      "snow_melting" : "Snowmelt",
      "fog" : "Dense Fog",
      "drying" : "Dry Air",
      "avalanche" : "Snowslide",
      "low_temp" : "Low Temperature",
      "frost" : "Hoarfrost",
      "ice_accretion" : "Ice Accretion",
      "snow_accretion" : "Snow Accretion"
    },
    codeClass : ["normal", "adovisoly", "warning", "special_warning" ],
    /**
     * アイコンimgファイル
     */
    iconImg : {
      // 警報レベルごとのアイコン画像
      url : [
        "img/weather_normal.png",
        "img/weather_advisory2.png",
        "img/weather_warning2.png",
        "img/weather_special-warning2.png",
      ],
      size : {
        "5" : 15, "6" : 20, "7" : 26, "8" : 16, "9" : 20,
        "10" : 22,  "11" : 22, "12" : 26, "13" : 30, "14" : 32
      }
    }
  },
};

});
