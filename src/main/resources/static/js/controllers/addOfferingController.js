'use strict';

(function (angular) {
    var addOfferingController = function($scope, passingService) {
    	$scope.offeringName = "";
    	$scope.saveData = function(){
    	if($scope.offeringName == "" || !bundleSvg) return;
	    var father = bundleSvg[0][0].__data__;
    	if(!father) return;
    	var newOffering = {
    	        isBundle: false,
    	        productOfferingCode: $scope.offeringName,
    			generals: {
    				productCategory: [],
    				productOfferingVersion: "",
    				productOfferingVariant: "",
    				productType: "",
    				productOfferingId: (tempIdCnt++) + "tmp",
    				productOfferingCode: $scope.offeringName,
    				validFrom: "",
    				isRequired: false,
    				isProductDiscount: false},
    			transitions: [],
    			prices: [],
    			products: []};
    	newOffering.productOfferingId = newOffering.generals.productOfferingId;
	    if (father.products) father.products = father.products.concat(newOffering);
	    else father.products = [newBundle];
	    $scope.offeringName = "";
	    
        passingService.genGraph();
        };
    };

    addOfferingController.$inject =['$scope', 'passingService'];
    angular.module('main.controllers').controller('addOfferingController', addOfferingController);
}(angular));