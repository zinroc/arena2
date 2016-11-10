
var numMinorFactions = 4;

var minorFactions = Array([numMinorFactions]);

minorFactions[0] = {name:'golems', icon: 'fa-diamond'}; // dwarves
minorFactions[1] = {name: 'spores', icon: 'fa-leaf'}; //orcs
minorFactions[2] = {name: 'jackals', icon: 'fa-paw'}; // necrophages
minorFactions[3] = {name: 'shades', icon: 'fa-moon-o'}; // forgotten

/**
 * Use these function to navigate static name data inside client-side code
 */

var minorFactionList = {

    getMinorFaction: function (index){
        return minorFactions[index];
    },
    getAllMinorFactions: function (){
    	return minorFactions;
    },
}

/**
 * Use these function to navigate static name data inside server-side code
 */

module.exports = nameList = {
	getMinorFaction: function (index){
        return minorFactions[index];
	},
	getAllMinorFactions: function (){
		return minorFactions;
	},
};