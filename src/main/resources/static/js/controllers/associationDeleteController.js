'use strict';

(function (angular) {
    var associationDeleteController = function($scope) {
        $scope.formData={deleted: null};
        var temp = [];

        $scope.canBeDeleted = function() {
        	svg.selectAll("line").forEach(function(data) {
  			    for(var j=0;j<data.length;j++) {
  			    	var modifiedId1 = data[j].__data__.source.category ? ('c' + data[j].__data__.source.categoryId) : ('t' + data[j].__data__.source.typeId);
  			    	var modifiedId2 = data[j].__data__.target.category ? ('c' + data[j].__data__.target.categoryId) : ('t' + data[j].__data__.target.typeId);
  			    	if(nodeToEdit == modifiedId1 || nodeToEdit == modifiedId2) temp.push(data[j]);
  			    }
  		   });
        	return temp;
        }

        $scope.$on('associationDeleteEvent', function(event, data) {
            $scope.formData={deleted: null};
            temp = [];
            $scope.associations =  $scope.canBeDeleted();
        });

        $scope.deleteAssociation = function(){
        	if($scope.formData.deleted==null) return;
    	    var toBeDeleted = $scope.formData.deleted;
    		if(toBeDeleted.__data__.target.typeId) {
    			toBeDeleted.__data__.source.associations.splice(toBeDeleted.__data__.source.associations
    					.indexOf(toBeDeleted.className.baseVal.charAt(0).toUpperCase() + 't' + toBeDeleted.__data__.target.typeId),1);
    		} else {
    			toBeDeleted.__data__.source.associations.splice(toBeDeleted.__data__.source.associations
    					.indexOf(toBeDeleted.className.baseVal.charAt(0).toUpperCase() + 'c' + toBeDeleted.__data__.target.categoryId),1);
    		} 
    		update(root);
        };
    };

    associationDeleteController.$inject =['$scope'];
    angular.module('main.controllers').controller('associationDeleteController', associationDeleteController);
}(angular));