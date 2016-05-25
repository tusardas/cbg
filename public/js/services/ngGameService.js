cbgApp.factory('ngGameService', ['$http',function($http) {
	return {
		saveGame : function(gameData) {
			return $http.post('/rest/xyz', gameData);
		}
	};
}]);