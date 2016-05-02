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

    $scope.loadedItemsArr = ['player', 'game','visitors', 'scrollPacks'];
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
    *   Get visitor info
    *   If visitors don't exist, create them
    */
    
    $scope.loadVisitors = function (){
        api_service.getVisitors($scope.email)
        .then(function (response) {
            console.log("Got visitors:");
            console.log(response.data);
            $scope.visitors = response.data;
            $scope.loadedItemsObj['visitors'] = true;
        });
    };
    /**
    *   Get scroll pack info
    */
    $scope.loadScrollPacks = function (){
        api_service.getScrollPacks($scope.email)
        .then(function (response){
            console.log("Got scroll packs:");
            console.log(response.data);
            $scope.scrollPacks = response.data;
            $scope.loadedItemsObj['scrollPacks'] = true;
        });
    };

    $scope.loading = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            $scope.loadedItemsObj[index] = false;
        }
    }

    $scope.load = function (){

        $scope.loadPlayerInfo();
        $scope.loadGameState();
        $scope.loadVisitors();
        $scope.loadScrollPacks();
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


    $scope.hideModals = function (){
        $('#visitors-modal').modal('hide');
    };

    /**
    *   Monitor the globalgamestate to know when it changes
    */
    $scope.monitorGameState = function (){

        api_service.getGameState($scope.email)
        .then(function (response){
            console.log("Got game state:");
            console.log(response.data);
            if($scope.timestep === response.data.timestep){
                //do nothing
            } else {
                $scope.hideModals();
                $scope.timestep = response.data.timestep;
                $scope.load();

            }
        });

        $timeout(function(){
            $scope.monitorGameState();
        }, 2000);

    };

    $scope.buyScrollPack = function (){
        console.log("buy scroll pack");
        api_service.buyScrollPack($scope.email)
        .then(function (response){
            console.log(response.data);
            $scope.loadScrollPacks();
        });
    };

    $scope.testNewFeature = function (){
        console.log('hello world');
    };

    $scope.advanceTimestep = function (){
        api_service.advanceTimestep($scope.email)
        .then(function (response) {
            console.log(response.data);
            $scope.load();
        });
    };

    $scope.openPack = function (packID){
        console.log(packID);
    };
    //loading must be seperate from load so modals can disapear on refresh
    $scope.loading();
    $scope.load();
    $scope.monitorGameState();

});
