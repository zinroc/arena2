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

    /** Enounters **/
    $scope.elders = [];
    $scope.currentEncounter = false;
    $scope.minor_factions = [];
    $scope.minor_faction_objects = {};
    $scope.encounterProposal = false;

    /** CSS animation parameters **/ 
    $scope.viewRegionSlideStatus = "off";
    $scope.characterSelectLock = "off";
    $scope.loadingElders = false;

    /** Are you sure Toggles **/
    $scope.toggleTravelInfo = false;
    //$scope.toggleElders = false;

    /** ------------- Redirect START ------------- **/
    /*
    *   Redirect to encounter.html
    */
    $scope.redirectToEncounter = function (){
        console.log("redirect To Encounter");
            //var profile = googleUser.getBasicProfile();
            //var data = { name: profile.getName(), email: profile.getEmail() };
            // create a cookie
            //document.cookie="name=" + data.name;
            //document.cookie="email=" + data.email;
            // redirect to main game
            window.location.href = "/encounter";

    };

    $scope.deleteCookies = function (){
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    $scope.logout = function (){
        $scope.deleteCookies();

        window.location.href= "https://accounts.google.com/logout";
    };

    $scope.enterEncounter = function (){
        console.log("entering encounter...", $scope.email, $scope.selectedCharacter.id);
    };

    /** ------------- Redirect End ------------- **/

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
            //don't start a new family if one exists
            if ($scope.characters.length){
                $scope.newCharFamilyName = $scope.characters[0].family_name;
            }
            //select the first character if none selected
            if ($scope.characters.length && !$scope.selectedCharacter){
                $scope.selectedCharacter = $scope.characters[0];
                if (!$scope.selectedProvince){
                    $scope.selectProvince($scope.selectedCharacter.location);
                }

            } else if (!$scope.selectedProvince) {//go to the 0th province if none selected and there are no characters
                $scope.selectProvince(null);
            }
            //reselect the selected character incase any property of theirs changed. 
            if ($scope.characters.length && $scope.selectedCharacter){
                var character = $scope.findCharacterById($scope.selectedCharacter.id); 
                $scope.selectCharacter(character);
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
        $scope.loadMinorFactions();
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

    /**
    * Load minor faction static info
    */
    $scope.loadMinorFactions = function () {
        $scope.minor_factions = utils.getMinorFactions();
        for (var i=0; i<$scope.minor_factions.length; i++){
            $scope.minor_faction_objects[$scope.minor_factions[i].name] = $scope.minor_factions[i];
        }
    };

    /*** ---------- Loading END ------------ ***/

    /*** ----------- Game State ------------ ***/

    $scope.hideModals = function (){
        $('#settings-modal').modal('hide');
        $('#createCharacter-modal').modal('hide');
        $('#deleteCharacter-modal').modal('hide');
        $('#spawnCharacter-modal').modal('hide');
        $('#nearbyRegion-modal').modal('hide');
        $('#distantRegion-modal').modal('hide');
        $('#travelInfo-modal').modal('hide');
        $('#travel-modal').modal('hide');
        $('#travelLock-modal').modal('hide');
        $('#currentLocation-modal').modal('hide');
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

    $scope.dropTables = function (){
        api_service.dropTables($scope.email)
        .then(function (response){
            console.log("Tables Dropped");
            console.log(response.data);

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
        console.log("deleting character...");
        api_service.deleteCharacter($scope.email, $scope.selectedCharacter.id)
        .then(function (response){
            console.log("character deleted");
            console.log(response.data);
            $scope.selectedCharacter = null;
            $scope.loadCharacterInfo();
            $scope.hideModals();
        });
    };

    /**** ------------ Char Creation/Destruction END-------------- ***/
    /**** ------------ Encounter START   ------- ***/

    /**
    *   For class HTML around elder who is mayor.
    */
    $scope.isMayor = function (mayor) {
        if (mayor){
            return 'mayor';
        } else {
            return '';
        }
    };

    /**
    *   Create an encounter for the selected Character
    */

    $scope.loadEncounterInfo = function () {
        api_service.loadEncounterInfo($scope.email, $scope.currentEncounter)
        .then(function (response){
            console.log("encounter loaded");
            console.log(response.data);
            $scope.encounterInfo = response.data;
        });
    }; 

    $scope.generateEncounter = function (elder_id){
        api_service.generateEncounter($scope.email, $scope.selectedCharacter.id, elder_id, $scope.selectedRegion)
        .then(function (response){
            console.log("encounter created");
            console.log(response.data);
            $scope.loadCharacterInfo();
            $scope.currentEncounter = $scope.selectedCharacter.encounter;
            if ($scope.currentEncounter){
                $scope.loadEncounterInfo();
            }
            // TODO toggle encounter lock upon encounter creation
        });
    };
    /**
    *   @params interaction STRING - type of interaction with elders.
    */
    $scope.showElders = function (interaction) {
        $scope.loadingElders = true;
        $scope.toggleElders = true;
        $scope.interaction_type = interaction;
        
        console.log($scope.email, $scope.selectedRegion);
        api_service.loadElders($scope.email, $scope.selectedRegion)
        .then(function (response){
            console.log("elders loaded");
            console.log(response.data);
            $scope.elders = response.data;
            $scope.loadingElders = false; 
        })

        
    };

    /**
    *   Select the object that has information about the proposed encounter. 
    */
    $scope.proposeEncounter = function (elder){
        $scope.proposedEncounter = elder;
    };


    /**** ------------ Encounter END ---------***/
    /**** ------------ Char Manipulation START ------- ***/


    /**
    *   Locks a character into a traveling state going West to the destination
    */
    $scope.travel = function (direction){

        api_service.travel($scope.email, $scope.selectedCharacter.id, $scope.selectedRegion, direction)
        .then(function (response){
            console.log("character traveling");
            console.log(response.data);
            $scope.loadCharacterInfo()
            $scope.hideModals();
        });
    };

    /**
    *   @params id INT
    *   @return character OBJECT
    */  
    $scope.findCharacterById = function (id){
        for (var i=0; i<$scope.characters.length; i++){
            var character = $scope.characters[i];
            if (character.id === id){
                return character;
            }
        }
    };

    /**
    *   INPUT character OBJECT row from characters table
    */
    $scope.selectCharacter = function (character){

        //do not select character if animations are playing
        if ($scope.viewRegionSlideStatus === 'off' && $scope.characterSelectLock === 'off'){
            $scope.selectedCharacter = character;
            $scope.newCharFamilyName = character.family_name;

            // snap to character's location
            if (provinceList.provinceGivenLocation($scope.selectedCharacter.location).name !== 
                       provinceList.provinceGivenLocation($scope.selectedRegion).name
                       && $scope.selectedCharacter.location){
                console.log("inside");
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
    *   Title for the travelInfo-modal
    */
    $scope.travelInfoTitle = function (){
        if (!$scope.selectedCharacter){
            return "";
        } else if (!$scope.selectedCharacter.location){
            return "";
        } else if ($scope.selectedRegion === $scope.selectedCharacter.location){
            return "Leaving " + $scope.selectedCharacter.location.toTitleCase();
        } else if ($scope.selectedRegion === $scope.selectedCharacter.destination){
            return "Destination: " + $scope.selectedCharacter.destination.toTitleCase();
        } else {
            return "";
        }
    };

    $scope.viewLeftSlot = function (location){
        if (!$scope.selectedCharacter){
            return false;

        } else if ($scope.selectedCharacter.direction==='west' && location === $scope.selectedCharacter.location){
            return true;
        } else if ($scope.selectedCharacter.direction ==='east' && location === $scope.selectedCharacter.destination) {
            return true;
        } else {
            return false;
        }
    };

    $scope.viewRightSlot = function (location){
        if (!$scope.selectedCharacter){
            return false;

        } else if ($scope.selectedCharacter.direction==='east' && location === $scope.selectedCharacter.location){
            return true;
        } else if ($scope.selectedCharacter.direction ==='west' && location === $scope.selectedCharacter.destination) {
            return true;
        } else {
            return false;
        }
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
        } else if ($scope.selectedCharacter.location === location && !$scope.selectedCharacter.destination){
            return "youAreHere";
        } else {
            return "";
        }
    };

    /**
    *
    */
    $scope.viewCharacterTraveling = function (location){
        if(!$scope.selectedCharacter){
            return "";
        } else if ($scope.selectedCharacter.location === location && $scope.selectedCharacter.destination){
            return "fa fa-blind fa-3x glow";
        } else if ($scope.selectedCharacter.destination === location){
            return "fa fa-bullseye fa-3x glow";
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

    /**** ------------ Map Manipulation START   ------- ***/
    /**
    *   Calculate the minimum time it would take the selected character to travel from
    *   their location to the selected region if traveling East
    */
    $scope.calculateEast = function (){
        if (!$scope.selectedCharacter){
            return false;
        }

        if (!$scope.selectedCharacter.location){
            return false;
        }

        var province_distance = 4; 
        var destination_indexes = provinceList.getIndexesFromLocation($scope.selectedRegion);
        var location_indexes = provinceList.getIndexesFromLocation($scope.selectedCharacter.location);

        var provinceVector = destination_indexes.province_index - location_indexes.province_index; 
        var regionVector = destination_indexes.region_index - location_indexes.region_index;

        var maxTraveLength = 3*5 + 4*4; //distance within regions + distance between regions

        var travelLength = 1;//minimum 
        if (provinceVector > 0){ // destination east of location
            travelLength += provinceVector*province_distance; //gaps between provinces
            travelLength += (provinceVector-1)*3; //distance within provinces
            travelLength += 3 - location_indexes.region_index; //distance within starting province
            travelLength += destination_indexes.region_index; //distance within ending province
            return travelLength;
        } else if (provinceVector < 0){ // destination west of location
            travelLength += (5+provinceVector)*province_distance; // gaps between provinces
            travelLength += (5+provinceVector - 1)*3; //distance within provinces
            travelLength += 3 - location_indexes.region_index; //distance within starting province
            travelLength += destination_indexes.region_index; //distance within ending province
            return travelLength;
        } else if (provinceVector === 0 && regionVector > 0){ // destination east of location
            travelLength += regionVector; //destination within region
            return travelLength;
        } else if (provinceVector === 0 && regionVector < 0){ // destination west of location
            travelLength += maxTraveLength + regionVector; //taking the long route...
            return travelLength;
        } else {
            return 0;
        }
    };

    /**
    *   Calculate the minimum time it would take the selected character to travel from
    *   their location to the selected region if traveling West
    */
    $scope.calculateWest = function (){
        var maxTraveLength = 3*5 + 4*4; //distance within regions + distance between regions
        var eastTravel = $scope.calculateEast(); 
        var travelLength = 1;
        travelLength += maxTraveLength - eastTravel + 1;

        return travelLength;
    };

    /**
    *   Toggles travel info in trave modal
    */
    $scope.promptTravel = function (){
        $scope.toggleTravelInfo = true;
    };

    /**
    * Select a location based on the location_name STRING
    */
    $scope.selectLocation = function (location_name){
        $scope.selectedRegion = location_name;
        $scope.toggleTravelInfo = false;
        $scope.toggleElders = false;
        $scope.proposedEncounter = null;
        $scope.interaction_type = null;
    };

    /**
    *   Create appropriate modal when player clicks on a location
    */
    $scope.locationModalTrigger = function (){
        if(!$scope.selectedCharacter){
            return "";
        }  else if (!$scope.selectedCharacter.location){
            return "#spawnCharacter-modal";
        } else if ($scope.selectedCharacter.location === $scope.selectedRegion && $scope.selectedCharacter.encounter) {
            //player wants to experience an encounter at their current location
            return "#encounter-modal";
        } else if ($scope.selectedCharacter.location === $scope.selectedRegion){
            //player wants to interact with their current location
            return "#currentLocation-modal";
        } else if ($scope.selectedCharacter.destination) {
            //player wants to interact with a locatio while traveling
            return "#travelLock-modal";
        } else if ($scope.selectedCharacter.encounter) {
            //player trying to interact with a location while in an encounter
            return "#encounterLock-modal";
        } else {
            //player wants to interact with a distance location
            return "#travel-modal";
        }
    };

    /**
    *   Select the province OBJECT given a location STRING
    */

    $scope.selectProvince = function(location){
        if (!location){
            $scope.selectedProvince = provinceList.provinceGivenLocation(null); 
            $scope.selectedRegion = $scope.selectedProvince.capital;
        } else {
            $scope.selectedProvince = provinceList.provinceGivenLocation(location);
            $scope.selectedRegion = location; 
        }
    };

    $scope.cycleProvinceLeft = function (){
        //console.log($scope.selectedProvince.index);
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleLeft($scope.selectedProvince.index);
        $scope.selectedRegion = $scope.selectedProvince.capital;

        /** Sliding animations **/ 
        $scope.viewRegionSlideStatus = 'left';
        $scope.characterSelectLock = 'on';
        setTimeout(function (){
                if ($scope.viewRegionSlideStatus === 'left'){
                    $scope.viewRegionSlideStatus = 'off'; 

                }
            }, 400);
        setTimeout(function (){
                $scope.characterSelectLock = 'off';
            }, 1200);
    };

    $scope.cycleProvinceRight = function (){
        $scope.selectedRegion = null; 
        $scope.selectedProvince = provinceList.cycleRight($scope.selectedProvince.index);
        $scope.selectedRegion = $scope.selectedProvince.capital;
        /** Sliding animations **/ 
        $scope.viewRegionSlideStatus = 'right';
        $scope.characterSelectLock = 'on';
        setTimeout(function (){
                if ($scope.viewRegionSlideStatus === 'right'){
                    $scope.viewRegionSlideStatus = 'off'; 

                }
            }, 400);
        setTimeout(function (){
                $scope.characterSelectLock = 'off';
            }, 1200);
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
