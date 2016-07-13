

var provinces = [	{	name: 'hell rift artic', 
				  		capital: 'glass mountain', 
				  		resource: 'obsidian',
				  		regions: [
				  			'winter wind fields', 'frost blossom cliff', 'ice breath vale'
				  		], 
				  		x_cord: 5,
				  		y_cord: 0
					},
					{
						name: 'tundra of gems', 
						capital: 'diamond basin',
						resource: 'gemstones',
						regions: [
							'twilight shard', 'jade pasture', 'quartz nether spikes'
						],
						x_cord: 5,
						y_cord: 5
					}, 
					{
						name: 'rust mesa desert',
						capital: 'sands of salt',
						resource: 'copper',
						regions: [
							'metal ink lair', 'crossroads', 'steel grove'
						],
						x_cord: 5,
						y_cord: 10
					},
					{
						name: 'ivy beach',
						capital: 'swordfish coast',
						resource: 'pearls',
						regions: [
							'port of echoes', 'shadow island', 'lagoon of storms'
						],
						x_cord: 10, 
						y_cord: 5
					},
					{
						name: 'thorn jungle',
						capital: 'soft silk brush',
						resource: 'silk',
						regions: [
							'gods flesh gardens', 'smoke woods', 'silver marsh'
						],
						x_cord: 0, 
						y_cord: 5
					}
				];





/**
 * Use these function to navigate static province data inside client-side code
 */

var provinceList = {

    /**
    *   VAR location STRING
    *   RETURN province object from client side provinces.js
    */
    provinceGivenLocation: function(location){
    	if (!location){
    		var province = provinces[0]; 
    		province.index = 0;
    		return province;
    	} else {

	        for (var i=0; i<provinces.length; i++){
	            var province = provinces[i];
	            if(province.capital=== location){
	            	province.index = i;
	                return province;
	            } else {
	                for (var j=0; j<province.regions.length; j++){
	                    var region = province.regions[j];
	                    if (location === region){
	                    	province.index = i;
	                        return province; 
	                    }
	                }
	            }
	        }
    	}
    },
    /**
    * Pick the next province 
    */
    cycleRight: function(index){
    	var newIndex = index+1; 
    	if(newIndex > provinces.length || newIndex === provinces.length){
    		newIndex = 0; 
    	}
    	var province = provinces[newIndex];
    	province.index = newIndex;
    	return province; 
    },
    /**
    * Pick the previous province 
    */
    cycleLeft: function(index){
    	var newIndex = index-1; 
    	if(newIndex < 0){
    		newIndex = provinces.length-1; 
    	}
    	var province = provinces[newIndex];
    	province.index = newIndex;
    	return province; 
    }

};


/**
 * Use these function to navigate static name data inside server-side code
 */

module.exports = provinceList = {

    /**
    * Return all the regions for server regions table population
    */
    regions: function () {
    	var regions = [];
    	for (var i=0; i<provinces.length; i++){
    		for (var j=0; j<4; j++){
    			var index = i*4 + j; 
    			regions[index] = {};
    			if (j==3){
	    			regions[index].name = provinces[i].capital;
	    			regions[index].province = provinces[i].name;
	    			regions[index].x_cord = provinces[i].x_cord;
	    			regions[index].y_cord = provinces[i].y_cord;
	    			regions[index].capital = true;
	    			regions[index].index = 3;
    			} else {
	    			regions[index].name = provinces[i].regions[j];
	    			regions[index].province = provinces[i].name;
	    			regions[index].x_cord = provinces[i].x_cord;
	    			regions[index].y_cord = provinces[i].y_cord;
	    			regions[index].capital = false;
	    			regions[index].index = j;
    			}
    		}
    	}
    	return regions;
    },
};
