"use strict";
module.exports = function (knex) {
    return {
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
                    });
                }
            });
        }
    };
};