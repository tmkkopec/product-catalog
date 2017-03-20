'use strict';

var diameter = 800,
format = d3.format(",d");

var pack = d3.layout.pack()
.size([(diameter - 4), diameter - 4])
.value(function(d) { return d.productOfferingCode.length + ((d.products) ? d.products.length : 0); })
.children(function(d) { return (d.products ? d.products : null); });

var bundleSvg;

var tempIdCnt = 0;

(function (angular) {
    var tabsController = function($scope,
        $compile,
        $location,
        offerByIdService,
        productByIdService,
        passingService) {

        $scope.offerId;
        $scope.showedProduct = 0;

        $scope.$on('offerSet', function(event, data) {
            offerByIdService.fn(data.param1, function(offerings) {
                $scope.offerId = data.param1;
                $scope.offerData = offerings;
                passingService.setOfferData(offerings);
            });
        });

        $scope.$on('productSet', function(event, data) {
            productByIdService.fn($scope.offerId, data.param1, function(productData) {
                $scope.productData = productData;

                var navTab = '<li class="" ng-include="\'templates/navTab.html\'"></li>';
                $('.nav-tabs').append($compile(navTab)($scope));

                var productDetails = '<div ' +
                    'id="det{{::productData.product.generals.productOfferingId}}" ' +
                    'class="tab-pane fade" ng-include="\'templates/details.html\'"></div>';
                $('.tab-content').append($compile(productDetails)($scope));
            });
        });

        $scope.setProductId = function(id) {
            passingService.setProductId(id);
            $scope.showedProduct=id;
        };

        $scope.setBundledProductId = function(id) {
            passingService.setProductId(id);
        };
        
        $scope.scrollOfferings = function(id) {
        	$scope.showedProduct=id; 
        	var url = '#' + id;
        	$location.url(url);
        }
    };

    tabsController.$inject = ['$scope', '$compile', '$location', 'offerByIdService', 'productByIdService', 'passingService'];
    angular.module('main.controllers').controller('tabsController', tabsController);

    var viewController = function($scope, passingService, Upload) {

        $scope.upload = function (file) {
            if (file) {
                Upload.upload({
                    url: '/product-catalog/import',
                    data: {file: file}
                }).then(function (resp) {
                    passingService.setFileImported();
                    $scope.isXmlLoaded = false;
                    passingService.saveDocument(resp.data.replace("UTF-16", "UTF-8"));
                });
            }
        };

        $scope.viewCount = 'offersOverview';
        $scope.isXmlLoaded = false;

        $scope.$on('xmlLoaded', function(){
            $scope.isXmlLoaded = true;
        });

        $scope.$on('viewEvent', function(event, data) {
            $scope.viewCount = data.viewId;
        });

        $scope.$on('offerSet', function(event, data) {
            $scope.offerId = data.param1;
        });

        $scope.addCategory = function() {
            passingService.addCategory();
        };

        $scope.addType = function() {
            passingService.addType();
        };

        $scope.addAssociation = function() {
            passingService.addAssociation();
        };
        
        $scope.addParentCategory = function() {
            passingService.addParentCategory();
        };
        
        $scope.addChildType = function() {
            passingService.addChildType();
        };

        $scope.deleteNode = function() {
            passingService.deleteNode();
        };

        $scope.deleteAssociation = function() {
            passingService.deleteAssociation();
        };
    };

    viewController.$inject = ['$scope', 'passingService', 'Upload'];
    angular.module('main.controllers').controller('viewController', viewController);

    var navController = function($scope, offersService, passingService, saveOfferings) {
        $scope.$on('offerSet', function(event, data) {
            $scope.offerId = data.param1;
        });

        function getOfferings(data) {
            var productOfferings = [];
            for (var child in data.children) {
                var offering = {
                    offerCode: data.children[child].productOfferingCode,
                    offerId: data.children[child].productOfferingId,
                };
                if (data.children[child].children != undefined)
                    offering.productOfferings = getOfferings(data.children[child]);

                productOfferings.push(offering);
            };

            if (data.offerCode == undefined)
                return productOfferings;

            var offerings = {
                offerCode: data.offerCode,
                offerId: data.offerId,
                productOfferings: productOfferings
            };

            return offerings;
        };

        $scope.$on('offeringsSaved', function(event, data){
            $scope.bundledOfferings = data;
            var offeringsToSave = {bundles: getOfferings(data.data.bundles[0][0].__data__), document: data.data.document};
            saveOfferings.fn(offeringsToSave);
        });

        $scope.shownPanel = 'none';
        $scope.previousPanel = 'none';
        $scope.viewCount = 'offersOverview';

        $scope.$on('fileImported', function(event) {
            offersService.fn(function(data){
                passingService.setXmlLoaded();
                $scope.offersList = data;
            });
        });

    	$scope.setOfferId = function(id) {
            if($scope.shownPanel != 'offeringEditPanel' &&
               $scope.shownPanel != 'editPanel' &&
               ($scope.shownPanel != 'editButton' || $scope.viewCount != 'offersOverview')) passingService.setOfferId(id);
        };

        $scope.setOverview = function() {
        	if($scope.shownPanel != 'offeringEditPanel' &&
                $scope.shownPanel != 'categoryEditPanel' &&
                $scope.shownPanel != 'editPanel' &&
                $scope.viewCount != 'offersOverview') {
                passingService.setOverview();
        	    $scope.shownPanel = $scope.previousPanel;
            }
        };

        $scope.setCategoryView = function() {
        	if($scope.shownPanel != 'offeringEditPanel' &&
                $scope.shownPanel != 'categoryEditPanel' &&
                $scope.shownPanel != 'editPanel' &&
        	    $scope.viewCount != 'category') {
            	passingService.setCategoryView();
            	$scope.previousPanel = $scope.shownPanel;
            	$scope.shownPanel = 'editButton';
        	}
        };

        $scope.setProductOfferingsView = function() {
            if($scope.shownPanel != 'offeringEditPanel' &&
                $scope.shownPanel != 'categoryEditPanel' &&
                $scope.shownPanel != 'editPanel' &&
                $scope.viewCount != 'offerings') {
                passingService.setProductOfferingsView();
                $scope.previousPanel = $scope.shownPanel;
                $scope.shownPanel = 'editButton';
            }
        };

        $scope.$on('changePanelEvent', function(event, data) {
        	$scope.shownPanel = data.shownPanel;
        	$scope.$apply();
        });

        $scope.$on('viewEvent', function(event, data) {
            $scope.viewCount = data.viewId;
        });
    };

    navController.$inject = ['$scope', 'offersService', 'passingService', 'saveOfferings'];
    angular.module('main.controllers').controller('navController', navController);
    
    var exportController = function($scope, exportService, passingService, FileSaver, Blob) {
        $scope.formInfo = {fileName: ""}
        $scope.exportData = function() {
            var data = new Blob([passingService.getDocument()], {encoding: 'UTF-8', type: 'text/xml;charset=utf-8'});
            FileSaver.saveAs(data, $scope.formInfo['fileName']);
        };
    };

    exportController.$inject = ['$scope', 'exportService', 'passingService', 'FileSaver', 'Blob'];
    angular.module('main.directives').controller('exportController', exportController);

    var offeringsViewController = function($scope, passingService) {

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);
        
        var newX;
        var newY;
        
        function bundleContains(bundle, child) {
        	for(var childInd in bundle) {
        		if(bundle[childInd].productOfferingCode == child.productOfferingCode) { 
        			if(bundle[childInd].productOfferingId == "" || bundle[childInd].productOfferingId == child.productOfferingId) return true;
        		}
        	}
        	return false;
        }
        
        function zoomed() {
        	bundleSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    	}

    	function dragstarted(d) {
    	  	d3.event.sourceEvent.stopPropagation();
    	  	d3.select(this).classed("dragging", true);
    	  	newX = d.x;
    	  	newY = d.y;
    	}

    	function dragged(d) {
    		newX = d3.event.x;
    	  	newY = d3.event.y;
    	  	d3.select(this).attr("transform", function(d) { return "translate(" + newX + "," + newY + ")"; });
    	}
    	
    	function cloneOffering(xCloned, saveId) {
    		var clone = new Object();
    		if(xCloned.generals!=undefined) clone.generals = xCloned.generals;
    		if(!saveId) clone.generals.productOfferingId = (tempIdCnt++) + "tmp";
    		if(xCloned.prices!=undefined) clone.prices = xCloned.prices;
    		if(xCloned.isBundle!=undefined) clone.isBundle = xCloned.isBundle;
    		if(xCloned.productOfferingCode!=undefined) clone.productOfferingCode = xCloned.productOfferingCode;
    		if(xCloned.productOfferingId!=undefined) clone.productOfferingId = clone.generals.productOfferingId;
    		if(xCloned.transitions!=undefined) clone.transitions = xCloned.transitions;
    		if(xCloned.products) {
    			clone.products = [];
    			for(var ind in xCloned.products) {
    				clone.products[ind] = cloneOffering(xCloned.products[ind], saveId);
    			}
    		} else if(xCloned.products == null) clone.products = null;
    		return clone;
    	}

    	function dragended(d) {
      		if(!d.parent.offerCode && ((newX-d.parent.x)*(newX-d.parent.x) + (newY-d.parent.y)*(newY-d.parent.y) > d.parent.r*d.parent.r)) {
      			d.parent.products.splice(d.parent.products.indexOf(d),1);
      		    var newParent = d3.selectAll(".bundle-node").filter(function(arg) { return ((newX-arg.x)*(newX-arg.x) + (newY-arg.y)*(newY-arg.y) < arg.r*arg.r) && arg.isBundle; });
      			if(newParent) {
	      		    var parents = new Map();
	      		    newParent[0].forEach(function(arg) {
	      		    		parents.set(arg.__data__.parent,arg);
    					});
	      		    var l = newParent[0].length;
	      		    var toDropOut = [];
	      		    for(var j=0; j<l; j++) {
	      		    	if(newParent[0][j].__data__==d) {
	      		    		newParent[0] = [];
	      		    		break;
	      		    	} else if(parents.has(newParent[0][j].__data__)) toDropOut.push(newParent[0][j]);
	      		    }
	      		    if(newParent[0].length > 0) {
		      		    toDropOut.forEach(function(arg) {
	      		    	    newParent[0].splice(newParent[0].indexOf(arg),1);
						});
	      		    }
	      		    
	      		    if(newParent[0].length > 0) {
	      				newParent[0].forEach(function(arg) {
		      					if(arg.__data__.products) { 
		      						if(!bundleContains(arg.__data__.products,d)) arg.__data__.products.push(cloneOffering(d, true)); 
		      						}
		      					else arg.__data__.products = [cloneOffering(d, true)];
	      					});
	      		    } else bundleSvg[0][0].__data__.products.push(cloneOffering(d, true));
      			} else bundleSvg[0][0].__data__.products.push(cloneOffering(d, true));
      		} else if(d.parent.offerCode) {
      		    var newParent = d3.selectAll(".bundle-node").filter(function(arg) { return ((newX-arg.x)*(newX-arg.x) + (newY-arg.y)*(newY-arg.y) < arg.r*arg.r) && arg.isBundle; });
      			if(newParent) {
	      		    var parents = new Map();
	      		    newParent[0].forEach(function(arg) {
	      		    		parents.set(arg.__data__.parent,arg);
    					});
	      		    var l = newParent[0].length;
	      		    var toDropOut = [];
	      		    for(var j=0; j<l; j++) {
	      		    	if(newParent[0][j].__data__==d) {
	      		    		newParent[0] = [];
	      		    		break;
	      		    	} else if(parents.has(newParent[0][j].__data__)) toDropOut.push(newParent[0][j]);
	      		    }
	      		    if(newParent[0].length > 0) {
		      		    toDropOut.forEach(function(arg) {
	      		    	    newParent[0].splice(newParent[0].indexOf(arg),1);
						});
	      		    }
	      		    
      				newParent[0].forEach(function(arg) {
      					if(arg.__data__.products) { 
      						if(!bundleContains(arg.__data__.products,d)) arg.__data__.products.push(cloneOffering(d, false)); 
      						}
      					else arg.__data__.products = [cloneOffering(d, false)];
  					});
      			}
      		}
    		d3.select(this).forEach(function(d) { d.x=newX; d.y=newY; })
    	  	d3.select(this).classed("dragging", false);

      		genGraph(bundleSvg[0][0].__data__);
    	}
        
        var genGraph = function(offer) {
            
            if(bundleSvg) d3.select("#offeringsGraph svg").remove();
            
            bundleSvg = d3.select("#offeringsGraph").append("svg")
	            .attr("width", diameter)
	            .attr("height", diameter)
	            .append("g")
	            .attr("transform", "translate(2,2)")
		        .call(zoom);
            
		    if(offer.products.length>0) {  
		        var node = bundleSvg.datum(offer).selectAll(".bundle-node")
		            .data(pack.nodes)
		          .enter().append("g")
		            .attr("class", function(d) { return d.isBundle ? "bundle-node" : "leaf bundle-node"; })
		            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		            .call(drag);
		        
		        node.append("title")
		        	.text(function(d) {return d.productOfferingCode; });
		
		        node.filter(function(d) { return d.parent; }).append("circle")
		            .attr("r", function(d) { return (d.products.length==1) ? (1.1*d.r) : d.r; });
		
		        node.filter(function(d) { return d.productOfferingCode && d.products.length==0; }).append("text")
		            .attr("dy", ".3em")
		            .style("text-anchor", "middle")
		            .text(function(d) { return d.productOfferingCode; });
		    }
		    if($('#offeringsEditPanel').length) {
			    $("#offeringsGraph g.leaf").contextMenu({
			        menuSelector: "#offeringMenu"
			    });
			    
			    $("#offeringsGraph g.bundle-node").contextMenu({
			        menuSelector: "#bundleMenu"
			    });
		    }
        }

        $scope.$on('offerData', function(event, data) {
		    genGraph(data.offerData.offer);
        });
        
        $scope.$on('genGraph', function(event, data) {
        	genGraph(bundleSvg[0][0].__data__);
        });

        $scope.$on('saveOrder', function() {
            passingService.saveOfferingsData({bundles: bundleSvg, document: passingService.getDocument()});
        });
    };

    offeringsViewController.$inject = ['$scope', 'passingService'];
    angular.module('main.controllers').controller('offeringsViewController', offeringsViewController);
}(angular));