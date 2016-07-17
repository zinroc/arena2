var app = angular.module("ArenaApp");

app.factory("api_service", function api_service ($http) {

    this.getJSON = function (url, data) {
        data = data || {};
        return $http.get(url, { params: data });
    };
    this.postJSON = function (url, data) {
        data = data || {};
        return $http.post(url, data);
    };

    this.getPlayer = function (email, name) {
        return this.postJSON("/api/players/get", { email: email, name: name });
    };

    this.getGameState = function (email) {
    	return this.getJSON("/api/gameState/get", {email: email});
    };

    this.getCharacters = function (email){
        return this.getJSON("/api/characters/get", {email: email});
    };


    this.getPlayerCharacters = function(email){
        return this.getJSON("/api/characters/getPlayerCharacters", {email: email});
    };

    this.advanceTimestep = function (email){
        return this.postJSON("/api/gameState/advanceTimestep", {email: email});
    };

    this.createCharacter = function (email, name, family_name){
        return this.postJSON("/api/characters/createPlayerCharacter", {email: email, name: name, family_name: family_name});
    };

    this.deleteCharacter = function (email, id){
        return this.postJSON("/api/characters/deletePlayerCharacter", {email: email, id: id});
    };

    this.spawnCharacter = function (email, id, location){
        return this.postJSON("/api/characters/spawnPlayerCharacter", {email: email, id: id, location: location});
    };
  
    this.travel = function (email, id, destination, direction){
        return this.postJSON("/api/characters/travel", {email: email, id: id, destination: destination, direction});
    };

    this.generateEncounter = function(email, char_id, elder_id){
        return this.postJSON("/api/characters/encounter", {email: email, id: char_id, elder: elder_id});
    };

    this.dropTables = function(email){
        return this.postJSON("/api/gameState/dropTables", {email: email});
    };

    this.loadElders = function(email, region){
        return this.getJSON("/api/characters/elders", {email: email, region: region});
    };



    return this;
});
