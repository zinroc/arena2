var app = angular.module("ArenaApp");


app.directive('bsTooltip', function (){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){


                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
}).controller("EncounterCtrl", function encounterCtrl ($scope, api_service, $timeout, $sce) {
    "use strict";
    /** URL PARAMS **/
    $scope.email = utils.getCookie("email");
    $scope.name = utils.getCookie("name");
    $scope.char_id = utils.getURLParams().char_id;
    $scope.encounter_id = utils.getURLParams().encounter_id;

    /** Loading List **/
    $scope.loadedItemsObj = {};
    $scope.loadedItemsArr = ['game', 'cards'];


    console.log($scope.email, $scope.name);
    console.log(utils.getURLParams());

    /** Mock values START**/
    $scope.playerCards = [{suit: 's' , suit_symbol: '<font color="black">&spades;</font>', value: 'Q'}, {suit: 'd', suit_symbol: '<font color="red">&diams;</font>', value: "Q"}];
    $scope.tableCards =[{suit: 'c', suit_symbol: '<font color="black">&clubs;</font>', value: '10'}, {suit: 'h', suit_symbol: '<font color="red">&hearts;</font>', value: 'A'}, 
                        {suit: 'h', suit_symbol: '<font color="red">&hearts;</font>', value: '2'}, {suit: 'd', suit_symbol: '<font color="red">&diams;</font>', value: '2'}, 
                        {suit: 'c', suit_symbol: '<font color="black">&clubs;</font>', value: '9'}];
    $scope.opponentCards = [{suit: 's' , suit_symbol: '<font color="black">&spades;</font>', value: 'K'}, {suit: 'd', suit_symbol: '<font color="red">&diams;</font>', value: "4"}];
    /** Mock values END ***/

    /** Loading START ***/
    $scope.loadGameState = function () {
        api_service.getGameState($scope.email)
        .then(function (response) {
            console.log("Got game state:");
            console.log(response.data);
            $scope.timestep = response.data.timestep;
            $scope.loadedItemsObj['game'] = true;

        });
    };

    $scope.loading = function (){
        for (var i=0; i<$scope.loadedItemsArr.length; i++){
            var index = $scope.loadedItemsArr[i];
            $scope.loadedItemsObj[index] = false;
        }
    };

    $scope.loadCards = function(){
        for(var i=0; i<$scope.playerCards.length; i++){
            $scope.playerCards[i].suit_symbol = $sce.trustAsHtml($scope.playerCards[i].suit_symbol);
        }

        for(var i=0; i<$scope.tableCards.length; i++){
            $scope.tableCards[i].suit_symbol = $sce.trustAsHtml($scope.tableCards[i].suit_symbol);
        }

        for(var i=0; i<$scope.opponentCards.length; i++){
            $scope.opponentCards[i].suit_symbol = $sce.trustAsHtml($scope.opponentCards[i].suit_symbol);
        }

        $scope.loadedItemsObj['cards'] = true;
    };
    /** Loading END ***/

    /** Poker Math  START **/

    $scope.getHand = function (twoCards, fiveCards){
        var totalHand = [];
        for (var i=0; i<twoCards.length; i++){
            totalHand[i] = "";
            totalHand[i] = twoCards[i].value + twoCards[i].suit;
        }

        for (i = 2; i<(fiveCards.length+2); i++){
            totalHand[i] = "";
            totalHand[i] = fiveCards[i-2].value + fiveCards[i-2].suit;
        }

        return totalHand;
    };

    $scope.evaluateWinningHand = function(){
        
        var playerHand = $scope.getHand($scope.playerCards, $scope.tableCards);
        var opponentHand = $scope.getHand($scope.opponentCards, $scope.tableCards);

        console.log(playerHand, opponentHand);

        var hand1 = Hand.solve(playerHand);
        var hand2 = Hand.solve(opponentHand);
        var winner = Hand.winners([hand1, hand2]);

        var winningFirstCard = winner[0].cards[0].value + winner[0].cards[0].suit;
        console.log(winner, winner[0].descr, winningFirstCard, winner.length);

        if (winner.length > 1) {
            console.log('tie');
        } else if(winningFirstCard === playerHand[0]){
            console.log('player wins');
        } else if (winningFirstCard === opponentHand[0]){
            console.log("opponent wins");
        } else {
            console.log('error');
        }
        
        /** Example Code START **/
        // solveing 2 hands
        //var hand1 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', '3c', 'Kd']);
        //var hand2 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
        //var winner = Hand.winners([hand1, hand2]); // hand2

        //solveing 1 hand
        //var hand = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
        //console.log(hand.name); // Two Pair
        //console.log(hand.descr); // Two Pair, A's & Q's
        /** Example Code END **/
    };
    /** Poker Math END **/

    /** UI START**/

    $scope.spinDice = "fa-spin";
    $scope.diceValue = null;

    $scope.stopDice = function (){
        console.log("stop dice");
        //pick a value 1-20 for the dice.
        if (!$scope.diceValue) {
            $scope.diceValue = Math.ceil(Math.random()*20);
            console.log($scope.diceValue);
            $scope.spinDice = "";
        } else {
            $scope.diceValue = null;
            $scope.spinDice = "fa-spin";
        }

        $scope.evaluateWinningHand();

    };

    /** UI END **/


    /** RUN ***/
    $scope.loading();
    $scope.loadCards();
    $scope.loadGameState();

});
