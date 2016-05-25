cbgApp.factory('ngHomeService', ['$http',function($http) {
	return {
		startNewGame : function(gameData) {
			return $http.post('/rest/game', gameData);
		},
        deleteGame : function(gameData) {
			return $http.post('/rest/delete', gameData);
		}
	};
}]);