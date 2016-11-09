"use strict";

var Promise = Promise || require("bluebird"),
    credentials = require("./credentials.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var schema = require("./test/schema.js")(knex);

module.exports = {
    createTables: function () {
        console.log("Creating tables...");
            // static tables (those which house data not modified by player) first
        return schema.createGameStateTable()
            .then(schema.createGameState)
            .then(schema.createPlayerTable)
            .then(schema.createRegionsTable)
            .then(schema.createRegions)
            .then(schema.createMinorFactionsTable)
            .then(schema.createMinorFactions)
            .then(schema.createEldersTable)
            .then(schema.createElders)
            .then(schema.createEncountersTable)
            .then(schema.createCharactersTable)
            .then(schema.createEncounterCharactersTable)
            .then(schema.createEncounterEldersTable)
        .error(function (e) {
            console.error("There was an error creating some tables");
            console.error(e);
        });
    }
};
