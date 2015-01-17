var app = angular.module("App", ["ngResource"]);

// Load data
app.factory('dataService', function($q, $http) {
	return {
		fetch: function() {
			var deferred = $q.defer();

			$http.get("./external/mapdata.json").success(function(data) {
				deferred.resolve(data);
			}.bind(this));

			return deferred.promise;
		}
	};
});

app.controller("MapController", ['$scope', 'dataService', function($scope, dataService) {
	
	dataService.fetch().then(function(data) {
		$scope.data = data;
	})

	$scope.cityover = function(cityId, regionId){
		$scope.over(cityId, regionId);
	}
	$scope.cbover = function(cityId, regionId){
		$scope.over(cityId, regionId);
	}

	// MouseEvent funcitons
	$scope.over = function(cityId, regionId){
		// documents 로딩이 늦어 에러가 발생함
		// 추후 제거 필요
		console.log(cityId);
		if (!this.svg) {
			this.svg = document.querySelector("#map");
		}
		if (!this.cbx) {
			this.cbx = document.querySelector("#checkboxlist");
			console.log("requery");
		}

		var city = $scope.data.cities[cityId];
		var region = $scope.data.regions[regionId];

		this.currentCityName = city.name;
		// reset region hover data
		for (var i in $scope.data.regions) {
			var r = $scope.data.regions[i];
			r.hover = false;
		}

		city.hover = true;
		region.hover = true;
	}.bind(this);

	$scope.out = function(cityId, regionId) {
		var city = $scope.data.cities[cityId];
		// var region = $scope.data.regions[regionId];
		city.hover = false;
		// region.hover = false;
		console.log(this);
	};

	$scope.click = function(cityId){
		var city = $scope.data.cities[cityId];
		city.selected = !city.selected;
		// map에서 click시 checkbox 체크는 변하지 않으므로 여기서 처리
		var checkbox = document.querySelector("#cb_"+cityId);
		checkbox.checked = city.selected;
	};
}]);

app.filter('citiesInRegion', function() {
	return function(cities, region){
		var filtered = [];
		angular.forEach(cities, function(city) {
			if (city.region == region) {
				filtered.push(city);
			}
		});
		return filtered;
	};
})