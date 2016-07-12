"use strict";

var Promise = Promise || require ("bluebird");


var credentials = require("./credentials.js"),
    players = {};

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var playerStore = require("./my_node_modules/playerStore.js")(knex);


module.exports = players = {
    /**
     * return player Info
     * ELSE return false
     */
    get: function (email, name, response) {
        playerStore.create(email, name)
        .then(function (id) {
            return playerStore.get(id);
        }).then (function (result){
            response.json(result).end();
        });
    },
};