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


var names = 'Abenigebritta,Demanni,Karraisrend,Remmethergiulf';

module.exports = characters = {

};