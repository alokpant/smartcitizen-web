(function() {
  'use strict';

  angular.module('app.components')
    .factory('markerUtils', markerUtils);

    markerUtils.$inject = ['device', 'kitUtils', 'COUNTRY_CODES', 'MARKER_ICONS'];
    function markerUtils(device, kitUtils, COUNTRY_CODES, MARKER_ICONS) {
      var service = {
        parseType: parseType,
        parseLocation: parseLocation,
        parseLabels: parseLabels,
        parseCoordinates: parseCoordinates,
        parseId: parseId,
        getIcon: getIcon,
        parseName: parseName
      };
      _.defaults(service, kitUtils);
      return service;

      ///////////////

      function parseType(object) {
        var kitType; 

        var genericKitData = device.getGenericKitData();
        var kit = genericKitData[object.kit_id];
        var kitName = kit && kit.name; 

        if((new RegExp('sck', 'i')).test(kitName)) { 
          kitType = 'SmartCitizen Kit';
        }
        return kitType; 
      }

      function parseLocation(object) {
        var location = '';
        
        var city = object.city;
        var country_code = object.country_code;
        var country = COUNTRY_CODES[country_code];

        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        return location;
      }

      function parseLabels(object) {
        return {
          status: object.status,
          exposure: object.exposure
        };
      }

      function parseCoordinates(object) {
        return {
          lat: object.latitude,
          lng: object.longitude
        };
      }

      function parseId(object) {
        return object.id;
      }

      function getIcon(status) {
        var icon;

        if(status === 'offline') {
          icon = MARKER_ICONS.smartCitizenOffline
        } else {
          icon = MARKER_ICONS.smartCitizenOnline;
        }  
        return icon;
      }

      function parseName(object) {
        return object.name.length <= 41 ? object.name : object.name.slice(0, 41).concat(' ... ');
      }
    }
})();
