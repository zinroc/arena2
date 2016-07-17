"use strict";

var utils = {};

var nameList = require("./public/js/nameList.js");
var provinceList = require("./public/js/provinceList.js");
var poker = require("./poker.js");

module.exports = utils = {

    getRandomSeed: function (){
        var maxInt = Math.pow(2, 31) - 1;
        var seed = Math.round(Math.random() * maxInt);
        return seed;
    },  

    newName: function () {
    
        var index_1 = Math.floor(Math.random()*4);
        var index_2 = Math.floor(Math.random()*125);
        return nameList.getName(index_1, index_2);
    },
    /**
    * Get provinces in format of DB insertion 
    */
   	provinces: function () {
   		return provinceList.regions();
   	}, 
    /**
    *   Generate Elders in format of DB insertion
    */
    elders: function () {
        var regions = provinceList.regions();
        var elders = [];
        for (var i=0; i<regions.length; i++){//make 3 elders per region.
            var region = regions[i];
            var names = [];
            var elder = [];
            for (var j=0; j<3; j++){

                names[j] = this.uniqueNewName(names);
                elder[j] = {};
                elder[j].name = names[j];
                elder[j].region = region.name;
                elders.push(elder[j]);
            }
        }
        return elders;
    },
    /**
    *   ARRAY of STRINGS names - names that the new name cannot be the same as.
    */
    uniqueNewName: function (names){
        var name = this.newName(); 
        for (var i=0; i<names.length; i++){
            if (name === names[i]){
                name = this.uniqueNewName(names);
            } 
        }
        return name;
    },
    getNineCards: function (){

        return poker.getNineCards();
    }

};