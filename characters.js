"use strict";

var Promise = Promise || require ("bluebird");


var credentials = require("./credentials.js"),
    //names = require("./public/names/names.js"),
    characters = {};

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var characterStore = require("./my_node_modules/characterStore.js")(knex),
    playerStore = require("./my_node_modules/playerStore.js")(knex);


var utils = require("./utils.js");

var popCap = 1000;

module.exports = characters = {
    //not called atm
    get: function (email, response) {
        characterStore.get()
        .then(function (rows) {
            response.json(rows).end();
        });
    },
    //called from client
    getPlayerCharacters: function(email, response){
        characterStore.getPlayerCharacters(email)
        .then(function (rows) {
            response.json(rows).end();
        });
    },
    //called from client
    createPlayerCharacter: function(email, name, response){
        characterStore.createPlayerCharacter(email, name)
        .then(function (rows){
            response.json(rows).end();
        });
    }
};