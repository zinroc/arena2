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
        return this.getJSON("/api/characters/get", {email, email});
    };

    this.createCharacters = function (email){
        return this.postJSON("/api/characters/create", {email, email});
    };

    return this;
});
