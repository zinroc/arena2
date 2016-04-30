var app = angular.module("ArenaApp");


app.directive('bsTooltip', function (){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){


                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
}).controller("ArenaCtrl", function arenaCtrl ($scope, api_service, $timeout) {
    "use strict";
    $scope.email = utils.getCookie("email");
    $scope.name = utils.getCookie("name");
    console.log($scope.email, $scope.name);

    $scope.loadedItemsArr = ['player', 'game'/*,'recruits'*/];
    $scope.loadedItemsObj = {};


    /**
     * Load player Info
     * If player does not yet exist, write into db
     */
    $scope.loadPlayerInfo = function () {
        api_service.getPlayer($scope.email, $scope.name)
        .then(function (response) {
            console.log("Got player state:");
            console.log(response.data);
            $scope.gold = response.data.gold;
            $scope.loadedItemsObj['player'] = true;
        });
    };

    $scope.loadGameState = function () {
        api_service.getGameState($scope.email)
        .then(function (response) {
            console.log("Got game state:");
            console.log(response.data);
            $scope.timestep = response.data.timestep;
            $scope.loadedItemsObj['game'] = true;

        });
    };

    /**
    *   Get recruit info
    *   If recruits don't exist, create them
    */
    /*
    $scope.loadRecruits = function (){
        api_service.getRecruits($scope.email)
        .then(function (response) {
            console.log("Got recruits:")
            console.log(response.data);
            $scope.recruits = response.data;
            $scope.loadedItemsObj['recruits'] = true;
        });
    };*/

    $scope.load = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            $scope.loadedItemsObj[index] = false;

        }
        $scope.loadPlayerInfo();
        $scope.loadGameState();
        //$scope.loadRecruits();
    };

    $scope.checkLoad = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            if ($scope.loadedItemsObj[index] === false){
                return false;
            }
        }
        return true;
    };
    
    $scope.testNewFeature = function (){
        console.log("hello world");
    };

    $scope.load();
});
