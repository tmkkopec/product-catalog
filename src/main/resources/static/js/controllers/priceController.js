'use strict';

(function (angular) {
	var priceController = function($scope, $compile) {
	    $scope.formInfo = {
	        PriceMode: "",
	        PriceType: "",
	        PriceTypeDescription: "",
	        PriceDescription: "",
	        Tax: "",
	        Currency: "",
	        Amount: ""
	    };
	
	    $scope.options = [
	        {name: "PriceMode"},
	        {name: "PriceType"},
	        {name: "PriceTypeDescription"},
	        {name: "PriceDescription"},
	        {name: "Tax"},
	        {name: "Currency"},
	        {name: "Amount"}
	    ];
	
	    $scope.$on('addPriceEvent', function(event, data) {
	    	$scope.invokingRow = data.invokingRow;
	    });
	
	    $scope.saveData = function(){
	
	        if($scope.invokingRow.prop("tagName")=="TBODY"){
	            var pricesBody = $('.active .prices-body tbody tr');
	
	            if (!pricesBody.length)
	                $scope.colorClass = 'grey-row';
	            else if (pricesBody.last().attr('class').indexOf('grey-row') >= 0)
	                $scope.colorClass = '';
	            else
	                $scope.colorClass = 'grey-row';
	
	            var newPrice = '<tr class="'+$scope.colorClass+'" highlight-price ng-include="\'templates/price.html\'"></tr>';
	            $('.active .prices-body tbody').append($compile(newPrice)($scope));
	        } else if($scope.invokingRow.prop("tagName")=="TR"){
	            var noOfRows = Number($scope.invokingRow.children().first().attr('rowspan')) + 1;
	            $scope.invokingRow.children().first().attr('rowspan',noOfRows);
	            if ($scope.invokingRow.attr('class').indexOf('grey-row')>-1)
	                $scope.colorClass = 'grey-row';
	            else
	                $scope.colorClass = '';
	            var newPrice = '<tr class="'+$scope.colorClass+'" data-group="'+$scope.invokingRow.attr('data-group')+'" highlight-groups ng-include="\'templates/price.html\'"></tr>';
	            $compile(newPrice)($scope).insertAfter($scope.invokingRow);
	        }
	    };
	};
	
	priceController.$inject =['$scope', '$compile'];
	angular.module('main.controllers').controller('priceController', priceController);
}(angular));