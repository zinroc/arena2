"use strict";

var Promise = Promise || require ("bluebird");


var credentials = require("./credentials.js"),
    gameState = {};

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var gameStateStore = require("./my_node_modules/gameStateStore.js")(knex),
    advance_timestep = require("./my_node_modules/advance_timestep")(knex);


module.exports = gameState = {
    /**
     * return gameState Info
     */
    get: function (email, response) {
        gameStateStore.get()
        .then (function (result){
            response.json(result).end();
        });
    },
    /**
    * TODO - limit to admins
    */
    advanceTimestep: function (email, response){
        gameStateStore.get()
        .then (function (gs){
            advance_timestep.internalAdvanceTimestep(gs)
        }).then(function (result){
            response.json(result).end();
        });
    }
};