angular.module('starter.services', ['ngResource'])
  .factory('Cities', function () {
    var cities = [
      {id: 0, name: 'New York City', lat: 40.7127, lgn: 74.0059},
      {id: 1, name: 'Chicago', lat: 41.90, lgn: 87.65},
      {id: 2, name: 'Indianapolis', lat: 39.73 , lgn: 86.27},
      {id: 3, name: 'Los Angeles', lat: 34.0500, lgn: 118.2500},
      {id: 4, name: 'Dallas', lat: 32.7758, lgn: 96.7967},
      {id: 5, name: 'London', lat: 51.5072, lgn: 1.1275},
      {id: 6, name: 'Frankfurt', lat: 50.1117, lgn: 8.6858},
      {id: 7, name: 'New Delhi', lat: 28.6100, lgn: 77.2300},
      {id: 8, name: 'North Pole', lat: 90, lgn: 0}
    ];

    return {
      all: function () {
        return cities;
      },
      get: function (cityId) {
        // Simple index lookup
        return cities[cityId];
      },
      addCurrentCityInfo: function () {
        return new Promise(function (resolve, reject) {
          geolocator.locateByIP({
            enableHighAccuracy: true,
            fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
            addressLookup: false
          }, function (err, respone) {
            if(respone.address.city !== ""){
              cities.push({
                id: cities.length,
                name: respone.address.city,
                lat: respone.coords.latitude,
                lgn: respone.coords.longitude
              });
            } else {
              cities.push({
                id: cities.length,
                name: "wherever you are!",
                lat: respone.coords.latitude,
                lgn: respone.coords.longitude
              });
            }

            return resolve();
          });
        });
      }
    }
  }).factory('DataStore', function () {

  var DataStore = {
    city: 'somewhere',
    latitude: 0,
    longitude: 0,
    unit: 'us'
  };

  DataStore.setUnit = function (value) {
    DataStore.unit = value;
  };

  DataStore.setNewCity = function (value) {
    DataStore.city = value;
  };

  DataStore.setLatitude = function (value) {
    DataStore.latitude = value;
  };

  DataStore.setLongitude = function (value) {
    DataStore.longitude = value;
  };

  return DataStore;
})
  .factory('Weather', ['$q', '$resource', '$http', 'FORECASTIO_KEY',
    function ($q, $resource, $http, FORECASTIO_KEY) {
      var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

      var weatherResource = $resource(url, {
        callback: 'JSON_CALLBACK',
      }, {
        get: {
          method: 'JSONP'
        }
      });

      return {
        getCurrentWeather: function (lat, lng, unit) {
          return $http.jsonp(url + lat + ',' + lng + '?units=' + unit + '&callback=JSON_CALLBACK');
        }
      }
    }]
  )
  .factory('Units', function (DataStore) {
    return {
      getUnit: function () {
        return DataStore.unit;
      }
    }
  });
