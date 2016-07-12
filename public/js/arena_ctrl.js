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

    /** CSS animation parameters **/ 
    $scope.viewRegionSlideStatus = "off";
    $scope.characterSelectLock = "off";

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
            if ($scope.characters.length){
                $scope.newCharFamilyName = $scope.characters[0].family_name;
            }

            if ($scope.characters.length && !$scope.selectedCharacter){
                $scope.selectedCharacter = $scope.characters[0];
                if (!$scope.selectedProvince){
                    $scope.selectProvince($scope.selectedCharacter.location);
                }
            } else if (!$scope.selectedProvince) {
                $scope.selectProvince(null);
            }
            $scope.loadedItemsObj['chars'] = true;

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
        $('#spawnCharacter-modal').modal('hide');

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
        if(!$scope.characters.length) {
            $scope.newCharFamilyName = utils.newName();
        }
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
        console.log($scope.viewRegionSlideStatus, $scope.characterSelectLock);
        if ($scope.viewRegionSlideStatus === 'off' && $scope.characterSelectLock === 'off'){
            $scope.selectedCharacter = character;
            $scope.newCharFamilyName = character.family_name;
            // snap to character's location
            if ($scope.selectedCharacter.location !== $scope.selectedRegion && $scope.selectedCharacter.location){
                $scope.selectProvince($scope.selectedCharacter.location);
                $scope.viewRegionSlideStatus = "right";
                $scope.characterSelectLock = "on";
                setTimeout(function (){
                    if ($scope.viewRegionSlideStatus === 'right'){
                        $scope.viewRegionSlideStatus = 'off'; 

                    }
                }, 400);
                //it takes longer for the main map to register changes in flags than it does for the
                // character scrolling list, so a seperate slower tag needs to be made for that list
                setTimeout(function (){
                    if ($scope.characterSelectLock === 'on'){
                        $scope.characterSelectLock = 'off'; 

                    }
                }, 1200);

            }
        }
    };

    /**
    * Places the character in a spawn location
    */

    $scope.spawnCharacter = function (){
        console.log($scope.selectedRegion, $scope.selectedCharacter.id);
        
        api_service.spawnCharacter($scope.email, $scope.selectedCharacter.id, $scope.selectedRegion)
        .then(function (response){
            console.log("character spawned into " + $scope.selectedRegion);
            console.log(response.data);
            $scope.selectedCharacter.location = $scope.selectedRegion; 
            $scope.loadCharacterInfo();
            $scope.hideModals();
        });

    };

    /**
    *   Function for dynamic client side CSS only
    *   Shows which character is currently selected
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
    *   When the player has the option to make more characters, shows a green button
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
    *   When a player does not have characters, shows them how to make one.
    */
    $scope.viewCharButtonFlicker = function (){
        if (!$scope.characters.length){
            return "flicker";
        } else {
            return "";
        }
    };

    /**
    *   Function for dynamic client side CSS only
    *   Makes CSS show what region selected character is in.
    */
    $scope.viewCharacterPresent = function (location){
        if(!$scope.selectedCharacter){
            return "";
        } else if ($scope.selectedCharacter.location === location){
            return "youAreHere";
        } else {
            return "";
        }
    };
    /**
    *   Function for dynamic client side CSS only
    *   Makes CSS show progress cursor when character reselection is locked
    */
    $scope.viewCharacterSelectLock = function (){
        if ($scope.characterSelectLock === 'on'){
            return "progress"; 
        } else {
            return "";
        }
    };


    /**** ------------ Char Manipulation END   ------- ***/
    /**** ------------ Map Manipulation START ---------***/

    /**
    * Select a location based on the location_name STRING
    */
    $scope.selectLocation = function (location_name){
        $scope.selectedRegion = location_name;
    };

    /**
    *   Create appropriate modal when player clicks on a location
    */
    $scope.locationModalTrigger = function (){
        if(!$scope.selectedCharacter){
            return "";
        }  else if (!$scope.selectedCharacter.location){
            return "#spawnCharacter-modal";
        } else {
            return "";
        }
    };

    /**
    *   Select the province OBJECT given a location STRING
    */

    $scope.selectProvince = function(location){
        if (!location){
            $scope.selectedProvince = provinceList.provinceGivenLocation(null); 
            $scope.selectedRegion = null;
        } else {
            $scope.selectedProvince = provinceList.provinceGivenLocation(location);
            $scope.selectedRegion = location; 
        }
    };

    $scope.cycleProvinceLeft = function (){
        //console.log($scope.selectedProvince.index);
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleLeft($scope.selectedProvince.index);
        /** Sliding animations **/ 
        $scope.viewRegionSlideStatus = 'left';
        setTimeout(function (){
                if ($scope.viewRegionSlideStatus === 'left'){
                    $scope.viewRegionSlideStatus = 'off'; 

                }
            }, 400);
    };

    $scope.cycleProvinceRight = function (){
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleRight($scope.selectedProvince.index);
        /** Sliding animations **/ 
        $scope.viewRegionSlideStatus = 'right';
        setTimeout(function (){
                if ($scope.viewRegionSlideStatus === 'right'){
                    $scope.viewRegionSlideStatus = 'off'; 

                }
            }, 400);
    };


    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewArrowTwinkle = function () {
        if($scope.characters.length ===0){
            return "";
        } else if (!$scope.selectedCharacter) {
            return "";
        }else if($scope.selectedCharacter.location){
            return "";
        } else if (!$scope.selectedCharacter.location){
            return "twinkle";
        }
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

    /**
    *   Function for dynamic client side CSS only
    */
    $scope.viewRegionSlide = function (){
        if ($scope.viewRegionSlideStatus === 'off'){
            return "";
        } else if ($scope.viewRegionSlideStatus === 'right'){
            return "fadeRight";
        } else if ($scope.viewRegionSlideStatus === 'left') {
            return "fadeLeft";
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
