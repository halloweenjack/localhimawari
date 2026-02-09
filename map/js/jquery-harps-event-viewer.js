;(function($){ $.fn.harpsEventViewer = function(pOptions){
/******************************************************************************/
/** NICT STARS Event Viewer for JQuery Plugin                                 */
/** Inoue Computer Service.                                                   */
/**                                                                           */
/** Json Format                                                               */
/**   status       : string                                                   */
/**   category     : string                                                   */
/**   view_url     : string                                                   */
/**   title        : string                                                   */
/**   body         : string                                                   */
/**   organization : string                                                   */
/**   user         : string                                                   */
/**   url          : string                                                   */
/**   device       : string[]                                                 */
/**   st           : string(Date Format)                                      */
/**   et           : string(Date Format)                                      */
/**   st_time      : string(Time Format)                                      */
/**   et_time      : string(Time Format)                                      */
/******************************************************************************/
/******************************************************************************/
/** Initialize                                                                */
/******************************************************************************/
/*-----* Variable *-----------------------------------------------------------*/
  var $base      = this;
  var objJson    = null;
  var objOptions = $.extend(
  {
    jsonPath     : null,
    appendTo     : "body",
    dateName     : "sD", // Date included in the ViewURL
    open         : null,
    select       : null,
    close        : null
  }, pOptions);
/******************************************************************************/
/** this.click                                                                */
/******************************************************************************/
  $base.on("click.harpsEventViewer", function()
  {
    if ($(".harpsEventViewer").css("display") === "none") {
      $(".harpsEventViewer").remove();
      if (typeof objOptions.close == "function") objOptions.close();
    }
    if ($(".harpsEventViewer").css("display") === "none" || $(".harpsEventViewer").length > 0)
    {
      $(".harpsEventViewer").fadeOut().queue(function(){ $(this).remove(); });
      if (typeof objOptions.close == "function") objOptions.close();
    }
    else
    {
      $base    .trigger("create.harpsEventViewer");
      $(window).trigger("resize.harpsEventViewer");
      if (typeof objOptions.open == "function") objOptions.open();
    }
    $(".harpsEventViewer").css("display", "block");
  });
/******************************************************************************/
/** window.resize                                                             */
/******************************************************************************/
  $(window).on("resize.harpsEventViewer", function()
  {
    $(".harpsEventViewer .body").css("width", "0px");

    var intListMargin = $(".harpsEventViewer .list").outerWidth (true) - $(".harpsEventViewer .list").width();
    var intItemMargin = $(".harpsEventViewer .item").outerWidth (true) - $(".harpsEventViewer .item").width();
    var intBodyMargin = $(".harpsEventViewer .body").outerWidth (true) - $(".harpsEventViewer .body").width();
    var intDateWidth  = $(".harpsEventViewer .date").outerWidth (true);
    var intTop        = parseInt($(".harpsEventViewer").css("top"), 10);

    $(".harpsEventViewer .list .body").css("width", $(".harpsEventViewer").width () - intListMargin - intItemMargin - intBodyMargin - intDateWidth - 20 + "px");

    if ($(".harpsEventViewer .list").attr("mode") == "list_view")
      $(".harpsEventViewer .list"          ).css("maxHeight", ($(window).height() - intTop) / 2);
    else
    {
      $(".harpsEventViewer .list"          ).css("maxHeight", "");
      $(".harpsEventViewer .selected .date").css({ height:$(".harpsEventViewer .selected .body").height() + "px", lineHeight:$(".harpsEventViewer .selected .body").height() + "px" });
    }
  });
/******************************************************************************/
/** create.harpsEventViewer                                               */
/******************************************************************************/
  $base.on("create.harpsEventViewer", function(pEvent, pExtra)
  {
/*-----* Create List *--------------------------------------------------------*/
    if (objOptions.jsonPath == null) return false;

    $.harpsAjaxManager.ajax(
    {
      type     : "GET",
      async    : false,
      cache    : false,
      url      : objOptions.jsonPath,
      dataType : "json",
      success  : function(pJson)                                      { objJson = pJson; },
      error    : function(pXMLHttpRequest, pTextStatus, pErrorThrown) { /*alert("XMLHttpRequest:" + pXMLHttpRequest.status + "errorThrown:" + pErrorThrown.message);*/ }
    });

    if (objJson == null) return;

    var $frame = $("<div class='harpsEventViewer'/>");
    var $title = $("<div class='title'><div class='close_button' /></div>");
    var $list  = $("<ul  class='list' mode='list_view'></ul>");

    for (var i01 = 0; i01 < objJson.length; i01++)
    {
      var intStDate = typeof objJson[i01].st      == "string" && objJson[i01].st     .length > 0          ? (new Date(objJson[i01].st)).getTime()                                                                     :        0;
      var intEtDate = typeof objJson[i01].et      == "string" && objJson[i01].et     .length > 0          ? (new Date(objJson[i01].et)).getTime()                                                                     : Infinity;
      var intStTime = typeof objJson[i01].st_time == "string" && objJson[i01].st_time.match(/^\d+\:\d+$/) ?  parseInt(objJson[i01].st_time.split(":")[0], 10) * 60 + parseInt(objJson[i01].st_time.split(":")[1], 10) :        0;
      var intEtTime = typeof objJson[i01].et_time == "string" && objJson[i01].et_time.match(/^\d+\:\d+$/) ?  parseInt(objJson[i01].et_time.split(":")[0], 10) * 60 + parseInt(objJson[i01].et_time.split(":")[1], 10) :     1440;
      var intNwDate = (new Date()).getTime ();
      var intNwTime = (new Date()).getHours() * 60 + (new Date()).getMinutes();

      if (!(intStDate <= intNwDate && intNwDate <= intEtDate && intStTime <= intNwTime && intNwTime <= intEtTime)) continue;

      var aryParameters     = objJson[i01].view_url.split("?")[1].split("&");
      var objGetQueryString = {};

      for( var i02 = 0; i02 < aryParameters.length; i02++)
      {
        objGetQueryString[decodeURIComponent(aryParameters[i02].split("=")[0])] = decodeURIComponent(aryParameters[i02].split("=")[1]);
      }

      var intDate = objGetQueryString[objOptions.dateName];
      var objDate = new Date(intDate.match(/^\d+$/) ? parseInt(intDate, 10) : intDate);
      var $item   = $("<li class='item'></li>");

      $item.attr  ("item_no"     , i01);
      $item.attr  ("status"      , objJson[i01].status);
      $item.attr  ("category"    , objJson[i01].category);
      $item.attr  ("date"        , objGetQueryString[objOptions.dateName]);
      $item.attr  ("view_url"    , objJson[i01].view_url);
      $item.attr  ("organization", objJson[i01].organization);
      $item.attr  ("device"      , objJson[i01].device.join(","));

      $item.append("<div class='date'        >"      + objDate.getFullYear() + "/" + ("0" + (objDate.getMonth() + 1)).slice(-2) + "/" + ("0" + objDate.getDate()).slice(-2) + "</div>");
      $item.append("<div class='body'        ><div>" + objJson[i01].title          +   "</div><div>" + objJson[i01].body + "<div class='user'>" + objJson[i01].user + "</div>" + "</div></div>");
      $item.append("<div class='list_btn'   />");
      if (objJson[i01].url.length > 0)
      $item.append("<a   class='rel_url' href='javascript:void(window.open(\"" + objJson[i01].url + "\", null, \"menubar=yes,toolbar=yes,location=yes,resizable=yes,scrollbars=yes\"));'></a>");

      $list.append($item);
    }

    $list    .html  ($list.children().get().sort(function(a, b){ return $(a).attr("date") < $(b).attr("date") ? 1 : -1; }));
    $list    .css   ("overflowY", "scroll");
    $frame   .append($title);
    $frame   .append($list);
    $frame   .fadeIn();
    $(objOptions.appendTo).append($frame);
/*-----* close_btn.click *----------------------------------------------------*/
    $title.on("click.harpsEventViewer", ".close_button", function()
    {
      $base.trigger("click.harpsEventViewer");
    });
/*-----* Events Not Found *---------------------------------------------------*/
    if ($list.children().length <= 0)
    {
      $list.append("<li class='item no_events'><div class='body'><div></li>");
      $(".harpsEventViewer").css("display", "none");
      return;
    }
/*-----* body.click *---------------------------------------------------------*/
    $list.on("click.harpsEventViewer", ".body", function()
    {
      var $this = $(this);
      if ($this.closest(".list").children(":animated").length > 0) return false;

      if ($this.closest(".list").attr("mode") == "list_view")
      {
        var fncChangeView = function()
        {
          $this.closest (".list")      .css({ overflowY:"" }).attr("mode", "data_view");
          $this.children()       .eq(1).css({ opacity  :0  });
          setTimeout(function() { $this.children().eq(1).animate({ opacity:1 }, 1000, "swing", function(){ $(this).css("opacity", ""); });}, 1000);
          $(window).trigger("resize.harpsEventViewer");
          if (typeof objOptions.select == "function") objOptions.select($this.closest(".item"));
        };

        $this.closest(".list").attr    ("item_height", $this.closest(".item").height());
        $this.closest(".item").addClass("selected");

        if ($this.closest(".item").siblings().length > 0)
        {
          $this.closest(".item").siblings().animate({ height:0 }, 500, "swing", function()
          {
            $(this).css("display", "none");
            if ($(this).siblings(":animated").length == 0) fncChangeView();
          });
        }
        else
          fncChangeView();

        $this.on("touchstart.harpsEventViewer", function(e)
        {
          if ($this.closest(".list").children(":animated").length > 0) return false;

          var flgEvent = "event" in window;
          var objStart = { x:0, y:0 };
          var objMove  = { x:0, y:0 };

          objStart.x = flgEvent ? event.changedTouches[0].pageX : e.originalEvent.touches.item(0).pageX;
          objStart.y = flgEvent ? event.changedTouches[0].pageY : e.originalEvent.touches.item(0).pageY;

          $(document).on("touchmove.harpsEventViewer", function(e)
          {
            objMove.x = flgEvent ? event.changedTouches[0].pageX : e.originalEvent.touches.item(0).pageX;
            objMove.y = flgEvent ? event.changedTouches[0].pageY : e.originalEvent.touches.item(0).pageY;
            return false;
          });

          $(document).one("touchend.harpsEventViewer", function(e)
          {
            $(document).off("touchmove.harpsEventViewer");
            if (objMove.y - objStart.y > 50) $this.siblings(".list_btn").trigger("click");
            else                             { if (typeof objOptions.select == "function") objOptions.select($this.closest(".item")); }
            return false;
          });

          if (flgEvent) event.stopPropagation(); else e.stopPropagation();
        });
      }
      else
      {
        if (typeof objOptions.select == "function") objOptions.select($this.closest(".item"));
      }
    });
/*-----* list_btn.click *-----------------------------------------------------*/
    $list.on("click.harpsEventViewer", ".list_btn", function()
    {
      if ($(".harpsEventViewer .list").children(":animated").length > 0) return false;

      $(this).siblings(".body")           .off        ("touchstart.harpsEventViewer");
      $(this).siblings(".date")           .css        ({ height:"", lineHeight:"" });
      $(this).closest (".item")           .removeClass("selected");
      $(this).closest (".list")           .css        ({ overflowY:"scroll" }).attr("mode", "list_view");
      $(this).closest (".list").children().css        ({ display  :""       });

      $(window).trigger("resize.harpsEventViewer");

      $(this).closest (".list").children().animate({ height:$(".harpsEventViewer .list").attr("item_height") }, 500, "swing", function()
      {
        $(this).css("height", "");
        if ($(this).siblings(":animated").length == 0) setTimeout(function() { $(window).trigger("resize.harpsEventViewer"); }, 500);
      });
    });
/*-----* date.click *---------------------------------------------------------*/
    $list.on("click.harpsEventViewer", ".date", function()
    {
      if ($(this).closest(".list").children(           ).length >  1
      &&  $(this).closest(".list").children(":animated").length == 0
      &&  $(this).closest(".list").attr    ("mode"     )        == "list_view")
      {
        var flgSort = $(this).closest(".list").data("sort.harpsEventViewer") ? false : true;
                      $(this).closest(".list").data("sort.harpsEventViewer", flgSort);
        animateSort(  $(this).closest(".list"), "date", flgSort);
      }
    });
  });
/******************************************************************************/
/** animateSort                                                               */
/******************************************************************************/
  function animateSort(pList, pKey, pAsc)
  {
    $(pList)           .css ({ position:"relative", height:$(pList).height() + "px" });
    $(pList).children().each(function(pIndex, pElement){ $(pElement).css("top", $(pElement).position().top); });
    $(pList).children().css ({ position:"absolute" });

    var flgSort = pAsc ? [-1, 1] : [1, -1];
    var aryTop  = $.map($(pList).children().get(),     function(pElement, pIndex){ return $(pElement).css("top"); });
    var arySort =       $(pList).children().get().sort(function(a       , b     )
    {
           if ($(a).attr(pKey) == $(b).attr(pKey)) return $(a).attr("item_no") < $(b).attr("item_no") ? flgSort[0] : flgSort[1];
      else if ($(a).attr(pKey) <  $(b).attr(pKey)) return flgSort[0];
      else                                         return flgSort[1];
    });

    for (var i01 = 0; i01 < arySort.length; i01++)
    {
      $(pList).children("[item_no='" + $(arySort[i01]).attr("item_no") + "']").animate({ top:aryTop[i01] }, 500, "swing");
    }

    function beforeSort()
    {
      if ($(pList).children(":animated").length > 0) { setTimeout(function(){ beforeSort(); }, 500); return; }

      for (var i01 = 0; i01 < arySort.length; i01++)
      {
        var $element = $(pList).children("[item_no='" + $(arySort[i01]).attr("item_no") + "']");
        $(pList).append($element);
        $element.css({ position:"", top:"" });
      }

      $(pList).css({ position:"", height:"" });
    }

    beforeSort();
  }

  return this;
};})(jQuery);
