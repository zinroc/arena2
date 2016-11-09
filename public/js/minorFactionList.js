
var numMinorFactions = 4;

var minorFactions = Array([numMinorFactions]);

minorFactions[0] = {name:'golems'}; // dwarves
minorFactions[1] = {name: 'spores'}; //orcs
minorFactions[2] = {name: 'leeches'}; // necrophages
minorFactions[3] = {name: 'shades'}; // forgotten

/**
 * Use these function to navigate static name data inside client-side code
 */

var minorFactionList = {

    getMinorFaction: function (index){
        return minorFactions[index];
    },
}

/**
 * Use these function to navigate static name data inside server-side code
 */

module.exports = nameList = {
	getMinorFaction: function (index){
        return minorFactions[index];
	},
};