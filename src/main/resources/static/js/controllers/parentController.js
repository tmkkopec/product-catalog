'use strict';

(function (angular) {
    var parentController = function($scope) {
    	$scope.formData={ par: null };
    	var child = null;
    	var temp = [];

        $scope.canHaveNodeChildren = function(rootOf) {
        	var core = rootOf;
			var typeParents = parentMap.get(child.typeId);
			if(core.children) {
        		core.children.forEach(function (d){
        			if(d.category && d!=child) { 
        				temp=temp.set(d.categoryId,d);
        				$scope.canHaveNodeChildren(d);
        			}
        		})
        	}
//        	return temp;
        }

        $scope.$on('parentEvent', function(event, data) {
        	$scope.formData={ par: null };
        	var childNode = svg.selectAll('g[identifier="' + nodeToEdit + '"]');
        	childNode.forEach(function(data) {
				  if(data[0]) {
			            child = data[0].__data__;
				  }
  		  	});
        	temp = new Map();
        	$scope.appendableNodesCategories = [];
        	$scope.canHaveNodeChildren(root);
			var typeParents = parentMap.get(child.typeId);
			if(!typeParents) {
				temp.forEach(function(category) {
					$scope.appendableNodesCategories.push(category);
				});
				var tempParent = child.parent;
				while (tempParent.category) {
					$scope.appendableNodesCategories.splice($scope.appendableNodesCategories.indexOf(tempParent),1);
					tempParent = tempParent.parent;
				}
			} else {
				typeParents.forEach(function(arg) {
					var tempParent = temp.get(arg);
					while (tempParent.category) {
						if(temp.has(tempParent.categoryId)) {
							temp.delete(tempParent.categoryId);
							tempParent = tempParent.parent;
						} else break;
					}
				});
				temp.forEach(function(category) {
					$scope.appendableNodesCategories.push(category);
				});
			}
        });

        $scope.saveData = function(){
        	if(!child || !$scope.formData.par) return;
        	var father = $scope.formData.par;
        	if(child.typeId) {
        		var clone = new Object();
        		clone.name = child.name;
        		clone.associations = child.associations;
        		clone.category = child.category;
        		clone.categoryId = child.categoryId;
        		clone.typeId = child.typeId;
          	    if (father.children) {
          	    	father.children = father.children.concat(clone);
          	    } else if(father._children) {
          	    	father._children = father._children.concat(clone);
          	    } else {
          	    	father.children = [clone];
          	    	father._children = null;
          	    }
          	    var typeParents = parentMap.get(child.typeId);
          	    if(typeParents) typeParents = typeParents.concat(father.categoryId);
          	    else {
          	    	typeParents = [father.categoryId];
          	    	if(root.children) root.children.splice(root.children.indexOf(child),1);
          	    	else if(root._children) root._children.splice(root._children.indexOf(child),1);
          	    }
          	    parentMap.set(child.typeId, typeParents);
        	} else if(child.categoryId) {
            	var cloneMe = function(xCloned) {
            		var clone = new Object();
            		if(xCloned.name!=undefined) clone.name = xCloned.name;
            		if(xCloned.associations!=undefined) clone.associations = xCloned.associations;
            		if(xCloned.category!=undefined) clone.category = xCloned.category;
            		if(xCloned.categoryId!=undefined) clone.categoryId = xCloned.categoryId;
            		if(xCloned.typeId!=undefined) clone.typeId = xCloned.typeId;
            		if(xCloned.children) {
            			clone.children = [];
            			for(var ind in xCloned.children) {
            				clone.children[ind] = cloneMe(xCloned.children[ind]);
            			}
            		} else if(xCloned.children == null) clone.children = null;
            		if(xCloned._children) {
            			clone._children = [];
            			for(var ind in xCloned._children) {
            				clone._children[ind] = cloneMe(xCloned._children[ind]);
            			}
            		} else if(xCloned._children == null) clone._children = null;
            		return clone;
            	}
            	clone = cloneMe(child);
        		child.parent.children.splice(child.parent.children.indexOf(child),1);
          	    if (father.children) {
          	    	father.children = father.children.concat(clone);
          	    } else if(father._children) {
          	    	father._children = father._children.concat(clone);
          	    } else {
          	    	father.children = [clone];
          	    	father._children = null;
          	    }
        	}
          	update(root);
          	if(!father.children) click(father);
        };
    };

    parentController.$inject =['$scope'];
    angular.module('main.controllers').controller('parentController', parentController);
}(angular));