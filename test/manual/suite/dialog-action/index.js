var $ = require('jquery');
var dialog = require('../../../../index.js');

var modal = dialog({
	content: '<p>Content</p><button type="button" data-dialog-action="show">Show</button><button type="button" data-dialog-action="close">Close</button><button type="button" data-dialog-action="confirm">Confirm</button><button type="button" data-dialog-action="cancel">Cancel</button>',
	userInteraction: true,
	onClose: function () {
		console.log(arguments);
	},
	onDestroy: function () {
		console.log(arguments);
	}
});

$('.show-outside').on('click', function () {
	modal.show();
});

$('.show-outside-confirm').on('click', function () {
	modal.setContent('<p>Content</p><button type="button" data-dialog-action="confirm">Confirm</button><button type="button" data-dialog-action="cancel">Cancel</button>');
	modal.show();
});

$('.show-outside-prompt').on('click', function () {
	modal.setContent('<p><input type="text" data-dialog-action="prompt-input" /></p><button type="button" data-dialog-action="confirm">Confirm</button><button type="button" data-dialog-action="cancel">Cancel</button>');
	modal.show();
});
