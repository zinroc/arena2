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
    $scope.newCharFamilyName = "";
    $scope.characterCap = 0; 

    /** Character Manipulation **/
    $scope.selectedCharacter = null;

    /** Map Manipulation **/ 
    $scope.selectedProvince = null;
    $scope.selectedRegion = null; 

    /** ------------- Loading START ------------- **/
    /**
     * Load player Info
     * If player does not yet exist, write into db
     */
    $scope.loadPlayerInfo = function () {
        api_service.getPlayer($scope.email, $scope.name)
        .then(function (response) {
            console.log("Got player state:", response.data.character_cap);
            console.log(response.data);
            $scope.admin = response.data.admin;
            $scope.characterCap = response.data.character_cap;
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
                $scope.newCharFamilyName = $scope.characters[0].family_name;
                if (!$scope.selectedProvince){
                    $scope.selectProvince($scope.selectedCharacter.location);
                }
            } else if (!$scope.selectedProvince) {
                $scope.selectProvince(null);
            }
        });
    };

    $scope.loading = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            $scope.loadedItemsObj[index] = false;
        }
    };

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
        $('#deleteCharacter-modal').modal('hide');

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
    /**** ------------ Char Creation/Destruction START-------------- ***/

    $scope.setCharName = function () {
        $scope.newCharName = utils.newName();
        for (var i=0; i<$scope.characters.length; i++){
            if($scope.newCharName === $scope.characters[i].name){
                $scope.setCharName();
                break;
            }
        }
    }; 

    $scope.setCharFamilyName = function () {
        $scope.newCharFamilyName = utils.newName();
    }; 

    $scope.setCharNames = function (){
        $scope.setCharName();
        $scope.setCharFamilyName();
    }

    $scope.createCharacter = function (){

        api_service.createCharacter($scope.email, $scope.newCharName, $scope.newCharFamilyName)
        .then(function (response){
            console.log("character created");
            console.log(response.data);
            $scope.loadCharacterInfo();
            $scope.hideModals();
            $scope.setCharName();
        });
    };

    $scope.deleteCharacter = function (){
        api_service.deleteCharacter($scope.email, $scope.selectedCharacter.id)
        .then(function (response){
            console.log("character deleted");
            console.log(response.data);
            $scope.selectedCharacter = null;
            $scope.loadCharacterInfo();
            $scope.hideModals();
        });
    };

    /**** ------------ Char Creation END-------------- ***/
    /**** ------------ Char Manipulation START ------- ***/

    /**
    *   INPUT character OBJECT row from characters table
    */
    $scope.selectCharacter = function (character){
        $scope.selectedCharacter = character;
        $scope.newCharFamilyName = character.family_name;
    };

    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewCharActive = function (char_id){
        if (!char_id){
            return "";
        } else if (!$scope.selectedCharacter){
            return "";
        }else if (char_id === $scope.selectedCharacter.id){
            return 'selectedCharacterPortrait';
        } else {
            return 'characterPortrait';
        }
    };

    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewCharButtonActive = function (){
        if (!$scope.characters.length){
            return "createCharButton-active";
        } else if ($scope.characters.length && $scope.characters.length < $scope.characterCap){
            return "createCharButton-active";
        } else {
            return "";
        }
    };

    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewCharButtonFlicker = function (){
        if (!$scope.characters.length){
            return "flicker";
        } else {
            return "";
        }
    };

    /**** ------------ Char Manipulation END   ------- ***/
    /**** ------------ Map Manipulation START ---------***/
    $scope.selectProvince = function(location){
        if (!location){
            $scope.selectedProvince = provinceList.provinceGivenLocation(null); 
        } else {
            $scope.selectedProvince = provinceList.provinceGivenLocation(location);
            $scope.selectedRegion = location; 
        }
    };

    $scope.cycleProvinceLeft = function (){
        //console.log($scope.selectedProvince.index);
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleLeft($scope.selectedProvince.index);

    };

    $scope.cycleProvinceRight = function (){
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleRight($scope.selectedProvince.index);
    };

    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewRegionFlicker = function () {
        if($scope.characters.length ===0){
            return "";
        } else if (!$scope.selectedCharacter) {
            return "";
        }else if($scope.selectedCharacter.location){
            return "";
        } else if (!$scope.selectedCharacter.location){
            return "flicker";
        }
    };


    /**** ------------ Map Manipulation END ---------***/
    /*** -------------- Run START ------------- ***/
    //loading must be seperate from load so modals can disapear on refresh
    $scope.loading();
    $scope.load();
    $scope.monitorGameState();

    /*** -------------- Run END ------------- ***/

});
