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

	this.options.onCreate.call(this, this.$el);
	this.$doc.trigger(meta.name + 'create', this.$el);

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
		this.$dialogContainer = $(this.options.dialogContainer);
		this.$backdropContainer = $(this.options.backdropContainer);
		this.$lastFocusedEl = $();

		this.$el = $('<div />', {
			'class': this.options.classes.wrapper,
			role: 'dialog',
			'aria-hidden': true
		});
		this.$el.addClass(this.options.classes.isHidden);

		this.setContent(this.options.content);

		this.$dialogContainer.append(this.$el);

	},

	cacheDialogActionElements: function () {
		if ( this.options.userInteraction ) {
			this.$dialogActionConfirm = this.$el.find('[data-dialog-action="confirm"]');
			this.$dialogActionCancel = this.$el.find('[data-dialog-action="cancel"]');
			this.$dialogActionPromptInput = this.$el.find('[data-dialog-action="prompt-input"]');
		}
	},

	cacheAutofocusElements: function () {

		// Find last element with "autofocus" attribute
		this.$autoFocusEl = this.$el.find('[autofocus]').last();

		// If that element doesn’t exist, use wrapper as programmably focusable element
		if ( !this.$autoFocusEl.length ) {
			this.$el.attr('tabindex', -1);
			this.$autoFocusEl = this.$el;
		}

	},

	cacheTabbableElements: function () {

		this.$tabbableElements = this.$el.find([
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
			this.$tabbableElements = this.$el;
		}

	},

	destroyDom: function () {

		this.$el.remove();

	},

	setupEvents: function () {

		var _show = $.proxy(function () { this.show(); }, this);
		var _close = $.proxy(function () { this.close(); }, this);
		var _destroy = $.proxy(function () { this.destroy(); }, this);
		var _confirm, _cancel;


		this.$el.on('click' + this.ens, '[data-dialog-action="show"]', _show);
		this.$el.on('click' + this.ens, '[data-dialog-action="close"]', _close);
		this.$el.on('click' + this.ens, '[data-dialog-action="destroy"]', _destroy);

		if ( this.options.userInteraction ) {

			_confirm = $.proxy(function () {
				if ( this.$dialogActionPromptInput.length ) {
					this.destroy(this.$dialogActionPromptInput.val());
				} else {
					this.destroy(true);
				}
			}, this);
			_cancel = $.proxy(function () {
				if ( this.$dialogActionPromptInput.length ) {
					this.destroy(null);
				} else {
					this.destroy(false);
				}
			}, this);

			this.$el.on('click' + this.ens, '[data-dialog-action="confirm"]', _confirm);
			this.$el.on('click' + this.ens, '[data-dialog-action="cancel"]', _cancel);

		}

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
				$target.closest(this.$el).length === 0
			) {
				if ( this.options.userInteraction ) {
					if ( this.$dialogActionPromptInput.length ) {
						this.destroy(null);
					} else if ( this.$dialogActionCancel.length ) {
						this.destroy(false);
					}
				} else {
					this.close();
				}
			}

		}, this));

		this.$doc.on('keydown' + this.ens, $.proxy(function ( e ) {

			var firstEl, lastEl;

			// Not a TAB, ignore it...
			if ( e.which !== 9 || this.$el.hasClass('is-hidden') ) {
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
		this.$el.off(this.ens);
		this.destroyGlobalEvents();
	},

	/**
	 * @param {Mixed} content
	 */
	setContent: function ( content ) {
		this.$el.html(content);
		this.cacheDialogActionElements();
		this.cacheAutofocusElements();
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

		this.$el.attr('aria-hidden', false);
		this.$el.addClass(this.options.classes.isVisible);
		this.$el.removeClass(this.options.classes.isHidden);
		this.$backdropContainer.addClass(this.options.classes.dialogBackdrop);

		// Store last focused element so we can return focus prior to showing dialog
		this.$lastFocusedEl = $(document.activeElement);
		// Autofocus last focusable element inside dialog
		this.$autoFocusEl.focus();

		// Setup global events on next event loop
		// (this is to handle early global event registration)
		setTimeout($.proxy(function () {
			this.setupGlobalEvents();
		}, this), 0);

		this.options.onShow.call(this, this.$el);
		this.$doc.trigger(meta.name + 'show', this.$el);

	},

	/**
	 * @param  {String} type
	 * @param  {Mixed} returnValue
	 */
	_handleClose: function ( type, returnValue ) {

		this.$el.attr('aria-hidden', true);
		this.$el.removeClass(this.options.classes.isVisible);
		this.$el.addClass(this.options.classes.isHidden);
		this.$backdropContainer.removeClass(this.options.classes.dialogBackdrop);

		// Return focus to last focused element prior to showing dialog
		this.$lastFocusedEl.focus();

		this.destroyGlobalEvents();

		if ( typeof returnValue !== 'undefined' ) {
			this.setReturnValue(returnValue);
		}

		if ( type === 'close' ) {

			this.options.onClose.call(this, this.$el, this.returnValue);
			this.$doc.trigger(meta.name + 'close', this.$el, this.returnValue);

		} else if ( type === 'destroy' ) {

			this.options.onDestroy.call(this, this.$el, this.returnValue);
			this.$doc.trigger(meta.name + 'destroy', this.$el, this.returnValue);

		}

		// Delete current return value after dialog element is closed
		delete this.returnValue;

	},

	/**
	 * @param  {Mixed} returnValue
	 */
	close: function ( returnValue ) {

		destroyStateCheck(this);

		if ( !this.state.visible ) {
			return;
		}
		this.state.visible = false;

		if ( this.options.destroyOnClose ) {
			this.destroy(returnValue);
		} else {
			this._handleClose('close', returnValue);
		}

	},

	/**
	 * @param  {Mixed} returnValue
	 */
	destroy: function ( returnValue ) {

		if ( this.state.destroyed ) {
			return;
		}
		this.state.destroyed = true;

		this._handleClose('destroy', returnValue);

		this.destroyDom();
		this.destroyEvents();
		this.destroyInstance();

	},

	defaults: {
		content: '',
		dialogContainer: 'body',
		backdropContainer: 'html',
		destroyOnClose: false,
		userInteraction: false,
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

module.exports = function ( options ) {
	return new Dialog(options || {});
};
module.exports.defaults = Dialog.prototype.defaults;
