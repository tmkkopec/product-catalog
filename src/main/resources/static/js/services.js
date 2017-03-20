'use strict';

(function(angular) {
    var JsonFactory = function($http) {
        return {
            fn: function(callback) {
                $http.get('/product-catalog/resource')
                .success(function(data) {
                    callback(data);
                })
                .error(function(err) {
                    return err;
                });
            }
        }
    };
   
    var OfferFactory = function($http) {
        return {
            fn: function(param1, callback) {
                $http.get('/product-catalog/offer',
                {
                    params: {offerId : param1}
                })
                .success(function(data) {
                    callback(data);
                })
                .error(function(err) {
                    return err;
                });
            }
        };
    };
    
    var ProductFactory = function($http) {
        return {
            fn: function(param1, param2, callback) {
                $http.get('/product-catalog/product',
                {
                    params : {offerId: param1, productId: param2}
                })
                .success(function(data) {
                    callback(data);
                })
                .error(function(err) {
                    return err;
                });
            }
        };
    };

    var SaveService = function($http, passingService) {
        return {
            fn: function(data) {
                $http.post('/product-catalog/save', data)
                .success(function(response) {
                    passingService.saveDocument(response);
                })
                .error(function() {
                })
            }
        };
    };

    var SaveCategories = function($http, passingService) {
        return {
            fn: function(data) {
                $http.post('/product-catalog/saveCategories', data)
                .success(function(response) {
                    passingService.saveDocument(response);
                })
                .error(function() {
                })
            }
        };
    };

    var SaveOfferings = function($http, passingService) {
        return {
            fn: function(data) {
                $http.post('/product-catalog/saveOfferings', data)
                .success(function(response) {
                    passingService.saveDocument(response);
                })
                .error(function() {
                })
            }
        };
    };

    var ExportService = function($http) {
        return {
            fn: function(data) {
                $http.post('/product-catalog/export', data)
                .success(function() {
                })
                .error(function() {
                })
            }
        };
    };

    var PassingService = function($rootScope) {
        var setOfferId = function(offerId) {
            $rootScope.$broadcast('offerSet', {param1: offerId});
        };

        var setProductId = function(productId) {
            $rootScope.$broadcast('productSet', {param1: productId});
        };
        
        var setCategoryView = function() {
            $rootScope.$broadcast('viewEvent', {viewId: 'category'});
        };

        var setOverview = function() {
            $rootScope.$broadcast('viewEvent', {viewId: 'offersOverview'});
        };

        var setProductOfferingsView = function() {
            $rootScope.$broadcast('viewEvent', {viewId: 'offerings'});
        };
        
        var setInvokingRow = function(invokingRow) {
            $rootScope.$broadcast('addPriceEvent', {invokingRow: invokingRow});
        };
        
        var setShownPanel = function(shownPanel) {
        	$rootScope.$broadcast('changePanelEvent', {shownPanel: shownPanel});
        };

        var saveView = function(view) {
            $rootScope.view = view;
        };

        var getView = function() {
            return $rootScope.view;
        };

        var saveOrder = function() {
            $rootScope.$broadcast('saveOrder', {});
        };

        var saveOfferingsData = function(data) {
            $rootScope.$broadcast('offeringsSaved', {data: data});
        };

        var addCategory = function() {
            $rootScope.$broadcast('categoryEvent', {});
        };
        
        var addType = function() {
            $rootScope.$broadcast('typeEvent', {});
        };
        
        var addAssociation = function() {
            $rootScope.$broadcast('associationEvent', {});
        };
        
        var addParentCategory = function() {
            $rootScope.$broadcast('parentEvent', {});
        };
        
        var addChildType = function() {
            $rootScope.$broadcast('childEvent', {});
        };
        
        var deleteNode = function() {
            $rootScope.$broadcast('nodeDeleteEvent', {});
        };
        
        var deleteAssociation = function() {
            $rootScope.$broadcast('associationDeleteEvent', {});
        };
        
        var setFileImported = function() {
            $rootScope.$broadcast('fileImported', {});
        };

        var setXmlLoaded = function() {
            $rootScope.$broadcast('xmlLoaded', {});
        };

        var setOfferData = function(offerData) {
            $rootScope.$broadcast('offerData', {offerData: offerData});
        };

        var genGraph = function() {
        	$rootScope.$broadcast('genGraph', {});
        };

        var saveDocument = function(data) {
            $rootScope.document = data;
        };

        var getDocument = function() {
            return $rootScope.document;
        };

       return {
            setOfferId: setOfferId,
            setProductId: setProductId,
            setCategoryView: setCategoryView,
            setOverview: setOverview,
            setProductOfferingsView: setProductOfferingsView,
            setInvokingRow: setInvokingRow,
            saveView: saveView,
            getView: getView,
            setShownPanel: setShownPanel,
            addCategory: addCategory,
            addType: addType,
            addAssociation: addAssociation,
            addParentCategory: addParentCategory,
            addChildType: addChildType,
            deleteNode: deleteNode,
            deleteAssociation: deleteAssociation,
            setFileImported: setFileImported,
            setXmlLoaded: setXmlLoaded,
            setOfferData: setOfferData,
            saveOrder: saveOrder,
            saveOfferingsData: saveOfferingsData,
            genGraph: genGraph,
            saveDocument: saveDocument,
            getDocument: getDocument
        }
    };

    JsonFactory.$inject = ['$http'];
    OfferFactory.$inject = ['$http'];
    ProductFactory.$inject = ['$http'];
    PassingService.$inject = ['$rootScope'];
    SaveService.$inject = ['$http', 'passingService'];
    ExportService.$inject = ['$http'];
    SaveCategories.$inject = ['$http', 'passingService'];
    SaveOfferings.$inject = ['$http', 'passingService'];

    angular.module('main.services').factory('passingService', PassingService);
    angular.module('main.services').factory('offersService', JsonFactory);
    angular.module('main.services').factory('offerByIdService', OfferFactory);
    angular.module('main.services').factory('productByIdService', ProductFactory);
    angular.module('main.services').factory('saveService', SaveService);
    angular.module('main.services').factory('exportService', ExportService);
    angular.module('main.services').factory('saveCategories', SaveCategories);
    angular.module('main.services').factory('saveOfferings', SaveOfferings);
}(angular));