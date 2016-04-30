"use strict";

var utils = {};

var nameList = require("./nameList.js");

module.exports = utils = {


    newName: function () {
    
        var index_1 = Math.floor(Math.random()*4);
        var index_2 = Math.floor(Math.random()*125);
        return nameList.getName(index_1, index_2);
    },
    

};