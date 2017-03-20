'use strict';

(function (angular) {
    var transitionController = function($scope, $compile) {
        $scope.formInfo = {
            TransitionType: "",
            PriceMode: "",
            PriceType: "",
            PriceTypeDescription: "",
            PriceDescription: "",
            Tax: "",
            Currency: "",
            Amount: ""
        };

        $scope.options = [
            {name: "TransitionType"},
            {name: "PriceMode"},
            {name: "PriceType"},
            {name: "PriceTypeDescription"},
            {name: "PriceDescription"},
            {name: "Tax"},
            {name: "Currency"},
            {name: "Amount"}
        ];

        $scope.saveData = function(){
            var transitionsBody = $('.active .transitions-body tbody tr');
            var rows = transitionsBody.filter(':not([ng-repeat-end])');

            if (!transitionsBody.length) {
                $scope.colorClass = 'grey-row';
                $scope.dataGroup = 0;
            }
            else if (rows.last().attr('class').indexOf('grey-row') >= 0) {
                $scope.colorClass = '';
                $scope.dataGroup = Number(rows.last().attr('data-group')) + 1;
            }
            else {
                $scope.colorClass = 'grey-row';
                $scope.dataGroup = Number(rows.last().attr('data-group')) + 1;
            }

            var newTransition = '<tr class="'+$scope.colorClass+' appendable-row" highlight-groups data-group="'+$scope.dataGroup+
                '" ng-include="\'templates/transition.html\'"></tr>';

            $('.active .transitions-body tbody').append($compile(newTransition)($scope));
        };
     };

    transitionController.$inject =['$scope', '$compile'];
    angular.module('main.controllers').controller('transitionController', transitionController);
}(angular));