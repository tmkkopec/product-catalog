'use strict';

(function (angular) {
    var graphController = function($scope) {
        $scope.masterSlave = false;
        $scope.requirement = false;
        $scope.exclusion = false;
        
        $scope.changeMaster = function(master) {
        	shownAssociations.master = master;
        	update(root);
        }
        
        $scope.changeReq = function(requirement) {
        	shownAssociations.requirement = requirement;
        	update(root);
        }
        
        $scope.changeEx = function(exclusion) {
        	shownAssociations.exclusion = exclusion;
        	update(root);
        }
    };

    graphController.$inject = ['$scope'];
    angular.module('main.controllers').controller('graphController', graphController);
}(angular));