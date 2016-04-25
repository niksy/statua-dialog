var $ = require('jquery');
var dialog = require('../../index.js');

var modal = dialog({
	content: '<p>Foo?</p><p>Baz??</p><button type="button" class="show">Show</button><button type="button" class="close" autofocus="autofocus">Close</button>',
	onCreate: function ( $dialog ) {
		console.log('Dialog create');
	},
	onShow: function ( $dialog ) {
		console.log('Dialog show');
	},
	onClose: function ( $dialog, returnValue ) {
		console.log('Dialog close');
		console.info(returnValue);
	},
	onDestroy: function ( $dialog, returnValue ) {
		console.log('Dialog destroy');
		console.info(returnValue);
	}
});

$('body').on('click', '.show-outside', function () {
	modal.show();
});

$('body').on('click', '.show-outside-new-content', function () {
	modal.setContent('Custom content<button type="button" class="close">Close</button>');
	modal.show();
});

$('body').on('click', '.destroy-outside', function () {
	modal.destroy(43);
});

$('body').on('click', '.show', function () {
	modal.show();
});

$('body').on('click', '.close', function () {
	modal.setReturnValue(42);
	modal.close();
});

$(document).on('dialogshow', function ( e, $dialog ) {
	console.log(arguments);
});

$(document).on('dialogclose', function ( e, $dialog, returnValue ) {
	console.log(arguments);
});

$(document).on('dialogdestroy', function ( e, $dialog, returnValue ) {
	console.log(arguments);
});
