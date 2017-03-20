'use strict';

(function (angular) {
    var associationController = function($scope) {
    	$scope.formData={ firstEntity: null,
				  		  secondEntity: null,
				  		  associationType: null};
    	var temp = [];

        $scope.canHaveNodeAssociation = function(rootOf) {
        	var core = rootOf;
        	if(core.children) {
        		core.children.forEach(function (d){
    				temp=temp.concat(d);
        			if(d.typeId==null) $scope.canHaveNodeAssociation(d);
        		})
        	}
        	return temp;
        }

        $scope.$on('associationEvent', function(event, data) {
            $scope.formData={ firstEntity: null,
            				  secondEntity: null,
            				  associationType: "M"};
        	var firstNode = svg.selectAll('g[identifier="' + nodeToEdit + '"]');
        	firstNode.forEach(function(data) {
				  if(data[0]) {
			            $scope.formData.firstEntity = data[0].__data__;
				  }
  		  	});
        	temp = [];
        	$scope.appendableNodesCategories =  $scope.canHaveNodeAssociation(root);
        });

        $scope.saveData = function(){
        	if(!$scope.formData.firstEntity || !$scope.formData.secondEntity || !$scope.formData.associationType) return;
        	if($scope.formData.firstEntity===$scope.formData.secondEntity) return;
        	var identifier = ($scope.formData.secondEntity.typeId)?('t' + $scope.formData.secondEntity.typeId):('c' + $scope.formData.secondEntity.categoryId);
        	var newAssociation = $scope.formData.associationType + identifier;
        	var father = $scope.formData.firstEntity;
        	father.associations = father.associations.concat(newAssociation);
          	update(root);
        };
    };

    associationController.$inject =['$scope'];
    angular.module('main.controllers').controller('associationController', associationController);
}(angular));