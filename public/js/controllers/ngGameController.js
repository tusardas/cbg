cbgApp.controller('ngGameController', function($rootScope, $scope, $modal, $location, $alert, userFactory, gameFactory, ngGameService, cbgFactory) {
    $rootScope.title = cbgFactory.getAppName() + " : Play In Progress";
    $scope.appName = cbgFactory.getAppName();
    var user = userFactory.getUser();
    if(user === undefined) {
        $location.path('/signin');
    }
    
    var cardAttributesModal = $modal({
    	scope: $scope,
    	template: 'partials/homeTemplates/includes/cardAttributesModal.html',
    	animation: 'am-fade-and-scale',
    	backdrop: false,
    	show: false
    });

    $scope.setSelectedAttribute = function(selectedAttribute) {
        console.log("selectedAttribute -------> " + selectedAttribute);
        $scope.selectedAttribute = selectedAttribute;
    };
    
    var playCard = function(cardId, playerId, attributeId) {

        ngGameService.playTurn({
            gameid : gameFactory.getCurrentGame()._id,
            cardid : cardId,
            playerId : playerId,
            attributeId : attributeId
        }).success(function(updatedGame) {
            cardAttributesModal.hide();
            gameFactory.setCurrentGame(updatedGame);
            loadGame();
        }).error(function(data, status, headers, config) {
            
        });
    };
    
    var loadGame = function() {
        var currentGame = gameFactory.getCurrentGame();
        $scope.currentGame = currentGame;
        var player = gameFactory.getCurrentPlayer();
        var sizeDistributions = currentGame._cardDistributions.length;
        for(i=0; i < sizeDistributions; i++) {
            if(currentGame._cardDistributions[i]._player ===  player._id) {
                $scope.cards = currentGame._cardDistributions[i]._cards;
                break;
            }
        }
        var playedCards = currentGame._gameState._playedCards;
        var sizePlayedCards = playedCards.length;
        var playedCard1, playedCard2;
        console.log("sizePlayedCards -----> " + sizePlayedCards);
        if(sizePlayedCards) {
            var tempPlayedCard;
            var i = (sizePlayedCards-1);
            while(i>=0) {
                tempPlayedCard = playedCards[i];
                if(playedCard1 === undefined && tempPlayedCard._player == player._id) {
                    playedCard1 = tempPlayedCard;
                }
                if(playedCard2 === undefined && tempPlayedCard._player != player._id) {
                    playedCard2 = tempPlayedCard;
                }
                i--;
            }
        }
        $scope.playedCard1 = playedCard1;
        $scope.playedCard2 = playedCard2;
        /*
        var nextPlayer = currentGame._gameState._nextPlayer;
        if(player._id !== nextPlayer._id) {
            playCard(""); //CPU's automatic turn
        }
        */
        var nextPlayer = currentGame._gameState._nextPlayer;
        $scope.nextPlayer = nextPlayer;
        $scope.currentPlayer = player;
        
    };
    
    loadGame();
    
    $scope.selectCard = function($event, cardId) {
        $scope.selectedCardId = cardId;
        $scope.selectedCard;
        var size = $scope.cards.length;
        var tempCard;
        console.log("cardId ---> " + cardId);
        for(var i=0; i<size; i++) {
            tempCard =  $scope.cards[i];
            if(cardId == tempCard._id) {
                $scope.selectedCard = tempCard;
                break;
            }
        }
    };
    
    $scope.initCardAttributes = function() {
        if($scope.selectedCardId !== undefined
            && $scope.currentPlayer._id == $scope.nextPlayer._id) {
            cardAttributesModal.$promise.then(function() {
                cardAttributesModal.show();
                $scope.selectedAttribute = undefined;
                return false;
            });
        }
    };
    
    $scope.placeCard = function() {
        var cardId = $scope.selectedCardId;
        console.log("placeCard called ---------------" + cardId);
        
        var game = gameFactory.getCurrentGame();
        var player = gameFactory.getCurrentPlayer();
        var nextPlayer = game._gameState._nextPlayer;

        var playerId = player._id;
        var attributeId = $scope.selectedAttribute

        console.log("game -------------" + game._id);
        console.log("player -------------" + player._id);
        console.log("nextPlayer -------------" + nextPlayer._id);
        
        //if(player._id === nextPlayer._id) {
            playCard(cardId, playerId, attributeId);
        //}
    }; 
});

  
