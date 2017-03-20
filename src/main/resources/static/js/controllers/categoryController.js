'use strict';

(function (angular) {
    var categoryController = function($scope) {
        $scope.categoryName = "";
        $scope.saveData = function(){
        	if($scope.categoryName == "") return;
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
        	var newCategory = {
        	        category: true,
        			name: $scope.categoryName,
        			associations: [],
        			children: [],
        			_children: [],
        			categoryId: i++ + "temp",
        			typeId: null};
        	var father = par;
          	if (father.children) {
          		father.children = father.children.concat(newCategory);
          	} else if(father._children) {
      	    	father._children = father._children.concat(newCategory);
      	    } else {
      	    	father.children = [newCategory];
      	    	father._children = null;
      	    }
          	$scope.categoryName = "";
          	update(root);
        };
    };

    categoryController.$inject =['$scope'];
    angular.module('main.controllers').controller('categoryController', categoryController);
}(angular));