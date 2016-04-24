var $ = require('jquery');

var meta = {
	name: 'dialog',
	ns: {
		htmlClass: 'kist-Dialog',
		event: '.kist.dialog'
	}
};
var instance = 0;

function destroyStateCheck ( ins ) {
	if ( ins.state.destroyed ) {
		throw new Error('Dialog instance has been destroyed, please create new instance.');
	}
}

function Dialog ( options ) {

	this.options = $.extend(true, {}, this.defaults, options);
	this.state = {
		visible: false
	};

	this.setupInstance();
	this.setupDom();
	this.setupEvents();

	this.options.onCreate.call(this, this.$wrapper);
	this.$doc.trigger(meta.name + 'create', this.$wrapper);

}

$.extend(Dialog.prototype, {

	setupInstance: function () {
		this.uid = instance++;
		this.ens = meta.ns.event + '.' + this.uid;
	},

	destroyInstance: function () {
	},

	setupDom: function () {

		this.$doc = $(document);
		this.$html = $('html');
		this.$body = $('body');
		this.$lastFocusedEl = $();

		this.$wrapper = $('<div />', {
			'class': this.options.classes.wrapper,
			role: 'dialog',
			'aria-hidden': true
		});
		this.$content = $(this.options.content);

		this.$wrapper.addClass(this.options.classes.isHidden);

		this.$wrapper.append(this.$content);

		this.cacheAutofocusElement();
		this.cacheTabbableElements();

		this.$body.append(this.$wrapper);

	},

	cacheAutofocusElement: function () {

		// Find last element with "autofocus" attribute
		this.$autoFocusEl = this.$wrapper.find('[autofocus]').last();

		// If that element doesn’t exist, use wrapper as programmably focusable element
		if ( !this.$autoFocusEl.length ) {
			this.$wrapper.attr('tabindex', -1);
			this.$autoFocusEl = this.$wrapper;
		}

	},

	cacheTabbableElements: function () {

		this.$tabbableElements = this.$wrapper.find([
			'a[href]',
			'area[href]',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'button:not([disabled])',
			'iframe, object, embed',
			'*[tabindex]',
			'*[contenteditable]'
		].join(','));

		// If there are no tabbable elements, constrain tabbing to wrapper element
		if ( !this.$tabbableElements.length ) {
			this.$tabbableElements = this.$wrapper;
		}

	},

	destroyDom: function () {

		this.$content.remove();
		this.$wrapper.remove();

	},

	setupEvents: function () {
	},

	setupGlobalEvents: function () {

		if ( this.state.globalEventsSet ) {
			return;
		}
		this.state.globalEventsSet = true;

		this.$doc.on($.trim(['click', 'keydown'].concat('').join(this.ens + ' ')), $.proxy(function ( e ) {

			var $target = $(e.target);

			if (
				e.which === 27 ||
				$target.hasClass(this.options.classes.dialogBackdrop)
			) {
				this.close();
			}

		}, this));

		this.$doc.on('keydown' + this.ens, $.proxy(function ( e ) {

			var firstEl, lastEl;

			if ( e.which !== 9 || this.$wrapper.hasClass('is-hidden') ) {
				// Not a TAB, ignore it...
				return;
			}

			// late grab of first/last element identification, because
			// DOM might have changed since registering this helper.
			// remember that DOMNodeList is a live view of the query
			// (unlike jQuery's static list)
			firstEl = this.$tabbableElements[0];
			lastEl = this.$tabbableElements[this.$tabbableElements.length - 1];

			if ( e.target === lastEl && !e.shiftKey ) {
				// Loop around the end
				firstEl.focus();
			} else if ( e.target === firstEl && e.shiftKey ) {
				// Loop around the beginning
				lastEl.focus();
			} else {
				// Ignore tabs in between
				return;
			}

			// Prevent browser from handling these TABs
			e.preventDefault();
			e.stopPropagation();

		}, this));

	},

	destroyGlobalEvents: function () {

		if ( !this.state.globalEventsSet ) {
			return;
		}
		this.state.globalEventsSet = false;

		this.$doc.off(this.ens);

	},

	destroyEvents: function () {
		this.$content.off(this.ens);
		this.destroyGlobalEvents();
	},

	/**
	 * @param {Mixed} content
	 */
	setContent: function ( content ) {
		this.$wrapper.html(content);
		this.cacheAutofocusElement();
		this.cacheTabbableElements();
	},

	/**
	 * @param {Mixed} returnValue
	 */
	setReturnValue: function ( returnValue ) {
		this.returnValue = returnValue;
	},

	show: function () {

		destroyStateCheck(this);

		if ( this.state.visible ) {
			return;
		}
		this.state.visible = true;

		this.$wrapper.attr('aria-hidden', false);
		this.$wrapper.addClass(this.options.classes.isVisible);
		this.$wrapper.removeClass(this.options.classes.isHidden);
		this.$html.addClass(this.options.classes.dialogBackdrop);

		// Store last focused element so we can return focus prior to showing dialog
		this.$lastFocusedEl = $(document.activeElement);
		// Autofocus last focusable element inside dialog
		this.$autoFocusEl.focus();

		// On next tick, setup global events for this dialog
		// (this seems like hackish solution, but it’s the only way I’ve found that
		// doesn’t trigger click events automatically on showing)
		// setTimeout($.proxy(function () {

		// }, this), 0);
		this.setupGlobalEvents();

		this.options.onShow.call(this, this.$wrapper);
		this.$doc.trigger(meta.name + 'show', this.$wrapper);

	},

	close: function ( returnValue ) {

		destroyStateCheck(this);

		if ( !this.state.visible ) {
			return;
		}
		this.state.visible = false;

		this.$wrapper.attr('aria-hidden', true);
		this.$wrapper.removeClass(this.options.classes.isVisible);
		this.$wrapper.addClass(this.options.classes.isHidden);
		this.$html.removeClass(this.options.classes.dialogBackdrop);

		// Return focus to last focused element prior to showing dialog
		this.$lastFocusedEl.focus();

		this.destroyGlobalEvents();

		if ( typeof returnValue !== 'undefined' ) {
			this.setReturnValue(returnValue);
		}

		this.options.onClose.call(this, this.$wrapper, this.returnValue);
		this.$doc.trigger(meta.name + 'close', this.$wrapper, this.returnValue);

		// Delete current return value after dialog element is closed
		delete this.returnValue;

	},

	destroy: function () {
		if ( this.state.destroyed ) {
			return;
		}
		this.close();
		this.options.onDestroy.call(this, this.$wrapper);
		this.$doc.trigger(meta.name + 'destroy', this.$wrapper, this.returnValue);
		this.destroyDom();
		this.destroyEvents();
		this.destroyInstance();
		this.state.destroyed = true;
	},

	defaults: {
		content: '',
		onCreate: function () {},
		onShow: function () {},
		onClose: function () {},
		onDestroy: function () {},
		classes: {
			wrapper: meta.ns.htmlClass,
			isVisible: 'is-visible',
			isHidden: 'is-hidden',
			dialogBackdrop: meta.ns.htmlClass + 'Backdrop'
		}
	}

});

module.exports = function ( _options ) {
	var options = _options || {};
	return new Dialog({
		content: options.content,
		onCreate: options.onCreate,
		onShow: options.onShow,
		onClose: options.onClose,
		onDestroy: options.onDestroy,
		classes: options.classes
	});
};
module.exports.defaults = Dialog.prototype.defaults;
