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
    createPlayerCharacter: function(email, name, family_name, response){
        characterStore.createPlayerCharacter(email, name, family_name)
        .then(function (rows){
            response.json(rows).end();
        });
    },
    //called from client
    deletePlayerCharacter: function(email, id, response){
        characterStore.deletePlayerCharacter(email, id)
        .then(function (result){
            response.json(result).end();
        });
    },
    //called from client
    spawnPlayerCharacter: function(email, id, location, response){
        characterStore.spawnPlayerCharacter(email, id, location)
        .then(function (result){
            response.json(result).end();
        });
    }, 
    //called from client
    travel: function(email, id, destination, direction, response){
        characterStore.travel(email, id, destination, direction)
        .then(function (result){
            response.json(result).end();
        });
    }, 
    //called from client
    encounter: function(email, id, response){
        characterStore.generateEncounter(email, id)
        .then(function (result){
            response.json(result).end();
        });
    },
};