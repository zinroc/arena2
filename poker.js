var cards = ['2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'Jc', 'Qc', 'Kc', 'Ac', 
             '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'Jd', 'Qd', 'Kd', 'Ad',
             '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'Js', 'Qs', 'Ks', 'As', 
             '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'Jh', 'Qh', 'Kh', 'Ah']; 

/**
 * Use these function to generate entries for poker encounters in DB 
 */

module.exports = poker = {

    /**
    * Return all the regions for server regions table population
    */
    getNineCards: function () {
        var remainingCards = cards;
        var pickedCards = [];
        var index = null
        for (var i=0; i<9; i++){
            index = Math.floor(Math.random() * remainingCards.length);
            pickedCards.push(remainingCards[index]);
            remainingCards.splice(index, 1);

        }
    	return pickedCards;
    },

};
