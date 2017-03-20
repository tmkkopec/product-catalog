'use strict';

(function(angular) {
    var removeTab = function() {
        return {
            restrict: 'A',
            priority: 1,
            link: function(scope, element, attrs) {
                var removeCurrentTab = function () {
                      // get id of current tab
                      var tabToRemove = element.parent().children().first().attr('data-target').substring(1);
                      // remove it's content
                      $('#'+tabToRemove).remove();

                      // eventually, remove target tab from panel
                      element.parent().parent().remove();
                };

                element.bind("click", function() {
                      // if in edit mode
                        if ($('#editPanel').length)
                            return;

                        var isActive = element.parent().parent().attr('class').indexOf('active');

                        /*  if removing active tab, switch to previous tab
                        *   else stay on current tab
                        */
                        if (isActive > -1) {
                            // get id of previous tab
                            var switchTarget = element.parent().parent().prev().children().first().children().first().attr('data-target').substring(1);
                            // switch to previous tab
                            $('#'+switchTarget).addClass('active in');
                            // set previous tab to active
                            element.parent().parent().prev().attr('class', 'active');

                            removeCurrentTab();
                        } else
                            removeCurrentTab();
                    }
                );
            }
        };
    };

    angular.module('main.directives').directive('removeTab', removeTab);

    var switchTabs = function(passingService) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    // if edit panel already exists (i.e edit mode is active)
                    // else if editButton already exists (just pure switching between product tabs
                    if ($('#editPanel').length || $('#editButton').length)
                        return;
                    else {
                    	passingService.setShownPanel('editButton');
                    }
                });
            }
        };
    };

    switchTabs.$inject = ['passingService'];
    angular.module('main.directives').directive('switchTabs', switchTabs);

    var removeEdit = function(passingService) {
        return {
            restrict: 'A',
            priority: 0,
            link: function(scope, element, attrs) {

                element.bind('click', function() {
                    // if in editMode
                    // else if current tab is overview tab
                    // else if tabToRemove isn't active
                    // else if previous tab is equal to overview tab, remove editButton
                    if ($('#editPanel').length)
                        return;
                    else if (element.attr('data-target') == '#overview') {
                    // Remove edit button
                    	passingService.setShownPanel('none');
                    }
                    else if (element.parent().parent().attr('class').indexOf('active')==-1)
                        return;
                    else if (element.parent().parent().prev().children().first().children().first().attr('data-target') == '#overview'){
                    // Remove edit button
                    	passingService.setShownPanel('none');
                    }
                });
            }
        };
    };

    removeEdit.$inject = ['passingService'];
    angular.module('main.directives').directive('removeEdit', removeEdit);

    var highlightGroups = function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('mouseenter', function() {
                    var dataGroup = element.attr('data-group');
                    var originalColor = (element.attr('class').indexOf('grey-row')>-1) ? "grey-row" : "";

                    // for each row with dataGroup change color
                    $('tr[data-group='+dataGroup+']').each(function() {
                        $(this).removeClass(originalColor).toggleClass('highlight-transitions');
                    });

                    element.bind('mouseout', function() {
                        $('tr[data-group='+dataGroup+']').each(function() {
                            $(this).removeClass('highlight-transitions').addClass(originalColor);
                        });
                    });
                });
            }
        };
    };

    angular.module('main.directives').directive('highlightGroups', highlightGroups);

    var addPrice = function(passingService) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                	if(element.prop("tagName")=='BUTTON') passingService.setInvokingRow($('.active .prices-body tbody'));
                	else if(element.prop("tagName")=='SPAN') passingService.setInvokingRow(element.parent().parent().parent());
                });
            }
        };
    };

    addPrice.$inject = ['passingService'];
    angular.module('main.directives').directive('addPrice', addPrice);

    var highlightPrice = function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('mouseenter', function() {
                    var originalColor = element.attr('class');

                    element.removeClass(originalColor).addClass('highlight-price');

                    element.bind('mouseout', function() {
                        element.removeClass('highlight-price').addClass(originalColor);
                    });
                });
            }
        };
    };

    angular.module('main.directives').directive('highlightPrice', highlightPrice);

    var setToBeDeleted = function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                	element.parent().parent().addClass('to-be-deleted');
                });
            }
        };
    };

    angular.module('main.directives').directive('setToBeDeleted', setToBeDeleted);

    var deleteRow = function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                	if($('.to-be-deleted').attr('class').indexOf('appendable-row')>-1){
                		if($('.to-be-deleted').attr('data-group')==$('.to-be-deleted').next().attr('data-group')){
                			var temporaryContent1 = $('.to-be-deleted').children().first();
                			var temporaryContent2 = $('.to-be-deleted').children().last();

                            var noOfRows = Number(temporaryContent1.attr('rowspan')) - 1;
                            temporaryContent1.attr('rowspan',noOfRows);

                			$('.to-be-deleted').children().remove();
                			$('.to-be-deleted').append(temporaryContent1);
                			var nextPrice = $('.to-be-deleted').next().children();
                			$('.to-be-deleted').append(nextPrice);
                			$('.to-be-deleted').next().remove();
                			$('.to-be-deleted').append(temporaryContent2);
                			$('.to-be-deleted').removeClass('to-be-deleted');
                		}
                		else {
                			$('.to-be-deleted').next().remove();
                			$('.to-be-deleted').remove();
                		}
                	}
                	else $('.to-be-deleted').remove();
                });
            }
        };
    };

    angular.module('main.directives').directive('deleteRow', deleteRow);

    var cancelDelete = function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                	$('.to-be-deleted').removeClass('to-be-deleted');
                });
            }
        };
    };

    angular.module('main.directives').directive('cancelDelete', cancelDelete);

    var editMode = function($compile, passingService) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    if (scope.viewCount == 'offersOverview') {
                        var activeDiv = $('div.active').clone();
                        passingService.saveView(activeDiv);

                        passingService.setShownPanel('editPanel');

                        var minusIcon = '<td><span class="glyphicon glyphicon-minus" data-toggle="modal" data-target="#deleteConfirmationModal" set-to-be-deleted></span></td>';
                        $('.active .transitions-body tbody tr').each(function() {
                            if($(this).attr('ng-repeat-end')==undefined) $(this).append($compile(minusIcon)(scope));
                        });
                        $('.active .prices-body tbody tr').each(function() {
                            $(this).append($compile(minusIcon)(scope));
                        });
                        $('.active .parameters-body tbody tr').each(function() {
                            $(this).append($compile(minusIcon)(scope));
                        });
                        $('.active .subscribing-object-types-body tbody tr').each(function() {
                            $(this).append($compile(minusIcon)(scope));
                        });
                        $('.active .sales-channels-body tbody tr').each(function() {
                            $(this).append($compile(minusIcon)(scope));
                        });

                        var transitionPriceIcon = '<td><span><span class="glyphicon glyphicon-plus" add-price data-toggle="modal" data-target="#priceModal"></span></span></td>';
                        $('.active .transitions-body tbody .appendable-row').each(function() {
                            $(this).append($compile(transitionPriceIcon)(scope));
                        });

                        var parameterIcon = '<tr><td><span class="glyphicon glyphicon-plus" add-parameter></td></tr>';
                        $('.active .parameters-body tbody').each(function() {
                        	$(this).append($compile(parameterIcon)(scope));
                        });

                        var sotIcon = '<tr><td><span class="glyphicon glyphicon-plus" add-sot></td></tr>';
                        $('.active .subscribing-object-types-body tbody').each(function() {
                        	$(this).append($compile(sotIcon)(scope));
                        });

                        var salesChannelsIcon = '<tr><td><span class="glyphicon glyphicon-plus" add-sales-channel></td></tr>';
                        $('.active .sales-channels-body tbody').each(function() {
                        	$(this).append($compile(salesChannelsIcon)(scope));
                        });

                        $('.editableArea')
                            .each(function() {
                                // save text node
                                var currentValue = $(this).text().trim();
                                // remove text node
                                $(this).empty();
                                // append textarea
                                $(this).append($('<input class="form-control"></input>').attr('value', currentValue));
                                $(this).attr('tmp', currentValue);
                            });

                        $('.editableComboBox')
                            .each(function() {
                                var currentValue = $(this).text();
                                $(this).empty();
                                $(this).append($('<select class="form-control input-sm"></select>')
                                    .append($('<option></option>').text(currentValue))
                                    .append($('<option></option>').text('unknown1'))
                                    .append($('<option></option>').text('unknown2')))
                                $(this).attr('tmp', currentValue);
                            });

                        var radioGroupId = 0;
                        $('.editableRadioButton')
                            .each(function() {
                                var currentValue = $(this).text();
                                var trueButton;
                                var falseButton;
                                if (currentValue == 'true') {
                                    trueButton = '<input type="radio" name="group' + radioGroupId + '" checked>';
                                    falseButton = '<input type="radio" name="group' + radioGroupId + '" >';
                                } else {
                                    trueButton = '<input type="radio" name="group' + radioGroupId + '">';
                                    falseButton = '<input type="radio" name="group' + radioGroupId + '" checked>';
                                }
                                radioGroupId++;
                                $(this).empty();
                                $(this).append($('<label class="radio-inline"></label>')
                                        .append(trueButton).append('true'))
                                    .append($('<label class="radio-inline"></label>')
                                        .append(falseButton).append('false'));
                                $(this).attr('tmp', currentValue);
                        });

                        $('.editableDate')
                            .each(function() {
                                var currentValue = $(this).text();
                                $(this).empty();
                                $(this).append($('<div class="input-group date" id="editableDate"></div>')
                                    .append('<input type="text" class="form-control"/>')
                                    .append($('<span class="input-group-addon"></span>')
                                        .append('<span class="glyphicon glyphicon-calendar"></span>')));

                                $(this).attr('tmp', currentValue);
                                $('#editableDate').datetimepicker({
                                    defaultDate: currentValue
                                });
                        });

                        $('a').each(function() {
                            var dataToggle = $(this).attr('data-toggle');
                            var func = $(this).attr('ng-click');

                            if(dataToggle == 'tab'){
                                // tab 'a'
                                $(this).parent().attr({'data-toggle':'modal', 'data-target':'#attentionModal'});
                                $(this).removeAttr('data-target data-toggle');

                                // button 'X'
                                $(this).next().removeAttr('remove-tab remove-edit');
                            } else if(func != undefined)
                                $(this).attr({'data-toggle':'modal', 'data-target':'#attentionModal', 'tmp':func});
                        });
                        
                        $('.active .transitions-body thead tr').append('<th></th><th></th>');
                        $('.active .prices-body thead tr').append('<th></th>');
                    } else if (scope.viewCount == 'category') {
                    	var cloneNode = function(xCloned) {
                    		var clone = new Object();
                    		if(xCloned.name!=undefined) clone.name = xCloned.name;
                    		if(xCloned.associations!=undefined) clone.associations = xCloned.associations;
                    		if(xCloned.category!=undefined) clone.category = xCloned.category;
                    		if(xCloned.categoryId!=undefined) clone.categoryId = xCloned.categoryId;
                    		if(xCloned.typeId!=undefined) clone.typeId = xCloned.typeId;
                    		if(xCloned.children) {
                    			clone.children = [];
                    			for(var ind in xCloned.children) {
                    				clone.children[ind] = cloneNode(xCloned.children[ind]);
                    			}
                    		} else if(xCloned.children == null) clone.children = null;
                    		if(xCloned._children) {
                    			clone._children = [];
                    			for(var ind in xCloned._children) {
                    				clone._children[ind] = cloneNode(xCloned._children[ind]);
                    			}
                    		} else if(xCloned._children == null) clone._children = null;
                    		return clone;
                    	}
                    	
                        passingService.saveView(cloneNode(root));

                        passingService.setShownPanel('categoryEditPanel');

                        $('a').each(function() {
                            var dataToggle = $(this).attr('data-toggle');
                            var func = $(this).attr('ng-click');

                            if(dataToggle == 'tab'){
                                // tab 'a'
                                $(this).parent().attr({'data-toggle':'modal', 'data-target':'#attentionModal'});
                                $(this).removeAttr('data-target data-toggle');

                                // button 'X'
                                $(this).next().removeAttr('remove-tab remove-edit');
                            } else if(func != undefined && !dataToggle)
                                $(this).attr({'data-toggle':'modal', 'data-target':'#attentionModal', 'tmp':func});
                        });

                        $("#graph g.category-node").contextMenu({
                            menuSelector: "#categoryMenu"
                        });

                        $("#graph g.type-node").contextMenu({
                            menuSelector: "#typeMenu"
                        });

                        $("#graph g.root-node").contextMenu({
                            menuSelector: "#rootMenu"
                        });
                    } else if (scope.viewCount == 'offerings') {
                        
                    	function cloneOffering(xCloned) {
                    		var clone = new Object();
                    		if(xCloned.generals!=undefined) clone.generals = xCloned.generals;
                    		if(xCloned.prices!=undefined) clone.prices = xCloned.prices;
                    		if(xCloned.isBundle!=undefined) clone.isBundle = xCloned.isBundle;
                    		if(xCloned.productOfferingCode!=undefined) clone.productOfferingCode = xCloned.productOfferingCode;
                    		if(xCloned.productOfferingId!=undefined) clone.productOfferingId = xCloned.productOfferingId;
                    		if(xCloned.transitions!=undefined) clone.transitions = xCloned.transitions;
                    		if(xCloned.products) {
                    			clone.products = [];
                    			for(var ind in xCloned.products) {
                    				clone.products[ind] = cloneOffering(xCloned.products[ind]);
                    			}
                    		} else if(xCloned.products == null) clone.products = null;
                    		return clone;
                    	}

                        passingService.saveView(cloneOffering(bundleSvg[0][0].__data__));
                        
                        $('a').each(function() {
                            var dataToggle = $(this).attr('data-toggle');
                            var func = $(this).attr('ng-click');

                            if(dataToggle == 'tab'){
                                // tab 'a'
                                $(this).parent().attr({'data-toggle':'modal', 'data-target':'#attentionModal'});
                                $(this).removeAttr('data-target data-toggle');

                                // button 'X'
                                $(this).next().removeAttr('remove-tab remove-edit');
                            } else if(func != undefined)
                                $(this).attr({'data-toggle':'modal', 'data-target':'#attentionModal', 'tmp':func});
                        });
                        
                        passingService.setShownPanel('offeringEditPanel');
                        
            		    $("#offeringsGraph g.leaf").contextMenu({
            		        menuSelector: "#offeringMenu"
            		    });

            		    $("#offeringsGraph g.bundle-node").contextMenu({
            		        menuSelector: "#bundleMenu"
            		    });
                    }
                });
            }
        };
    };

    editMode.$inject = ['$compile', 'passingService'];
    angular.module('main.directives').directive('editMode', editMode);

    var addParameter = function($compile) {
        return {
            link: function(scope, element, attrs){
                element.bind('click', function() {
                    var emptyRow = "<tr parameter></tr>";
                    $compile(emptyRow)(scope).insertBefore($('div.active .parameters-body tr:last'));
                    scope.$apply();
                });
            }
        };
    };

    addParameter.$inject = ['$compile'];
    angular.module('main.directives').directive('addParameter', addParameter);
    
    var parameter = function() {

        return({
            controller: "tabsController",
            restrict: "A",
            template: '<td class="editableArea"><input class="form-control"></td><td class="editableArea"><input class="form-control"></td>'+
            '<td class="editableComboBox" tmp="S"><select class="form-control input-sm"><option>S</option><option>unknown1</option>'+
            '<option>unknown2</option></select></td><td><span class="glyphicon glyphicon-minus" set-to-be-deleted="" '+
            'data-target="#deleteConfirmationModal" data-toggle="modal"></span></td>'
        });

    }

    angular.module('main.directives').directive('parameter', parameter);

    var addSot = function($compile) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var emptyRow = "<tr subscribing-object-type></tr>";
                    $compile(emptyRow)(scope).insertBefore($('div.active .subscribing-object-types-body tr:last'));
                    scope.$apply();
                });
            }
        };
    };

    addSot.$inject = ['$compile'];
    angular.module('main.directives').directive('addSot', addSot);
    
    var subscribingObjectType = function() {

        return({
            controller: "tabsController",
            restrict: "A",
            template: '<td class="editableComboBox"><select class="form-control input-sm"><option>SOT 1</option><option>SOT 2</option>'+
            '<option>SOT 3</option></select></td><td class="ng-scope"><span class="glyphicon glyphicon-minus" set-to-be-deleted="" '+ 
            'data-target="#deleteConfirmationModal" data-toggle="modal"></span></td>'
        });

    }

    angular.module('main.directives').directive('subscribingObjectType', subscribingObjectType);

    var addSalesChannel = function($compile) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var emptyRow = "<tr sales-channel></tr>";
                    $compile(emptyRow)(scope).insertBefore($('div.active .sales-channels-body tr:last'));
                    scope.$apply();
                });
            }
        };
    };

    addSalesChannel.$inject = ['$compile'];
    angular.module('main.directives').directive('addSalesChannel', addSalesChannel);
    
    var salesChannel = function() {

    	        return({
    	            controller: "tabsController",
    	            restrict: "A",
    	            template: '<td class="editableComboBox"><select class="form-control input-sm"><option>CRM</option><option>unknown1</option>'+
    	            '<option>unknown2</option></select></td><td><span class="glyphicon glyphicon-minus" set-to-be-deleted '+
    	            'data-target="#deleteConfirmationModal"data-toggle="modal"></span></td>'
    	        });

    	    }

    angular.module('main.directives').directive('salesChannel', salesChannel);

    var saveChanges = function(passingService, saveService, saveCategories) {
        function getTransitions() {
            var transitionsAmount = $('div.active .transitions-body .appendable-row').length;
            var transitions = [];

            for (var j = 0; j < transitionsAmount; j++) {
                var transitionType;
                var priceMode;
                var priceType;
                var priceTypeDescription;
                var priceDescription;
                var tax;
                var currency;
                var amount;
                var prices = [];

                // for each transition
                $('div.active .transitions-body tr[data-group="'+j+'"]').each(function() {
                    // if parsing main row with transition type, else if parsing row with price only
                    if ($(this).find('td').length == 10) {
                        transitionType = $(this).find('td:nth-child(1)').attr('tmp').trim();
                        priceMode = $(this).find('td:nth-child(2)').attr('tmp');
                        priceType = $(this).find('td:nth-child(3)').attr('tmp');
                        priceTypeDescription = $(this).find('td:nth-child(4)').attr('tmp');
                        priceDescription = $(this).find('td:nth-child(5)').attr('tmp');
                        tax = $(this).find('td:nth-child(6)').attr('tmp');
                        currency = $(this).find('td:nth-child(7)').attr('tmp');
                        amount = $(this).find('td:nth-child(8)').attr('tmp');
                    } else {
                        priceMode = $(this).find('td:nth-child(1)').attr('tmp');
                        priceType = $(this).find('td:nth-child(2)').attr('tmp');
                        priceTypeDescription = $(this).find('td:nth-child(3)').attr('tmp');
                        priceDescription = $(this).find('td:nth-child(4)').attr('tmp');
                        tax = $(this).find('td:nth-child(5)').attr('tmp');
                        currency = $(this).find('td:nth-child(6)').attr('tmp');
                        amount = $(this).find('td:nth-child(7)').attr('tmp');
                    }

                    // add price to set
                    prices.push({
                        priceMode: priceMode,
                        priceType: priceType,
                        priceTypeDescription: priceTypeDescription,
                        priceDescription: priceDescription,
                        tax: tax,
                        currency: currency,
                        amount: amount
                    });
                });

                transitions.push({
                    transitionType: transitionType,
                    prices: prices
                });
            };

            return transitions;
        };

        function getPrices() {
            var prices = [];
            var priceMode;
            var priceType;
            var priceTypeDescription;
            var priceDescription;
            var tax;
            var currency;
            var amount;

            $('div.active .prices-body tbody tr').each(function() {
                priceMode = $(this).find('td:nth-child(1)').attr('tmp');
                priceType = $(this).find('td:nth-child(2)').attr('tmp');
                priceTypeDescription = $(this).find('td:nth-child(3)').attr('tmp');
                priceDescription = $(this).find('td:nth-child(4)').attr('tmp');
                tax = $(this).find('td:nth-child(5)').attr('tmp');
                currency = $(this).find('td:nth-child(6)').attr('tmp');
                amount = $(this).find('td:nth-child(7)').attr('tmp');

                prices.push({
                    priceMode: priceMode,
                    priceType: priceType,
                    priceTypeDescription: priceTypeDescription,
                    priceDescription: priceDescription,
                    tax: tax,
                    currency: currency,
                    amount: amount
                });
            });

            return prices;
        };

        function getSalesChannels() {
            var salesChannelsArray = [];
            $('div.active .sales-channels-body td[class*="editable"').each(function() {
                salesChannelsArray.push($(this).attr('tmp').trim());
            });

            return salesChannelsArray;
        };

        function getSot() {
            var sotArray = [];
            $('div.active .subscribing-object-types-body td[class*="editable"').each(function() {
                sotArray.push($(this).attr('tmp').trim())
            });

            return sotArray;
        };

        function getParameters() {
            var parameters = $('div.active .parameters-body tr');
            var parametersSet = [];

            $('div.active .parameters-body tr').each(function() {
                var isValidRow = $(this).attr('ng-repeat');
                // if row has no valid data, i.e. has no ng-repeat attr
                if(typeof isValidRow == typeof undefined || isValidRow == false)
                    return;

                var parameterName = $(this).find('td:nth-child(1)').attr('tmp');
                var parameterValue = $(this).find('td:nth-child(2)').attr('tmp');
                var parameterType = $(this).find('td:nth-child(3)').attr('tmp');

                parametersSet.push({
                    parameterName: parameterName,
                    parameterValue: parameterValue,
                    parameterType: parameterType
                });
            });

            return parametersSet;
        };

        function removeModalEvents() {
            $('a').each(function() {
                var func = $(this).attr('ng-click');
                if (func) {
                    if($(this).attr('data-toggle') == 'modal' && $(this).attr('tmp')){
                        var func = $(this).attr('tmp');
                        $(this).removeAttr('data-toggle data-target').attr('ng-click', func);
                    }
                } else {
                    if($(this).parent().attr('data-toggle') == 'modal'){
                        // tab 'a'
                        var target = $(this).attr('tmp');
                        $(this).attr({'data-toggle':'tab', 'data-target':target});

                        // button 'X'
                        $(this).next().attr({'remove-edit':'', 'remove-tab':''});

                        // parent div
                        $(this).parent().removeAttr('data-toggle data-target');
                    }
                }
            });
        };

        function loop(item) {
            var toInsert = {};
            toInsert.name = item.name;
            toInsert.children = [];
            toInsert.isCategory = item.category;
            toInsert.associations = item.associations;
            if (item.category == false) {
                if (item.typeId.indexOf('temp') == -1)
                    toInsert.id = item.typeId;
                else
                    toInsert.id = '';
                return toInsert;
            }
            else
                if (item.categoryId.indexOf('temp') == -1)
                    toInsert.id = item.categoryId;
                else
                    toInsert.id = '';

            // if any child nodes exists
            // ELSE return
            if (item.children != null)
                // add collapsed children
                for (var childInd in item.children)
                    toInsert.children.push(loop(item.children[childInd]));
            if (item._children != null)
                // add opened children
                for (var childInd in item._children)
                    toInsert.children.push(loop(item._children[childInd]));
            return toInsert;
        }

        function getProductCategories() {
            var productCategories = [];
            // iterate over every child
            for (var j = 0; j < root.children.length; j++)
                productCategories.push(loop(root.children[j]));

            return productCategories;
        };

        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    if(scope.viewCount == 'offersOverview') {
                        // remove editPanel, add editButton
                        passingService.setShownPanel('editButton');

                        // update fields with new values
                        $('.editableArea input')
                            .each(function() {
                                var currentValue = $(this).val();
                                var parent = $(this).parent();

                                parent.attr('tmp', currentValue);
                                parent.empty().text(currentValue);
                            });

                        $('.editableComboBox')
                            .each(function() {
                                var currentValue = $(this).find(':selected').text();

                                $(this).attr('tmp', currentValue);
                                $(this).empty().text(currentValue);
                            });

                        $('.editableDate').each(function() {
                            var currentValue = $(this).find('input').val();

                            $(this).empty().text(currentValue);
                        });

                        $('.editableRadioButton')
                            .each(function() {
                                var currentValue;
                                $(this).children('label').children('input').each(function() {
                                    if ($(this).is(':checked'))
                                        currentValue = $(this)[0].nextSibling.nodeValue;
                                });

                                $(this).attr('tmp', currentValue);
                                $(this).empty().text(currentValue);
                            });

                        var offerId = scope.offerId;
                        var productId = $('li.active a')[0].innerText;
                        var general = $('div.active .general-body tr:not([class*="grey-row"]) td[class*="editable"]');
                        var productOfferingCode = general[0].getAttribute('tmp');
                        var productType = general[1].getAttribute('tmp');
                        var productMultiplicity = general[2].getAttribute('tmp');
                        var productOfferingVariant = general[3].getAttribute('tmp');
                        var productOfferingVersion = general[4].getAttribute('tmp');
                        var validFrom = general[5].getAttribute('tmp');
                        var isRequired = general[6].getAttribute('tmp');
                        var isProductDiscount = general[7].getAttribute('tmp').trim();

                        var categoriesRows = $('div.active .general-body tr.grey-row td[class*="editable"]');
                        var productCategory = [];
                        for(var j = 0; j < categoriesRows.length; j++)
                            productCategory.push(categoriesRows[j].getAttribute('tmp'));

                        var data = {
                            offerId: offerId,
                            productId: productId,
                            productOfferingCode: productOfferingCode,
                            productType: productType,
                            productCategory: productCategory,
                            productMultiplicity: productMultiplicity,
                            productOfferingVariant: productOfferingVariant,
                            productOfferingVersion: productOfferingVersion,
                            validFrom: validFrom,
                            isRequired: isRequired,
                            isProductDiscount: isProductDiscount,
                            parametersSet: getParameters(),
                            subscribingObjectTypes: getSot(),
                            salesChannels: getSalesChannels(),
                            transitions: getTransitions(),
                            prices: getPrices(),
                            document: passingService.getDocument()
                        };

                        saveService.fn(data);

                        $('.glyphicon-plus').parent().parent().remove();
                        $('.glyphicon-minus').parent().remove();
                        
                        $('.active .transitions-body thead tr th:last').remove();
                        $('.active .transitions-body thead tr th:last').remove();
                        $('.active .prices-body thead tr th:last').remove();

                    } else if (scope.viewCount == 'category') {
                        passingService.setShownPanel('editButton');
                        var data = getProductCategories();
                        saveCategories.fn({data: data, document: passingService.getDocument()});
        			    $("#categoryMenu").hide();
        			    $("#typeMenu").hide();
        			    $("#rootMenu").hide();
                    } else if (scope.viewCount == 'offerings') {
                        passingService.saveOrder();
                        passingService.setShownPanel('editButton');
        			    $("#offeringMenu").hide();
        			    $("#bundleMenu").hide();
            		}


                    removeModalEvents();
                });
            }
        };
    };

    saveChanges.$inject = ['passingService', 'saveService', 'saveCategories'];
    angular.module('main.directives').directive('saveChanges', saveChanges);

    var discardChanges = function(passingService) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function(){
                    $('a').each(function() {
                       var func = $(this).attr('ng-click');

                       if (func) {
                           if($(this).attr('data-toggle') == 'modal' && $(this).attr('tmp')){
                               var func = $(this).attr('tmp');
                               $(this).removeAttr('data-toggle data-target').attr('ng-click', func);
                           }
                       } else {
                           if($(this).parent().attr('data-toggle') == 'modal'){
                               // tab 'a'
                               var target = $(this).attr('tmp');
                               $(this).attr({'data-toggle':'tab', 'data-target':target});

                               // button 'X'
                               $(this).next().attr({'remove-edit':'', 'remove-tab':''});

                               // parent div
                               $(this).parent().removeAttr('data-toggle data-target');
                           }
                       }
                    });

                    passingService.setShownPanel('editButton');

                    if (scope.viewCount == 'offersOverview') {
                        $('div.active').remove();
                        $('.tab-content').append(passingService.getView());
                    }
                    else if (scope.viewCount == 'category') {
                        root = passingService.getView();
                        update(root);
        			    $("#categoryMenu").hide();
        			    $("#typeMenu").hide();
        			    $("#rootMenu").hide();
                    } else if (scope.viewCount == 'offerings') {
                        bundleSvg[0][0].__data__ = passingService.getView();
                        passingService.genGraph();
        			    $("#offeringMenu").hide();
        			    $("#bundleMenu").hide();
                    }
                });
            }
        };
    };

    discardChanges.$inject = ['passingService'];
    angular.module('main.directives').directive('discardChanges', discardChanges);
}(angular));