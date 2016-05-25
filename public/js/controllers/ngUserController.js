cbgApp.controller('ngUserController', function($rootScope, $scope, $http, $alert, $location, userFactory, gameFactory, ngUserService, cbgFactory) {
    $rootScope.title = cbgFactory.getAppName() + " : Siginin";
    $scope.signinProcessing = false;
    $scope.signinButtonCss = "";
    $scope.signinButton = "Sign in";
    $scope.appName = cbgFactory.getAppName();
    $scope.signin = function() {
        if($scope.signinProcessing === false) { //disables multiple clicks
            $scope.signinProcessing = true;
            $scope.signinButtonCss = 'disabled signin_loading';
            $scope.signinButton = "Please wait...";
            angular.element(document.querySelector("#signinError")).html('');
            ngUserService.verifyAuth({
                email : $scope.email,
                password : $scope.password
            })
            .success(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                if(data.status !== "failed") {
                    userFactory.setUser(data.user);
                    gameFactory.setCurrentPlayer(data.player);
                    if(data.game !== undefined && data.game !== null) {
                        gameFactory.setCurrentGame(data.game);
                    }
                    $location.path('/home');
                }
                else {
                    //show error
                    $alert({title: " ", content: "User not found", container:"#signinError", type: 'danger', show: true});
                }
                $scope.signinProcessing = false;
                $scope.signinButtonCss = '';
                $scope.signinButton = "Sign in";
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.signinProcessing = false;
                $scope.signinButtonCss = '';
                $scope.signinButton = "Sign in";
                $alert({title: " ", content: "Could not connect server", container:"#signinError", type: 'danger', show: true});
            });
        }
    };
});