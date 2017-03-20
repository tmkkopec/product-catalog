'use strict';

(function (angular) {
    var bundleDeleteController = function($scope, passingService) {
        $scope.deleteBundle = function(){
        	if(!nodeToEdit) return;
        	var toBeDeleted = nodeToEdit;
        	if(!toBeDeleted) return;
        	while(!toBeDeleted.isBundle) {
        		toBeDeleted = toBeDeleted.parent;
        	}
        	toBeDeleted.parent.children.splice(toBeDeleted.parent.children.indexOf(toBeDeleted),1);
            passingService.genGraph();
        };
    };

    bundleDeleteController.$inject =['$scope', 'passingService'];
    angular.module('main.controllers').controller('bundleDeleteController', bundleDeleteController);
}(angular));