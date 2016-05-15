var $ = require('jquery');
var dialog = require('../../../../index.js');

var modal = dialog({
	content: '<p>Dialog content</p><p>More dialog content</p><button type="button" class="show">Show</button><button type="button" class="close" autofocus="autofocus">Close with autofocus</button><button type="button" class="close-return-value">Close with return value</button><button type="button" class="destroy-return-value">Destroy with return value</button>',
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

$('body').on('click', '.show', function () {
	modal.show();
});

$('body').on('click', '.close', function () {
	modal.close();
});

$('body').on('click', '.close-return-value', function () {
	modal.close(42);
});

$('body').on('click', '.destroy-return-value', function () {
	modal.destroy(43);
});

$('.show-outside').on('click', function () {
	modal.show();
});

$('.show-outside-custom-content').on('click', function () {
	modal.setContent('Custom content!');
	modal.show();
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
