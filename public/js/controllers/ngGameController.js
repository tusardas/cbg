cbgApp.controller('ngGameController', function($rootScope, $scope, $alert, userFactory, gameFactory, ngGameService, cbgFactory) {
    $rootScope.title = cbgFactory.getAppName() + " : Play In Progress";
    $scope.appName = cbgFactory.getAppName();
    $scope.cards = $rootScope.cards;
    console.log("$rootScope.cards ---> " + $rootScope.cards.length);
    var user = userFactory.getUser();
    if(user === undefined) {
        $location.path('/signin');
    }
});

  
