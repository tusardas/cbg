cbgApp.controller('ngHomeController', function($rootScope, $scope, $location, $templateCache, $route, $modal, $aside, $alert, userFactory, gameFactory, ngHomeService, cbgFactory) {
    $rootScope.title = cbgFactory.getAppName() + " : Home";
    var user = userFactory.getUser();
    $scope.appName = cbgFactory.getAppName();
    $scope.templateURI = 'partials/homeTemplates/includes/starter.html';
    if(user === undefined) {
        $location.path('/signin');
    }
    $scope.user = user;
    
    var sideMenu = $aside({
    	scope: $scope, 
    	template: 'partials/homeTemplates/includes/sideMenu.html', 
    	show:false
    });

    var signoutModal = $modal({
    	scope: $scope,
    	template: 'partials/homeTemplates/includes/signoutModal.html',
    	animation: 'am-fade-and-scale',
    	backdrop: false,
    	show: false
    });
    
    var exsistingGameModal = $modal({
    	scope: $scope,
    	template: 'partials/homeTemplates/includes/exsistingGameModal.html',
    	animation: 'am-fade-and-scale',
    	backdrop: false,
    	show: false
    });
    
    var newGameModal = $modal({
		"title": $scope.appName,
		"content": "Get ready ! Starting new game...",
		animation:'am-fade-and-scale',
		backdrop: false,
		show: false
	});
    
    $scope.showSignoutModal = function() {
   		sideMenu.hide();
      	signoutModal.$promise.then(function() {
  			if($scope.existingErrorAlert !== undefined) {
                $scope.existingErrorAlert.hide();
            }
            signoutModal.show();
            $scope.existingErrorAlert = signoutModal;
  		});
    };
    
    $scope.signout = function() {
    	signoutModal.hide();
    	userFactory.setUser(undefined);
        gameFactory.setCurrentPlayer(undefined);
        gameFactory.setCurrentGame(undefined);
        if($scope.existingErrorAlert !== undefined) {
            $scope.existingErrorAlert.hide();
        }
        $location.path('/signin');
    };

    $scope.showOptions = function() {
    	sideMenu.$promise.then(function() {
            if($scope.existingErrorAlert !== undefined) {
                $scope.existingErrorAlert.hide();
            }
			sideMenu.show();
            $scope.existingErrorAlert = sideMenu;
		});
    };

    $scope.startNewGame = function() {
        if(gameFactory.getCurrentGame() !== undefined) {
            $scope.resumePrompt();
        }
        else {
            newGameModal.$promise.then(function() {
                sideMenu.hide();
                newGameModal.show();
                if($scope.existingErrorAlert !== undefined) {
                    $scope.existingErrorAlert.hide();
                }
                ngHomeService.startNewGame({
                    playerid : gameFactory.getCurrentPlayer()._id
                }).success(function(newGame) {
                    newGameModal.hide();
                    if(newGame.status !== "failed") {
                        gameFactory.setCurrentGame(newGame);
                        //var currentPageTemplate = $route.current.templateUrl;
                        //$templateCache.remove(currentPageTemplate);
                        $scope.templateURI = 'partials/homeTemplates/includes/gameConsole.html';
                    }
                    else {
                        $scope.existingErrorAlert = $alert({title: "SERVER ERROR:", content: "Could not save new game", type: 'danger', show: true});
                    }

                }).error(function(data, status, headers, config) {
                    newGameModal.hide();
                    $scope.existingErrorAlert = $alert({title: "SERVER ERROR:", content: "Could not connect server", type: 'danger', show: true});
                });
            });
        }
    };
    
    $scope.resumePrompt = function () {
        exsistingGameModal.$promise.then(function() {
            if($scope.existingErrorAlert !== undefined) {
                $scope.existingErrorAlert.hide();
            }
            exsistingGameModal.show();
            $scope.existingErrorAlert = exsistingGameModal;
            return false;
        });
    };
    
    $scope.discardAndStartNewGame = function() {
        newGameModal.$promise.then(function() {
            sideMenu.hide();
            newGameModal.show();
            if($scope.existingErrorAlert !== undefined) {
                $scope.existingErrorAlert.hide();
            }
            ngHomeService.deleteGame({
                gameid : gameFactory.getCurrentGame()._id
            }).success(function(responseObj) {
                newGameModal.hide();
                if(responseObj.status !== "failed") {
                    gameFactory.setCurrentGame(undefined);
                    $scope.startNewGame();
                }
                else {
                    $scope.existingErrorAlert = $alert({title: "SERVER ERROR:", content: "Could not delete existing game", type: 'danger', show: true});
                }

            }).error(function(data, status, headers, config) {
                newGameModal.hide();
                $scope.existingErrorAlert = $alert({title: "SERVER ERROR:", content: "Could not connect server", type: 'danger', show: true});
            });
        });
    };
    $scope.resumeGame = function() {
        if($scope.existingErrorAlert !== undefined) {
            $scope.existingErrorAlert.hide();
        }
        $scope.templateURI = 'partials/homeTemplates/includes/gameConsole.html';
    };
    if(gameFactory.getCurrentGame() !== undefined) {
        $scope.resumePrompt();
    }
});