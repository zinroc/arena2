

var provinces = [	{	name: 'hell rift artic', 
				  		capital: 'glass mountain', 
				  		resource: 'obsidian',
				  		regions: [
				  			'winter wind fields', 'frost blossom cliff', 'ice breath vale'
				  		]
					},
					{
						name: 'tundra of gems', 
						capital: 'diamond basin',
						resource: 'gemstones',
						regions: [
							'twilight shard', 'jade pasture', 'quartz nether spikes'
						]
					}, 
					{
						name: 'rust mesa desert',
						capital: 'sands of salt',
						resource: 'copper',
						regions: [
							'metal ink lair', 'crossroads', 'steel grove'
						]
					},
					{
						name: 'ivy beach',
						capital: 'swordfish coast',
						resource: 'pearls',
						regions: [
							'port of echoes', 'shadow island', 'lagoon of storms'
						]
					},
					{
						name: 'thorn jungle',
						capital: 'soft silk brush',
						resource: 'silk',
						regions: [
							'gods flesh gardens', 'smoke woods', 'silver marsh'
						]
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
	                    var region = regions[j];
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
    },

}