'use strict';

var nodeToEdit;

$.fn.contextMenu = function (settings) {

    return this.each(function () {

        // Open context menu
        $(this).on("contextmenu", function (event) {
            // return native menu if pressing control
            if (event.ctrlKey) return;

            if($(this).attr("identifier")) nodeToEdit = $(this).attr("identifier");
            else nodeToEdit = $(this)[0].__data__;
            //open menu
            var $menu = $(settings.menuSelector)
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(event.clientX, 'width', 'scrollLeft'),
                    top: getMenuPosition(event.clientY, 'height', 'scrollTop')
                })
                .off('click')
                .on('click', 'a', function (event) {
                    $menu.hide();
                });

            return false;
        });

        //make sure menu closes on any click
        $('body').mouseup(function(e) {
            $(settings.menuSelector).hide();
        });
    });

    function getMenuPosition(mouse, direction, scrollDir) {
        var win = $(window)[direction](),
            scroll = $(window)[scrollDir](),
            menu = $(settings.menuSelector)[direction](),
            position = mouse + scroll;

        // opening menu would pass the side of the page
        if (mouse + menu > win && menu < mouse)
            position -= menu;

        return position;
    }

};