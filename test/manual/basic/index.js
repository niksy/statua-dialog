var $ = require('jquery');
var dialog = require('../../../index.js');

var modal = dialog({
	content: '<p>Dialog content</p><p>More dialog content</p>',
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

$('.show-outside').on('click', function () {
	modal.show();
});

$('.close-outside').on('click', function () {
	modal.close();
});

$('.destroy-outside').on('click', function () {
	modal.destroy();
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
