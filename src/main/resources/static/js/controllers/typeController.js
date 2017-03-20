'use strict';

(function (angular) {
    var typeController = function($scope) {
        $scope.typeName = "";
        $scope.saveData = function(){
        	if($scope.typeName == "") return;
        	if(!nodeToEdit) return;
        	var parentNode = svg.selectAll('g[identifier="' + nodeToEdit + '"]');
        	if(!parentNode) return;
        	var par;
        	parentNode.forEach(function(data) {
				  if(data[0]) {
					  par = data[0].__data__;
				  }
  		  	});
        	if(!par) return;
        	var newType = {
        	        category: false,
        			name: $scope.typeName,
        			associations: [],
        			typeId: i++ + "temp",
        			categoryId: null};
    	    var father = par;
      	    if (father.children) {
      	    	father.children = father.children.concat(newType);
      	    } else if(father._children) {
      	    	father._children = father._children.concat(newType);
      	    } else {
      	    	father.children = [newType];
      	    	father._children = null;
      	    }
  		    if(father.categoryId) {
  		    	var parents = parentMap.set(newType.typeId, [father.categoryId]);
  		    }
            $scope.typeName = "";
      	    update(root);
        };
    };

    typeController.$inject =['$scope'];
    angular.module('main.controllers').controller('typeController', typeController);
}(angular));