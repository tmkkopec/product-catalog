'use strict';

(function (angular) {
    var addBundleController = function($scope, passingService) {
    	$scope.bundleName = "";
    	$scope.saveData = function(){
    	if($scope.bundleName == "" || !bundleSvg) return;
	    var father = bundleSvg[0][0].__data__;
    	if(!father) return;
    	var newBundle = {
    	        isBundle: true,
    	        productOfferingCode: $scope.bundleName,
    			generals: {
    				productCategory: [],
    				productOfferingVersion: "",
    				productOfferingVariant: "",
    				productType: "",
    				productOfferingId: (tempIdCnt++) + "tmp",
    				productOfferingCode: $scope.bundleName,
    				validFrom: "",
    				isRequired: false,
    				isProductDiscount: false},
    			transitions: [],
    			prices: [],
    			products: []};
    	newBundle.productOfferingId = newBundle.generals.productOfferingId;
	    if (father.products) father.products = father.products.concat(newBundle);
	    else father.products = [newBundle];
	    $scope.bundleName = "";
		
        passingService.genGraph();
        };
    };

    addBundleController.$inject =['$scope', 'passingService'];
    angular.module('main.controllers').controller('addBundleController', addBundleController);
}(angular));