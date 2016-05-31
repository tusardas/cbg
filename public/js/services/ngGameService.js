cbgApp.factory('ngGameService', ['$http',function($http) {
	return {
        playTurn : function(gameData) {
			return $http.post('/rest/playTurn', gameData);
		}
	};
}]);