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

    /** Loading Screen Parameters **/ 
    $scope.loadedItemsArr = ['player', 'game', 'chars'];
    $scope.loadedItemsObj = {};
    
    /** Character Creation Parameters **/ 
    $scope.newCharName = "";

    /** Character Manipulation **/
    $scope.selectedCharacter = null;

    /** ------------- Loading START ------------- **/
    /**
     * Load player Info
     * If player does not yet exist, write into db
     */
    $scope.loadPlayerInfo = function () {
        api_service.getPlayer($scope.email, $scope.name)
        .then(function (response) {
            console.log("Got player state:");
            console.log(response.data);
            $scope.admin = response.data.admin;
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


    $scope.loadCharacterInfo = function (){
        api_service.getPlayerCharacters($scope.email)
        .then(function (response){
            console.log("Got Characters");
            console.log(response.data);
            $scope.characters = response.data;
            $scope.loadedItemsObj['chars'] = true;
            if ($scope.characters.length && !$scope.selectedCharacter){
                $scope.selectedCharacter = $scope.characters[0];
            }
        });
    }

    $scope.loading = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            $scope.loadedItemsObj[index] = false;
        }
    }

    $scope.load = function (){

        $scope.loadPlayerInfo();
        $scope.loadGameState();
        $scope.loadCharacterInfo();
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

    /*** ---------- Loading END ------------ ***/

    /*** ----------- Game State ------------ ***/

    $scope.hideModals = function (){
        $('#settings-modal').modal('hide');
        $('#createCharacter-modal').modal('hide');

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
    /*** ------------ Game State END ---------------- ***/
    /*** ------------ Dev Environment START--------------- ***/

    $scope.advanceTimestep = function (){
        api_service.advanceTimestep($scope.email)
        .then(function (response) {
            console.log(response.data);
            $scope.load();
        });
    };
    /*** ------------- Dev Environemnt END------------ ***/ 
    /**** ------------ Char Creation START-------------- ***/

    $scope.setCharName = function () {
        $scope.newCharName = utils.newName();
        for (var i=0; i<$scope.characters.length; i++){
            if($scope.newCharName === $scope.characters[i].name){
                $scope.setCharName();
                break;
            }
        }
    }; 

    $scope.createCharacter = function (){

        console.log($scope.newCharName, $scope.email);
        api_service.createCharacter($scope.email, $scope.newCharName)
        .then(function (response){
            console.log("character created");
            console.log(response.data);
            $scope.loadCharacterInfo();
            $scope.hideModals();
            $scope.setCharName();
        });
    };

    /**** ------------ Char Creation END-------------- ***/
    /**** ------------ Char Manipulation START ------- ***/

    /**
    *   INPUT character OBJECT row from characters table
    */
    $scope.selectCharacter = function (character){
        $scope.selectedCharacter = character;
    };

    /**** ------------ Char Manipulation END   ------- ***/
    /*** -------------- Run START ------------- ***/
    //loading must be seperate from load so modals can disapear on refresh
    $scope.loading();
    $scope.load();
    $scope.monitorGameState();

    /*** -------------- Run END ------------- ***/

});
