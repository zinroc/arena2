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
    $scope.email = utils.getCookie("email");
    $scope.name = utils.getCookie("name");

    console.log($scope.email, $scope.name);


    $scope.playerCards = [{suit: 's' , suit_symbol: '<font color="black">&spades;</font>', value: '4'}, {s: 'd', suit_symbol: '<font color="red">&diams;</font>', value: "K"}];
    $scope.tableCards =[{suit: 'c', suit_symbol: '<font color="black">&clubs;</font>', value: '10'}, {suit: 'h', suit_symbol: '<font color="red">&hearts;</font>', value: 'A'}, 
                        {suit: 'h', suit_symbol: '<font color="red">&hearts;</font>', value: '2'}, {suit: 'd', suit_symbol: '<font color="red">&diams;</font>', value: '2'}, 
                        {suit: 'c', suit_symbol: '<font color="black">&clubs;</font>', value: '9'}];
    $scope.opponentCards = [{suit: 's' , suit_symbol: '<font color="black">&spades;</font>', value: 'Q'}, {s: 'd', suit_symbol: '<font color="red">&diams;</font>', value: "Q"}];



    $scope.load = function(){
        for(var i=0; i<$scope.playerCards.length; i++){
            $scope.playerCards[i].suit_symbol = $sce.trustAsHtml($scope.playerCards[i].suit_symbol);
        }

        for(var i=0; i<$scope.tableCards.length; i++){
            $scope.tableCards[i].suit_symbol = $sce.trustAsHtml($scope.tableCards[i].suit_symbol);
        }

        for(var i=0; i<$scope.opponentCards.length; i++){
            $scope.opponentCards[i].suit_symbol = $sce.trustAsHtml($scope.opponentCards[i].suit_symbol);
        }
    };

    $scope.load();

});
