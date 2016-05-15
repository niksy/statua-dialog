# kist-dialog

Simple dialog component.

Features:

* Simple and flexible API
* [Best][a11y-01] [accessibility][a11y-02] [practices][a11y-03] [baked in][a11y-04]

## Install

```sh
npm install kist-dialog --save
```

## Usage

```js
var dialog = require('kist-dialog');

var modal = dialog({
	content: '<p>Some content</p><button type="button" class="show">Show</button><button type="button" class="close" autofocus="autofocus">Close</button>',
	onCreate: function ( $dialog ) {
		// Dialog created!
	},
	onShow: function ( $dialog ) {
		// Dialog shown!
	},
	onClose: function ( $dialog, returnValue ) {
		// Dialog closed!
	}
});

// Setting custom content
modal.setContent('<p>New custom content</p><button type="button" class="close">Close</button>');

// Show dialog
modal.show();

// Close dialog
modal.close();

// Destroy dialog
modal.destroy();

// Set return value
modal.setReturnValue(42);
```

More usage examples are available in [manual tests](#test).

## API

### dialog([options])

Returns: `Dialog`

Creates new dialog instance

#### options

Type: `Object`

Options for dialog element.

##### content

Type: `Mixed`  
Default: ` `

Content which will be used for dialog element.

##### dialogContainer

Type: `String|Element|jQuery`  
Default: `body`

Element which will contain dialog.

##### backdropContainer

Type: `String|Element|jQuery`  
Default: `html`

Element which will contain backdrop (overlay) for dialog.

##### destroyOnClose

Type: `Boolean`  
Default: `false`

By default, closing dialog will only add necessary HTML classes and change ARIA attributes. Enable this option if you want to implicitly destroy dialog instance when calling `.close()` method or triggering click event on `[data-dialog-action="close"]` element.

##### userInteraction

Type: `Boolean`  
Default: `false`

Enable this option if you want to handle user interactions such as in standard [`window.confirm`][window-confirm] and [`window.prompt`][window-prompt] boxes with [special dialog actions](#user-interaction).

##### onCreate

Type: `Function`  
Default: noop  
Arguments: [Dialog element]  
Event: `dialogcreate`  

Callback when dialog element is created.

##### onShow

Type: `Function`  
Default: noop  
Arguments: [Dialog element]  
Event: `dialogshow`

Callback when dialog element is shown.

##### onClose

Type: `Function`  
Default: noop  
Arguments: [Dialog element, Return value]  
Event: `dialogclose`

Callback when dialog element is closed.

##### onDestroy

Type: `Function`  
Default: noop  
Arguments: [Dialog element]  
Event: `dialogdestroy`

Callback when dialog element is detroyed.

##### classes

Type: `Object`

HTML classes for dialog element.

Default values:

```js
{
	element: 'kist-Dialog',
	isVisible: 'is-visible',
	isHidden: 'is-hidden',
	dialogBackdrop: 'kist-DialogBackdrop'
}
```

### dialog.show()

Display dialog element. Triggers `onShow` callback and corresponding events.

### dialog.close([returnValue])

Closes dialog element. Triggers `onClose` callback and corresponding events.

#### returnValue

Type: `Mixed`

Return value when current dialog element is closed.

### dialog.destroy([returnValue])

Destroys dialog element. Triggers `onDestroy` callback and corresponding events.

## DOM API

In addition to programmatic API, there is also DOM API through `data-` attributes. You can access it via `data-dialog-action` and corresponding value:

* `[data-dialog-action="show"]`: triggers `dialog.show();`
* `[data-dialog-action="close"]`: triggers `dialog.close();`
* `[data-dialog-action="destroy"]`: triggers `dialog.destroy();`

### User interaction

Enabling `userInteraction` option allows you to use additional dialog actions:

* `[data-dialog-action="confirm"]`: triggers `dialog.destroy();` with `true` as return value, or, if `[data-dialog-action="prompt-input"]` is present, value of that form element
* `[data-dialog-action="cancel"]`: triggers `dialog.destroy();` with `false` as return value, or, if `[data-dialog-action="prompt-input"]` is present, `null`

## Caveats

* If any element (or it’s parent) inside dialog is hidden with `display: none;`, tabbing order will be inconsistent and will make dialog tabbing behavior unpredictable (it will jump from dialog to first element outside dialog). To avoid this, it is better to hide elements with [technique which only visually hides element][visually-hidden].

## Test

Only manual tests are available.

Run `npm test -- --watch` and open <http://0.0.0.0:8000/> in your browser.

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[a11y-01]: https://drublic.de/archive/accessible-dialogs-modals/
[a11y-02]: https://accessibility.oit.ncsu.edu/blog/2013/09/13/the-incredible-accessible-modal-dialog/
[a11y-03]: https://www.nczonline.net/blog/2013/02/12/making-an-accessible-dialog-box/
[a11y-04]: https://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/
[visually-hidden]: http://bitsofco.de/hiding-elements-with-css/#position
[window-confirm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
[window-prompt]: https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt
