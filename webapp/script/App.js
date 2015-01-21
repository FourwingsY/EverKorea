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
		this.resetHover();

		city.hover = true;
		region.hover = true;
	}.bind(this);

	$scope.click = function(cityId){
		var city = $scope.data.cities[cityId];
		city.selected = !city.selected;
		// map에서 click시 checkbox 체크는 변하지 않으므로 여기서 처리
		var checkbox = document.querySelector("#cb_"+cityId);
		checkbox.checked = city.selected;
	};

	$scope.catover = function(regionId) {
		var region = $scope.data.regions[regionId];
		this.resetHover();
		region.hover = true;
	}.bind(this);

	this.resetHover = function() {
		for (var i in $scope.data.cities) {
			var c = $scope.data.cities[i];
			c.hover = false;
		}
		for (var j in $scope.data.regions) {
			var r = $scope.data.regions[j];
			r.hover = false;
		}
	}
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
});

app.controller("ZoomController", function() {

	this.move = function(e) {
		var coordinate = this.getCursorXY(e);
		this.zoomBox = this.getViewBox(coordinate, 2);
		var zoomPos = this.getZoomPos(coordinate);
		this.cx = zoomPos[0];
		this.cy = zoomPos[1];
	};

	this.getCursorXY = function(e) {
		console.log("P:"+e.pageX);
		var svgElementPos = document.querySelector("#zoom").getBoundingClientRect();
		// var x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		// var y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		var x = e.pageX - svgElementPos.left;
		var y = e.pageY - svgElementPos.top;

		var result = [x,y];
		console.log(result);
		return result;
	};

	this.getViewBox = function(coord, scale) {
		var viewBox = [78742.3, -584111.1, 478020.8, 632482.1];
		var width = 420;
		var height = 556;

		var clipX = viewBox[0] + (1 - 1/scale) * viewBox[2] * (coord[0] / width);
		var clipY = viewBox[1] + (1 - 1/scale) * viewBox[3] * (coord[1] / height);
		var clipW = viewBox[2]/scale;
		var clipH = viewBox[3]/scale;

		var newViewBox = [parseInt(clipX), parseInt(clipY), parseInt(clipW), parseInt(clipH)];

		return newViewBox.join(' ');
	};

	this.getZoomPos = function(coord) {
		var viewBox = [78742.3, -584111.1, 478020.8, 632482.1];
		var width = 420;
		var height = 556;

		var x = viewBox[0] + viewBox[2] * coord[0] / width;
		var y = viewBox[1] + viewBox[3] * coord[1] / height;

		var result = [parseInt(x), parseInt(y)];

		return result;
	};

	// 초기화 작업
	this.cx = 0;
	this.cy = 0;
	this.zoomBox = this.getViewBox([0,0], 2);
});