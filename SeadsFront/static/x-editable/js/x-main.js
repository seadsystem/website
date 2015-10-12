$(document).ready(function() {
    $.fn.editable.defaults.mode = 'inline';     
    $('.modify').editable({
    				placement: "right",
    				type: "text",
    				name: "modify",
   					url: '../devices/',   					
				  });
});