"use strict";
var utils = require("../utils.js");

module.exports = function (knex) {
    return {
        createEncounterEldersTable: function (){
            return knex.schema.hasTable("encounter_elders")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("encounter_elders", function (table){
                        table.increments("id");
                        table.integer("encounter").references("id").inTable("encounters");
                        table.integer("elder").references("id").inTable("elders");
                        table.string("card_1");
                        table.string("card_2");
                    });
                }
            });
        },
        createGameStateTable: function () {
            return knex.schema.hasTable("game_state")
            .then(function(exists) {
                if (!exists) {
                    return knex.schema.createTable("game_state", function (table) {
                        table.increments("id");
                        table.integer("timestep").notNullable();
                        // in minutes
                        table.integer("timestep_interval").notNullable();
                    });
                }
            });
        },
        /**
         * Insert a game state into the table, if none exists
         */
        createGameState: function  () {
            return knex("game_state").select("*")
            .then(function (rows) {
                if (rows.length === 0) {
                    return knex("game_state").insert({
                        "id": 1,
                        "timestep": 1,
                        "timestep_interval": 1,
                    });
                }
            });
        },
        /**
        * Create a table for recording player information
        */
        createPlayerTable: function () {
            return knex.schema.hasTable("players")
            .then(function(exists){
                if (!exists){
                    return knex.schema.createTable("players", function (table){
                        table.increments("id");
                        table.string("name");
                        table.string("email").unique();
                        table.boolean("admin");
                        table.integer("character_cap");
                    });
                }
            });
        }, 
        /**
        *   Create a characters table
        */
        createCharactersTable: function (){
            return knex.schema.hasTable("characters")
            .then(function(exists){
                if (!exists){
                    return knex.schema.createTable("characters", function (table){
                        table.increments("id");
                        table.string("name");
                        table.string("location");
                        table.string("owner");
                        table.string("family_name");
                        table.string("destination"); 
                        table.integer("travel_progress");
                        table.string("direction");
                        table.string("travel_success");
                        table.integer("encounter").references("id").inTable("encounters");
                    });
                }
            });
        }, 
        /**
        * Create Minor Factions table
        */
        createMinorFactionsTable: function (){
            return knex.schema.hasTable("minor_factions")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("minor_factions", function (table) {
                        table.increments("id");
                        table.string("name");  
                        table.string("icon");
                    });
                }
            });
        },
        createMinorFactions: function () {
            var minor_factions = utils.minor_factions();
            return knex("minor_factions").select("*")
            .then(function (rows){
                if (rows.length === 0){
                    return knex("minor_factions").insert(minor_factions);
                }
            });
        },
        /**
        * Create an elders table
        */
        createEldersTable: function (){
            return knex.schema.hasTable("elders")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("elders", function (table){
                        table.increments("id");
                        table.string("name");
                        table.string("region");
                        table.string("minor_faction");
                    });
                }
            });
        },
        /**
        * Populate the elders table
        */
        createElders: function (){
            var elders = utils.elders();
            return knex("elders").select("*")
            .then(function (rows){
                if (rows.length === 0){
                    return knex("elders").insert(elders);
                }
            });
        },
        /**
        *   Create a regions table 
        */
        createRegionsTable: function (){
            return knex.schema.hasTable("regions")
            .then(function(exists){
                if (!exists){
                    return knex.schema.createTable("regions", function (table){
                        table.increments("id");
                        table.string("name").unique();
                        table.string("province");
                        table.boolean("capital"); 
                        table.integer("index");
                    });
                }
            });
        },
        /**
        *   Populate the regions table
        */
        createRegions: function  () {
            var regions = utils.provinces();
            return knex("regions").select("*")
            .then(function (rows) {
                if (rows.length === 0) {
                    return knex("regions").insert(regions);
                }
            });
        },
        /**
        *   Poker encounters
        */
        createEncountersTable: function (){
            return knex.schema.hasTable("encounters")
            .then(function (exists){
                if(!exists){
                    return knex.schema.createTable("encounters", function (table){
                        table.increments("id");
                        table.string("card_1");
                        table.string("card_2");
                        table.string("card_3");
                        table.string("card_4");
                        table.string("card_5");
                        table.integer("elder_id").references("id").inTable("elders");
                    });
                }
            });
        },
        /**
        *  Characters involved in poker encounters
        */
        createEncounterCharactersTable: function (){
            return knex.schema.hasTable("encounter_characters")
            .then(function (exists){
                if (!exists){
                    return knex.schema.createTable("encounter_characters", function (table){
                        table.increments("id");
                        table.integer("encounter").references("id").inTable("encounters");
                        table.integer("character").references("id").inTable("characters");
                        table.string("card_1");
                        table.string("card_2"); 
                    });
                }
            });
        },
    };
};