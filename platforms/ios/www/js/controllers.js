angular.module('starter.controllers', []).constant('FORECASTIO_KEY', '47bf99da87e9ee588c011cd5ecce56d7')

  .controller('HomeCtrl', function ($scope, $state, Weather, DataStore, Units) {

    $scope.city = DataStore.city;
    var latitude = DataStore.latitude;
    var longitude = DataStore.longitude;

    var unit = Units.getUnit();

    var currentWeather = Weather.getCurrentWeather(latitude, longitude, unit);

    currentWeather.then(function (weather) {
      console.log('currentWeather');


      var tagline = [
        'It\'s fucking \n' + weather.data.currently.summary.toLowerCase() + ' in ' + DataStore.city
      ];

      var skycons = new Skycons();
      skycons.add("icon", weather.data.currently.icon);
      skycons.play();

      $scope.tagline = tagline[0];
      $scope.temperature = Math.floor(weather.data.currently.temperature);
      if(unit === 'ca'){
        $scope.unit = "˚C"
      } else {
        $scope.unit = "˚F"
      }

    });
  })

  .controller('LocationsCtrl', function ($scope, $state, Cities, DataStore) {
    console.log('LocationsCtrl');

    Cities.addCurrentCityInfo().then(function () {

      $scope.cities = Cities.all();
      $scope.$apply();

      $scope.changeCity = function (cityId) {
        var lat = $scope.cities[cityId].lat;
        var lgn = $scope.cities[cityId].lgn;
        var city = $scope.cities[cityId].name;

        DataStore.setNewCity(city);
        DataStore.setLatitude(lat);
        DataStore.setLongitude(lgn);

        $state.go('tab.home');
      }
    });
  })
  .controller('SettingsCtrl', function ($scope, DataStore) {

    $scope.american = {checked: true};
    $scope.toggleChange = function () {
      if ($scope.american.checked === false) {
        DataStore.setUnit('ca');
      } else {
        DataStore.setUnit('us');
      }
    }

  });
