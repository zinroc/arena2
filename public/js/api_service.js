var app = angular.module("ArenaApp");

app.factory("arenaService", function arenaService ($http) {

    this.getJSON = function (url, data) {
        data = data || {};
        return $http.get(url, { params: data });
    };
    this.postJSON = function (url, data) {
        data = data || {};
        return $http.post(url, data);
    };

    return this;
});
