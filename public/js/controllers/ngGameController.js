cbgApp.controller('ngGameController', function($rootScope, $scope, $alert, userFactory, gameFactory, ngGameService, cbgFactory) {
    $rootScope.title = cbgFactory.getAppName() + " : Play In Progress";
    $scope.appName = cbgFactory.getAppName();
    var user = userFactory.getUser();
    if(user === undefined) {
        $location.path('/signin');
    }
    
    var loadGame = function() {
        var currentGame = gameFactory.getCurrentGame();
        $scope.currentGame = currentGame;
        var player = gameFactory.getCurrentPlayer();
        for(i=0; i < 2; i++) {
            if(currentGame._cardDistributions[i]._player ===  player._id) {
                $scope.cards = currentGame._cardDistributions[i]._cards;
                break;
            }
        }
        var nextPlayer = currentGame._gameState._nextPlayer;
        if(player._id !== nextPlayer._id) {
            playCard(""); //CPU's automatic turn
        }
    };
    
    $scope.notPlaced1 = true;
    $scope.notPlaced2 = true;
    loadGame();
    
    $scope.toggoleCardView = function($event) {
        var clickedObject = angular.element($event.currentTarget);
        var cardPic = clickedObject.find("img");
        var cardInfo = clickedObject.find("ul");
        if(cardInfo.hasClass("hide")) {
            cardPic.addClass("hide");
            cardInfo.removeClass("hide");
        }
        else {
            cardPic.removeClass("hide");
            cardInfo.addClass("hide");
        }
    };
    
    var playCard = function(cardId) {
        ngGameService.playTurn({
            gameid : gameFactory.getCurrentGame()._id,
            cardid : cardId
        }).success(function(updatedGame) {
            gameFactory.setCurrentGame(updatedGame);
            loadGame();
        }).error(function(data, status, headers, config) {
            
        });
    };
    
    $scope.placeCard = function(cardId) {
        var game = gameFactory.getCurrentGame();
        var player = gameFactory.getCurrentPlayer();
        var nextPlayer = game._gameState._nextPlayer;
        if(player._id === nextPlayer._id) {
            playCard(cardId);
        }
    }; 
});

  
