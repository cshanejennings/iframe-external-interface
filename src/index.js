var dispatcher = require('dispatch-token');
var widget = dispatcher();
var postMessageBus = {
    api: {},
    widget: widget
};
var element;
var root;

// bind adds a method to the widget api with name methodName
// the resulting function will take arguments and route those
// arguments to the appropriate function in the child, using
// the widgetId, the methodName and an arguments variable
postMessageBus.bind = function (methodName) {
    widget.api[methodName] = function () {
        var params = [];
        var message = {
            id: postMessageBus.id,
            method: methodName,
            arguments: params.splice.call(arguments, 0)
        };
        try {
            // TODO: Create widget.element
            element = element || widget.getElement();
            element.contentWindow.postMessage(message, '*');
        } catch (e) {
            console.error('no access to widget object');
        }
    };
    widget.dispatchEvent({
        type: 'methodReady',
        payload: {
            methodName: methodName
        }
    });
};

// The methods that can be received from the child are fixed
// for now.
function receiveMessageFromChild (event) {
    var data = event.data || {};
    var args = data.arguments;
    var method = data.method || '';
    if (postMessageBus.id !== data.widgetId) {
        return;
    }

    if (data && method) {
        if (method === 'dispatchEvent') {
            widget.dispatchEvent(args.shift());
        } else if (method === 'addMethod') {
            // Add method will change the api signature for the child api
            postMessageBus.bind(data.arguments[0]);
        } else {
            console.warn('uncaught ' + data.method);
        }
    }
}

function initialize (data) {
    //try { root = window; } catch (ignore) {}
    root = root || data.root;
    widget.data = require('./iFrameData')(data);
    widget.api = postMessageBus.api;
    postMessageBus.id = widget.data.widgetId;
    widget.setElement = function (el) {
        element = el;
        return widget;
    };
    root.addEventListener('message', receiveMessageFromChild, false);
    return widget;
}

module.exports = function (data) {
    return initialize(data);
};
