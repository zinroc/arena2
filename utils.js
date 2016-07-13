"use strict";

var utils = {};

var nameList = require("./public/js/nameList.js");
var provinceList = require("./public/js/provinceList.js");

module.exports = utils = {


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
   	}

};