'use strict';

(function (angular) {
    var nodeDeleteController = function($scope) {
        $scope.deleteNode = function(){
        	if(!nodeToEdit) return;
        	var nodeToBeDeleted = svg.selectAll('g[identifier="' + nodeToEdit + '"]');
        	if(!nodeToBeDeleted) return;
        	var toBeDeleted;
        	nodeToBeDeleted.forEach(function(data) {
				  if(data[0]) {
					  toBeDeleted = data[0].__data__;
				  }
  		  	});
        	if(!toBeDeleted) return;
        	if(toBeDeleted.typeId) {
        		svg.selectAll('path.link')[0].forEach(function(d) {
        			if(d.__data__.target === toBeDeleted) {
        				var tempParent = d.__data__.source;
        				for(var child in tempParent.children) {
        					if(tempParent.children[child].typeId) {
        						if(tempParent.children[child].typeId == toBeDeleted.typeId) tempParent.children.splice(child,1)
        					}
        				};
        			}
        		});
        	} else {
        		toBeDeleted.parent.children.splice(toBeDeleted.parent.children.indexOf(toBeDeleted),1);
        	}
      	    update(root);
        };
    };

    nodeDeleteController.$inject =['$scope'];
    angular.module('main.controllers').controller('nodeDeleteController', nodeDeleteController);
}(angular));