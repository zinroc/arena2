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
}).controller("MatchCtrl", function matchCtrl ($scope, api_service, $timeout, $sce) {
    "use strict";

    $scope.hello_world = "hello world";

});