$(function(){
/**
 * HARPS Environment
 */

/**
 * API Base URL
 * ローカル開発時: "https://sc-gis.nict.go.jp"
 * 本番環境: ""
 */
const API_BASE_URL = "";

/**
 * 地図色の指定
 */
const MCOLOR_DARK = 0;
const MCOLOR_WHITE = 1;

$.harpsEnv = {
  /**
   * アプリケーションバージョン
   */
  appVersion : "2.0.0",

  /**
   * 最終更新日
   */
  lastUpdate : "2022/11/7",

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
  autoupdate_interval : 5000, // 5秒

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
  //eventViewer : true,

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
  
  mapOpt : {
    zoom : 6,
    maxZoom   : 17,
    minZoom   : 1,
    center    : new mapboxgl.LngLat(139.250157, 35.541896),
    bearing   : 0,
    pitch     : 0,
    zoomControl : false,
  },
  
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
      url   : function(zoom, time){
        console.log("Solar radiation org color : zoom " + zoom + " time = " + time + " - " + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc"));
        tiles_root = API_BASE_URL + "/api/amaterass_jp/data/";

        timezone = "utc";
        if (zoom < 5) {
          tiles_root = API_BASE_URL + "/api/amaterass_ao/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      addLegend : function(tileInfo){
        console.log("env.addLegend " + this.name);
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
      zoom_min : 1,
      //zoom_max : 14,
      zoom_max : 17,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.06 dol-add
//      latest_json : "json/latest/amjp_latest.json",
      // 2019.03.06 dol-add

      // 2022.03.23 村永change
      // amaoをlatestに使う
      //latest_json : "/api/amaterass_jp/latest/latest.json",
      latest_json : API_BASE_URL + "/api/amaterass_ao/latest/latest.json",
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
      exclusive : ["h8jp", "wni"],
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
        //return "tiles/h8jp/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = API_BASE_URL + "/api/himawari-8_ao/data/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = API_BASE_URL + "/api/himawari-8_ao/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      style : {
        opacity : 0.4
      },
      interval : function(){return 150},
      zindex : 49,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      //latest_json : "json/latest/h8jp_latest.json",
      //latest_json : "/api/himawari-8_jp/latest/latest.json",
      latest_json : API_BASE_URL + "/api/himawari-8_ao/latest/latest.json",
      start : new Date("2016/12/20 09:00:00"),
      disable : [
        { from : "2015/8/2 00:00:00", to : "2018/3/31 23:59:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      exclusive : ["amjp", "amjp_temp", "amjp_humidity", "amjp_wnd", "wni"],
      logo : ["#ceres"],
      mobileOn : true
    },
/*
    {
      name  : 'h8jp_b13',
      alt   : 'HIMAWARI-8_B13',
      label : DATA_HIMA_B13,
      mapColor : MCOLOR_DARK,
      display : "tile",
      url   : function(zoom, time){
        //return "tiles/h8jp/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = "/api/himawari-8_ao/band13/data/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = "/api/himawari-8_ao/band13/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
      },
      style : {
        opacity : 0.4
      },
      interval : function(){return 150},
      zindex : 49,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // latest_json : "json/latest/h8jp_latest.json",
      latest_json : "/api/himawari-8_ao/latest/latest.json",
      start : new Date("2016/12/20 09:00:00"),
      disable : [
        { from : "2015/8/2 00:00:00", to : "2018/3/31 23:59:00" }
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      exclusive : ["amjp", "amjp_temp", "amjp_humidity", "amjp_wnd", "wni"],
      logo : ["#ceres"],
      mobileOn : true
    },
*/
    {
      name  : 'wni',
      alt   : 'WNI',
      label : DATA_WNI,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(zoom, time){
        //return "tiles/wni/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(0,8) + "/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(8,12) + "/{z}/{x}/{y}.png";
        return API_BASE_URL + "/api/weather_wni/data/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(0,8) + "/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc").replace(/\//g, "").substring(8,12) + "/{z}/{x}/{y}.png";
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
      interval : function(){
        return 300;
      },
      zindex : 45,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 9,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/wni_latest.json",
      // 2019.03.06 dol-add
      latest_json : API_BASE_URL + "/api/weather_wni/latest/latest.json",
      start : new Date("2015/05/11 09:00:00"),
      disable : [
      ],
      latlng : {
        latN : 47.6,
        latS : 22.4,
        lngW : 120,
        lngE : 150,
      },
      exclusive : ["amjp", "amjp_temp", "amjp_humidity", "amjp_wnd", "h8jp"],
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
        tiles_root = API_BASE_URL + "/api/temperture_jp/data/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = API_BASE_URL + "/api/temperture_ao/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
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
      interval : function(){
        return 600;
      },
      zindex : 55,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/amjp_temp_latest.json",
      // 2019.03.06 dol-add
      //latest_json : "/api/temperture_jp/latest/latest.json",
      latest_json : API_BASE_URL + "/api/temperture_ao/latest/latest.json",
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
      exclusive : ["h8jp", "wni"],
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_humidity',
      alt   : 'AMJP_HUMIDITY',
      label : DATA_AMJP_HUMIDITY,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(zoom, time){
        //return "tiles/amjp_veda02_sshfs/rh.sfc/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = API_BASE_URL + "/api/humidity_jp/data/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = API_BASE_URL + "/api/humidity_ao/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
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
      interval : function(){
        return 600;
      },
      zindex : 56,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 10,
      sortable : true,
      update : true,
      transparent : true,
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/amjp_humidity_latest.json",
      // 2019.03.06 dol-add
      //latest_json : "/api/humidity_jp/latest/latest.json",
      latest_json : API_BASE_URL + "/api/humidity_ao/latest/latest.json",
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
      exclusive : ["h8jp", "wni"],
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name  : 'amjp_wnd',
      alt   : 'AMJP_WND',
      label : DATA_AMJP_WND,
      mapColor : MCOLOR_WHITE,
      display : "tile",
      url   : function(zoom, time){
        //return "tiles/amjp_veda02_sshfs/wnd/" + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, "utc") + "/{z}/{x}/{y}.png";
        tiles_root = API_BASE_URL + "/api/wind_jp/data/";
        timezone = "utc";
        if (zoom < 5) {
          tiles_root = API_BASE_URL + "/api/wind_ao/data/";
          timezone = "utc-amao";
        }
        return tiles_root + $.harpsModel.util.date2str(time, $.harpsEnv.dir_date_format, timezone) + "/{z}/{x}/{y}.png";
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
      interval : function(){
        return 600
      },
      zindex : 58,
      zoom_min : 1,
      zoom_max : 14,
      zoom_enlarge_src : 11,
      sortable : true,
      update : true,
      transparent : true,
      //latest_json : "/api/wind_jp/latest/latest.json",
      latest_json : API_BASE_URL + "/api/wind_ao/latest/latest.json",
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
      exclusive : ["h8jp", "wni"],
      logo : ["#taiyo", "#ceres"],
      mobileOn : false
    },
    {
      name : "wwarn",
      alt  : "wwarn",
      label : DATA_WEATHER_WARNING,
      display : "marker",
      locations : [
        API_BASE_URL + "/api/weather_warn/latest/location-prefecture.json",
        API_BASE_URL + "/api/weather_warn/latest/location-all.json",
      ],
      interval : function(){
        return 300;
      },
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/wwarn_latest-time.json",
      // 2019.03.06 dol-add
      latest_json : API_BASE_URL + "/api/weather_warn/latest/latest-time.json",
      jsonname : "%Y/%m/%d/%Y%m%d%H%M.json",
      jsonurl : function(time){
        jtime = new Date(time.getTime() - time.getTime() % 300000)
        return API_BASE_URL + "/api/weather_warn/data/" + $.harpsModel.util.date2str(jtime, this.jsonname);
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
      zoom_min : 4,
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
    /*
    {
      name  : 'dam_map',
      alt   : 'Dam Map',
      label : DATA_DAMM,
      display : "tile",
      url   : function(zoom, time){ 
        return "/api/dam_map/{z}/{x}/{y}.png";
      },
      style : {
        opacity : 0.4,
      },
      interval : function(){
        return 0
      },
      zindex : 18,
      zoom_min : 4,
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
    */
    {
      name : "amedas",
      alt  : "amedas",
      label : DATA_AMEDAS,
      display : "marker",
      locations : [
        API_BASE_URL + "/api/amedas/test_st.json",
        API_BASE_URL + "/api/amedas/test_a.json",
      ],
      interval : function(){
        return 300;
      },
      // コメントアウト 2019.03.06 dol-add
      // latest_json : "json/latest/wwarn_latest-time.json",
      // 2019.03.06 dol-add
      latest_json : API_BASE_URL + "/api/amedas/latest-time.json",
      jsonname : "%Y/%m/%d/%Y%m%d%H%M.json",
      jsonurl : function(point1, point2, point3, point4, time){
        //jtime = new Date(time.getTime() - time.getTime() % 300000)
        //return "json/amedas/" + $.harpsModel.util.date2str(jtime, this.jsonname);

        var param = "point_1=" + point1.lng + "," + point1.lat + "&"
        param    += "point_2=" + point2.lng + "," + point2.lat + "&"
        param    += "point_3=" + point3.lng + "," + point3.lat + "&"
        param    += "point_4=" + point4.lng + "," + point4.lat

        return API_BASE_URL + "/api/amedas_location?" + param;
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
      zoom_min : 6,
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
      exclusive : ["amjp_point"],
      mobileOn : false
    },
    {
      name : "amjp_point",
      alt  : "amjp_point",
      label : DATA_AMJP_POINT,
      display : "marker",
      locations : [
        API_BASE_URL + "/api/amjp_point/test_st.json",
        API_BASE_URL + "/api/amjp_point/test_a.json",
      ],
      interval : function(){
        return 300;
      },
      latest_json : API_BASE_URL + "/api/amjp_point/latest-time.json",
      jsonname : "%Y/%m/%d/%Y%m%d%H%M.json",
      jsonurl : function(point1, point2, point3, point4, time){
        var param = "point_1=" + point1.lng + "," + point1.lat + "&"
        param    += "point_2=" + point2.lng + "," + point2.lat + "&"
        param    += "point_3=" + point3.lng + "," + point3.lat + "&"
        param    += "point_4=" + point4.lng + "," + point4.lat

        return API_BASE_URL + "/api/amjp_point?" + param;
      },
      start : new Date("2000/01/01 00:00:00"),
      disable : [],
      addMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amjpPoint.addMarker(zoom, tile);
      },
      removeMarker : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amjpPoint.removeMarker(zoom, tile);
      },
      updateMethod : function(zoom, tile){
        $.harpsModelLocalHIMAWARI.amjpPoint.updateMarker(zoom, tile)
      },
      updateLock : function(){
        return $.harpsModelLocalHIMAWARI.amjpPoint.updateLock;
      },
      style : {},
      zindex : 1,
      zoom_min : 6,
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
      logo : ["#taiyo", "#ceres"],
      exclusive : ["amedas"],
      mobileOn : false
    },
    /**
     * Camera Layer
     */
    {
      name: "camera",
      alt: "camera",
      label: DATA_CAMERA,
      display: "marker",
      locations: [], // Managed by internal logic
      interval: function() { return 300; },
      start: new Date("2000/01/01 00:00:00"),
      disable: [],
      addMarker: function(zoom, tile) {
        $.harpsModelLocalHIMAWARI.camera.init(zoom, tile);
      },
      removeMarker: function(zoom, tile) {
        $.harpsModelLocalHIMAWARI.camera.removeLayer();
      },
      updateMethod: function(zoom, tile) {
        $.harpsModelLocalHIMAWARI.camera.update();
      },
      updateLock: function() { return false; },
      style: {},
      zindex: 100, // Top layer
      zoom_min: 1,
      zoom_max: 20,
      sortable: true,
      update: true,
      transparent: false,
      mobileOn: true
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
        "img/marker_icon_lightblue.svg",
        "img/marker_icon_red.svg",
        //"img/marker_icon_lightblue.svg",
//        "img/marker_icon_red.svg",
      ],
      size : {
        "5" : 8, "6" : 12, "7" : 12, "8" : 16, "9" : 16,
        "10" : 16,  "11" : 24, "12" : 24, "13" : 32, "14" : 36
      }
    },
    /**
     * AMeDAS拠点の矩形選択可能件数
     */
    maxSelect : 20
  },
  amjpPoint : {
    /**
     * Amaterassの地点表示imgファイル
     */
    iconImg : {
      url : [
        "img/marker_icon_orange.svg",
        "img/marker_icon_orange.svg",
        //"img/marker_icon_lightblue.svg",
        //"img/marker_icon_blue.png",
        //"img/marker_icon_lightblue.svg",
//        "img/marker_icon_red.svg",
      ],
      size : {
        "5" : 8, "6" : 12, "7" : 12, "8" : 16, "9" : 16,
        "10" : 16,  "11" : 24, "12" : 24, "13" : 32, "14" : 36
      }
    },
    /**
     * Amaterassの矩形選択可能件数
     */
    maxSelect : 20
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
      "00" : { level : 1, name : "解除", type : "normal"}, "02" : { level : 2, name : "暴風雪", type : "snowstorm"},
      "03" : { level : 2, name : "大雨", type : "rain"}, "04" : { level : 2, name : "洪水", type : "flood"},
      "05" : { level : 2, name : "暴風", type : "storm"}, "06" : { level : 2, name : "大雪", type : "snow"},
      "07" : { level : 2, name : "波浪", type : "wave"}, "08" : { level : 2, name : "高潮", type : "surge"},
      "10" : { level : 1, name : "大雨", type : "rain"}, "12" : { level : 1, name : "大雪", type : "snow"},
      "13" : { level : 1, name : "風雪", type : "snowstorm"}, "14" : { level : 1, name : "雷", type : "lightning"},
      "15" : { level : 1, name : "強風", type : "storm"}, "16" : { level : 1, name : "波浪", type : "wave"},
      "17" : { level : 1, name : "融雪", type : "snow_melting"}, "18" : { level : 1, name : "洪水", type : "flood"},
      "19" : { level : 1, name : "高潮", type : "surge"}, "20" : { level : 1, name : "濃霧", type : "fog"},
      "21" : { level : 1, name : "乾燥", type : "drying"}, "22" : { level : 1, name : "なだれ", type : "avalanche"},
      "23" : { level : 1, name : "低温", type : "low_temp"}, "24" : { level : 1, name : "霜", type : "frost"},
      "25" : { level : 1, name : "着氷", type : "ice_accretion"}, "26" : { level : 1, name : "着雪", type : "snow_accretion"},
      "27" : { level : 1, name : "その他", type : "other"}, "32" : { level : 3, name : "暴風雪", type : "snowstorm"},
      "33" : { level : 3, name : "大雨", type : "rain"}, "35" : { level : 3, name : "暴風", type : "storm"},
      "36" : { level : 3, name : "大雪", type : "snow"}, "37" : { level : 3, name : "波浪", type : "wave"},
      "38" : { level : 3, name : "高潮", type : "surge"},
    },
    /**
     * 注意報・警報が発令されていない場合の表示名
     */
    displayCode : {
      "snowstorm" : "風雪",
      "rain" : "大雨",
      "flood" : "洪水",
      "storm" : "強風",
      "snow" : "大雪",
      "wave" : "波浪",
      "surge" : "高潮",
      "lightning" : "雷",
      "snow_melting" : "融雪",
      "fog" : "濃霧",
      "drying" : "乾燥",
      "avalanche" : "なだれ",
      "low_temp" : "低温",
      "frost" : "霜",
      "ice_accretion" : "着氷",
      "snow_accretion" : "着雪"
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
        "1" : 0, "2" : 0, "3" : 5, "4" : 10,
        "5" : 15, "6" : 20, "7" : 26, "8" : 16, "9" : 20,
        "10" : 22,  "11" : 22, "12" : 26, "13" : 30, "14" : 32
      }
    }
  },
};

/**starstouch対応*/
  $.Env = {
    showTimeZone : "JST"
  };

});
