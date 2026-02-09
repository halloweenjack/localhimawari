$(function(){
/**
 * HARPS Model for HarpsWeb
 * require jquery, harps-model
 */

$.harpsModelHarps = {
  /**
   * 発電所
   */
  elst : {
    markers : {},
    json : null,
    infoWindow : null,
    addMarker : function(zoom, tileSetting){
      if($.harpsModelHarps.elst.json == null){
        $.harpsModelHarps.elst.getJson(type, zoom, tileSetting);
        return;
      }
      for(var type in $.harpsModelHarps.elst.json){
        $.harpsModelHarps.elst.visibleMarkers(type, zoom, tileSetting);
      }
    },
    zoomMarker : function(zoom, tileSetting){
      for(var type in $.harpsModelHarps.elst.markers){
        $.harpsModelHarps.elst.visibleMarkers(type, zoom, tileSetting);
      }
    },
    removeMarker : function(zoom, tileSetting){
      for(var type in $.harpsModelHarps.elst.markers){
        $.harpsModelHarps.elst.invisibleMarkers(type);
      }
    },
    getJson : function(type, zoom, tileSetting){
      $.harpsModelHarps.elst.json = {};
      for(var type in tileSetting.json){
        $.harpsModelHarps.elst.json[type] = [];
        $.harpsModelHarps.elst.markers[type] = [];
        $.ajax({
          type  : "GET",
          url   : tileSetting.json[type] + "?uid=" + (new Date()).getTime().toString(),
          dataType : "json"
        }).done(function(pJson){
          for(var key in pJson){
            $.harpsModelHarps.elst.json[key] = pJson[key];
            $.harpsModelHarps.elst.createMarkers(type, zoom, tileSetting);
          }
        }).fail(function(pXMLHttpRequest, pTextStatus, pErrorThrown){
          console.log(pXMLHttpRequest);
          console.log(pTextStatus);
          console.log(pErrorThrown);
        });
      }
    },
    visibleMarkers : function(type, zoom, tileSetting){
      var markers = $.harpsModelHarps.elst.markers[type];
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
      var markers = $.harpsModelHarps.elst.markers[type];
      var markerCount = markers.length
      for(var i=0; i<markerCount; i++){
        var marker = markers[i];
        marker.setVisible(false);
      }
    },
    createMarkers : function(type, zoom, tileSetting){
      var markerCount = $.harpsModelHarps.elst.json[type].length;
      for(var i=0; i<markerCount; i++){
        var json = $.harpsModelHarps.elst.json[type][i];
        $.harpsModelHarps.elst.createMarker(type, json, zoom, tileSetting);
      }
    },
    createMarker : function(type, json, zoom, tileSetting){
      var stage = tileSetting.zoomStage[zoom.toString()];
      var markerSize = tileSetting.size[zoom.toString()];
      //var markerSize = tileSetting.size[stage];
      var url = tileSetting.icon[type][stage];
      var marker = new google.maps.Marker({
        map : $.harpsModel.map,
        position : new google.maps.LatLng(
          parseFloat(json.y),
          parseFloat(json.x)
        ),
        title : json.P03_0002,
        icon : {
          url : url,
          scaledSize : new google.maps.Size(markerSize, markerSize)
        },
      });

      // マーカをクリックすると詳細を表示
      if($.harpsModelHarps.elst.infoWindow != null){
        $.harpsModelHarps.elst.infoWindow.close();
      }
      google.maps.event.addListener(marker, "click", function(event){
        if($.harpsModelHarps.elst.infoWindow != null){
          $.harpsModelHarps.elst.infoWindow.close();
        }
        $.harpsModelHarps.elst.infoWindow = new google.maps.InfoWindow({
          content : json.P03_0002
        });
        $.harpsModelHarps.elst.infoWindow.open(marker.getMap(), marker);
      });
      $.harpsModelHarps.elst.markers[type].push(marker);
    }
  },
  sortTimer : null
}
});
