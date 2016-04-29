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
}).controller("ArenaCtrl", function arenaCtrl ($scope, arenaService, $timeout) {
    "use strict";
    $scope.email = utils.getCookie("email");
    $scope.name = utils.getCookie("name");
    console.log($scope.email, $scope.name);

    /**
     * Load player Info
     */
    $scope.loadPlayerInfo = function () {
        arenaService.getPlayer($scope.email, $scope.name)
        .then(function (response) {
            console.log("Got player state:");
            console.log(response.data);
            $scope.gold = response.data.gold;
        });

       
    };

    $scope.loadGameState = function () {
        arenaService.getGameState($scope.email)
        .then(function (response) {
            console.log("Got game state:");
            console.log(response.data);
            $scope.timestep = response.data.timestep;
        });
    };

    $scope.loadPlayerInfo();
    $scope.loadGameState();
});
