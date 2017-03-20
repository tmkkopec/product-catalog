'use strict';

$('.table-bound').each(function() {
    var $table = $(this);
    $table.floatThead({
        scrollContainer: function($table) {
            return $table.parent();
        }
    });
});