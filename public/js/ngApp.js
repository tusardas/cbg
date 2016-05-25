var cbgApp = angular.module('cbgApp', ['ngAnimate', 'ngRoute', 'mgcrea.ngStrap'], function($provide) {
    $provide.factory('userFactory', [function() {
        var user;
        this.getUser = function() {
            return user;
        };
        this.setUser = function($user) {
            user = $user;
        };
        return this;
    }]);
    $provide.factory('cbgFactory', [function() {
        var appName = "CBG";
        this.getAppName = function() {
            return appName;
        };
        return this;
    }]);
    $provide.factory('gameFactory', [function() {
        var currentPlayer;
        var currentGame;
        this.getCurrentPlayer = function() {
            return currentPlayer;
        };
        this.setCurrentPlayer = function($player) {
            currentPlayer = $player;
        };
        this.getCurrentGame = function() {
            return currentGame;
        };
        this.setCurrentGame = function($game) {
            currentGame = $game;
        };
        return this;
    }]);
});

cbgApp.config(function($routeProvider) {
    $routeProvider
        .when('/signin',
            {
                controller : 'ngUserController',
                templateUrl : 'partials/signin.html'
            }
        )
        .when('/home',
            {
                controller : 'ngHomeController',
                templateUrl : 'partials/homeTemplates/home.html'
            }
        )
        .when('/',
            {
                redirectTo : '/signin'
            }
        )
        //.otherwise({redirectTo : '/signin'});
        .otherwise(
            {
                templateUrl : 'partials/404.html'
            }
        );
});
