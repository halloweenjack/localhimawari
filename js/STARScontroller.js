/******************************************************************************/
/* Sample for k2goTimeline                                                    */
/* halloweenjack inc.                                                         */
/******************************************************************************/
/******************************************************************************/
/*  STARScontroller_getPosition                                               */
/******************************************************************************/
function STARScontroller_getPosition(){
  var pMap = $('#map')[0].contentWindow.getMap();
  if(!pMap){
    return null;
  }

  var objCenter = pMap.getCenter();
  var objBounds = pMap.getBounds();
  var objResult = {center:{lat:0, lng:0}};

  if (objCenter && objBounds) {
    var objSouthWest = objBounds.getSouthWest();
    var objNorthEast = objBounds.getNorthEast();

    objResult.center.lat = objCenter.lat;
    objResult.center.lng = objCenter.lng;

    objResult.north      = objNorthEast.lat;
    objResult.east       = objNorthEast.lng;
    objResult.south      = objSouthWest.lat;
    objResult.west       = objSouthWest.lng;

    objResult.zoom       = pMap.getZoom();
    objResult.direction  = pMap.getBearing();
    objResult.pitch      = pMap.getPitch();

    console.log("STARScontroller_getPosition", objResult);
    return objResult;
  } else {
    return null;
  }
}
/******************************************************************************/
/*  STARScontroller_setPosition                                               */
/******************************************************************************/
function STARScontroller_setPosition(pPosition){
  console.log("STARScontroller_setPosition", pPosition);
  if(pPosition == undefined || pPosition == null) {
    return;
  }
  $('#map')[0].contentWindow.setPosition(pPosition);
}
/******************************************************************************/
/*  STARScontroller_getDate                                                   */
/******************************************************************************/
function STARScontroller_getDate()
{
  var objOptions = $("#timeline").k2goTimeline("getOptions");
  var objTimeInfo = {};
  
  objTimeInfo.currentDate = objOptions.currentTime;
  objTimeInfo.startDate   = objOptions.startTime;
  objTimeInfo.endDate     = objOptions.endTime;
  
  return objTimeInfo;
}
/******************************************************************************/
/*  STARScontroller_setDate                                                   */
/******************************************************************************/
function STARScontroller_setDate(pDate)
{
       if ($("#time-btn")           .hasClass("timeNowPlay")   ) $("#current_time").trigger("click");
  else if ($("#button_play")        .hasClass("play_frame")    ) $("#button_stop" ).trigger("click");
  else if ($("#button_play_reverse").hasClass("play_frame_rev")) $("#button_stop" ).trigger("click");

  var objTimeInfo = {};

  objTimeInfo.minTime     = new Date($Env.minTime     .getTime());
  objTimeInfo.maxTime     = new Date($Env.maxTime     .getTime());
  objTimeInfo.startTime   = new Date($Env.minTime     .getTime() > pDate.startDate.getTime() ? $Env.minTime.getTime() : pDate.startDate.getTime());
  objTimeInfo.endTime     = new Date($Env.maxTime     .getTime() < pDate.endDate  .getTime() ? $Env.maxTime.getTime() : pDate.endDate  .getTime());
  objTimeInfo.currentTime = new Date(pDate.currentDate.getTime());

  if (objTimeInfo.currentTime.getTime() < objTimeInfo.startTime.getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.startTime.getTime());
  if (objTimeInfo.currentTime.getTime() > objTimeInfo.endTime  .getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.endTime  .getTime());
  
  $Env.creating = true;
  $("#lockWindow").addClass("show");
  
  console.log("STARScontroller_setDate objTimeInfo", objTimeInfo);

  $("#timeline").k2goTimeline("create", {
    timeInfo :
    {
      minTime     : objTimeInfo.minTime,
      maxTime     : objTimeInfo.maxTime,
      startTime   : objTimeInfo.startTime,
      endTime     : objTimeInfo.endTime,
      currentTime : objTimeInfo.currentTime
    },
    callback : function(pTimeInfo)
    {
      adjustRangeBar();
      $Env.creating = false;
      $("#lockWindow").removeClass("show");
    }
  });
  console.log("STARScontroller_setDate timeline", $("#timeline").k2goTimeline("getOptions"));
  mapsync_updateDate();
}
/******************************************************************************/
/*  map view url                                                         */
/******************************************************************************/
function mapsync_getViewURL(){
  return $('#map')[0].contentWindow.getViewURL();
}
/******************************************************************************/
/*  map view url                                                         */
/******************************************************************************/
function mapsync_setViewURL(viewUrl){
  //$('#map')[0].contentWindow.setViewURL(viewUrl);
}
/******************************************************************************/
/*  updateDate                                                */
/******************************************************************************/
function mapsync_updateDate(pDate){
  console.log("STARScontroller_mapsync_updateDate", pDate);
  var mapDate = {};
  if (pDate) {
    mapDate.currentTime = pDate.currentTime;
  } else {
    var objOptions = $("#timeline").k2goTimeline("getOptions");
    mapDate.currentTime = objOptions.currentTime;
  }
  console.log("STARScontroller_mapsync_updateDate", mapDate);
  $('#map')[0].contentWindow.updateDate(mapDate);
}
/******************************************************************************/
/*  STARScontroller_mapLatestDate                                             */
/******************************************************************************/
function mapsync_getMapLatestDate(){
  var mapLatest = $('#map')[0].contentWindow.getLatestDate();
  return mapLatest;
}
/******************************************************************************/
/*  STARScontroller_isReady                                                   */
/******************************************************************************/
function STARScontroller_isReady(){
  if(!$('#map')[0].contentWindow.isReady()) {
    return false;
  }
  return $Env.creating == false && !$("#lockWindow").hasClass("show");
}

