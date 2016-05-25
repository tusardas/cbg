cbgApp.factory('ngUserService', ['$http',function($http) {
	return {
		verifyAuth : function(authData) {
			return $http.post('/rest/user', authData);
		}
	};
}]);