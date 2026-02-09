;(function($){
/******************************************************************************/
/** NICT STARS Touch for JQuery Function                                      */
/** Inoue Computer Service.                                                   */
/******************************************************************************/
/******************************************************************************/
/** nictSTARStouch.getEnvironment                                             */
/******************************************************************************/
$.nictSTARStouch = {getEnvironment : function(pMission, pTeam, pData, pComponent)
{
  var objEnv = $.extend(
  {
    type                  : "",
    disabled              : "off",
    show                  : "none",
    visible               : "on",
    extPlot               : ".jpeg",
    isRelativeYAxis       : false,
    extYAxis              : ".jpeg",
    plotType              : "",
    caption               : "",
    label                 : "",
    labelColor            : [],
    showLabelColor        : "",
    colorBar              : "",
    isYScale              : false,
    isFixedYScale         : true,
    isYSlide              : false,
    ySlideBase            : "",
    yScale                : [],
    showYScale            : "",
    yDataScale            : [],
    showYDataScale        : "",
    isPlotColor           : false,
    plotColor             : [],
    showPlotColor         : "",
    isZeroAxis            : false,
    showZeroAxis          : "off",
    showTop               : "0px",
    dialogType            : "",
    logo                  : "",
    banner                : "",
    dateFormat            : ["%Sy/%Sm/%Sd %SH:%SM:%SS ~ %Ey/%Em/%Ed %EH:%EM:%ES (%TZ)", "%Sj年%Sm月%Sd日 %SH時%SM分%SS秒 ~ %Ej年%Em月%Ed日 %EH時%EM分%ES秒 (%TZ)", "%Sy(%Sj)/%Sm/%Sd %SH:%SM:%SS ~ %Ey(%Ej)/%Em/%Ed %EH:%EM:%ES (%TZ)"],
    isEvent               : false,
    eventColor            : [],
    eventBgColor          : [],
    showEvent             : false,
    showEventColor        : "",
    showEventBgColor      : "",
    isChronological       : false,
    zoomXInEfect          : ["transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform"],
    zoomXOutEfect         : ["transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform", "transform"],
    margin                : null,
    isOutOfRange          : false,
    outOfRangeColor       : "e6e6e6",
    firstDateMargin       : 0,
    lastDateMargin        : 0,
    cache                 : "",
    group                 : null,
    isGroup               : false
  }, $Env);

  if (typeof pMission   == "string") objEnv = $.extend(objEnv, $Env.mission[pMission]);
  if (typeof pTeam      == "string") objEnv = $.extend(objEnv, $Env.mission[pMission].team[pTeam]);
  if (typeof pData      == "string") objEnv = $.extend(objEnv, $Env.mission[pMission].team[pTeam].data[pData]);
  if (typeof pComponent == "string") objEnv = $.extend(objEnv, $Env.mission[pMission].team[pTeam].data[pData].component[pComponent]);

  return objEnv;
},
/******************************************************************************/
/** nictSTARStouch.refreshData                                                */
/******************************************************************************/
refreshData : function(pAryData)
{
  $("#plot_table > li").remove();

  for (var i01 = 0; i01 < pAryData.length; i01++)
  {
    var strMission   = pAryData[i01].mission;
    var strTeam      = pAryData[i01].team;
    var strData      = pAryData[i01].data;
    var strComponent = pAryData[i01].component;
    var strOverlayX  = pAryData[i01].overlay_x;

    if ($("#plot_table > li#" + strMission + "_" + strTeam + "_" + strData + (typeof strComponent == "string" ? "_" + strComponent : "")).length == 0)
    {
      if (typeof strComponent == "string") $("#plot_table").append($.nictSTARStouch.appendData(strMission, strTeam, strData, strComponent, strOverlayX));
      else                                 $("#plot_table").append($.nictSTARStouch.appendData(strMission, strTeam, strData, null,         strOverlayX));
    }
  }
},
/******************************************************************************/
/** nictSTARStouch.appendData                                                 */
/******************************************************************************/
appendData : function(pMission, pTeam, pData, pComponent, pOverlayX)
{
  var objEnv        = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);
  var objDate       = $.nictSTARStouch.getZoomDate   ($Env.showDate, $Env.showXScale);
  var strYDataScale = null;

  if (objEnv.isYScale)
  {
    var aryYScale     = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent).yScale;
    var aryYDataScale = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent).yDataScale;

    if ((aryYScale.length == 0) && (aryYDataScale.length > 0))
    {
      var targetYDataScale = $.nictSTARStouch.getTargetYDataScale($Env.showXScale, aryYDataScale);
      if ($.inArray(objEnv.showYDataScale, targetYDataScale) > 0) strYDataScale = objEnv.showYDataScale; else strYDataScale = targetYDataScale[0];
    }
  }

  var $li       = $("<li id='" + pMission + "_" + pTeam + "_" + pData + (typeof pComponent == "string" ? "_" + pComponent : "") + "'/>");
  var $led      = $("<div class='led'       mission_id='" + pMission + "' team_id='" + pTeam + "' data_id='" + pData + "'" + (typeof pComponent == "string" ? " component='" + pComponent + "'" : "") + (typeof objEnv.group == "string" ? " group='" + objEnv.group + "'" : "") + "/>");
  var $label    = $("<div class='label'     mission_id='" + pMission + "' team_id='" + pTeam + "' data_id='" + pData + "'" + (typeof pComponent == "string" ? " component='" + pComponent + "'" : "") + (typeof objEnv.group == "string" ? " group='" + objEnv.group + "'" : "") + "/>");
  var $download = $("<div class='download'  mission_id='" + pMission + "' team_id='" + pTeam + "' data_id='" + pData + "'" + (typeof pComponent == "string" ? " component='" + pComponent + "'" : "") + (typeof objEnv.group == "string" ? " group='" + objEnv.group + "'" : "") + "/>")
  var $yAxis    = $("<div class='y_axis'    mission_id='" + pMission + "' team_id='" + pTeam + "' data_id='" + pData + "'" + (typeof pComponent == "string" ? " component='" + pComponent + "'" : "") + (typeof objEnv.group == "string" ? " group='" + objEnv.group + "'" : "") + "/>");
  var $plotArea = $("<div class='plot_area' mission_id='" + pMission + "' team_id='" + pTeam + "' data_id='" + pData + "'" + (typeof pComponent == "string" ? " component='" + pComponent + "'" : "") + (typeof objEnv.group == "string" ? " group='" + objEnv.group + "'" : "") + "/>");
  var $colorBar = $("<div class='color_bar'/>");

  if (typeof objEnv.margin === "number")
  {
    if (objEnv.margin > 0) $li.css({ marginTop:objEnv.margin + "px" });
    else                   $li.css({ marginTop:objEnv.margin + "px", boxShadow:"none" });
  }

  $label.append(objEnv.label.replace("%TZ", $Env.showTimeZone ? $Env.showTimeZone : "UT"));

  switch(objEnv.downloadType)
  {
    case "internal":
      $download.append(objEnv.download);
      $download.attr("title", objEnv.downloadTitle);
      $download.hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });

      $download.on("touchstart mousedown", function(e)
      {
        var $this = this;

        setTimeout(function()
        {
          $.nictSTARStouch.openDataDownloadDialog($this);
        }, 300);
      });

      break;
    case "external":
      $download.append(objEnv.download);
      $download.attr("title", objEnv.downloadTitle);
      $download.hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });

      $download.on("click", function(e)
      {
        window.open(objEnv.downloadURL);
      });

      break;
  }

  if (objEnv.isLED)
  {
    var $ledGreen  = (objEnv.component  ? $("<li class='green'></li>")  : $("<li class='off'></li>"));
    var $ledRed    = (objEnv.dialogType ? $("<li class='red'></li>")    : $("<li class='off'></li>"));
    var $ledLabel  = $("<ul/>");

    $ledLabel.append($ledGreen);
    $ledLabel.append($ledRed);
    $led.append($ledLabel);

    if (objEnv.component) $ledGreen.attr("title", "Components can be Displayed");
    if (objEnv.component) $ledRed  .attr("title", "Dialogs can be Displayed");
  }

  if (objEnv.isYScale)
  $yAxis              .append($.nictSTARStouch.getYAxis   (pMission, pTeam, pData, pComponent, $Env.showXScale, objEnv.showYScale, strYDataScale));
  $plotArea           .append($.nictSTARStouch.getContents(pMission, pTeam, pData, pComponent, $Env.showXScale, (objEnv.isYScale ? objEnv.showYScale : null), (objEnv.isYScale ? strYDataScale : null), (objEnv.isZeroAxis ? objEnv.showZeroAxis : null), objDate));
  $plotArea           .width (        ($Env.screenSize > $Env.windowSize ? $Env.screenSize : $Env.windowSize) * 3);
  $plotArea           .css   ("left", ($Env.screenSize > $Env.windowSize ? $Env.screenSize : $Env.windowSize) * -1 + "px");
  $plotArea.children().css   ("left", $Env.showLeft);
  $colorBar           .append(objEnv.colorBar);

  $li.append($led);
  $li.append($label);
  $li.append($download);
  $li.append($yAxis);
  $li.append($plotArea);
  $li.append($colorBar);

  if (objEnv.isYSlide)
  {
    if ((objEnv.yScale.length > 0) || (objEnv.yDataScale.length > 0))
      $li.nictSTARSPlotYSlider(
      {
        selector   : "[class!='label'][class!='led'][class!='download'][mission_id='" + pMission + "'][team_id='" + pTeam + "'][data_id='" + pData + "']" + (typeof pComponent == "string" ? "[component='" + pComponent + "']" : ""),
        zoomIn     : function(pContents, pY)   { return $.nictSTARStouch.zoomY(pContents, pY, "in" ); },
        zoomOut    : function(pContents, pY)   { return $.nictSTARStouch.zoomY(pContents, pY, "out"); },
        zoomBefore : function()                { $("#plot_table").trigger("showWaitMessage.nictSTARSPlotXSlider"); },
        zoomAfter  : function(pPlotArea, pZoom){
          if (pZoom)
          {
            $.nictSTARStouch.updateGroup(pPlotArea);
            $.nictSTARSLogger.info("zoom y", { action : "zoom y", mission : pPlotArea.attr("mission_id"), team : pPlotArea.attr("team_id"), data : pPlotArea.attr("data_id"), component : (!!pPlotArea.attr("component") ? pPlotArea.attr("component") : ""), yscale : (!!pPlotArea.children("img").attr("y_scale") ? pPlotArea.children("img").attr("y_scale") : ""), ydatascale : (!!pPlotArea.children("img").attr("y_data_scale") ? pPlotArea.children("img").attr("y_data_scale") : ""), url : $.nictSTARStouch.getViewUrl() });
          }
          setTimeout(function(){ $("#plot_table").trigger("removeWaitMessage.nictSTARSPlotXSlider"); }, 100);
        },
        moveAfter  : function(pPlotArea, pMove){ if (pMove) $.nictSTARStouch.updateGroup(pPlotArea); },
        resizeY    : function(pPlotArea)       { return $.nictSTARStouch.resizeY(pPlotArea); }
      });
    else
      $li.nictSTARSPlotYSlider(
      {
        selector  : "[class!='label'][class!='led'][class!='download'][mission_id='" + pMission + "'][team_id='" + pTeam + "'][data_id='" + pData + "']" + (typeof pComponent == "string" ? "[component='" + pComponent + "']" : "")
      });

    $yAxis   .children().css("top", objEnv.showTop);
    $plotArea.children().css("top", objEnv.showTop);
  }

  if (!objEnv.isFixedYScale)
  {
    var objResults = $.extend({ heightY : false }, $.nictSTARStouch.resizeY($plotArea));
    if (typeof objResults.heightY == "number" && objResults.heightY > 0)
    {
      $li.css("height", objResults.heightY.toString() + "px");
      $li.children().css("height", objResults.heightY.toString() + "px");
    }
  }

  $li.nictSTARSPlotController(
  {
    selector  : "[class!='label'][class!='led'][class!='download'][mission_id='" + pMission + "'][team_id='" + pTeam + "'][data_id='" + pData + "']" + (typeof pComponent == "string" ? "[component='" + pComponent + "']" : ""),
    isControl : objEnv.isControl,
    resetY    : !objEnv.yScaleBase ? null : function(pPlotArea){ return $.nictSTARStouch.resetY(pPlotArea.children(":first")); },
    group     : !objEnv.group      ? null : function(pPlotArea){ $.nictSTARStouch.toggleGroup(pPlotArea); $.nictSTARStouch.updateGroup(pPlotArea); },
    ready     : !objEnv.isControl  ? null : function(pPlotArea, pController){
      var strMission    = pPlotArea.attr("mission_id");
      var strTeam       = pPlotArea.attr("team_id");
      var strData       = pPlotArea.attr("data_id");
      var strComponent  = pPlotArea.attr("component");
      var objEnv        = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);

      pController.find(".nictSTARSPlotControllerGroup").toggleClass("enable", objEnv.isGroup);
    }
  });

  if (objEnv.isChronological)
  {
    $led                   .css("background", "#" + objEnv.showLabelColor);
    $label                 .css("background", "#" + objEnv.showLabelColor);
    $label.children("span").css("background", "#" + objEnv.showPlotColor);
    $yAxis                 .css("background", "#" + objEnv.showLabelColor);
    $colorBar              .css("background", "#" + objEnv.showPlotColor);
  }
  else
  {
    if (!!objEnv.showPlotColor)
    {
      $label.children("span").css("color", "#" + objEnv.showPlotColor);
    }
  }

  if (!!pOverlayX)
  {
    var intOverlayX = (parseInt($("#plot_table").css("margin-top"), 10) + parseInt(pOverlayX, 10)) + "px";
    $li.addClass("nict-stars-plot-sortable-overlay");
    $li.css({position:"absolute", top:intOverlayX});
  }

  return $li;
},
/******************************************************************************/
/** nictSTARStouch.appendContents                                             */
/******************************************************************************/
appendContents : function(pContents, pMode)
{
  var strMission    = pContents.parent().attr("mission_id");
  var strTeam       = pContents.parent().attr("team_id");
  var strData       = pContents.parent().attr("data_id");
  var strComponent  = pContents.parent().attr("component");
  var strXScale     = pContents         .attr("x_scale"  );
  var strYScale     = pContents         .attr("y_scale"  );
  var strYDataScale = pContents         .attr("y_data_scale");
  var strZeroAxis   = pContents         .attr("zero_axis");
  var objDate       = $.nictSTARStouch.getNextDate($.nictSTARStouch.getDate(pContents), strXScale, (pMode == "first" ? -1 : 1));

  return $.nictSTARStouch.getContents(strMission, strTeam, strData, strComponent, strXScale, strYScale, strYDataScale, strZeroAxis, objDate);
},
/******************************************************************************/
/** nictSTARStouch.zoomX                                                      */
/******************************************************************************/
zoomX : function(pContents, pX, pXScale, pNextXScale)
{
  var strMission      = pContents.parent().attr("mission_id");
  var strTeam         = pContents.parent().attr("team_id");
  var strData         = pContents.parent().attr("data_id");
  var strComponent    = pContents.parent().attr("component");
  var strYScale       = pContents         .attr("y_scale"  );
  var strYDataScale   = pContents         .attr("y_data_scale");
  var strZeroAxis     = pContents         .attr("zero_axis");
  var objNextDate     = $.nictSTARStouch.getZoomDate   ($Env.showDate, pNextXScale);
  var objEnv          = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var aryYDataScale   = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).yDataScale;

  if (aryYDataScale.length > 0)
  {
    var targetYDataScale = $.nictSTARStouch.getTargetYDataScale(pNextXScale, aryYDataScale);
    if (targetYDataScale.indexOf(strYDataScale) == -1) strYDataScale = targetYDataScale[0];
  }

  var $element        = $.nictSTARStouch.getContents   (strMission, strTeam, strData, strComponent, pNextXScale, strYScale, strYDataScale, strZeroAxis, objNextDate);
  var intDiffMilliSec = $Env.showDate - objNextDate;
  var intBaseX        = parseInt(pContents.css("left"), 10) + pX;
  var intMoveX        = intBaseX - Math.floor(intDiffMilliSec / $.nictSTARStouch.getPixelMilliseconds(pNextXScale));

  if (objEnv.isYScale)
  {
    var $yAxis = $("#plot_table #" + strMission + "_" + strTeam + "_" + strData + (typeof strComponent == "string" ? "_" + strComponent.replace(/\$.*/, "").replace(".", "\\.") : "") + " .y_axis");

    if ($yAxis.children().length > 0)
    {
      $yAxis.children().attr("x_scale", pNextXScale);

      if ((objEnv.isRelativeYAxis) || (aryYDataScale.length > 0))
      {
        var $yAxisImg = $.nictSTARStouch.getYAxis(strMission, strTeam, strData, strComponent, pNextXScale, strYScale, strYDataScale);
        if ($yAxisImg) $yAxis.children().attr("src", $yAxisImg.attr("src"));
      }
    }
  }

  return { element : $element, moveX : intMoveX };
},
/******************************************************************************/
/** nictSTARStouch.zoomY                                                      */
/******************************************************************************/
zoomY : function(pContents, pY, pZoom)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission        = pContents.parent().attr("mission_id");
  var strTeam           = pContents.parent().attr("team_id");
  var strData           = pContents.parent().attr("data_id");
  var strComponent      = pContents.parent().attr("component");
  var strYScale         = pContents         .attr("y_scale");
  var strYDataScale     = pContents         .attr("y_data_scale");
  var strZeroAxis       = pContents         .attr("zero_axis");
  var strXScale         = pContents         .attr("x_scale");
  var strNextYDataScale = pContents         .attr("y_data_scale");
  var objEnv            = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var aryYScale         = objEnv.yScale;
  var aryYDataScale     = objEnv.yDataScale;
  var strNextYScale     = strYScale;

  if (pContents.parents(".nict-stars-plot-sortable-target, .nict-stars-plot-sortable-overlay").length > 0 && !objEnv.isGroup) return { element : null, moveY : null };
/*-----* Get Next Y Scale *---------------------------------------------------*/
  if (aryYScale.length > 0)
  {
    if (pZoom == "in")
    {
      if (strYScale == aryYScale[aryYScale.length - 1]) return false;

      for (var i01 = 0; i01 < aryYScale.length - 1; i01++)
      {
        if (strYScale == aryYScale[i01]) { strNextYScale = aryYScale[i01 + 1]; break; }
      }
    }
    else if (pZoom == "out")
    {
      if (strYScale == aryYScale[0]) return false;

      for (var i01 = 1; i01 < aryYScale.length; i01++)
      {
        if (strYScale == aryYScale[i01]) { strNextYScale = aryYScale[i01 - 1]; break; }
      }
    }
    else if (aryYScale.indexOf(pZoom) != -1)
    {
      strNextYScale = pZoom;
    }
  }
  else
  {
    var targetYDataScale = $.nictSTARStouch.getTargetYDataScale(strXScale, aryYDataScale);

    if (pZoom == "in")
    {
      if (strYDataScale == targetYDataScale[targetYDataScale.length - 1]) return false;

      for (var i01 = 0; i01 < targetYDataScale.length - 1; i01++)
      {
        if (strYDataScale == targetYDataScale[i01]) { strNextYDataScale = targetYDataScale[i01 + 1]; break; }
      }
    }
    else if(pZoom == "out")
    {
      if (strYDataScale == targetYDataScale[0]) return false;

      for (var i01 = 1; i01 < targetYDataScale.length; i01++)
      {
        if (strYDataScale == targetYDataScale[i01]) { strNextYDataScale = targetYDataScale[i01 - 1]; break; }
      }
    }
    else if (targetYDataScale.indexOf(pZoom) != -1)
    {
      strNextYDataScale = pZoom;
    }

    if (!strNextYDataScale) strNextYDataScale = targetYDataScale[0];
  }
/*-----* Create Element *-----------------------------------------------------*/
  if (pContents.parent().attr("class") == "y_axis")
  {
    var $element  = $.nictSTARStouch.getYAxis   (strMission, strTeam, strData, strComponent, strXScale, strNextYScale, strNextYDataScale);
  }
  else
  {
    var objDate   = $.nictSTARStouch.getDate    (pContents);
    var $element  = $.nictSTARStouch.getContents(strMission, strTeam, strData, strComponent, strXScale, strNextYScale, strNextYDataScale, strZeroAxis, objDate);
  }
/*-----* Calc Move Y *--------------------------------------------------------*/
  var yScaleBase    = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).yScaleBase;
  var intYScale     = parseInt(strYScale    , 10);
  var intNextYScale = parseInt(strNextYScale, 10);
  var intMoveY      = 0;

  switch ( yScaleBase ) {
    case "top" :
      var intBaseY = parseInt(pContents.css("top"), 10);
      intMoveY     = intBaseY;
      break;
    case "bottom" :
      var intBaseY = parseInt(pContents.css("top"), 10) + intYScale;
      intMoveY     = intBaseY - Math.floor(intYScale * (intNextYScale / intYScale));
      break;
    case "zeroaxis" :
      var scaleMin = parseInt($.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).scaleMin, 10);
      var scaleMax = parseInt($.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).scaleMax, 10);
      var intBaseY = parseInt(pContents.css("top"), 10) + intYScale * scaleMax / (scaleMax - scaleMin);
      intMoveY     = intBaseY - Math.floor(intYScale * scaleMax / (scaleMax - scaleMin) * (intNextYScale / intYScale));
      break;
    case "pointer" :
    default:
      var intBaseY = parseInt(pContents.css("top"), 10) + pY;
      intMoveY     = intBaseY - Math.floor(pY * (intNextYScale / intYScale));
      break;
  }

  if (pContents.parent().height() >= intNextYScale           ) intMoveY = 0;
  if (pContents.parent().height() >  intNextYScale + intMoveY) intMoveY = pContents.parent().height() - intNextYScale;
  if (intMoveY                    >                         0) intMoveY = 0;
  if (!$.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).isFixedYScale) intMoveY = 0

  $(window).trigger("scroll");

  return { element : $element, moveY : intMoveY };
},
/******************************************************************************/
/** nictSTARStouch.resetY                                                     */
/******************************************************************************/
resetY : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission    = pContents.parent().attr("mission_id");
  var strTeam       = pContents.parent().attr("team_id");
  var strData       = pContents.parent().attr("data_id");
  var strComponent  = pContents.parent().attr("component");
  var strXScale     = pContents         .attr("x_scale");
  var strYScale     = pContents         .attr("y_scale");
  var strYDataScale = pContents         .attr("y_data_scale");
  var strZeroAxis   = pContents         .attr("zero_axis");
  var yScaleBase    = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).yScaleBase;
  var intYScale     = parseInt(strYScale, 10);
  var intMoveY      = -1;
/*-----* Create Element *-----------------------------------------------------*/
  if (pContents.parent().attr("class") == "y_axis")
  {
    var $element  = $.nictSTARStouch.getYAxis   (strMission, strTeam, strData, strComponent, strXScale, strYScale, strYDataScale);
  }
  else
  {
    var objDate   = $.nictSTARStouch.getDate    (pContents);
    var $element  = $.nictSTARStouch.getContents(strMission, strTeam, strData, strComponent, strXScale, strYScale, strYDataScale, strZeroAxis, objDate);
  }
/*-----* Calc Move Y *--------------------------------------------------------*/
  switch ( yScaleBase ) {
    case "top" :
      intMoveY     = 0;
      break;
    case "bottom" :
      intMoveY     = parseInt(pContents.parent().height(), 10) - intYScale;
      break;
    case "zeroaxis" :
      var scaleMin = parseInt($.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).scaleMin, 10);
      var scaleMax = parseInt($.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).scaleMax, 10);
      intMoveY     = - intYScale * scaleMax / (scaleMax - scaleMin) + Math.floor(parseInt(pContents.parent().height(), 10) / 2);
      break;
    case "pointer" :
    default:
      intMoveY     = - (intYScale / 2) + Math.floor(parseInt(pContents.parent().height(), 10) / 2);
      break;
  }

  return { element : $element, moveY : intMoveY }
},
/******************************************************************************/
/** nictSTARStouch.resizeY                                                    */
/******************************************************************************/
resizeY : function(pPlotArea)
{
  var strMission    = pPlotArea.attr("mission_id");
  var strTeam       = pPlotArea.attr("team_id");
  var strData       = pPlotArea.attr("data_id");
  var strComponent  = pPlotArea.attr("component");
  var strPlotType   = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).plotType;
  var isFixedYScale = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent).isFixedYScale;
  var intY          = -1;

  if (!isFixedYScale)
  {
    if (strPlotType == "thumbnail")
      intY = parseInt(pPlotArea.children("div").attr("y_scale"), 10) + 20;
    else
      intY = parseInt(pPlotArea.children("div").attr("y_scale"), 10);
  }

  return { heightY : intY }
},
/******************************************************************************/
/** nictSTARStouch.updateGroup                                               */
/******************************************************************************/
updateGroup : function(pPlotArea)
{
  var strMission   = pPlotArea.attr("mission_id");
  var strTeam      = pPlotArea.attr("team_id");
  var strData      = pPlotArea.attr("data_id");
  var strComponent = pPlotArea.attr("component");
  var objEnv       = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var scrollTop    = $(window).scrollTop();
  var positionTop  = pPlotArea.parent().position().top;

  if (objEnv.isGroup)
  {
    var strGroup      = pPlotArea                   .attr("group");
    var strYScale     = pPlotArea.children(":first").attr("y_scale");
    var strYDataScale = pPlotArea.children(":first").attr("y_data_scale");
    var intTop        = parseInt(pPlotArea.children().css("top"), 10);
    var strSelector   = "[class!='label'][class!='led'][class!='download'][group='" + strGroup + "']:not([mission_id='" + strMission + "'][team_id='" + strTeam + "'][data_id='" + strData + "']" + (typeof strComponent == "string" ? "[component='" + strComponent + "']" : "") + ")";

    $(strSelector).each(function(pIndex, pElement)
    {
      if (($(pElement).children(":first").attr("y_scale") != strYScale) || ($(pElement).children(":first").attr("y_data_scale") != strYDataScale))
      {
        var $element = $("<div/>");

        $(pElement).children().each(function(pIndex2, pElement2)
        {
          var objResults = $.extend({ element:false, moveY:0 }, $.nictSTARStouch.zoomY($(pElement2), intTop, (typeof strYDataScale != "undefined" ? strYDataScale : strYScale)));

          if (typeof objResults.element == "string" || typeof objResults.element == "object")
          {
            $element                  .append(objResults.element);
            $element.children(":last").css   ("position", "absolute");
            $element.children(":last").css   ("top"     , objResults.moveY + "px");
            $element.children(":last").css   ("bottom"  , $(pElement2).css("bottom"));
            $element.children(":last").css   ("left"    , $(pElement2).css("left"));
            $element.children(":last").css   ("right"   , $(pElement2).css("right"));
            $element.children(":last").css   ("width"   , $(pElement2).css("width"));
          }
        });

        if ($element.children().length > 0)
        {
          $(pElement).children().remove();
          $(pElement)           .append($element.children());
        }
      }
    });

    $(strSelector).trigger("resize.nictSTARSPlotYSlider");
    $(strSelector).children().css("top", intTop + "px");
  }

  if (pPlotArea.parent().position().top != positionTop)
  {
    window.scrollTo($(window).scrollLeft(), scrollTop + pPlotArea.parent().position().top - positionTop);
  }
},
/******************************************************************************/
/** nictSTARStouch.reload                                                     */
/******************************************************************************/
reload : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission       = pContents.parent().attr("mission_id");
  var strTeam          = pContents.parent().attr("team_id");
  var strData          = pContents.parent().attr("data_id");
  var strComponent     = pContents.parent().attr("component");
  var strXScale        = pContents         .attr("x_scale");
  var strYScale        = pContents         .attr("y_scale");
  var strYDataScale    = pContents         .attr("y_data_scale");
  var strZeroAxis      = pContents         .attr("zero_axis");
/*-----* Create Element *-----------------------------------------------------*/
  var objDate   = $.nictSTARStouch.getDate    (pContents);
  var $element  = $.nictSTARStouch.getContents(strMission, strTeam, strData, strComponent, strXScale, strYScale, strYDataScale, strZeroAxis, objDate);

  return { element : $element };
},
/******************************************************************************/
/** nictSTARStouch.toggleZeroAxis                                             */
/******************************************************************************/
toggleZeroAxis : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission       = pContents.parent().attr("mission_id");
  var strTeam          = pContents.parent().attr("team_id");
  var strData          = pContents.parent().attr("data_id");
  var strComponent     = pContents.parent().attr("component");
  var strXScale        = pContents         .attr("x_scale");
  var strYScale        = pContents         .attr("y_scale");
  var strYDataScale    = pContents         .attr("y_data_scale");
  var strZeroAxis      = pContents         .attr("zero_axis");
/*-----* Get Next Zero Axis *-------------------------------------------------*/
  var nextZeroAxis = (strZeroAxis == "off" ? "on" : "off") 
/*-----* Create Element *-----------------------------------------------------*/
  var objDate   = $.nictSTARStouch.getDate    (pContents);
  var $element  = $.nictSTARStouch.getContents(strMission, strTeam, strData, strComponent, strXScale, strYScale, strYDataScale, nextZeroAxis, objDate);

  return { element : $element };
},
/******************************************************************************/
/** nictSTARStouch.toggleGroup                                                */
/******************************************************************************/
toggleGroup : function(pPlotArea)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission       = pPlotArea.attr("mission_id");
  var strTeam          = pPlotArea.attr("team_id");
  var strData          = pPlotArea.attr("data_id");
  var strComponent     = pPlotArea.attr("component");
  var strGroup         = pPlotArea.attr("group");
/*-----* Toggle Group *-------------------------------------------------------*/
  var objEnv           = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var isNextGroup      = !objEnv.isGroup;

  for (var strEnvMission in $Env.mission)
  {
    for (var strEnvTeam in $Env.mission[strEnvMission].team)
    {
      for (var strEnvData in $Env.mission[strEnvMission].team[strEnvTeam].data)
      {
        var objDataEnv = $.nictSTARStouch.getEnvironment(strEnvMission, strEnvTeam, strEnvData, null);
        if (objDataEnv.group == strGroup) $Env.mission[strEnvMission].team[strEnvTeam].data[strEnvData].isGroup = isNextGroup;

        for (var strEnvComponent in $Env.mission[strEnvMission].team[strEnvTeam].data[strEnvData].component)
        {
          var objComponentEnv = $.nictSTARStouch.getEnvironment(strEnvMission, strEnvTeam, strEnvData, strEnvComponent);
          if (objComponentEnv.group == strGroup) $Env.mission[strEnvMission].team[strEnvTeam].data[strEnvData].component[strEnvComponent].isGroup = isNextGroup;
        }
      }
    }
  }
  $(".nictSTARSPlotControllerGroup").toggleClass("enable", isNextGroup);
},
/******************************************************************************/
/** nictSTARStouch.getYAxis                                                   */
/******************************************************************************/
getYAxis : function(pMission, pTeam, pData, pComponent, pXScale, pYScale, pYDataScale)
{
  var objEnv   = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);
  var $element = $("<span x_scale='" + pXScale + "' y_scale='" + pYScale + (!!pYDataScale ? "' y_data_scale='" + pYDataScale : "") + "'/>").css("height", pYScale);

  if (objEnv.extYAxis)
  {
    var strUrl   = "img/" + pData + "/item/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") : pData) + (objEnv.isRelativeYAxis ? "_" + pXScale : "") + "_YAxis_40-" + pYScale + (!!pYDataScale ? "_" + pYDataScale : "") + objEnv.extYAxis;
    var strCache = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

    $.ajax(
    {
      async    : false,
      type     : "GET",
      url      : strUrl + strCache,
      success  : function(pImg)
      {
        $element = $("<img x_scale='" + pXScale + "' y_scale='" + pYScale + (!!pYDataScale ? "' y_data_scale='" + pYDataScale : "") + "' src='" + strUrl + "'/>");
      },
      error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });
  }

  return $element;
},
/******************************************************************************/
/** nictSTARStouch.getContents                                                */
/******************************************************************************/
getContents : function(pMission, pTeam, pData, pComponent, pXScale, pYScale, pYDataScale, pZeroAxis, pDate)
{
/*-----* Variable *-----------------------------------------------------------*/
  var objEnv        = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);
  var strDate       = $.nictSTARStouch.formatDate    (pDate   , null , "%Sy%Smm%Sdd%SH%SM%SS");
  var strYear       = strDate.substr(0, 4);
  var strMonth      = strDate.substr(4, 2);
  var strDay        = strDate.substr(6, 2);
  var strTime       = strDate.substr(8, 6);
  var $element      = $("<div x_scale='" + pXScale + (objEnv.isYScale ? "' y_scale='" + pYScale : "") + ((objEnv.isYScale && !!pYDataScale) ? "' y_data_scale='" + pYDataScale : "") + (objEnv.isZeroAxis ? "' zero_axis='" + pZeroAxis : "") + "' year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "'/>");
  var $plot         = $("#plot_table #" + pMission + "_" + pTeam + "_" + pData + (typeof pComponent == "string" ? "_" + pComponent.replace(/\$.*/, "").replace(".", "\\.") : ""));
  var intViewTop    = $(".header2").offset().top - $(window).scrollTop() + $(".header2").outerHeight(true);
  var intViewBottom = $("footer"  ).offset().top - $(window).scrollTop() - parseInt($Env.mission["TimeAxis"].team["TimeAxis"].data["TimeAxis"].showYScale, 10);
/*-----* Get Ajax Data *------------------------------------------------------*/
  if ($plot.length > 0)
  {
    var intPlotTop    = $plot.offset().top      - $(window).scrollTop();
    var intPlotBottom = $plot.outerHeight(true) + intPlotTop;

    if (pMission      == "TimeAxis"
    || (intPlotTop    >= intViewTop && intPlotTop    <= intViewBottom)
    || (intPlotBottom >= intViewTop && intPlotBottom <= intViewBottom)
    || (intPlotTop    <= intViewTop && intPlotBottom >= intViewBottom))
    {
      $element.addClass("window_scroll_event");
      $.nictSTARStouch.getAjaxContents($element, pMission, pTeam, pData, pComponent);
/*-----* Set Out of Range Data *----------------------------------------------*/
      if (pMission != "TimeAxis")
      {
        $.nictSTARStouch.setOutOfRangeContents($element, pMission, pTeam, pData, pComponent, $plot.height());
      }
    }
  }
/*-----* Set Zero Axis -------------------------------------------------------*/
  $.nictSTARStouch.setZeroAxisContents($element, pMission, pTeam, pData, pComponent, pYScale, pZeroAxis);
/*-----* Dialog *-------------------------------------------------------------*/
  if (objEnv.dialogType.length > 0 && objEnv.dialogType != "none")
  {
    $element.on("mouseover.nictSTARStouchDialog", "> *", function(e) { $(this).css("cursor", "pointer"); });
    $element.on("mouseout.nictSTARStouchDialog" , "> *", function(e) { $(this).css("cursor", "auto"   ); });

    $.each(["touchstart", "mousedown"], function()
    {
      var flgTouch = ((this == "touchstart") ? true : false);
      var flgEvent = flgTouch && "event" in window;

    $element.on((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchDialog", "> *", function(e)
    {
      var $this    = this;
        var intBaseX = (flgEvent ? event.changedTouches[0].pageX : e.pageX);
      var intMoveX = 0;

      $(document).on((flgTouch ? "touchmove" : "mousemove") + ".nictSTARStouchDialog", function(e)
      {
          intMoveX += intBaseX - (flgEvent ? event.changedTouches[0].pageX : e.pageX);
          intBaseX  =            (flgEvent ? event.changedTouches[0].pageX : e.pageX);
      });

      if (!$element.data("dblTap.nictSTARStouchDialog"))
      {
        $element.data("dblTap.nictSTARStouchDialog", true);
        setTimeout(function(){ $element.data("dblTap.nictSTARStouchDialog", false); }, 300);
        $(document).one((flgTouch ? "touchend" : "mouseup") + ".nictSTARStouchDialog", function()
        {
          $(document).off((flgTouch ? "touchmove" : "mousemove") + ".nictSTARStouchDialog");
          if ($element.data("dblTap.nictSTARStouchDialog"))
          {
            setTimeout(function()
            {
              if ((Math.abs(intMoveX) < 1) && $element.data("dblTap.nictSTARStouchDialog"))
              {
                     if (objEnv.dialogType == "list_view") $.nictSTARStouch.openListViewDialog($this);
                else if (objEnv.dialogType == "data_view") $.nictSTARStouch.openDataViewDialog($this);
              }
              $element.data("dblTap.nictSTARStouchDialog", false);
            }, 200);
          }
        });
      }
      else
      {
        $element.data("dblTap.nictSTARStouchDialog", false);
      }
    });
    });
  }

  return $element;
},
/******************************************************************************/
/** nictSTARStouch.getAjaxContents                                            */
/******************************************************************************/
getAjaxContents : function(pElement, pMission, pTeam, pData, pComponent)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strXScale            = pElement.attr("x_scale");
  var strYScale            = pElement.attr("y_scale");
  var strYDataScale        = pElement.attr("y_data_scale");
  var strZeroAxis          = pElement.attr("zero_axis");
  var strYear              = pElement.attr("year");
  var strMonth             = pElement.attr("month");
  var strDay               = pElement.attr("day");
  var strTime              = pElement.attr("time");
  var objEnv               = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);
  var objDate              = $.nictSTARStouch.getDate       (pElement);
  var strUrl               = pData + "/" + (objEnv.isPlotColor && objEnv.showPlotColor != "" ? objEnv.showPlotColor + "/" : "") + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") + "/" : "") + strXScale + "/" + (objEnv.isYScale ? strYScale + "/" : "") + (objEnv.isYScale && !!strYDataScale ? strYDataScale + "/" : "") + strYear + "/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") : pData) + "_" + strXScale + (objEnv.isYScale ? "-" + strYScale : "") + (objEnv.isYScale && !!strYDataScale ? "_" + strYDataScale : "") + "_" + strYear + strMonth + strDay + "_" + strTime;
  var strCache             = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 
  var firstDate            = new Date(objEnv.firstDate);
  var lastDate             = new Date(objEnv.lastDate);
  var intPixelMilliseconds = $.nictSTARStouch.getPixelMilliseconds(strXScale);

  firstDate.setMilliseconds(firstDate.getMilliseconds() + intPixelMilliseconds * objEnv.firstDateMargin * -1);
  lastDate .setMilliseconds(lastDate .getMilliseconds() + intPixelMilliseconds * objEnv.lastDateMargin      );
/*-----* TimeAxis *-----------------------------------------------------------*/
  if (pMission == "TimeAxis")
  {
    var intLeft     = 0;
    var strTimeZone = $.nictSTARStouch.getTimeZone($Env.showTimeZone);
    var objStart    = new Date(objDate.toISOString().replace("Z", strTimeZone.replace("+", "-")));
    var objNext     = objStart;
    var strYear     = $Env.showCalendarLocale == 0 ? "%Sy"         : $Env.showCalendarLocale == 1 ? "%Sj年"          : "%Sy<br/>(%Sj年)";
    var strMonth    = $Env.showCalendarLocale == 0 ?     "%Sm"     : $Env.showCalendarLocale == 1 ?      "%Sm"       :     "%Sm";
    var strDay      = $Env.showCalendarLocale == 0 ?     "%Sm/%Sd" : $Env.showCalendarLocale == 1 ?      "%Sm/%Sd"   :     "%Sm/%Sd";
    var strDate     = $Env.showCalendarLocale == 0 ? "%Sy/%Sm/%Sd" : $Env.showCalendarLocale == 1 ? "%Sj年%Sm月%Sd日": "%Sy/%Sm/%Sd<br/>(%Sj年)";
    var strTime     = $Env.showCalendarLocale == 0 ? "%SH:%SM"     : $Env.showCalendarLocale == 1 ? "%SH時%SM分"     : "%SH:%SM";

    switch (strXScale)
    {
      case "32768d" : objNext = new Date(objStart.getFullYear(), 0                  , 1                 , 0                  ,  0                   ,  0);  break;
      case "16384d" : objNext = new Date(objStart.getFullYear(), 0                  , 1                 , 0                  ,  0                   ,  0);  break;
      case  "8192d" : objNext = new Date(objStart.getFullYear(), 6                  , 1                 , 0                  ,  0                   ,  0);  break;
      case  "4096d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case  "2048d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case  "1024d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case   "512d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case   "256d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case   "128d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), 1                 , 0                  ,  0                   ,  0);  break;
      case    "64d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), 0                  ,  0                   ,  0);  break;
      case    "32d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), 0                  ,  0                   ,  0);  break;
      case    "16d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), 0                  ,  0                   ,  0);  break;
      case     "8d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), 0                  ,  0                   ,  0);  break;
      case     "4d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), 2                  ,  0                   ,  0);  break;
      case     "2d" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(),  0                   ,  0);  break;
      case    "24h" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(),  0                   ,  0);  break;
      case    "12h" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), 30                   ,  0);  break;
      case     "6h" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), 10                   ,  0);  break;
      case     "3h" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), 10                   ,  0);  break;
      case     "1h" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), objStart.getMinutes(),  0);  break;
      case    "30m" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), objStart.getMinutes(),  0);  break;
      case    "10m" : objNext = new Date(objStart.getFullYear(), objStart.getMonth(), objStart.getDate(), objStart.getHours(), objStart.getMinutes(), 30);  break;
    }

    while (intLeft <= $Env.width)
    {
      intLeft = Math.floor((objNext - objStart) / intPixelMilliseconds);

      if (0 < intLeft && intLeft <= $Env.width)
      {
        var $scale       = null;
        var $labelTop    = null;
        var $labelBottom = null;

        switch (strXScale)
        {
          case "32768d" :
                 if (objNext.getFullYear() % 10 == 0) { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getFullYear() %  5 == 0)   $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case "16384d" :
            if (objNext.getFullYear() % 5 == 0)       { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case  "8192d" :
                 if (objNext.getFullYear() % 2 == 0
                 &&  objNext.getMonth()        == 0)  { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getMonth()        == 0)    $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case  "4096d" :
          case  "2048d" :
                 if (objNext.getMonth() == 0)         { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getMonth() == 6)           $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case  "1024d" :
            if (objNext.getMonth() == 0)                $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strYear ) + "</div>");
                                                        $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strMonth) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />");
            break;
          case   "512d" :
            if (objNext.getMonth() == 0)                $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDay ) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />");
            break;
          case   "256d" :
                                                        $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDay ) + "</div>");
                                                        $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strYear) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />");
            break;
          case   "128d" :
                                                        $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />");
            break;
          case    "64d" :
          case    "32d" :
                 if (objNext.getDate()      < 31
                 &&  objNext.getDate() % 10 == 1)     { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getDate() % 10 == 6)       $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case    "16d" :
                 if (objNext.getDate()      < 31
                 &&  objNext.getDate() %  5 == 1)     { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "8d" :
            if (objNext.getDate()     < 31
            &&  objNext.getDate() % 2 == 1)           { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "4d" :
                 if (objNext.getHours() ==  0)        { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getHours() == 12)          $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "2d" :
                 if (objNext.getHours() % 12 == 0)    { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getHours() %  6 == 0)      $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case    "24h" :
            if (objNext.getHours()      == 0)           $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
            if (objNext.getHours() %  2 == 0)         { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case    "12h" :
            if (objNext.getMinutes()    == 0
            &&  objNext.getHours() % 12 == 0)           $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
            if (objNext.getMinutes()    == 0)         { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "6h" :
                 if (objNext.getMinutes()   ==  0
                 &&  objNext.getHours() % 6 ==  0)      $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                 if (objNext.getMinutes()   ==  0)    { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getMinutes()   == 30)      $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "3h" :
            if (objNext.getMinutes()      ==  0
            &&  objNext.getHours()   %  3 ==  0)        $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
            if (objNext.getMinutes() % 30 ==  0)      { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case     "1h" :
                 if (objNext.getMinutes()      == 0)    $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
                 if (objNext.getMinutes() % 10 == 0)  { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else if (objNext.getMinutes() %  5 == 0)    $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_middle'/>");
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case    "30m" :
            if (objNext.getMinutes() % 30 == 0)         $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
            if (objNext.getMinutes() %  5 == 0)       { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
          case    "10m" :
            if (objNext.getSeconds()      == 0
            &&  objNext.getMinutes() % 10 == 0)         $labelBottom = $("<div class='nictSTARSPlotXSliderSlideTarget label_bottom '>" + $.nictSTARStouch.formatDate(objNext, null, strDate) + "</div>");
            if (objNext.getSeconds()      == 0)       { $labelTop    = $("<div class='nictSTARSPlotXSliderSlideTarget label_top'    >" + $.nictSTARStouch.formatDate(objNext, null, strTime) + "</div>");
                                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_long'  />"); }
            else                                        $scale       = $("<div class='nictSTARSPlotXSliderSlideTarget scale_short' />");
            break;
        }

        if ($scale       != null) pElement.append($scale      .css("left", intLeft + "px"));
        if ($labelTop    != null) pElement.append($labelTop   .css("left", intLeft + "px").animate({ opacity:"1" }, 1, "swing", function() { $(this).css({ left:"-=" + ($(this).width() / 2) + "px", opacity:"" }); }));
        if ($labelBottom != null) pElement.append($labelBottom.css("left", intLeft + "px").animate({ opacity:"1" }, 1, "swing", function() { $(this).css({ left:"-=" + ($(this).width() / 2) + "px", opacity:"" }); }));
      }

      switch (strXScale)
      {
        case "32768d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() + 12, 1                    , 0                     , 0                        , 0                        );  break;
        case "16384d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() + 12, 1                    , 0                     , 0                        , 0                        );  break;
        case  "8192d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  6, 1                    , 0                     , 0                        , 0                        );  break;
        case  "4096d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case  "2048d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case  "1024d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case   "512d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case   "256d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case   "128d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth() +  1, 1                    , 0                     , 0                        , 0                        );  break;
        case    "64d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate() + 1, 0                     , 0                        , 0                        );  break;
        case    "32d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate() + 1, 0                     , 0                        , 0                        );  break;
        case    "16d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate() + 1, 0                     , 0                        , 0                        );  break;
        case     "8d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate() + 1, 0                     , 0                        , 0                        );  break;
        case     "4d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours() + 2, 0                        , 0                        );  break;
        case     "2d" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours() + 1, 0                        , 0                        );  break;
        case    "24h" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours() + 1, 0                        , 0                        );  break;
        case    "12h" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes() + 30, 0                        );  break;
        case     "6h" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes() + 10, 0                        );  break;
        case     "3h" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes() + 10, 0                        );  break;
        case     "1h" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes() +  1, 0                        );  break;
        case    "30m" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes() +  1, 0                        );  break;
        case    "10m" : objNext = new Date(objNext.getFullYear(), objNext.getMonth()     , objNext.getDate()    , objNext.getHours()    , objNext.getMinutes()     , objNext.getSeconds() + 30);  break;
      }
    }

    var objNext       = $.nictSTARStouch.getNextDate  (objStart, strXScale, 1);
    var aryJpCalendar = $.nictSTARStouch.getJpCalendar(objStart, objNext);

    for (var i01 = 0; i01 < aryJpCalendar.length; i01++)
    {
      var intLeft  = Math.floor((aryJpCalendar[i01].start - objStart) / intPixelMilliseconds);
      var intRight = Math.floor((aryJpCalendar[i01].end   - objStart) / intPixelMilliseconds);
      var $calendar = $("<div class='calendar_bar'/>").addClass(aryJpCalendar[i01].enName).css({ left:intLeft, width:intRight - intLeft });
      pElement.append($calendar);
    }

    return;
  }
/*-----* Get Image *----------------------------------------------------------*/
  if ((firstDate <= $.nictSTARStouch.getNextDate(objDate, strXScale, 1)) && (objDate <= lastDate))
  {
    if (objEnv.extPlot.length > 0)
    {
      $.ajax(
      {
        type     : "GET",
        url      : "img/" + strUrl + objEnv.extPlot + strCache,
        success  : function(pImg)
        {
          var $img = $("<img>");

          if (pComponent
          &&  ((objEnv.xScaleMin && ($Env.xScale.indexOf(objEnv.xScaleMin) < $Env.xScale.indexOf(strXScale)))
          ||   (objEnv.xScaleMax && ($Env.xScale.indexOf(objEnv.xScaleMax) > $Env.xScale.indexOf(strXScale)))))
          {
            var tmpEnv        = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, null);
            var tmpYScale     = tmpEnv.showYScale;
            var tmpYDataScale = tmpEnv.showYDataScale;
            var tmpPlotColor  = tmpEnv.showPlotColor;
                strUrl        = pData + "/" + (tmpEnv.isPlotColor && tmpPlotColor != "" ? tmpPlotColor + "/" : "") + strXScale + "/" + (tmpEnv.isYScale ? tmpYScale + "/" : "") + (tmpEnv.isYScale && !!tmpYDataScale ? tmpYDataScale + "/" : "") + strYear + "/" + pData + "_" + strXScale + (tmpEnv.isYScale ? "-" + tmpYScale : "") + (tmpEnv.isYScale && !!tmpYDataScale ? "_" + tmpYDataScale : "") + "_" + strYear + strMonth + strDay + "_" + strTime;

            $img.attr("src"   , "img/" + strUrl + tmpEnv.extPlot + strCache);
            $img.attr("width" , 900);
            $img.attr("height", parseInt(strYScale, 10) / 1.25);
          }
          else
            $img.attr("src"   , "img/" + strUrl + objEnv.extPlot + strCache);

          pElement.append($img);
        },
        error    : function(pXMLHttpRequest, pTextStatus, pErrorThrown) {   pElement.children(".dl_msg").remove();/*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }
/*-----* Set Event *----------------------------------------------------------*/
    if (objEnv.isEvent)
    {
      if (strXScale.indexOf("d") != -1)
        var strUrl2 = "json/event/" + pData + "/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") + "/" : "") + strXScale + "/" + strYear + "/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") : pData) + "_" + strXScale + "_" + strYear + strMonth + strDay + "_" + strTime  + ".js";
      else
        var strUrl2 = "json/event/" + pData + "/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") + "/" : "") + "24h"     + "/" + strYear + "/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") : pData) + "_" + "24h"     + "_" + strYear + strMonth + strDay + "_" + "000000" + ".js";

      $.ajax(
      {
        type     : "GET",
        url      : strUrl2 + strCache,
        dataType : "json",
        success  : function(pJson)
        {
          var objNextDate    = $.nictSTARStouch.getNextDate(objDate, strXScale, 1);
          var strColorR      = parseInt(objEnv.showEventBgColor.substr(0, 2), 16).toString();
          var strColorG      = parseInt(objEnv.showEventBgColor.substr(2, 2), 16).toString();
          var strColorB      = parseInt(objEnv.showEventBgColor.substr(4, 2), 16).toString();
          var strBgColor     = "rgba(" + strColorR + ", " + strColorG + ", " + strColorB + ", 0.5)";
          var strStartFormat = $Env.showCalendarLocale == 0 ? "%Sy/%Sm/%Sd" : $Env.showCalendarLocale == 1 ? "%Sj年%Sm月%Sd日" : "%Sy(%Sj)/%Sm/%Sd";
          var strEndFormat   = $Env.showCalendarLocale == 0 ? "%Ey/%Em/%Ed" : $Env.showCalendarLocale == 1 ? "%Ej年%Em月%Ed日" : "%Ey(%Ej)/%Em/%Ed";
          var $plotArea      = $("#plot_table .plot_area[mission_id='" + pMission + "'][team_id='" + pTeam + "'][data_id='" + pData + "']" + (typeof pComponent == "string" ? "[component='" + pComponent.replace(/\$.*/, "") + "']" : ""));

          for (var i01 = 0; i01 < pJson.length; i01++)
          {
            var objStart = $.nictSTARStouch.getDate(pJson[i01].start);
            var objEnd   = $.nictSTARStouch.getDate(pJson[i01].end);
            var intWidth = Math.floor((objEnd - objStart) / intPixelMilliseconds);

            if (!((objDate <= objStart && objStart < objNextDate) || (objDate < objEnd && objEnd <= objNextDate && intWidth > $Env.width) || (objStart < objDate && objNextDate < objEnd))) continue;

            var intLeft         = Math.floor((objStart - objDate ) / intPixelMilliseconds);
            var strTop          = pJson[i01].y_position_type == "absolute" ? pJson[i01].y_position + "px" : (parseInt(strYScale) * (pJson[i01].y_position / 100)) + "px";
            var strHeight       = pJson[i01].y_position_type == "absolute" ? pJson[i01].y_length   + "px" : (parseInt(strYScale) * (pJson[i01].y_length   / 100)) + "px";
            var strTitle        = (objEnd - objStart <= 1000 * 60 * 60 * 24 ? $.nictSTARStouch.formatDate(objStart, null, strStartFormat) : $.nictSTARStouch.formatDate(objStart, objEnd, strStartFormat + "~" + strEndFormat)) + " [件数:" + pJson[i01].data.length +  "]"
            var aryBorderStyle  = ["solid", "solid", "solid", "solid"];
            var aryBorderRadius = ["30px" , "30px" , "30px" , "30px" ];
            var $box            = $("<div class='event_box' event_id='" + pJson[i01].id + "' index='" + i01 + "' start_date='" + pJson[i01].start + "' end_date='" + pJson[i01].end + "'></div>");
            var $text           = $("<div class='event_box_text'/>");
            var $line           = $("<div class='event_box_line'/>");
            var $title          = $("<div class='event_box_text_title'>" + strTitle         + "</div>");
            var $body           = $("<div class='event_box_text_body'>"  + pJson[i01].title + "</div>");

            if ( objEnv.showEvent
            && ((objEnv.width    >= intWidth)
            ||  (objEnv.showDate <  objStart        && objDate         <= objStart && objStart <  objNextDate)
            ||  (objEnv.showDate >  objEnd          && objDate         <  objEnd   && objEnd   <= objNextDate)
            ||  (objDate         <= objEnv.showDate && objEnv.showDate <  objNextDate)))
              $box.animate({ opacity:"1" }, 1, "swing", function() { $.nictSTARStouch.createBoxLine($(this)); $(this).children().css({ display:"block"}).animate({ opacity:"1" }, 2000, "swing"); });
            else
              $box.animate({ opacity:"1" }, 1, "swing", function() { $.nictSTARStouch.createBoxLine($(this)); $(this).children().css({ display:"none", opacity:"0" }); });

            if (intWidth < 30)
            {
              intLeft  += parseInt((intWidth - 30) / 2, 10);
              intWidth  = 30;
            }
            else
            {
              if (intLeft  <  0        ) { intWidth += intLeft;              intLeft = 0; aryBorderStyle[3] = "none"; aryBorderRadius[0] = "0px"; aryBorderRadius[3] = "0px"; }
              if (intWidth > $Env.width) { intWidth  = $Env.width - intLeft;              aryBorderStyle[1] = "none"; aryBorderRadius[1] = "0px"; aryBorderRadius[2] = "0px"; }
            }

            if (aryBorderStyle[3]  == "solid" && aryBorderStyle[1] == "none") { intWidth -= 1; }

            $box  .css({ position:"absolute", borderColor:"#" + objEnv.showEventColor, background:strBgColor, left:intLeft + "px"          , top:strTop, width:intWidth + "px", height:strHeight, borderStyle:aryBorderStyle.join(" "), borderRadius:aryBorderRadius.join(" ") });
            $text .css({ position:"absolute", borderColor:"#" + objEnv.showEventColor, background:strBgColor, left:intWidth / 2 + 20 + "px", top:"35px", opacity:"0" });
            $line .css({ position:"absolute", borderColor:"#" + objEnv.showEventColor, opacity:"0", cursor:"auto", pointerEvents:"none" });
            $title.css({ background:"#" + objEnv.showEventColor, color:"#fff" });
            $body .css({ color     :"#" + objEnv.showEventColor });

            $text   .append($title);
            $text   .append($body);
            $box    .append($text);
            $box    .append($line);
            pElement.append($box);
          }

          pElement.children(".event_box").hover(function()
          {
            if (!$.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent).showEvent) $(this).css("cursor", "pointer");
          },
          function()
          {
            $(this).css("cursor", "auto");
          });

          $.each(["touchstart", "mousedown"], function()
          {
            var flgTouch = ((this == "touchstart") ? true : false);

          pElement.off((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchEvent", ".event_box");
          pElement.on ((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchEvent", ".event_box", function(e)
          {
            var flgLeftClick = flgTouch ? true : (e.which == 3 ? false : true);

            if (flgLeftClick)
            {
              if (!$.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent).showEvent)
              {
                if ($(this).children().css("display") == "none")
                {
                  $(this).closest("li").find(".event_box[event_id='" + $(this).attr("event_id") + "']").children().css({ opacity:"0", display:"none" });
                  $(this).children().css("display", "block").animate({ opacity:"1" }, 500, "swing");
                }
                else
                  $(this).children().animate({ opacity:"0" }, 250, "swing", function(){ $(this).css("display", "none"); });

                return false;
              }
            }
            else
            {
              var objStartDate = $.nictSTARStouch.getDate($(this).attr("start_date"));
              var objEndDate   = $.nictSTARStouch.getDate($(this).attr("end_date"));
              if (!(objStartDate <= $Env.showDate && $Env.showDate <= objEndDate)) $.nictSTARStouch.moveMarker(objStartDate);
            }
          });
          });

          pElement.find(".event_box_text").hover    (function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });
          pElement.find(".event_box_text").draggable( { drag : function (pEvent, pUI) { $.nictSTARStouch.createBoxLine($(this).parent()); } });

          $.each(["touchstart", "mousedown"], function()
          {
            var flgTouch = ((this == "touchstart") ? true : false);

          pElement                                 .off((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchDialog", ".event_box_text");
          pElement.data("dblTap.STARStouch", false).on ((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchDialog", ".event_box_text", function()
          {
            if (pElement.data("dblTap.STARStouch"))
            {
              var $this = $(this).parent();
              $(document).one((flgTouch ? "touchend" : "mouseup") + ".nictSTARStouch", function() { $.nictSTARStouch.openEventListDialog($this); });
              pElement.data("dblTap.STARStouch", false);
            }
            else
              pElement.data("dblTap.STARStouch", true);

            setTimeout(function(){ pElement.data("dblTap.STARStouch", false); }, 300);
            return false;
          });
          });
        },
        error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }
/*-----* Set Chronological *--------------------------------------------------*/
    if (objEnv.isChronological)
    {
      $.ajax(
      {
        type     : "GET",
        url      : "json/chronological/" + (typeof pComponent == "string" ? pComponent.replace(/\$.*/, "") : pData) + ".js",
        dataType : "json",
        success  : function(pJson)
        {
          var CRNLGCL_MIN_CIRCLE =  30;
          var CRNLGCL_MAX_CIRCLE = 130;
          var CRNLGCL_EXT_CIRCLE =   5;
          var CRNLGCL_TXT_HEIGHT =  20;
          var objNextDate        = $.nictSTARStouch.getNextDate(objDate, strXScale, 1);
          var $plotArea          = $("#plot_table .plot_area[mission_id='" + pMission + "'][team_id='" + pTeam + "'][data_id='" + pData + "']" + (typeof pComponent == "string" ? "[component='" + pComponent.replace(/\$.*/, "") + "']" : ""));
          var intCanvasWidth     = $("#plot_table .color_bar").offset().left - ($("#plot_table .y_axis").offset().left + $("#plot_table .y_axis").outerWidth(true));
          var aryCanvas          = new Array(Math.floor($plotArea.height() / 5) - 1);
          var intRow             = 1;

          for (var i01 = 0; i01 < pJson.length; i01++)
          {
            var objJson       = pJson[i01];
            var intRowCounter = intRow;

            objJson.start      = $.nictSTARStouch.getDate(objJson.start);
            objJson.end        = $.nictSTARStouch.getDate(objJson.end);
            objJson.circle     = CRNLGCL_MIN_CIRCLE + CRNLGCL_EXT_CIRCLE * (objJson.data.length - 1);
            objJson.circle     = objJson.circle > CRNLGCL_MAX_CIRCLE ? CRNLGCL_MAX_CIRCLE : objJson.circle;
            objJson.textHeight = CRNLGCL_TXT_HEIGHT * objJson.data.length;
            objJson.textHeight = objJson.textHeight > objJson.circle ? Math.ceil(objJson.circle / CRNLGCL_TXT_HEIGHT) * CRNLGCL_TXT_HEIGHT : objJson.textHeight;
            objJson.height     = objJson.textHeight < objJson.circle ? objJson.circle                                                      : objJson.textHeight;

            for (var i02 = 1; i02 <= aryCanvas.length - objJson.height / 5; i02++)
            {
              if (intRowCounter + objJson.height / 5 > aryCanvas.length) intRowCounter = 1;
              objJson.top = intRowCounter * 5;

              for (var i03 = intRowCounter; i03 < intRowCounter + objJson.height / 5; i03++)
              {
                if (i03 >= aryCanvas.length       ) break;
                if (!Array.isArray(aryCanvas[i03])) aryCanvas[i03] = [];
                else
                {
                  for (var i04 = 0; i04 < aryCanvas[i03].length; i04++)
                  {
                    if ((aryCanvas[i03][i04].start <= objJson.start && objJson.start <= aryCanvas[i03][i04].end)
                    ||  (aryCanvas[i03][i04].start <= objJson.End   && objJson.end   <= aryCanvas[i03][i04].end)
                    ||  (aryCanvas[i03][i04].start >  objJson.start && objJson.end   >  aryCanvas[i03][i04].end))
                    {
                      objJson.top = null;
                      break;
                    }
                  }
                }

                if (objJson.top == null) break;
              }

              if (objJson.top != null) break; else intRowCounter += 1;
            }

            if (objJson.top == null) if (intRow + objJson.height / 5 > aryCanvas.length) objJson.top = 5; else objJson.top = intRow * 5;

            for (var i02 = objJson.top / 5; i02 <= (objJson.top + objJson.height) / 5; i02++)
            {
              if (i02 >= aryCanvas.length       ) break;
              if (!Array.isArray(aryCanvas[i02])) aryCanvas[i02] = [];
              aryCanvas[i02].push({ id:objJson.id, start:objJson.start, end:objJson.end, circle:objJson.circle });
            }

            intRow = (objJson.top + objJson.height) / 5 + 1;
            if (intRow >= aryCanvas.length) intRow = 1;
          }

          for (var i01 = 0; i01 < pJson.length; i01++)
          {
            var objJson     = pJson[i01];
            var intDistance = Math.abs($Env.showDate - objJson.start) / intPixelMilliseconds;

            if (!((objDate <= objJson.start && objJson.start < objNextDate) || (objDate < objJson.end && objJson.end <= objNextDate) || (objJson.start < objDate && objNextDate < objJson.end))) continue;

            objJson.left   = Math.floor((objJson.start - objDate      ) / intPixelMilliseconds);
            objJson.width  = Math.ceil ((objJson.end   - objJson.start) / intPixelMilliseconds);

            if (objDate <= objJson.start && objJson.start < objNextDate)
            {
              objJson.textWidth = null;

              for (var i02 = objJson.top / 5; i02 < (objJson.top + objJson.height) / 5; i02++)
              {
                for (var i03 = 0; i03 < aryCanvas[i02].length; i03++)
                {
                  if (aryCanvas[i02][i03].id == objJson.id || aryCanvas[i02][i03].start < objJson.start) continue;
                  var intTextWidth = Math.floor((aryCanvas[i02][i03].start - objJson.start) / intPixelMilliseconds) - Math.floor(aryCanvas[i02][i03].circle / 2) - Math.floor(objJson.circle / 2) - 10;
                  if (objJson.textWidth == null || objJson.textWidth > intTextWidth) objJson.textWidth = intTextWidth;
                }
              }

              if (objJson.textWidth != null && objJson.textWidth <= 0) objJson.textWidth = 0;
            }
            else
              objJson.circle = 0;
          }

          for (var i01 = 0; i01 < pJson.length; i01++)
          {
            var objJson  = pJson[i01];

            if (typeof objJson.left !== "number"  )   continue;
            if (       objJson.left <   0         ) { objJson.width += objJson.left; objJson.left = 0; }

            var $box = $("<div class='chronological_box nictSTARSPlotXSliderSlideTarget' schedule_id='" + objJson.id + "' start_date='" + $.nictSTARStouch.formatDate(objJson.start, null, "%Sy/%Smm/%Sdd %SH:%SM:%SS") + "' end_date='" + $.nictSTARStouch.formatDate(objJson.end, null, "%Sy/%Smm/%Sdd %SH:%SM:%SS") + "' />");
            $box.css({ position:"absolute", left:objJson.left + "px", top:objJson.top + "px", width:objJson.width + "px", height:objJson.height + "px" });

            if (objJson.left + objJson.width > $Env.width) objJson.width = $Env.width - objJson.left;

            var $line = $("<div class='chronological_line' line_width='" + objJson.width + "px' />");
            $line.css({ position:"absolute", left:"0px", bottom:"0px", width:objJson.width + "px", height:"1px", background:"#" + objEnv.showPlotColor, opacity:0.5 });
            $box.append($line);

            if (objJson.circle > 0)
            {
              var $circle = $("<div class='chronological_circle' />");
              $circle.css({ position:"absolute", left:Math.floor(objJson.circle / 2 * -1) + "px", bottom:"0px", width:objJson.circle + "px", height:objJson.circle + "px", borderRadius:objJson.circle + "px", background:"#" + objEnv.showPlotColor, opacity:0.5 });
              $box.append($circle);

              var intListCount = objJson.textHeight / CRNLGCL_TXT_HEIGHT;
              var $ul          = $("<ul class='chronological_text' text_height='" + objJson.textHeight + "px' text_width='" + (objJson.textWidth == null ? "" : objJson.textWidth + "px") + "' />");
              $ul.css({ position:"absolute", left:Math.floor(objJson.circle / 2) + "px", bottom:"0px", height:"0px", overflow:"hidden", fontSize: Math.floor(CRNLGCL_TXT_HEIGHT * 0.6) + "px", listStyleType:"none", padding:"0 0 0 5px", color:"#" + objEnv.showPlotColor });

              $ul.animate({ height:"0px" }, 1, "swing", function()
              {
                var intWidth  = parseInt($(this).attr("text_width"), 10);
                if (!isNaN(intWidth) && intWidth < $(this).width()) $(this).css("width", intWidth + "px");

                if (objEnv.showChronological) $(this).animate({ height:$(this).attr("text_height") }, 1500, "swing", function()
                {
                  var $text        = $(this);
                  var $box         = $(this).closest(".plot_area").find(".chronological_box[schedule_id='" + $(this).parent().attr("schedule_id") + "']:last");
                  var $line        = $box.children(".chronological_line"); if ($line.length <= 0) return;
                  var intBoxRight  = $box .offset().left + $box .outerWidth(true);
                  var intTextRight = $text.offset().left + $text.outerWidth(true);

                  if (intTextRight > intBoxRight) $line.css("width", (intTextRight - $line.offset().left) + "px");
                });
              });

              for (var i02 = 0; i02 < objJson.data.length; i02++)
              {
                var $li = $("<li class='chronological_text_item' schedule_id='" + objJson.data[i02].id + "'>" + objJson.data[i02].summary + "</li>");
                $li.css({ position: "relative", height:CRNLGCL_TXT_HEIGHT + "px", "z-index":1 });
                $ul.append($li);
                if (intListCount - 1 <= i02) break;
              }

              if (intListCount < objJson.data.length)
              {
                var $li = $("<li class='chronological_text_list'>...</li>");
                $li.css({ height:CRNLGCL_TXT_HEIGHT + "px" });
                $ul.children(":last").remove();
                $ul.append($li);
              }

              $box.append($ul);
            }
            else
              $box.css("pointer-events", "none");

            pElement.append($box);
          }

          pElement.find(".chronological_box").hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });

          $.each(["touchstart", "mousedown"], function()
          {
            var flgTouch = ((this == "touchstart") ? true : false);

          pElement.find(".chronological_box").on((flgTouch ? "touchstart" : "mousedown") + ".nictSTARStouchDialog", "*", function(e)
          {
            if ($(this).hasClass("chronological_circle"))
            {
              var flgLeftClick = flgTouch ? true : (e.which == 3 ? false : true);

              if (flgLeftClick)
                $.nictSTARStouch.openListViewDialog($(this).parent());
              else
              {
                var objStartDate = $.nictSTARStouch.getDate($(this).parent().attr("start_date"));
                var objEndDate   = $.nictSTARStouch.getDate($(this).parent().attr("end_date"));
                if (!(objStartDate <= $Env.showDate && $Env.showDate <= objEndDate)) $.nictSTARStouch.moveMarker(objStartDate);
              }
            }
            else if ($(this).hasClass("chronological_text_list")) $.nictSTARStouch.openListViewDialog($(this).parent().parent());
            else if ($(this).hasClass("chronological_text_item")) $.nictSTARStouch.openDataViewDialog($(this).parent().parent(), $(this).attr("schedule_id"));

            return false;
            });
          });
        },
        error    : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }

    $("#plot_table").trigger("loadContent.nictSTARStouch", [pElement, pMission, pTeam, pData, pComponent]);
  }
/*-----* Cache *--------------------------------------------------------------*/
  if (objEnv.extPlot.length == 0) return;

/*
  setTimeout(function()
  {
    var strDir      = "img/";
    var strExt      = objEnv.extPlot;
    var objPrevDate = $.nictSTARStouch.getNextDate(objDate, strXScale, -1);
    var objNextDate = $.nictSTARStouch.getNextDate(objDate, strXScale,  1);
    var strPrevDate = $.nictSTARStouch.formatDate (objPrevDate, null, "%Sy%Smm%Sdd_%SH%SM%SS");
    var strNextDate = $.nictSTARStouch.formatDate (objNextDate, null, "%Sy%Smm%Sdd_%SH%SM%SS");
    var strPrevYear = strPrevDate.substr(0, 4);
    var strNextYear = strNextDate.substr(0, 4);
    var strPrevUrl  = strDir + strUrl.replace(new RegExp(strYear + "(/.+_)" + strYear + strMonth + strDay + "_" + strTime), strPrevYear + "$1" + strPrevDate) + strExt;
    var strNextUrl  = strDir + strUrl.replace(new RegExp(strYear + "(/.+_)" + strYear + strMonth + strDay + "_" + strTime), strNextYear + "$1" + strNextDate) + strExt;

    if ((firstDate <= $.nictSTARStouch.getNextDate(objPrevDate, strXScale, 1)) && (objPrevDate <= lastDate)) $.ajax({ type:"GET", url:strPrevUrl});
    if ((firstDate <= $.nictSTARStouch.getNextDate(objNextDate, strXScale, 1)) && (objNextDate <= lastDate)) $.ajax({ type:"GET", url:strNextUrl});

    var aryXScale = [];
    var intIndex  = $Env.xScale.indexOf(strXScale);

    if (intIndex > 0                                                          ) aryXScale.push($Env.xScale[intIndex           - 1]);
    if (intIndex < $Env.xScale.length - 1                                     ) aryXScale.push($Env.xScale[intIndex           + 1]);
//  if (intIndex > 1                      && intIndex < 5                     ) aryXScale.push($Env.xScale[0                     ]);
//  if (intIndex > 4                                                          ) aryXScale.push($Env.xScale[intIndex           - 4]);
//  if (intIndex < $Env.xScale.length - 2 && intIndex > $Env.xScale.length - 6) aryXScale.push($Env.xScale[$Env.xScale.length - 1]);
//  if (intIndex < $Env.xScale.length - 5                                     ) aryXScale.push($Env.xScale[intIndex           + 4]);

    for (var i01 = 0; i01 < aryXScale.length; i01++)
    {
      if ($Env.xScale[i01] == strXScale) continue;

      var objZoomDate = $.nictSTARStouch.getZoomDate($Env.showDate, aryXScale[i01]);
      var objPrevDate = $.nictSTARStouch.getNextDate(objZoomDate  , aryXScale[i01], -1);
      var objNextDate = $.nictSTARStouch.getNextDate(objZoomDate  , aryXScale[i01],  1);
      var strZoomDate = $.nictSTARStouch.formatDate (objZoomDate  , null          , "%Sy%Smm%Sdd_%SH%SM%SS");
      var strPrevDate = $.nictSTARStouch.formatDate (objPrevDate  , null          , "%Sy%Smm%Sdd_%SH%SM%SS");
      var strNextDate = $.nictSTARStouch.formatDate (objNextDate  , null          , "%Sy%Smm%Sdd_%SH%SM%SS");
      var strZoomYear = strZoomDate.substr(0, 4);
      var strPrevYear = strPrevDate.substr(0, 4);
      var strNextYear = strNextDate.substr(0, 4);
      var strZoomUrl  = strDir + strUrl.replace(new RegExp(strXScale   + "(.+)"   + strYear + "(/.+_)" + strXScale + "(.+)" + strYear + strMonth + strDay + "_" + strTime), aryXScale[i01] + "$1" + strZoomYear + "$2" + aryXScale[i01] + "$3" + strZoomDate) + strExt;
      var strPrevUrl  =      strZoomUrl.replace(new RegExp(strZoomYear + "(/.+_)" + strZoomDate), strPrevYear + "$1" + strPrevDate);
      var strNextUrl  =      strZoomUrl.replace(new RegExp(strZoomYear + "(/.+_)" + strZoomDate), strNextYear + "$1" + strNextDate);

      if ((firstDate <= $.nictSTARStouch.getNextDate(objZoomDate, aryXScale[i01], 1)) && (objZoomDate <= lastDate)) $.ajax({ type:"GET", url:strZoomUrl });
      if ((firstDate <= $.nictSTARStouch.getNextDate(objPrevDate, aryXScale[i01], 1)) && (objPrevDate <= lastDate)) $.ajax({ type:"GET", url:strPrevUrl });
      if ((firstDate <= $.nictSTARStouch.getNextDate(objNextDate, aryXScale[i01], 1)) && (objNextDate <= lastDate)) $.ajax({ type:"GET", url:strNextUrl });
    }

    if ((pElement.children().size() > 0) && (objEnv.yScale.length > 0))
    {
      for (var i01 = 0; i01 < objEnv.yScale.length; i01++)
      {
        var strOtherYUrl = strDir + strUrl.replace(new RegExp("(" + strXScale + "/)" + strYScale + "(/" + strYear + "/.+-)" + strYScale), "$1" + objEnv.yScale[i01] + "$2" + objEnv.yScale[i01]) + strExt;
        $.ajax({ type:"GET", url:strOtherYUrl });
      }
    }
  }, 300);
*/
},
/******************************************************************************/
/** nictSTARStouch.setZeroAxisContents                                        */
/******************************************************************************/
setZeroAxisContents : function(pElement, pMission, pTeam, pData, pComponent, pYScale, pZeroAxis)
{
/*-----* Variable *-----------------------------------------------------------*/
  var objEnv = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);

/*-----* Set Zero Axis -------------------------------------------------------*/
  if (objEnv.isZeroAxis && pZeroAxis == "on")
  {
    var strScaleMin = objEnv.scaleMin;
    var strScaleMax = objEnv.scaleMax;

    if (objEnv.isYScale && strScaleMax >= 0 && strScaleMin <= 0)
    {
      var zeroAxisPos = parseFloat(strScaleMax) / (parseFloat(strScaleMax) - parseFloat(strScaleMin)) * parseFloat(pYScale - 1);
      pElement.append("<hr style='position: absolute; top: " + Math.round(zeroAxisPos).toString() + "px; margin-top:0px; margin-left: 0px; margin-bottom: 0px; width:900px; border-top: 1px solid #aaaaaa; border-bottom: 0px; border-left: 0px; border-right: 0px; z-index: 1;'/>");
    }
  }
},
/******************************************************************************/
/** nictSTARStouch.setOutOfRangeContents                                      */
/******************************************************************************/
setOutOfRangeContents : function(pElement, pMission, pTeam, pData, pComponent, intHeight)
{
/*-----* Variable *-----------------------------------------------------------*/
  var objEnv    = $.nictSTARStouch.getEnvironment(pMission, pTeam, pData, pComponent);
  var objDate   = $.nictSTARStouch.getDate       (pElement);
  var strXScale = pElement.attr("x_scale");
  var strYScale = (!!pElement.attr("y_scale") ? ((objEnv.plotType == "thumbnail") ? (parseInt(pElement.attr("y_scale"), 10) + 20).toString(10) : pElement.attr("y_scale")) : intHeight.toString(10));
/*-----* Get Image *----------------------------------------------------------*/
  if (!!objEnv.isOutOfRange)
  {
    var firstDate = new Date(objEnv.firstDate);
    var lastDate  = new Date(objEnv.lastDate);

    firstDate.setMilliseconds(firstDate.getMilliseconds() + $.nictSTARStouch.getPixelMilliseconds(strXScale) * objEnv.firstDateMargin * -1);
    lastDate.setMilliseconds (lastDate.getMilliseconds()  + $.nictSTARStouch.getPixelMilliseconds(strXScale) * objEnv.lastDateMargin      );

    if (($.nictSTARStouch.getNextDate(objDate, strXScale, 1) < firstDate) || (lastDate < objDate))
    {
      pElement.append("<div class='nict-stars-out-of-data nictSTARSPlotXSliderTransformTarget' style='position: absolute; top: 0px; left: 0px; width: 900px; height: " + strYScale + "px; background-color: #" + objEnv.outOfRangeColor + ";'/>")
    }
    else
    {
      if (objDate < firstDate)
      {
        var intWidth = Math.round((firstDate - objDate) / ($.nictSTARStouch.getNextDate(objDate, strXScale, 1) - objDate) * 900);
        pElement.append("<div class='nict-stars-out-of-data nictSTARSPlotXSliderTransformTarget' style='position: absolute; top: 0px; left: 0px; width: " + intWidth + "px; height: " + strYScale + "px; background-color: #" + objEnv.outOfRangeColor + ";'/>")
      }
      if (lastDate < $.nictSTARStouch.getNextDate(objDate, strXScale, 1))
      {
        var intWidth = Math.round(($.nictSTARStouch.getNextDate(objDate, strXScale, 1) - lastDate) / ($.nictSTARStouch.getNextDate(objDate, strXScale, 1) - objDate) * 900);
        pElement.append("<div class='nict-stars-out-of-data nictSTARSPlotXSliderTransformTarget' style='position: absolute; top: 0px; left: " + (900 - intWidth) + "px; width: " + intWidth + "px; height: " + strYScale + "px; background-color: #" + objEnv.outOfRangeColor + ";'/>")
      }
    }
  }
},
/******************************************************************************/
/** nictSTARStouch.openListViewDialog                                         */
/******************************************************************************/
openListViewDialog : function(pContents)
{
  $.nictSTARStouch.showListViewDialog(pContents, null, "open");
},
/******************************************************************************/
/** nictSTARStouch.updateListViewDialog                                       */
/******************************************************************************/
updateListViewDialog : function(pContents, pDate)
{
  $.nictSTARStouch.showListViewDialog(pContents, pDate, "update");
},
/******************************************************************************/
/** nictSTARStouch.showListViewDialog                                         */
/******************************************************************************/
showListViewDialog : function(pContents, pDate, pType)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission   =                          $(pContents).parent().parent().attr("mission_id");
  var strTeam      =                          $(pContents).parent().parent().attr("team_id");
  var strData      =                          $(pContents).parent().parent().attr("data_id");
  var strComponent =                          $(pContents).parent().parent().attr("component");
  var strXScale    =                          $(pContents).parent()         .attr("x_scale");
  var objDate      = (!!pDate) ? pDate : $.nictSTARStouch.getDate($(pContents).parent());
  var objPrevDate  = null;
  var objNextDate  = null;
  var objEnv       = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var objJson      = null;
  var $ul          = $("<ul mission_id='" + strMission + "' team_id='" + strTeam + "' data_id='" + strData + "'" + (typeof strComponent == "string" ? " component='" + strComponent.replace(/\$.*/, "") + "'" : "") + "/>");
/*-----* iCalendar *----------------------------------------------------------*/
  if (objEnv.type == "iCalendar")
  {
    var strDate       = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_%SH%SM%SS");
    var strScheduleId = $(pContents).attr("schedule_id");

    $.ajax(
    {
      async    : false,
      type     : "GET",
      url      : "json/chronological/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + ".js",
      dataType : "json",
      success  : function(pJson)
      {
        for(var i01 = 0; i01 < pJson.length; i01++)
        {
          if (pJson[i01].id == strScheduleId) { objJson = pJson[i01]; break; }
        }

        $.nictSTARSLogger.info("open (ListViewDialog/iCalendar)", { action : "open (ListViewDialog/iCalendar)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), count : pJson.length, datetime : $.nictSTARStouch.formatDate(objDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : "json/chronological/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + ".js" });
      },
      error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });
  }
/*-----* other *--------------------------------------------------------------*/
  else if (objEnv.type != "statistics")
  {
    if (!pDate) objDate = $Env.showDate;

    var strDate   = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_000000");
    var strUrl    = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_24h_" + strDate;
    var strCache  = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 
        strXScale = "24h";

    $.ajax(
    {
      async    : false,
      type     : "GET",
      url      : "json/" + strUrl + ".js" + strCache,
      dataType : "json",
      success  : function(pJson)
      {
        if (pJson        .length < 1) return false;
        if (pJson[0].data.length < 1) return false;
          objJson = pJson[0];
        $.nictSTARSLogger.info("open (ListViewDialog/other)", { action : "open (ListViewDialog/other)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), count : objJson.data.length, datetime : $.nictSTARStouch.formatDate(objDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : "json/" + strUrl + ".js" + strCache });
      },
      error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });
  }
/*-----* statistics (PerDay) *------------------------------------------------*/
  else if (parseInt(strXScale, 10) < 256)
  {
    if (!pDate) objDate = $Env.showDate;

    if (objEnv.firstDate.getTime() <= objDate.getTime() && objDate.getTime() <= objEnv.lastDate.getTime())
    {
      var strDate   = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_000000");
      var strUrl    = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_24h_" + strDate;
      var strCache  = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 
          strXScale = "24h";

      $.ajax(
      {
        async    : false,
        type     : "GET",
        url      : "json/" + strUrl + ".js" + strCache,
        dataType : "json",
        success  : function(pJson)
        {
          if (pJson        .length < 1) return false;
          if (pJson[0].data.length < 1) return false;
            objJson = pJson[0];
          $.nictSTARSLogger.info("open (ListViewDialog/statistics PerDay)", { action : "open (ListViewDialog/statistics PerDay)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), count : objJson.count, datetime : $.nictSTARStouch.formatDate(objDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : "json/" + strUrl + ".js" + strCache });
        },
        error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }
  }
/*-----* statistics (PerMonth) *----------------------------------------------*/
  else
  {
    if (!pDate) objDate = new Date($Env.showDate);

    if (objEnv.firstDate.getTime() <= objDate.getTime() && objDate.getTime() <= objEnv.lastDate.getTime())
    {
      var strDate   = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm01_000000");
      var strUrl    = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "1M/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_1M_" + strDate;
      var strCache  = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

      $.ajax(
      {
        async    : false,
        type     : "GET",
        url      : "json/" + strUrl + ".js" + strCache,
        dataType : "json",
        success  : function(pJson)
        {
          if (pJson.length < 1) return false;
            objJson = pJson[0];
          $.nictSTARSLogger.info("open (ListViewDialog/statistics PerMonth)", { action : "open (ListViewDialog/statistics PerMonth)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), count : objJson.count, datetime : $.nictSTARStouch.formatDate(objDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : "json/" + strUrl + ".js" + strCache });
        },
        error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }
  }

  if (!objJson) return false;
/*-----* Create List *--------------------------------------------------------*/
  var strYear  = strDate.substr(0, 4);
  var strMonth = strDate.substr(4, 2);
  var strDay   = strDate.substr(6, 2);
  var strTime  = strDate.substr(9, 6);

  if (objJson.data.length > 0)
  {
    for(var i01 = 0; i01 < objJson.data.length; i01++)
    {
      var strIndex = objEnv.type == "iCalendar" ? objJson.data[i01].id      : i01;
      var strTitle = objEnv.type == "iCalendar" ? objJson.data[i01].summary : objJson.data[i01].title;
      var $li      = $("<li x_scale='" + strXScale + "' year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "'/>");

      $li.append("<span index='" + strIndex + "'>" + objEnv.logo + strTitle + (objEnv.type == "statistics" && objJson.data[i01].page_name.length > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;(" + objJson.data[i01].page_name + ")" : "") + "</span>");

      if (objJson.data[i01].body != "")
        $li.children("span").hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });
      else
        $li.children("span").addClass("no_link");

      $ul.append($li);
    }
  }
  else
  {
    var $li = $("<li x_scale='" + strXScale + "' year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "'/>");
    $li.append("<span index='-1'></span>");
    $ul.append($li);
  }

  $ul.on("touchstart mousedown", "li > span", function(e){ $.nictSTARStouch.openDataViewDialog(this, $(this).attr("index")); return false; });
/*-----* Create Dialog *------------------------------------------------------*/
  if (pType == "update")
  {
    if (objEnv.type != "statistics")
      $.nictSTARStouch.updateDialog("list_view_dialog",
                                    $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)),
                                    $ul
                                   );
    else if (parseInt(strXScale, 10) < 256)
      $.nictSTARStouch.updateDialog("list_view_dialog",
                                    $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)) + "&nbsp;（" + objJson.count + "件）",
                                    $ul
                                   );
    else
      $.nictSTARStouch.updateDialog("list_view_dialog",
                                    $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormatMonth[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)) + "&nbsp;（" + objJson.count + "件）",
                                    $ul
                                   );
  }
  else // if (pType == "open")
  {
    if (objEnv.type != "statistics")
      $.nictSTARStouch.openDialog("list_view_dialog",
                                  objEnv.banner,
                                  objEnv.type == "iCalendar" ? objEnv.caption : "",
                                  $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)),
                                  $ul
                                 );
    else if (parseInt(strXScale, 10) < 256)
      $.nictSTARStouch.openDialog("list_view_dialog",
                                  objEnv.banner,
                                    "",
                                  $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)) + "&nbsp;（" + objJson.count + "件）", 
                                  $ul
                                 );
    else
      $.nictSTARStouch.openDialog("list_view_dialog",
                                  objEnv.banner,
                                    "",
                                  $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormatMonth[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)) + "&nbsp;（" + objJson.count + "件）",
                                  $ul
                                 );
  }
/*-----* Change Date *--------------------------------------------------------*/
  if (!!objJson.previous) objPrevDate = $.nictSTARStouch.getDate(objJson.previous);
  if (!!objJson.next)     objNextDate = $.nictSTARStouch.getDate(objJson.next);
  if (!!objJson.previous && objPrevDate.getTime() < objEnv.firstDate.getTime()) objPrevDate = null;
  if (!!objJson.next     && objEnv.lastDate.getTime() < objNextDate.getTime())  objNextDate = null;

  if (!!objPrevDate)
  {
    var $button = $("<p class='dialog_prev_date'></p>");
    $button.on("click", function()
    {
      $.nictSTARStouch.updateListViewDialog($ul.children("li").children("span")[0], objPrevDate);
    });
    $("#list_view_dialog").children(".dialog_frame").children(".dialog_header").children(".dialog_date").before($button);
  }
  if (!!objNextDate)
  {
    var $button = $("<p class='dialog_next_date'></p>");
    $button.on("click", function()
    {
      $.nictSTARStouch.updateListViewDialog($ul.children("li").children("span")[0], objNextDate);
    });
    $("#list_view_dialog").children(".dialog_frame").children(".dialog_header").children(".dialog_date").before($button);
  }
/*-----* Move Position *------------------------------------------------------*/
  if (pType == "update")
  {
    $(window).trigger("unload");

    var nextDate     = $.nictSTARStouch.getDate(objJson.start);
    if (objEnv.type != "iCalendar") nextDate.setMilliseconds(($.nictSTARStouch.getDate(objJson.end) - $.nictSTARStouch.getDate(objJson.start)) / 2);

    var intDiffPixel = Math.floor($Env.showDate / $.nictSTARStouch.getPixelMilliseconds($Env.showXScale)) - Math.floor(nextDate / $.nictSTARStouch.getPixelMilliseconds($Env.showXScale));

    if (Math.abs(intDiffPixel) < ($(".plot_area").width() / 2))
    {
      $("#plot_table").trigger("move.nictSTARSPlotXSlider", { left:intDiffPixel, moveMarker:false })
      $("#plot_table").trigger("moveMarker.nictSTARSPlotXSlider");
      $("#plot_table").trigger(   "refresh.nictSTARSPlotXSlider", false);
      $Env.showDate = nextDate;
      $.nictSTARStouch.setMarkerTime();
    }
    else
    {
      $("#calendar_value").datetimepicker("option", "onClose")($.nictSTARStouch.formatDate(nextDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS", $.nictSTARStouch.getTimeZone($Env.showTimeZone)));
    }
  }
/*-----* Scroll Event *-------------------------------------------------------*/
  if ((objEnv.type == "statistics") && (parseInt(strXScale, 10) >= 256))
  {
    $ul.on("scroll", function()
    {
      if (objJson.external.length > 0)
      {
        var scrollTop    = $(this).scrollTop();
        var scrollOffset = $(this).prop("scrollHeight") - $(this).prop("offsetHeight");

        if ($(this).prop("scrollHeight") < 10)
        {
          setTimeout(function(){ $ul.trigger("scroll"); }, 100);
        }
        else if (scrollTop >= scrollOffset)
        {
          var objJsonDay = null;
          var objDate    = new Date(objJson.external.shift());

          if (objEnv.firstDate.getTime() <= objDate.getTime() && objDate.getTime() <= objEnv.lastDate.getTime())
          {
            var strDate    = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_000000");
            var strUrl     = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_24h_" + strDate;
            var strCache   = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

            $.ajax(
            {
              async    : false,
              type     : "GET",
              url      : "json/" + strUrl + ".js" + strCache,
              dataType : "json",
              success  : function(pJson)
              {
                if (pJson.length < 1)         return false;
                if (pJson[0].data.length < 1) return false;
                  objJsonDay = pJson[0];
                $.nictSTARSLogger.info("open (ListViewDialog/statistics PerDay)", { action : "open (ListViewDialog/statistics PerDay)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), count : objJsonDay.count, datetime : $.nictSTARStouch.formatDate(objDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : "json/" + strUrl + ".js" + strCache });
              },
              error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
            });

            var strYear  = strDate.substr(0, 4);
            var strMonth = strDate.substr(4, 2);
            var strDay   = strDate.substr(6, 2);
            var strTime  = strDate.substr(9, 6);

            $(this).append("<p class='dialog_date_sub' year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "'>" + $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJsonDay.start), $.nictSTARStouch.getDate(objJsonDay.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)) + "&nbsp;（" + objJsonDay.count + "件）</p>");

            for(var i01 = 0; i01 < objJsonDay.data.length; i01++)
            {
              var strIndex = objEnv.type == "iCalendar" ? objJsonDay.data[i01].id      : i01;
              var strTitle = objEnv.type == "iCalendar" ? objJsonDay.data[i01].summary : objJsonDay.data[i01].title;
              var $li      = $("<li x_scale='" + strXScale + "' year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "'/>");

              $li.append("<span index='" + strIndex + "'>" + objEnv.logo + strTitle + (objEnv.type == "statistics" && objJsonDay.data[i01].page_name.length > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;(" + objJsonDay.data[i01].page_name + ")" : "") + "</span>");

              if (objJsonDay.data[i01].body != "")
                $li.children("span").hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });
              else
                $li.children("span").addClass("no_link");

              $(this).append($li);
            }
          }

          $("body").trigger("scrollDialog.STARStouch");
          setTimeout(function(){ $ul.trigger("scroll"); }, 0);
        }
      }
    });

    setTimeout(function(){ $ul.trigger("scroll"); }, 100);
  }
},
/******************************************************************************/
/** nictSTARStouch.openDataViewDialog                                         */
/******************************************************************************/
openDataViewDialog : function(pContents, pId)
{
  $.nictSTARStouch.showDataViewDialog(pContents, pId, null, "open");
},
/******************************************************************************/
/** nictSTARStouch.updateDataViewDialog                                       */
/******************************************************************************/
updateDataViewDialog : function(pContents, pId, pDate)
{
  $.nictSTARStouch.showDataViewDialog(pContents, pId, pDate, "update");
},
/******************************************************************************/
/** nictSTARStouch.showDataViewDialog                                         */
/******************************************************************************/
showDataViewDialog : function(pContents, pId, pDate, pType)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission    = $(pContents).parent().parent().attr("mission_id");
  var strTeam       = $(pContents).parent().parent().attr("team_id");
  var strData       = $(pContents).parent().parent().attr("data_id");
  var strComponent  = $(pContents).parent().parent().attr("component");
  var strXScale     = $(pContents).parent()         .attr("x_scale");
  var strYScale     = $(pContents).parent()         .attr("y_scale");
  var strYDataScale = $(pContents).parent()         .attr("y_data_scale");
  var objEnv        = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var strDateFormat = objEnv.dateFormat[$Env.showCalendarLocale];
  var objPrevDate   = null;
  var objNextDate   = null;
  var intPrevId     = null;
  var intNextId     = null;
  var objJson       = null;
  var $body;
/*-----* Statistics *---------------------------------------------------------*/
  if (objEnv.type == "statistics")
  {
    var objDate  = $.nictSTARStouch.getDate($(pContents).parent());

    if (objEnv.firstDate.getTime() <= objDate.getTime() && objDate.getTime() <= objEnv.lastDate.getTime())
    {
      var strDate  = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_000000");
      var strUrl   = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_24h_" + strDate;
      var strCache = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 
      var intIndex = parseInt(pId, 10);

      $.ajax(
      {
        async    : false,
        type     : "GET",
        url      : "json/" + strUrl + ".js" + strCache,
        dataType : "json",
        success  : function(pJson)
        {
          if (pJson        .length <         1) return false;
          if (pJson[0].data.length <= intIndex) return false;
          objJson = { start:pJson[0].start, end:pJson[0].end, title:pJson[0].data[intIndex].title + (pJson[0].data[intIndex].page_name.length > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;(" + pJson[0].data[intIndex].page_name + ")" : ""), body:pJson[0].data[intIndex].body };
          $.nictSTARSLogger.info("open (DataViewDialog/Statistics)", { action : "open (DataViewDialog/Statistics)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), start : objJson.start, end : objJson.end, title : objJson.title, url : "json/" + strUrl + ".js" + strCache });
        },
        error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
      });
    }
  }
/*-----* iCalendar *----------------------------------------------------------*/
  else if (objEnv.type == "iCalendar")
  {
    $.ajax(
    {
      async    : false,
      type     : "GET",
      url      : "json/chronological/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + ".js",
      dataType : "json",
      success  : function(pJson)
      {
        var strStartFormat = $Env.showCalendarLocale == 0 ? "%Sy/%Sm/%Sd" : $Env.showCalendarLocale == 1 ? "%Sj年%Sm月%Sd日" : "%Sy(%Sj)/%Sm/%Sd";

        for(var i01 = 0; i01 < pJson.length; i01++)
        {
          for(var i02 = 0; i02 < pJson[i01].data.length; i02++)
          {
            if (pJson[i01].data[i02].id != pId) continue;

            if (pJson[i01].data[i02].rule)
            {
              var objRule      = pJson[i01].data[i02].rule;
              var objStart     =                 $.nictSTARStouch.getDate(objRule.start);
              var objEnd       =                 $.nictSTARStouch.getDate(objRule.end);
              var objUntil     = objRule.until ? $.nictSTARStouch.getDate(objRule.until) : null;
              var objFrequency = { DAILY:"day"   , WEEKLY:"week"  , MONTHLY:"month"  , YEARLY:"year" };
              var objWeek      = { SU   :"Sunday", MO    :"Monday", TU     :"Tuesday", WE    :"Wednesday", TH:"Thursday", FR:"Friday", SA:"Saturday" };
              var aryDate      = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];

              if (objRule.by_day)
              {
                var strWeek;
                var intWeek;

                for (var i03 = 0; i03 < objRule.by_day.length; i03++)
                {
                  strWeek             =        objRule.by_day[i03].replace(/[0-9]/g, "");
                  intWeek             = Number(objRule.by_day[i03].replace(/[A-Z]/g, ""));
                  intWeek             = isNaN(intWeek) ? 0 : intWeek;
                  objRule.by_day[i03] = (intWeek > 0 ? aryDate[intWeek] + " " : "") + objWeek[strWeek];
                }
              }

              if (objRule.by_month_day)
              {
                for (var i03 = 0; i03 < objRule.by_month_day.length; i03++)
                {
                  objRule.by_month_day[i03] = aryDate[Number(objRule.by_month_day[i03])];
                }
              }

              if (objRule.interval) strDateFormat = "Interval : every " + objRule.interval + " " + objFrequency[objRule.frequency] + "s" + "<br/>";
              else                  strDateFormat = "Interval : every " +                          objFrequency[objRule.frequency] +       "<br/>";

                   if (objRule.frequency == "WEEKLY" )                             strDateFormat += "Day  : " + objRule.by_day      .join(", ") + "<br/>";
              else if (objRule.frequency == "MONTHLY") { if (objRule.by_day      ) strDateFormat += "Day  : " + objRule.by_day      .join(", ") + "<br/>";
                                                         if (objRule.by_month_day) strDateFormat += "Date : " + objRule.by_month_day.join(", ") + "<br/>"; }
              else if (objRule.frequency == "YEARLY" )                             strDateFormat += "Date : " + "%Sm/%Sd"                       + "<br/>";

              strDateFormat += "Period : " + strStartFormat + " ~ " + (objRule.count ? objRule.count + " times" : "") + (objUntil ? $.nictSTARStouch.formatDate(objUntil, null, strStartFormat, $.nictSTARStouch.getTimeZone($Env.showTimeZone)) : "") + "<br/>";
              strDateFormat += objEnd - objStart < 86400000 ? "Time : %SH:%SM ~ %EH:%EM" : "";
              objJson        = { start:objRule.start, end:objRule.end, title:pJson[i01].data[i02].summary, body:pJson[i01].data[i02].description };
            }
            else
              objJson        = { start:pJson[i01].data[i02].start, end:pJson[i01].data[i02].end, title:pJson[i01].data[i02].summary, body:pJson[i01].data[i02].description };

            if (objJson.body == "") objJson.body = "&nbsp;";
            break;
          }
        }
        $.nictSTARSLogger.info("open (DataViewDialog/Calendar)", { action : "open (DataViewDialog/Calendar)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), url : "json/chronological/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + ".js" });
      },
      error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });
  }
/*-----* other *--------------------------------------------------------------*/
  else
  {
    var objDate = $Env.showDate;

    if (typeof pId === "undefined")
    {
      var intPixelMilliseconds = $.nictSTARStouch.getPixelMilliseconds(strXScale);
      var objZoomDate          = $.nictSTARStouch.getZoomDate($Env.showDate, strXScale);
      var strCorrectYear       = $.nictSTARStouch.formatDate(objZoomDate, null, "%Sy");
      var strCorrectMonth      = $.nictSTARStouch.formatDate(objZoomDate, null, "%Smm");
      var strCorrectDay        = $.nictSTARStouch.formatDate(objZoomDate, null, "%Sdd");
      var strCorrectTime       = $.nictSTARStouch.formatDate(objZoomDate, null, "%SH%SM%SS");
      var strCorrectUrl        = strData + "/" + (objEnv.isPlotColor && objEnv.showPlotColor != "" ? objEnv.showPlotColor + "/" : "") + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") + "/" : "") + strXScale + "/" + (objEnv.isYScale ? strYScale + "/" : "") + (objEnv.isYScale && !!strYDataScale ? strYDataScale + "/" : "") + strCorrectYear + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + "_" + strXScale + (objEnv.isYScale ? "-" + strYScale : "") + (objEnv.isYScale && !!strYDataScale ? "_" + strYDataScale : "") + "_" + strCorrectYear + strCorrectMonth + strCorrectDay + "_" + strCorrectTime;

      $.ajax(
      {
        async    : false,
        type     : "GET",
        url      : "img/" + strCorrectUrl + ".js",
        dataType : "json",
        success  : function(pJson)
        {
          var objCorrectJson     = null;
          var intCurrentPosition = Math.abs($Env.showDate - objZoomDate) / intPixelMilliseconds;
          var intStartPosition   = null;
          var intEndPosition     = null;

          for(var i01 = 0; i01 < pJson.length; i01++)
          {
            objCorrectJson   = pJson[i01];
            intStartPosition = parseInt(objCorrectJson.left, 10);
            intEndPosition   = parseInt(objCorrectJson.left, 10) + parseInt(objCorrectJson.width, 10);

            if (intStartPosition <= intCurrentPosition && intCurrentPosition <= intEndPosition)
              objDate = $.nictSTARStouch.getDate(objCorrectJson.date);
          }

          $.nictSTARSLogger.info("open (DataViewDialog/other)", { action : "open (DataViewDialog/other)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), url : "img/" + strCorrectUrl + ".js" });
        },
        error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /* DO NOTHING */ }
      });
    }
    else
    {
      objDate = pDate;
    }

    var strDate  = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_000000");
    var strUrl   = strData + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h/" + strDate.substr(0, 4) + "/" + ((typeof strComponent == "string" && objEnv.dialogBase != "data") ? strComponent.replace(/\$.*/, "") : strData) + "_24h_" + strDate;
    var strCache = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

    $.ajax(
    {
      async    : false,
      type     : "GET",
      url      : "json/" + strUrl + ".js" + strCache,
      dataType : "json",
      success  : function(pJson)
      {
        var objStart;
        var objEnd;
        var intDistance;

        if (typeof pId === "undefined")
        {
          for(var i01 = 0; i01 < pJson.length; i01++)
          {
            objJson     = pJson[i01];
            objStart    = $.nictSTARStouch.getDate(objJson.start);
            objEnd      = $.nictSTARStouch.getDate(objJson.end);
            intDistance = (Math.abs(objStart - objDate) < Math.abs(objEnd - objDate) ? Math.abs(objStart - objDate) : Math.abs(objEnd - objDate));

            if (objStart <= objDate && objDate <= objEnd)
            {
              objPrevDate = (!!objJson.previous) ? $.nictSTARStouch.getDate(objJson.previous) : null;
              objNextDate = (!!objJson.next)     ? $.nictSTARStouch.getDate(objJson.next)     : null;
              intPrevId   = i01 - 1;
              intNextId   = i01 + 1;
              break;
            }

            if (i01 < pJson.length - 1)
            {
              var objNextStart     = $.nictSTARStouch.getDate(pJson[i01 + 1].start);
              var objNextEnd       = $.nictSTARStouch.getDate(pJson[i01 + 1].end);
              var intNextDistance  = (Math.abs(objNextStart - objDate) < Math.abs(objNextEnd - objDate) ? Math.abs(objNextStart - objDate) : Math.abs(objNextEnd - objDate));

              if (intNextDistance > intDistance)
              {
                objPrevDate = (!!objJson.previous) ? $.nictSTARStouch.getDate(objJson.previous) : null;
                objNextDate = (!!objJson.next)     ? $.nictSTARStouch.getDate(objJson.next)     : null;
                intPrevId   = i01 - 1;
                intNextId   = i01 + 1;
                break;
              }
            }
            else
            {
              objPrevDate = (!!objJson.previous) ? $.nictSTARStouch.getDate(objJson.previous) : null;
              objNextDate = (!!objJson.next)     ? $.nictSTARStouch.getDate(objJson.next)     : null;
              intPrevId   = i01 - 1;
              intNextId   = i01 + 1;
            }
          }
        }
        else
        {
          if (pId == -1) pId = pJson.length - 1;

          objJson     = pJson[pId];
          objPrevDate = (!!objJson.previous) ? $.nictSTARStouch.getDate(objJson.previous) : null;
          objNextDate = (!!objJson.next)     ? $.nictSTARStouch.getDate(objJson.next)     : null;
          intPrevId   = pId - 1;
          intNextId   = pId + 1;
        }

        if (!(objStart <= objDate && objDate <= objEnd) && intDistance / intPixelMilliseconds > 45)
        {
          objJson = null;
          return false;
        }

        if (intPrevId >= 0)
          objPrevDate = objDate;
        else
          intPrevId = -1;

        if (intNextId < pJson.length)
          objNextDate = objDate;
        else
          intNextId = 0;

        if (!!objPrevDate && objPrevDate.getTime() < objEnv.firstDate.getTime())
          objPrevDate = null;

        if (!!objNextDate && objEnv.lastDate.getTime() < objNextDate.getTime())
          objNextDate = null;

        $.nictSTARSLogger.info("open (DataViewDialog)", { action : "open (DataViewDialog)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), pid : pId, prev : (!!objPrevDate ? $.nictSTARStouch.formatDate(objPrevDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS") : ""), next : (!!objNextDate ? $.nictSTARStouch.formatDate(objNextDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS") : ""), url : "json/" + strUrl + ".js" + strCache });
      },
      error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });
  }

  if (!objJson           ) return false;
  if ( objJson.body == "") return false;
/*-----* Create Dialog *------------------------------------------------------*/
  $body = $("<p>" + objJson.body + "</p>");

  if (pType == "update")
  {
    $.nictSTARStouch.updateDialog("data_view_dialog",
                                  $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), strDateFormat, $.nictSTARStouch.getTimeZone($Env.showTimeZone)),
                                  $body
                                 );
  }
  else  // if (pType == "open")
  {
    $.nictSTARStouch.openDialog("data_view_dialog",
                                objEnv .banner,
                                objJson.title,
                                $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), strDateFormat, $.nictSTARStouch.getTimeZone($Env.showTimeZone)),
                                $body
                               );
  }

  $body.children("a").children("img").css("width", $(window).width() * 0.35 + "px");

  if (!!strMission)    $body           .attr("mission_id",   strMission)
  if (!!strTeam)       $body           .attr("team_id",      strTeam)
  if (!!strData)       $body           .attr("data_id",      strData)
  if (!!strComponent)  $body           .attr("component_id", strComponent)
  if (!!strXScale)     $body.children().attr("x_scale",      strXScale)
  if (!!strYScale)     $body.children().attr("y_scale",      strYScale)
  if (!!strYDataScale) $body.children().attr("y_data_scale", strYDataScale)
/*-----* Change Date *--------------------------------------------------------*/
  if (!!objPrevDate)
  {
    var $button = $("<p class='dialog_prev_date'></p>");
    $button.on("click", function()
    {
      $.nictSTARStouch.updateDataViewDialog($body.children().children()[0], intPrevId, objPrevDate);
    });
    $("#data_view_dialog").children(".dialog_frame").children(".dialog_header").children(".dialog_date").before($button);
  }
  if (!!objNextDate)
  {
    var $button = $("<p class='dialog_next_date'></p>");
    $button.on("click", function()
    {
      $.nictSTARStouch.updateDataViewDialog($body.children().children()[0], intNextId, objNextDate);
    });
    $("#data_view_dialog").children(".dialog_frame").children(".dialog_header").children(".dialog_date").before($button);
  }
/*-----* Move Position *------------------------------------------------------*/
  if (pType == "update")
  {
    $(window).trigger("unload");

    var nextDate     = $.nictSTARStouch.getDate(objJson.start);
    if (objEnv.type != "iCalendar") nextDate.setMilliseconds(($.nictSTARStouch.getDate(objJson.end) - $.nictSTARStouch.getDate(objJson.start)) / 2);

    var intDiffPixel = Math.floor($Env.showDate / $.nictSTARStouch.getPixelMilliseconds($Env.showXScale)) - Math.floor(nextDate / $.nictSTARStouch.getPixelMilliseconds($Env.showXScale));

    if (Math.abs(intDiffPixel) < ($(".plot_area").width() / 2))
    {
      $("#plot_table").trigger("move.nictSTARSPlotXSlider", { left:intDiffPixel, moveMarker:false })
      $("#plot_table").trigger("moveMarker.nictSTARSPlotXSlider");
      $("#plot_table").trigger(   "refresh.nictSTARSPlotXSlider", false);
      $Env.showDate = nextDate;
      $.nictSTARStouch.setMarkerTime();
    }
    else
    {
      $("#calendar_value").datetimepicker("option", "onClose")($.nictSTARStouch.formatDate(nextDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS", $.nictSTARStouch.getTimeZone($Env.showTimeZone)));
    }
  }
},
/******************************************************************************/
/** nictSTARStouch.openDataDownloadDialog                                     */
/******************************************************************************/
openDataDownloadDialog : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission    =                          $(pContents).attr("mission_id");
  var strTeam       =                          $(pContents).attr("team_id");
  var strData       =                          $(pContents).attr("data_id");
  var strComponent  =                          $(pContents).attr("component_id");
  var objEnv        = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var showDateLeft  = $.nictSTARStouch.getShowDateLeft();
  var showDateRight = $.nictSTARStouch.getShowDateRight();
  var $body         = $("<ul/>");

  $.ajax({
    async    : true,
    type     : "POST",
    url      : objEnv.appDownloadGetSize,
    data     :
    {
      "dataId"    : strData,
      "startTime" : $.nictSTARStouch.formatDate(showDateLeft, null,          "%Sy%Smm%Sdd %SH:%SM:%SS"),
      "endTime"   : $.nictSTARStouch.formatDate(null,         showDateRight, "%Ey%Emm%Edd %EH:%EM:%ES")
    },
    dataType : "json",
    success  : function(pJson)
    {
      $body.children().remove();
      $body.append("<li class='dialog_datasize'>Total Data Size : "     + String(pJson.totalSize).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ) + " Bytes</li>");
      $body.append("<li class='dialog_datanum'>Total Number of Data : " + String(pJson.totalNum ).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ) + "</li>");

      if (!pJson.isDownloadable) {
        $body.append("<li>Download Failed. Please change the selection period.</li>")
      } else {
        if (parseInt(pJson.totalNum, 10) > 0)
        {
          var $download = $("<li class='dialog_download'><ul><li><a href='#'>Prepare Download</a></li></ul></li>");

          $body.append($download);
          $download.on("touchstart mousedown", function(e){
            $download.remove();
            $download = $("<li class='dialog_download'>Preparing to download...</li>");
            $body.append($download);
            $.ajax({
              async    : true,
              type     : "POST",
              url      : objEnv.appDownloadArchive,
              data     :
              {
                "dataId"    : strData,
                "startTime" : $.nictSTARStouch.formatDate(showDateLeft, null,          "%Sy%Smm%Sdd %SH:%SM:%SS"),
                "endTime"   : $.nictSTARStouch.formatDate(null,         showDateRight, "%Ey%Emm%Edd %EH:%EM:%ES")
              },
              dataType : "json",
              success  : function(pJson)
              {
                $download.remove();
                $body.append("<li class='dialog_datasize'>Download Period : " + pJson.limit + "</li>");
                $body.append("<li class='dialog_download'><ul><li><a href='" + pJson.url + "'>" + pJson.url + "</a></li></ul></li>");
              },
              error    : function(pXMLHttpRequest, pTextStatus, pErrorThrown)
              {
                $download.remove();
                if (typeof pErrorThrown == 'string') {
                  $body.append("<li>" + pErrorThrown + "</li>");
                } else {
                  $body.append("<li>" + pErrorThrown.name + "</li>");
                  $body.append("<li><pre><code>" + pErrorThrown.stack + "</code></pre></li>");
                }
              }
            });
            return false;
          });
        }
      }
    },
    error : function(pXMLHttpRequest, pTextStatus, pErrorThrown)
    {
      $body.children().remove();
      $body.append("<li></li>")
      if (typeof pErrorThrown == 'string') {
        $body.append("<li>" + pXMLHttpRequest.status + " : " + pErrorThrown + "</li>");
      } else {
        $body.append("<li>" + pXMLHttpRequest.status + " : " + pErrorThrown.name + "</li>");
        $body.append("<li><pre><code>" + pErrorThrown.stack + "</code></pre></li>");
      }
    }
  });
/*-----* Create Dialog *------------------------------------------------------*/
  $body.append("<li>Calculating data size. Please wait a few minutes...</li>");

  $.nictSTARStouch.openDialog("data_download_dialog",
                              objEnv.banner,
                              "Download Information",
                              $.nictSTARStouch.formatDate(showDateLeft, showDateRight, objEnv.dateFormat[$Env.showCalendarLocale]),
                              $body
                             );

  $body.children("a").children("img").css("width", $(window).width() * 0.25 + "px");
},
/******************************************************************************/
/** nictSTARStouch.openEventListDialog                                        */
/******************************************************************************/
openEventListDialog : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission     =                          $(pContents).parent().parent().attr("mission_id");
  var strTeam        =                          $(pContents).parent().parent().attr("team_id");
  var strData        =                          $(pContents).parent().parent().attr("data_id");
  var strComponent   =                          $(pContents).parent().parent().attr("component");
  var strXScale      =                          $(pContents).parent()         .attr("x_scale");
  var objDate        = $.nictSTARStouch.getDate($(pContents).parent());
  var intIndex       = parseInt                ($(pContents)                  .attr("index"), 10);

  var strDate        = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd%SH%SM%SS");
  var strYear        = strDate.substr(0, 4);
  var strMonth       = strDate.substr(4, 2);
  var strDay         = strDate.substr(6, 2);
  var strTime        = strDate.substr(8, 6);
  var strStartFormat = $Env.showCalendarLocale == 0 ? "%Sy/%Sm/%Sd" : $Env.showCalendarLocale == 1 ? "%Sj年%Sm月%Sd日" : "%Sy(%Sj)/%Sm/%Sd";
  var strEndFormat   = $Env.showCalendarLocale == 0 ? "%Ey/%Em/%Ed" : $Env.showCalendarLocale == 1 ? "%Ej年%Em月%Ed日" : "%Ey(%Ej)/%Em/%Ed";

  var objEnv       = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var objJson      = null;
  var $ul          = $("<ul mission_id='" + strMission + "' team_id='" + strTeam + "' data_id='" + strData + "'" + (typeof strComponent == "string" ? " component='" + strComponent.replace(/\$.*/, "") + "'" : "") + " year='" + strYear + "' month='" + strMonth + "' day='" + strDay + "' time='" + strTime + "' x_scale='" + strXScale + "' index='" + intIndex + "'/>");
/*-----* Get Json *-----------------------------------------------------------*/
  if (strXScale.indexOf("d") != -1)
    var strUrl = "json/event/" + strData + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") + "/" : "") + strXScale + "/" + strYear + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + "_" + strXScale + "_" + strYear + strMonth + strDay + "_" + strTime  + ".js";
  else
    var strUrl = "json/event/" + strData + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h"     + "/" + strYear + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + "_" + "24h"     + "_" + strYear + strMonth + strDay + "_" + "000000" + ".js";

  var strCache = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

  $.ajax(
  {
    async    : false,
    type     : "GET",
    url      : strUrl + strCache,
    dataType : "json",
    success  : function(pJson)                                      { if (pJson.length > intIndex) objJson = pJson[intIndex]; },
    error    : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
  });

  if (!objJson) return false;
/*-----* Create List *--------------------------------------------------------*/
  for(var i01 = 0; i01 < objJson.data.length; i01++)
  {
    var $li = $("<li>");
    $li.append("<span index='" + i01 + "'>" + objEnv.logo + "[" + $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.data[i01].start), null, strStartFormat) + "]" + objJson.data[i01].title + (objEnv.type == "statistics" && objJson.data[i01].page_name.length > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;(" + objJson.data[i01].page_name + ")" : "") + "</span>");

    if (objJson.data[i01].body != "")
      $li.children("span").hover(function(){ $(this).css("cursor", "pointer"); }, function(){ $(this).css("cursor", "auto"); });
    else
      $li.children("span").addClass("no_link");

    $ul.append($li);
  }

  $ul.on("touchstart mousedown", "li > span", function(e){ $.nictSTARStouch.openEventDialog(this); return false; });
/*-----* Create Dialog *------------------------------------------------------*/
  var objStart     = $.nictSTARStouch.getDate(objJson.start);
  var objEnd       = $.nictSTARStouch.getDate(objJson.end);
  var strTitleDate = (objEnd - objStart <= 1000 * 60 * 60 * 24 ? $.nictSTARStouch.formatDate(objStart, null, strStartFormat) : $.nictSTARStouch.formatDate(objStart, objEnd, strStartFormat + "~" + strEndFormat));

  $.nictSTARStouch.openDialog("event_list_dialog",
                              objEnv .banner,
                              "",
                              strTitleDate + " [件数:" + objJson.data.length + "]<br/>" + objJson.title,
                              $ul
                             );

  $.nictSTARSLogger.info("open (EventListDialog)", { action : "open (EventListDialog)", mission : strMission, team : strTeam, data : strData, component : (!!strComponent ? strComponent : ""), start : $.nictSTARStouch.formatDate(objStart, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), end : $.nictSTARStouch.formatDate(objEnd, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), count : objJson.data.length, url : strUrl + strCache });
},
/******************************************************************************/
/** nictSTARStouch.openEventDialog                                            */
/******************************************************************************/
openEventDialog : function(pContents)
{
/*-----* Variable *-----------------------------------------------------------*/
  var strMission   =                          $(pContents).parent().parent().attr("mission_id");
  var strTeam      =                          $(pContents).parent().parent().attr("team_id");
  var strData      =                          $(pContents).parent().parent().attr("data_id");
  var strComponent =                          $(pContents).parent().parent().attr("component");
  var strXScale    =                          $(pContents).parent().parent().attr("x_scale");
  var objDate      = $.nictSTARStouch.getDate($(pContents).parent().parent());
  var intIndex1    = parseInt                ($(pContents).parent().parent().attr("index"), 10);
  var intIndex2    = parseInt                ($(pContents)                  .attr("index"), 10);

  var strDate      = $.nictSTARStouch.formatDate(objDate, null, "%Sy%Smm%Sdd_%SH%SM%SS");
  var objEnv       = $.nictSTARStouch.getEnvironment(strMission, strTeam, strData, strComponent);
  var objJson      = null;
  var $body;
/*-----* Get Json *-----------------------------------------------------------*/
  if (strXScale.indexOf("d") != -1)
    var strUrl = "json/event/" + strData + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") + "/" : "") + strXScale + "/" + strDate.substr(0, 4) + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + "_" + strXScale + "_" + strDate + ".js";
  else
    var strUrl = "json/event/" + strData + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") + "/" : "") + "24h"     + "/" + strDate.substr(0, 4) + "/" + (typeof strComponent == "string" ? strComponent.replace(/\$.*/, "") : strData) + "_" + "24h"     + "_" + strDate.substr(0, 8) + "_" + "000000" + ".js";

  var strCache = (objEnv.cache != "") ? "?ver=" + $.nictSTARStouch.getCacheParameter(objEnv.cache) : ""; 

  $.ajax(
  {
    async    : false,
    type     : "GET",
    url      : strUrl,
    dataType : "json",
    success  : function(pJson)
    {
      if (pJson                .length <= intIndex1) return false;
      if (pJson[intIndex1].data.length <= intIndex2) return false;
      objJson = pJson[intIndex1].data[intIndex2];
    },
    error : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
  });

  if (!objJson          ) return false;
  if (objJson.body == "") return false;
/*-----* Create Dialog *------------------------------------------------------*/
  $body = $("<p>" + objJson.body + "</p>");

  $.nictSTARStouch.openDialog("event_dialog",
                              objEnv .banner,
                              objJson.title + (objJson.page_name.length > 0 ? "&nbsp;&nbsp;&nbsp;&nbsp;(" + objJson.page_name + ")" : ""),
                              $.nictSTARStouch.formatDate($.nictSTARStouch.getDate(objJson.start), $.nictSTARStouch.getDate(objJson.end), objEnv.dateFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)),
                              $body
                             );

  $body.children("a").children("img").css("width", $(window).width() * 0.25 + "px");

  $.nictSTARSLogger.info("open (EventDialog)", { action : "open (EventDialog)", mission : pMission, team : pTeam, data : pData, component : (!!pComponent ? pComponent : ""), title : objJson.title, start : $.nictSTARStouch.formatDate(objJson.start, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), end : $.nictSTARStouch.formatDate(objJson.end, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), url : strUrl });
},
/******************************************************************************/
/** nictSTARStouch.openDialog                                                 */
/******************************************************************************/
openDialog : function(pId, pBanner, pTitle, pDate, pBody, pClose)
{
/*-----* Variable *-----------------------------------------------------------*/
  var $dialog = $("<div id='" + pId + "'/>");
  var $frame  = $("<div class='dialog_frame'/>");
  var $header = $("<div class='dialog_header'/>");
/*-----* Create Dialog *------------------------------------------------------*/
                     $header.append("<div class='dialog_close' >" + (pClose === undefined ? "<a href='#'></a>" : pClose) + "</div>");
  if (pBanner != "") $header.append("<div class='dialog_banner'>" + pBanner +  "</div>");
  if (pTitle  != "") $header.append("<h1  class='dialog_title' >" + pTitle  +  "</h1>");
  if (pDate   != "") $header.append("<p   class='dialog_date'  >" + pDate   +  "</p>");

  $frame.append($header);
  $frame.append(pBody.addClass("dialog_body"));

  if (pClose === undefined) $frame.on("touchstart mousedown", ".dialog_close > a", function(e){ $("#" + pId).find("img").attr("src", ""); $("#" + pId).remove(); return false; });

  $dialog.append($frame);
  $("#" + pId).remove();
  $("body").append($dialog);
/*-----* Style *--------------------------------------------------------------*/
  pBody  .css({ visibility:"hidden" });

  setTimeout(function()
  {
    pBody.css({ visibility:"visible", overflowY:"scroll", height:($frame.height() - $header.height() - 40) + "px", WebkitOverflowScrolling:"touch" });
    $("body").trigger("openDialog.STARStouch");
  }, 300);
/*-----* Window Scroll Lock *-------------------------------------------------*/
  $.nictSTARStouch.setScrollLock(pBody);

  return $dialog;
},
/******************************************************************************/
/** nictSTARStouch.updateDialog                                               */
/******************************************************************************/
updateDialog : function(pId, pDate, pBody)
{
/*-----* Variable *-----------------------------------------------------------*/
  var $dialog = $("#" + pId + "");
  var $frame  = $dialog.children('.dialog_frame');
  var $header = $frame .children('.dialog_header');
/*-----* Cancel Describe *----------------------------------------------------*/
  $frame .children(".dialog_body").find("img").attr("src", "");
/*-----* Update Dialog *------------------------------------------------------*/
  $header.children(".dialog_date").remove();
  $header.children(".dialog_prev_date").remove();
  $header.children(".dialog_next_date").remove();
  $frame .children(".dialog_body").remove();

  if (pDate != "") $header.append("<p class='dialog_date'>" + pDate + "</p>");

  $frame.append(pBody.addClass("dialog_body"));

/*-----* Style *--------------------------------------------------------------*/
  pBody  .css({ visibility:"hidden" });

  setTimeout(function()
  {
    pBody.css({ visibility:"visible", overflowY:"scroll", height:($frame.height() - $header.height() - 40) + "px", WebkitOverflowScrolling:"touch" });
    $("body").trigger("openDialog.STARStouch");
  }, 300);
/*-----* Window Scroll Lock *-------------------------------------------------*/
  $.nictSTARStouch.setScrollLock(pBody);

  return $dialog;
},
/******************************************************************************/
/** nictSTARStouch.fetchDialog                                                */
/******************************************************************************/
fetchDialog : function(pId, pDialog)
{
/*-----* Variable *-----------------------------------------------------------*/
  var $dialog = $(pDialog);
  var $frame  = $dialog.children('.dialog_frame');
  var $header = $frame .children('.dialog_header');
  var $index  = $frame .children('.dialog_index')
  var $body   = $frame .children('.dialog_body');
/*-----* Fetch Dialog *-------------------------------------------------------*/
  $dialog.append($frame);
  $("#" + pId).remove();
  $("body").append($dialog);
/*-----* Style *--------------------------------------------------------------*/
  $index .css({ visibility:"hidden" });
  $body  .css({ visibility:"hidden" });

  setTimeout(function()
  {
    $index.css({ visibility:"", overflowY:"scroll", height:($frame.height() - $header.height() - 40) + "px", WebkitOverflowScrolling:"touch" });
    $body .css({ visibility:"", overflowY:"scroll", height:($frame.height() - $header.height() - 40) + "px", WebkitOverflowScrolling:"touch" });
    $("body").trigger("openDialog.STARStouch");
  }, 300);
/*-----* Window Scroll Lock *-------------------------------------------------*/
  $.nictSTARStouch.setScrollLock($index);
  $.nictSTARStouch.setScrollLock($body);

  return $dialog;
},
/******************************************************************************/
/** nictSTARStouch.refreshDialog                                              */
/******************************************************************************/
refreshDialog : function()
{
/*-----* Variable *-----------------------------------------------------------*/
  $("[id$=_dialog]").each(function()
  {
    var $frame  = $(this).children('.dialog_frame');
    var $header = $frame .children('.dialog_header');
    var $index  = $frame .children('.dialog_index')
    var $body   = $frame .children('.dialog_body');
/*-----* Style *--------------------------------------------------------------*/
    setTimeout(function()
    {
      $index.css({ height:($frame.height() - $header.height() - 40) + "px" });
      $body .css({ height:($frame.height() - $header.height() - 40) + "px" });
      $("body").trigger("openDialog.STARStouch");
    }, 0);
  });
},
/******************************************************************************/
/** nictSTARStouch.setScrollLock                                              */
/******************************************************************************/
setScrollLock : function(pElement)
{
  var intScrollTop;
  var intScrollY;

  pElement.on("mouseenter", function()
  {
    if (!$("body").data("nictSTARStouch.setScrollLock"))
    {
      intScrollTop = $(window).scrollTop();
      $("body").css ({ position:"fixed", top:-intScrollTop + "px", overflowY:"scroll" });
      $("body").data("nictSTARStouch.setScrollLock", true);
    }
  });

  pElement.on("mouseleave", function()
  {
    $("body").css      ({ position:"", top:"", overflowY:"" });
    $("body").data     ("nictSTARStouch.setScrollLock", false);
    $(window).scrollTop(intScrollTop);
  });

  pElement.on("touchstart", function(){ intScrollY = event.changedTouches[0].pageY; intScrollTop = $(window).scrollTop();             });
  pElement.on("touchend"  , function(){                                                            $(window).scrollTop(intScrollTop); });
  pElement.on("touchmove" , function()
  {
    if ($(this).scrollTop() == 0                                                             && (intScrollY <= event.changedTouches[0].pageY))
      event.preventDefault();
    if ($(this).scrollTop() == ($(this).prop("scrollHeight") - $(this).prop("offsetHeight")) && (intScrollY >= event.changedTouches[0].pageY))
      event.preventDefault();

    intScrollY = event.changedTouches[0].pageY;
  });
},
/******************************************************************************/
/** nictSTARStouch.dropout                                                    */
/******************************************************************************/
dropout : function(pContents)
{
  var strMission   = pContents.children().attr("mission_id");
  var strTeam      = pContents.children().attr("team_id");
  var strData      = pContents.children().attr("data_id");
  var strComponent = pContents.children().attr("component");

  if (typeof strComponent == "string")
  {
    $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].show = "off";
    var flgComponent = false;

    for (var strComponent in $Env.mission[strMission].team[strTeam].data[strData].component)
    {
      if ($Env.mission[strMission].team[strTeam].data[strData].component[strComponent].show == "on") flgComponent = true;
    }

    if ($Env.mission[strMission].team[strTeam].data[strData].show == "on" && !flgComponent)
    $Env.mission[strMission].team[strTeam].data[strData].show = "off";
  }
  else
    $Env.mission[strMission].team[strTeam].data[strData].show = "off";
},
/******************************************************************************/
/** nictSTARStouch.createBoxLine                                              */
/******************************************************************************/
createBoxLine : function(pContents)
{
  var objText           = pContents.children   ("[class*='text']");
  var objLine           = pContents.children   ("[class*='line']");
  var intContentsHeight = pContents.outerHeight(true);
  var intContentsWidth  = pContents.outerWidth (true);
  var intTextHeight     = objText  .outerHeight(true);
  var intTextWidth      = objText  .outerWidth (true);
  var intTextTop        = objText  .position   ().top;
  var intTextLeft       = objText  .position   ().left;

  intContentsWidth = $Env.width < intContentsWidth ? $Env.width : intContentsWidth;
  objLine.removeClass("border_tr border_rb border_bl border_lt");
/*-----* Upper Area *---------------------------------------------------------*/
  if (intTextTop + intTextHeight < intContentsHeight / 2)
  {
    var intTop    = intTextTop + intTextHeight;
    var intHeight = intContentsHeight / 2 - intTop;

    if (intTextLeft + intTextWidth / 2 < intContentsWidth / 2)
    {
      var intLeft  = intTextLeft + intTextWidth / 2;
      var intWidth = intContentsWidth / 2 - intLeft;
      objLine.addClass("border_bl");
    }
    else
    {
      var intLeft  = intContentsWidth / 2;
      var intWidth = intTextLeft + intTextWidth / 2 - intLeft;
      objLine.addClass("border_rb");
    }
  }
/*-----* Lower Area *---------------------------------------------------------*/
  else if (intTextTop > intContentsHeight / 2)
  {
    var intTop    = intContentsHeight / 2;
    var intHeight = intTextTop - intTop;

    if (intTextLeft + intTextWidth / 2 < intContentsWidth / 2)
    {
      var intLeft   = intTextLeft + intTextWidth / 2;
      var intWidth = intContentsWidth / 2 - intLeft;
      objLine.addClass("border_lt");
    }
    else
    {
      var intLeft  = intContentsWidth / 2;
      var intWidth  = intTextLeft + intTextWidth / 2 - intLeft;
      objLine.addClass("border_tr");
    }
  }
/*-----* Left Area *----------------------------------------------------------*/
  else if (intTextLeft + intTextWidth < intContentsWidth / 2)
  {
    var intLeft  = intTextLeft + intTextWidth;
    var intWidth = intContentsWidth / 2  - intLeft;

    if (intTextTop + intTextHeight / 2 < intContentsHeight / 2)
    {
      var intTop    = intTextTop  + intTextHeight / 2;
      var intHeight = intContentsHeight / 2 - intTop;
      objLine.addClass("border_tr");
    }
    else
    {
      var intTop    = intContentsHeight / 2;
      var intHeight = intTextTop  + intTextHeight / 2 - intTop;
      objLine.addClass("border_rb");
    }
  }
/*-----* Right Area *---------------------------------------------------------*/
  else
  {
    var intLeft  = intContentsWidth / 2;
    var intWidth = intTextLeft - intLeft;

    if (intTextTop + intTextHeight / 2 < intContentsHeight / 2)
    {
      var intTop    = intTextTop  + intTextHeight / 2;
      var intHeight = intContentsHeight / 2 - intTop;
      objLine.addClass("border_lt");
    }
    else
    {
      var intTop    = intContentsHeight / 2;
      var intHeight = intTextTop  + intTextHeight / 2 - intTop;
      objLine.addClass("border_bl");
    }
  }

  objLine.css({ top:intTop - 1 + "px", left:intLeft - 1 + "px", height:intHeight + "px", width:intWidth + "px" });
},
/******************************************************************************/
/** nictSTARStouch.getDate                                                    */
/******************************************************************************/
getDate : function(pContents)
{
  if (typeof pContents == "string")
  {
    var strDate         = (pContents.indexOf(".") != -1 ?          pContents.split(".")[0]      : pContents);
    var intMilliseconds = (pContents.indexOf(".") != -1 ? parseInt(pContents.split(".")[1], 10) : 0);
    var objDate         = new Date(strDate);

    objDate.setMilliseconds(objDate.getMilliseconds() + intMilliseconds);
    return objDate;
  }
  else
  {
    var strYear  = pContents.attr("year" );
    var strMonth = pContents.attr("month");
    var strDay   = pContents.attr("day"  );
    var strTime  = pContents.attr("time" );

    return new Date(strYear + "/" + strMonth + "/" + strDay + " " + strTime.substr(0, 2) + ":" + strTime.substr(2, 2) + ":" + strTime.substr(4, 2));
  }
},
/******************************************************************************/
/** nictSTARStouch.getNextDate                                                */
/******************************************************************************/
getNextDate : function(pDate, pXScale, pCount)
{
  var objDate   = new Date(pDate.getTime());
  var intXScale = parseInt(pXScale, 10);

       if (pXScale.indexOf("d") != -1) objDate.setDate   (objDate.getDate   () + intXScale * pCount);
  else if (pXScale.indexOf("h") != -1) objDate.setHours  (objDate.getHours  () + intXScale * pCount);
  else                                 objDate.setMinutes(objDate.getMinutes() + intXScale * pCount);

  return objDate;
},
/******************************************************************************/
/** nictSTARStouch.getZoomDate                                                */
/******************************************************************************/
getZoomDate : function(pDate, pNextXScale)
{
  var intNextXScale = parseInt(pNextXScale, 10);
  var objBaseDate   = new Date($Env.baseDate.getTime());
  var intDays       = (pDate - objBaseDate) / 1000 / 60 / 60 / 24;
  var objNextDate;

       if (pNextXScale.indexOf("d") != -1)
  {
    objBaseDate.setDate(objBaseDate.getDate() + Math.floor(intDays / intNextXScale) * intNextXScale);
    objNextDate = objBaseDate;
  }
  else if (pNextXScale.indexOf("h") != -1)
    objNextDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), Math.floor(pDate.getHours() / intNextXScale) * intNextXScale, 0, 0);
  else
    objNextDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), pDate.getHours(), Math.floor(pDate.getMinutes() / intNextXScale) * intNextXScale, 0);

  return objNextDate;
},
/******************************************************************************/
/** nictSTARStouch.setMarkerTime                                              */
/******************************************************************************/
setMarkerTime : function()
{
  $("#marker_time").html($.nictSTARStouch.formatDate($Env.showDate, null, $Env.markerTimeFormat[$Env.showCalendarLocale], $.nictSTARStouch.getTimeZone($Env.showTimeZone)));
},
/******************************************************************************/
/** nictSTARStouch.getMarkerTime                                              */
/******************************************************************************/
getMarkerTime : function()
{
  var $element  = $("#plot_table .plot_area").children();
  var strXScale = $element.attr("x_scale");
  var objDate   = $.nictSTARStouch.getDate($element);
  var intX      = $.nictSTARSPlotXSlider.getMarkerOffset() - $element.offset().left;

  objDate.setMilliseconds(objDate.getMilliseconds() + $.nictSTARStouch.getPixelMilliseconds(strXScale) * intX);
  return objDate;
},
/******************************************************************************/
/** nictSTARStouch.moveMarker                                                 */
/******************************************************************************/
moveMarker : function(pDate)
{
  var $element        = $("#plot_table .plot_area").children();
  var strXScale       = $element.attr("x_scale");
  var intDiffMilliSec = pDate - $Env.showDate;
  var intMoveX        = Math.floor(intDiffMilliSec / $.nictSTARStouch.getPixelMilliseconds(strXScale));
      $Env.showDate   = pDate;

  $.nictSTARStouch.setMarkerTime();
  $("#plot_table").trigger("moveMarker.nictSTARSPlotXSlider", { left:"+=" + intMoveX, callBack:false });
},
/******************************************************************************/
/** nictSTARStouch.formatDate                                                 */
/******************************************************************************/
formatDate : function(pStartDate, pEndDate, pFormatString, pTimeZone)
{
  var aryWeek       = new Array("日", "月", "火", "水", "木", "金", "土");
  var strResult     = pFormatString;
  var aryJpCalendar;

  if (pStartDate && !isNaN(Date.parse(pStartDate.toString())))
  {
    if (!(pTimeZone === undefined))
    {
      if (pTimeZone.indexOf("+") != -1) pStartDate = new Date(pStartDate.toISOString().replace("Z", pTimeZone.replace("+", "-")));
      else                              pStartDate = new Date(pStartDate.toISOString().replace("Z", pTimeZone.replace("-", "+")));
    }

    aryJpCalendar = $.nictSTARStouch.getJpCalendar(pStartDate, pStartDate);

    strResult = strResult.replace(/%Sj/g , aryJpCalendar[0].jpName + aryJpCalendar[0].year);
    strResult = strResult.replace(/%Sy/g ,         pStartDate.getFullYear()      .toString());
    strResult = strResult.replace(/%Smm/g, ("0" + (pStartDate.getMonth() + 1   )).slice(-2));
    strResult = strResult.replace(/%Sm/g ,        (pStartDate.getMonth() + 1   ) .toString());
    strResult = strResult.replace(/%Sdd/g, ("0" + (pStartDate.getDate()        )).slice(-2));
    strResult = strResult.replace(/%Sd/g ,         pStartDate.getDate()          .toString());
    strResult = strResult.replace(/%Sw/g , aryWeek[pStartDate.getDay()]);
    strResult = strResult.replace(/%SH/g , ("0" +  pStartDate.getHours()        ).slice(-2));
    strResult = strResult.replace(/%SM/g , ("0" +  pStartDate.getMinutes()      ).slice(-2));
    strResult = strResult.replace(/%SS/g , ("0" +  pStartDate.getSeconds()      ).slice(-2));
    strResult = strResult.replace(/%SN/g ,         pStartDate.getMilliseconds()  .toString());
    strResult = strResult.replace(/%TZ/g , $Env.showTimeZone ? $Env.showTimeZone : "UT"     );
  }

  if (pEndDate && !isNaN(Date.parse(pEndDate.toString())))
  {
    if (!(pTimeZone === undefined))
    {
      if (pTimeZone.indexOf("+") != -1) pEndDate = new Date(pEndDate.toISOString().replace("Z", pTimeZone.replace("+", "-")));
      else                              pEndDate = new Date(pEndDate.toISOString().replace("Z", pTimeZone.replace("-", "+")));
    }

    aryJpCalendar = $.nictSTARStouch.getJpCalendar(pEndDate, pEndDate);

    strResult = strResult.replace(/%Ej/g , aryJpCalendar[0].jpName + aryJpCalendar[0].year);
    strResult = strResult.replace(/%Ey/g ,         pEndDate.getFullYear()      .toString());
    strResult = strResult.replace(/%Emm/g, ("0" + (pEndDate.getMonth() + 1   )).slice(-2));
    strResult = strResult.replace(/%Em/g ,        (pEndDate.getMonth() + 1   ) .toString());
    strResult = strResult.replace(/%Edd/g, ("0" + (pEndDate.getDate()        )).slice(-2));
    strResult = strResult.replace(/%Ed/g ,         pEndDate.getDate()          .toString());
    strResult = strResult.replace(/%Ew/g , aryWeek[pEndDate.getDay()]);
    strResult = strResult.replace(/%EH/g , ("0" + pEndDate.getHours()         ).slice(-2));
    strResult = strResult.replace(/%EM/g , ("0" + pEndDate.getMinutes()       ).slice(-2));
    strResult = strResult.replace(/%ES/g , ("0" + pEndDate.getSeconds()       ).slice(-2));
    strResult = strResult.replace(/%EN/g ,        pEndDate.getMilliseconds()   .toString());
    strResult = strResult.replace(/%TZ/g , $Env.showTimeZone ? $Env.showTimeZone : "UT"   );
  }

  return strResult;
},
/******************************************************************************/
/** nictSTARStouch.getJpCalendar                                              */
/******************************************************************************/
getJpCalendar : function(pStartDate, pEndDate)
{
  var objAnei    = new Date(1781,  3,  1, 23, 59, 59, 999);
  var objTenmei  = new Date(1789,  0, 24, 23, 59, 59, 999);
  var objKansei  = new Date(1801,  1,  4, 23, 59, 59, 999);
  var objKyouwa  = new Date(1804,  1, 10, 23, 59, 59, 999);
  var objBunka   = new Date(1818,  3, 21, 23, 59, 59, 999);
  var objBunsei  = new Date(1830, 11,  9, 23, 59, 59, 999);
  var objTenpou  = new Date(1844, 11,  1, 23, 59, 59, 999);
  var objKouka   = new Date(1848,  1, 27, 23, 59, 59, 999);
  var objKaei    = new Date(1854, 10, 26, 23, 59, 59, 999);
  var objAnsei   = new Date(1860,  2, 17, 23, 59, 59, 999);
  var objManen   = new Date(1861,  1, 18, 23, 59, 59, 999);
  var objBunkyu  = new Date(1864,  1, 19, 23, 59, 59, 999);
  var objGenji   = new Date(1865,  3,  6, 23, 59, 59, 999);
  var objKeiou   = new Date(1868,  8,  7, 23, 59, 59, 999);
  var objMeiji   = new Date(1912,  6, 29, 23, 59, 59, 999);
  var objTaisho  = new Date(1926, 11, 24, 23, 59, 59, 999);
  var objSyouwa1 = new Date(1945,  7, 14, 23, 59, 59, 999);
  var objSyouwa2 = new Date(1989,  0,  7, 23, 59, 59, 999);

  var objStartDate = new Date(pStartDate.getTime());
  var objResult    = new Array();

  while (objStartDate <= pEndDate)
  {
    var objDate = new Date(objStartDate.getTime());

         if (objDate <= objAnei   ) { objResult.push({ start:objDate, end:(pEndDate < objAnei    ? pEndDate : objAnei   ), enName:"anei"   , jpName:"安永", year:objDate.getFullYear() - 1771 }); objStartDate.setTime(objAnei   .getTime() + 1); }
    else if (objDate <= objTenmei ) { objResult.push({ start:objDate, end:(pEndDate < objTenmei  ? pEndDate : objTenmei ), enName:"tenmei" , jpName:"天明", year:objDate.getFullYear() - 1780 }); objStartDate.setTime(objTenmei .getTime() + 1); }
    else if (objDate <= objKansei ) { objResult.push({ start:objDate, end:(pEndDate < objKansei  ? pEndDate : objKansei ), enName:"kansei" , jpName:"寛政", year:objDate.getFullYear() - 1788 }); objStartDate.setTime(objKansei .getTime() + 1); }
    else if (objDate <= objKyouwa ) { objResult.push({ start:objDate, end:(pEndDate < objKyouwa  ? pEndDate : objKyouwa ), enName:"kyouwa" , jpName:"享和", year:objDate.getFullYear() - 1800 }); objStartDate.setTime(objKyouwa .getTime() + 1); }
    else if (objDate <= objBunka  ) { objResult.push({ start:objDate, end:(pEndDate < objBunka   ? pEndDate : objBunka  ), enName:"bunka"  , jpName:"文化", year:objDate.getFullYear() - 1803 }); objStartDate.setTime(objBunka  .getTime() + 1); }
    else if (objDate <= objBunsei ) { objResult.push({ start:objDate, end:(pEndDate < objBunsei  ? pEndDate : objBunsei ), enName:"bunsei" , jpName:"文政", year:objDate.getFullYear() - 1817 }); objStartDate.setTime(objBunsei .getTime() + 1); }
    else if (objDate <= objTenpou ) { objResult.push({ start:objDate, end:(pEndDate < objTenpou  ? pEndDate : objTenpou ), enName:"tenpou" , jpName:"天保", year:objDate.getFullYear() - 1829 }); objStartDate.setTime(objTenpou .getTime() + 1); }
    else if (objDate <= objKouka  ) { objResult.push({ start:objDate, end:(pEndDate < objKouka   ? pEndDate : objKouka  ), enName:"kouka"  , jpName:"弘化", year:objDate.getFullYear() - 1843 }); objStartDate.setTime(objKouka  .getTime() + 1); }
    else if (objDate <= objKaei   ) { objResult.push({ start:objDate, end:(pEndDate < objKaei    ? pEndDate : objKaei   ), enName:"kaei"   , jpName:"嘉永", year:objDate.getFullYear() - 1847 }); objStartDate.setTime(objKaei   .getTime() + 1); }
    else if (objDate <= objAnsei  ) { objResult.push({ start:objDate, end:(pEndDate < objAnsei   ? pEndDate : objAnsei  ), enName:"ansei"  , jpName:"安政", year:objDate.getFullYear() - 1853 }); objStartDate.setTime(objAnsei  .getTime() + 1); }
    else if (objDate <= objManen  ) { objResult.push({ start:objDate, end:(pEndDate < objManen   ? pEndDate : objManen  ), enName:"manen"  , jpName:"万延", year:objDate.getFullYear() - 1859 }); objStartDate.setTime(objManen  .getTime() + 1); }
    else if (objDate <= objBunkyu ) { objResult.push({ start:objDate, end:(pEndDate < objBunkyu  ? pEndDate : objBunkyu ), enName:"bunkyu" , jpName:"文久", year:objDate.getFullYear() - 1860 }); objStartDate.setTime(objBunkyu .getTime() + 1); }
    else if (objDate <= objGenji  ) { objResult.push({ start:objDate, end:(pEndDate < objGenji   ? pEndDate : objGenji  ), enName:"genji"  , jpName:"元治", year:objDate.getFullYear() - 1863 }); objStartDate.setTime(objGenji  .getTime() + 1); }
    else if (objDate <= objKeiou  ) { objResult.push({ start:objDate, end:(pEndDate < objKeiou   ? pEndDate : objKeiou  ), enName:"keiou"  , jpName:"慶応", year:objDate.getFullYear() - 1864 }); objStartDate.setTime(objKeiou  .getTime() + 1); }
    else if (objDate <= objMeiji  ) { objResult.push({ start:objDate, end:(pEndDate < objMeiji   ? pEndDate : objMeiji  ), enName:"meiji"  , jpName:"明治", year:objDate.getFullYear() - 1867 }); objStartDate.setTime(objMeiji  .getTime() + 1); }
    else if (objDate <= objTaisho ) { objResult.push({ start:objDate, end:(pEndDate < objTaisho  ? pEndDate : objTaisho ), enName:"taisho" , jpName:"大正", year:objDate.getFullYear() - 1911 }); objStartDate.setTime(objTaisho .getTime() + 1); }
    else if (objDate <= objSyouwa1) { objResult.push({ start:objDate, end:(pEndDate < objSyouwa1 ? pEndDate : objSyouwa1), enName:"syouwa1", jpName:"昭和", year:objDate.getFullYear() - 1925 }); objStartDate.setTime(objSyouwa1.getTime() + 1); }
    else if (objDate <= objSyouwa2) { objResult.push({ start:objDate, end:(pEndDate < objSyouwa2 ? pEndDate : objSyouwa2), enName:"syouwa2", jpName:"昭和", year:objDate.getFullYear() - 1925 }); objStartDate.setTime(objSyouwa2.getTime() + 1); }
    else                            { objResult.push({ start:objDate, end: pEndDate                                      , enName:"heisei" , jpName:"平成", year:objDate.getFullYear() - 1988 }); objStartDate.setTime(pEndDate  .getTime() + 1); }
  }

  return objResult;
},
/******************************************************************************/
/** nictSTARStouch.getTimeZone                                                */
/******************************************************************************/
getTimeZone : function(timezoneID, format)
{
  var mark      = "Z";
  var hour      = null;
  var minute    = null;
  var strResult = (format === undefined ? "%MK%H:%M" : format);

  switch(timezoneID)
  {
    case "JST":
      mark = "+"; hour = "09"; minute = "00"; break;
  }

  if (mark == "Z") {
    if (strResult.indexOf("%MC") == -1)
      strResult = "Z";
    else
      strResult = "";
  } else {
    strResult = strResult.replace("%MK",  mark                    );
    strResult = strResult.replace("%MC", (mark == "-" ? "M" : "P"));
    strResult = strResult.replace("%H",   hour                    );
    strResult = strResult.replace("%M",   minute                  );
  }

  return strResult;
},
/******************************************************************************/
/** nictSTARStouch.getPixelMilliseconds                                       */
/******************************************************************************/
getPixelMilliseconds : function(pXScale)
{
  var intXScale = parseInt(pXScale, 10);

       if (pXScale.indexOf("d") != -1) return 1000 * 60 * 60 * 24 * intXScale / $Env.width;
  else if (pXScale.indexOf("h") != -1) return 1000 * 60 * 60 *      intXScale / $Env.width;
  else if (pXScale.indexOf("m") != -1) return 1000 * 60 *           intXScale / $Env.width;
},
/******************************************************************************/
/** nictSTARStouch.getOptimizationValue                                       */
/******************************************************************************/
getOptimizationValue : function(pStart, pEnd)
{
  var objResult = null;
  var intCenter = $("#marker_area .nictSTARSPlotXSliderMarkerRail").width() / 2;
  var objCenter = new Date(pStart.getTime() + (pEnd.getTime() - pStart.getTime()) / 2);

  for (var i01 = $Env.xScale.length - 1; i01 >= 0; i01--)
  {
    var intDiffSec = $.nictSTARStouch.getPixelMilliseconds($Env.xScale[i01]) * intCenter;
    var objStart   = new Date(objCenter.getTime() - intDiffSec);
    var objEnd     = new Date(objCenter.getTime() + intDiffSec);

    if (objStart.getTime() <= pStart.getTime() && pEnd.getTime() <= objEnd.getTime())
    {
      objResult = { date:objCenter, scale:$Env.xScale[i01], position:intCenter };
      break;
    }
  }

  if (objResult == null) objResult = { date:objCenter, scale:$Env.xScale[0], position:intCenter };
  return objResult;
},
/******************************************************************************/
/** nictSTARStouch.getTargetYDataScale                                        */
/******************************************************************************/
getTargetYDataScale : function(xScale, yDataScale)
{
  var minXScaleIndex;
  var maxXScaleIndex;
  var xScaleIndex      = $Env.xScale.indexOf(xScale);
  var targetYDataScale = null;

  if (yDataScale.length > 0)
  {
    for (var i01 = 0; i01 < yDataScale.length; i01++)
    {
      minXScaleIndex = $Env.xScale.indexOf(yDataScale[i01][0]);
      maxXScaleIndex = $Env.xScale.indexOf(yDataScale[i01][1]);

      if ((minXScaleIndex <= xScaleIndex) && (xScaleIndex <= maxXScaleIndex))
      {
        targetYDataScale = yDataScale[i01][2]; break;
      }
    }
  }

  return targetYDataScale;
},
/******************************************************************************/
/** nictSTARStouch.modifyDateTimePicker                                       */
/******************************************************************************/
modifyDateTimePicker : function(pInput, pInstance)
{
  if (pInstance.settings.showTimepicker)
  {
    var $buttonPane  = pInstance.dpDiv.find(".ui-datepicker-buttonpane");
    var $resetButton = $("<button type='button' class='ui-datepicker-reset ui-state-default ui-priority-secondary ui-corner-all' style='float:left;'>Zero-set</button>");

    $resetButton.on("click", function()
    {
      $(pInput).datetimepicker("setDate", new Date(pInstance.selectedYear, pInstance.selectedMonth, pInstance.selectedDay, 0, 0, 0));
      setTimeout(function(){ $.nictSTARStouch.modifyDateTimePicker(pInput, pInstance); }, 10);
    });

    $buttonPane.find  (".ui-datepicker-reset").remove();
    $buttonPane.append($resetButton);
  }

  var strYear = $Env.showCalendarLocale == 0 ? "%Sy" : $Env.showCalendarLocale == 1 ? "%Sj年" : "%Sy(%Sj)";

  pInstance.dpDiv.find("select.ui-datepicker-year > option").each(function(pIndex, pElement)
  {
    var objYear = new Date($(pElement).val(), 0, 1);
    $(pElement).text($.nictSTARStouch.formatDate(objYear, null, strYear));
  });

  if ($Env.showCalendarLocale == 1)
  {
    $parent = pInstance.dpDiv.find(   "div.ui-datepicker-title");
    $month  = pInstance.dpDiv.find("select.ui-datepicker-month");
    $parent.append($month);
  }
},
/******************************************************************************/
/** nictSTARStouch.getDateTimePickerOption                                    */
/******************************************************************************/
getDateTimePickerOption : function()
{
/*-----* Base Option *--------------------------------------------------------*/
  var objOptions =
  {
    showOn            : "button",
    buttonImage       : $Env.calendarIcon,
    buttonImageOnly   : true,
    buttonText        : "Set date and time",
    closeText         : "OK",
    monthNamesShort   : $Env.showCalendarLocale == 1 ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNamesMin       : $Env.showCalendarLocale == 1 ? ["日" , "月" , "火" , "水" , "木" , "金" , "土"]                                        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    minDate           : new Date($.nictSTARStouch.formatDate($Env.firstDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS", $.nictSTARStouch.getTimeZone($Env.showTimeZone))),
    maxDate           : new Date($.nictSTARStouch.formatDate($Env.lastDate , null, "%Sy/%Sm/%Sd %SH:%SM:%SS", $.nictSTARStouch.getTimeZone($Env.showTimeZone))),
    showTimepicker    : ($Env.calendarType.match(/time/i) ? true : false),
    showButtonPanel   : ($Env.calendarType.match(/time/i) ? true : false),
    dateFormat        : "yy/m/d",
    timeFormat        : "HH:mm:ss",
    changeYear        : true,
    changeMonth       : true,
    yearRange         : $Env.firstDate.getFullYear() + ":" + $Env.lastDate.getFullYear(),
/*-----* beforeShow *---------------------------------------------------------*/
    beforeShow : function(pInput, pInstance)
    {
      $(this).datetimepicker("setDate", new Date($.nictSTARStouch.formatDate($Env.showDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS", $.nictSTARStouch.getTimeZone($Env.showTimeZone))));

      setTimeout(function()
      {
        var $dialog = $("<div id='calendar_dialog'/>");
        var $frame  = pInstance.dpDiv;

        $dialog              .append($frame);
        $("#calendar_dialog").remove();
        $("body")            .append($dialog);
        $frame               .css({ top:"", left:"" });
        $(pInput)            .val("");

        $.nictSTARStouch.modifyDateTimePicker(pInput, pInstance);
        $.nictSTARSLogger.info("open (calendar)", { action : "open (calendar)", xscale : $Env.showXScale, datetime : $.nictSTARStouch.formatDate($Env.showDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), firstdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateLeft(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), lastdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateRight(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), timezone : $Env.showTimeZone, url : $.nictSTARStouch.getViewUrl() });
      }, 10);
    },
/*-----* onChangeMonthYear *--------------------------------------------------*/
    onChangeMonthYear : function(pYear, pMonth, pInstance)
    {
      var objInput = this;

      setTimeout(function()
      {
        $.nictSTARStouch.modifyDateTimePicker(objInput, pInstance);
      }, 10);
    },
/*-----* onClose *------------------------------------------------------------*/
    onClose : function(pDateText, pInstance)
    {
      $("#calendar_dialog").remove();
      if (pDateText.length <= 0)
      {
        $.nictSTARSLogger.info("cancel (calendar)", { action : "cancel (calendar)", xscale : $Env.showXScale, datetime : $.nictSTARStouch.formatDate($Env.showDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), firstdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateLeft(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), lastdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateRight(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), timezone : $Env.showTimeZone, url : $.nictSTARStouch.getViewUrl() });
        return;
      }
      $("#plot_table").trigger("showWaitMessage.nictSTARSPlotXSlider");

      setTimeout(function()
      {
        $(window).trigger("unload");

        var intScrollTop = $(window).scrollTop();
        var strTimeZone  = $.nictSTARStouch.getTimeZone($Env.showTimeZone);

        $Env.showDate    = new Date(pDateText);
        $Env.showDate    = (strTimeZone.indexOf("+") != -1 ? new Date($Env.showDate.toISOString().replace("Z", strTimeZone.replace("-", "+"))) : new Date($Env.showDate.toISOString().replace("Z", strTimeZone.replace("+", "-"))));

        var intMarker    = $.nictSTARSPlotXSlider.getMarkerOffset() - $("#plot_table .plot_area").offset().left;
        var objDate      = $.nictSTARStouch.getZoomDate($Env.showDate, $Env.showXScale);

        $Env.showLeft    = intMarker - Math.floor(($Env.showDate - objDate) / $.nictSTARStouch.getPixelMilliseconds($Env.showXScale));

        $.nictSTARStouch.refreshData  (JSON.parse(localStorage.getItem(location.pathname + ".showList")));
        $.nictSTARStouch.setMarkerTime();
        $(window)       .scrollTop    (intScrollTop);
        $(window)       .trigger      ("resize");
        $("#plot_table").trigger      ("removeWaitMessage.nictSTARSPlotXSlider");
        $.nictSTARSLogger.info("select (calendar)", { action : "select (calendar)", xscale : $Env.showXScale, datetime : $.nictSTARStouch.formatDate($Env.showDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), firstdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateLeft(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), lastdate : $.nictSTARStouch.formatDate($.nictSTARStouch.getShowDateRight(), null, "%Sy/%Sm/%Sd %SH:%SM:%SS"), timezone : $Env.showTimeZone, url : $.nictSTARStouch.getViewUrl() });
      }, 10);
    }
  };

  return objOptions;
},
/******************************************************************************/
/** nictSTARStouch.getCacheParameter                                          */
/******************************************************************************/
getCacheParameter : function(pCache)
{
  if (pCache == "version") return encodeURIComponent($Env.version);
  if (pCache == "none"   ) return $Env.accessDate.getTime().toString();
  return "";
},
/******************************************************************************/
/** nictSTARStouch.getViewUrl                                                 */
/******************************************************************************/
getViewUrl : function()
{
  var viewURLParam = {};
  var aryEnvParam  = [];

  $(window).trigger("unload");

  aryEnvParam.push("{");

  for (var strMission in $Env.mission)
  {
    if ($("[id^='" + strMission + "']")[0])
    {
      aryEnvParam.push("\"" + strMission + "\":{");

      for (var strTeam in $Env.mission[strMission].team)
      {
        if ($("[id^='" + strMission + "_" + strTeam + "']")[0])
        {
          var aryMissionParam = [];

          for (var strData in $Env.mission[strMission].team[strTeam].data)
          {
            if ($("[id^='" + strMission + "_" + strTeam + "_" + strData + "']")[0])
            {
              var aryComponentParam = [];
              var aryDataData       = [];

              if (typeof $Env.mission[strMission].team[strTeam].data[strData].show              == "string" ) aryDataData.push("\"show\":\""             + $Env.mission[strMission].team[strTeam].data[strData].show              + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showYScale        == "string" ) aryDataData.push("\"showYScale\":\""       + $Env.mission[strMission].team[strTeam].data[strData].showYScale        + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showYDataScale    == "string" ) aryDataData.push("\"showYDataScale\":\""   + $Env.mission[strMission].team[strTeam].data[strData].showYDataScale    + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showTop           == "string" ) aryDataData.push("\"showTop\":\""          + $Env.mission[strMission].team[strTeam].data[strData].showTop           + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showLabelColor    == "string" ) aryDataData.push("\"showLabelColor\":\""   + $Env.mission[strMission].team[strTeam].data[strData].showLabelColor    + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showPlotColor     == "string" ) aryDataData.push("\"showPlotColor\":\""    + $Env.mission[strMission].team[strTeam].data[strData].showPlotColor     + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showEventColor    == "string" ) aryDataData.push("\"showEventColor\":\""   + $Env.mission[strMission].team[strTeam].data[strData].showEventColor    + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showEventBgColor  == "string" ) aryDataData.push("\"showEventBgColor\":\"" + $Env.mission[strMission].team[strTeam].data[strData].showEventBgColor  + "\"");
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showEvent         == "boolean") aryDataData.push("\"showEvent\":"          + $Env.mission[strMission].team[strTeam].data[strData].showEvent);
              if (typeof $Env.mission[strMission].team[strTeam].data[strData].showChronological == "boolean") aryDataData.push("\"showChronological\":"  + $Env.mission[strMission].team[strTeam].data[strData].showChronological);

              for (var strComponent in $Env.mission[strMission].team[strTeam].data[strData].component)
              {
                if ($("[id^='" + strMission + "_" + strTeam + "_" + strData + "_" + strComponent + "']")[0])
                {
                  var aryComponentData = [];

                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].show              == "string" ) aryComponentData.push("\"show\":\""             + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].show              + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showYScale        == "string" ) aryComponentData.push("\"showYScale\":\""       + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showYScale        + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showYDataScale    == "string" ) aryComponentData.push("\"showYDataScale\":\""   + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showYDataScale    + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showTop           == "string" ) aryComponentData.push("\"showTop\":\""          + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showTop           + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showLabelColor    == "string" ) aryComponentData.push("\"showLabelColor\":\""   + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showLabelColor    + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showPlotColor     == "string" ) aryComponentData.push("\"showPlotColor\":\""    + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showPlotColor     + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEventColor    == "string" ) aryComponentData.push("\"showEventColor\":\""   + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEventColor    + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEventBgColor  == "string" ) aryComponentData.push("\"showEventBgColor\":\"" + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEventBgColor  + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showZeroAxis      == "string" ) aryComponentData.push("\"showZeroAxis\":\""     + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showZeroAxis      + "\"");
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEvent         == "boolean") aryComponentData.push("\"showEvent\":"          + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showEvent);
                  if (typeof $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showChronological == "boolean") aryComponentData.push("\"showChronological\":"  + $Env.mission[strMission].team[strTeam].data[strData].component[strComponent].showChronological);

                  if (aryComponentData.length > 0)
                  {
                    aryComponentParam.push("\"" + strComponent + "\":{");
                    for (var i = 0; i < aryComponentData.length; i++) { aryComponentParam.push(aryComponentData[i]); }
                    aryComponentParam.push("}");
                  }
                }
              }

              if ((aryComponentParam.length > 0) || (aryDataData.length > 0)) aryMissionParam.push("\"" + strData + "\":{");
              if ( aryDataData      .length > 0)                              { for (var i = 0; i < aryDataData      .length; i++) { aryMissionParam.push(aryDataData[i]); } }
              if ( aryComponentParam.length > 0)                              { for (var i = 0; i < aryComponentParam.length; i++) { aryMissionParam.push(aryComponentParam[i]); } }
              if ((aryComponentParam.length > 0) || (aryDataData.length > 0)) aryMissionParam.push("}");
            }
          }

          if (aryMissionParam.length > 0)
          {
            aryEnvParam.push("\"" + strTeam + "\":{");
            for (var i = 0; i < aryMissionParam.length; i++) { aryEnvParam.push(aryMissionParam[i]); }
            aryEnvParam.push("}");
          }
        }
      }
      aryEnvParam.push("}");
    }
  }
  aryEnvParam.push("}");

  viewURLParam = {
    base_url             : location.href.split("?")[0],
    show_date            : $Env.showDate,
    show_autorun_start   : $Env.showAutorunStart,
    show_autorun_end     : $Env.showAutorunEnd,
    show_autorun         : null,
    show_marker_left     : $Env.showMarkerLeft,
    show_x_scale         : $Env.showXScale,
//    show_left            : $Env.showLeft,
    show_time_zone       : $Env.showTimeZone,
    show_calendar_locale : $Env.showCalendarLocale,
    show_list            : localStorage.getItem(location.pathname + ".showList"),
    env_param            : aryEnvParam.join(",")
  };

  return $.nictSTARSViewURL.createURL(viewURLParam);
},
/******************************************************************************/
/** nictSTARStouch.getShowDateLeft                                            */
/******************************************************************************/
getShowDateLeft : function()
{
  var showXScale   = $("#plot_table .plot_area").children().attr("x_scale");
  var offsetLeft   = parseInt($("#plot_table .plot_area").css("left"), 10) + parseInt($("#plot_table .plot_area").children().css("left"), 10);
  var showDateLeft = $.nictSTARStouch.getDate($("#plot_table .plot_area").children());
  showDateLeft.setMilliseconds(showDateLeft.getMilliseconds() + ((-parseInt(offsetLeft, 10)) * $.nictSTARStouch.getPixelMilliseconds(showXScale)));

  return showDateLeft;
},
/******************************************************************************/
/** nictSTARStouch.getShowDateRight                                           */
/******************************************************************************/
getShowDateRight : function()
{
  var showXScale    = $("#plot_table .plot_area").children().attr("x_scale");
  var offsetRight   = parseInt($("#plot_table .plot_area").css("left"), 10) + parseInt($("#plot_table .plot_area").children().css("left"), 10) - $(".nictSTARSPlotXSliderMarkerRail").width();
  var showDateRight = $.nictSTARStouch.getDate($("#plot_table .plot_area").children());
  showDateRight.setMilliseconds(showDateRight.getMilliseconds() + ((-parseInt(offsetRight, 10)) * $.nictSTARStouch.getPixelMilliseconds(showXScale)));

  return showDateRight;
}
};})(jQuery);
