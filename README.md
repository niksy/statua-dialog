# kist-dialog

Simple dialog component.

Features:

* Simple and flexible API
* Best accessibility practices baked in

## Installation

```sh
npm install kist-dialog --save
```

## Usage

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
	wrapper: 'kist-Dialog',
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

### dialog.destroy()

Destroys dialog element. Triggers `onDestroy` callback and corresponding events.

## Examples

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

## Testing

Only manual tests are available.

Run `npm test -- --watch` and open <http://0.0.0.0:8000/> in your browser.

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
