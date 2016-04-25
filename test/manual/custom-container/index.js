var $ = require('jquery');
var dialog = require('../../../index.js');

var modal = dialog({
	content: '<p>Content</p>',
	dialogContainer: '.CustomDialogContainer',
	backdropContainer: '.CustomBackdropContainer'
});

$('.show-outside').on('click', function () {
	modal.show();
});
