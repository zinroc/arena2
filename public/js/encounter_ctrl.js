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
    $scope.playerCards = [{suit: '&spades;', value: '4'}, {suit: '&diams;', value: "K"}];

    $scope.load = function(){
        for(var i=0; i<$scope.playerCards.length; i++){
            $scope.playerCards[i].suit = $sce.trustAsHtml($scope.playerCards[i].suit);
        }
    };

    $scope.load();

});
