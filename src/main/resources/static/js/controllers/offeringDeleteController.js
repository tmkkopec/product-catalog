'use strict';

(function (angular) {
    var offeringDeleteController = function($scope, passingService) {
        $scope.deleteOffering = function(){
        	if(!nodeToEdit) return;
        	var toBeDeleted = nodeToEdit;
        	if(!toBeDeleted) return;
        	toBeDeleted.parent.children.splice(toBeDeleted.parent.children.indexOf(toBeDeleted),1);
            passingService.genGraph();
        };
    };

    offeringDeleteController.$inject =['$scope', 'passingService'];
    angular.module('main.controllers').controller('offeringDeleteController', offeringDeleteController);
}(angular));