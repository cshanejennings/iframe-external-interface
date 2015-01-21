var dispatcher = require('dispatch-token'),
    widget = dispatcher({
        api: {}
    }),
    socket = dispatcher({
        api: {},
        widget: widget
    }),
    element,
    root;

socket.bind = function (methodName) {
    widget.api[methodName] = function () {
        var params = [],
            message = {
                id : socket.id,
                method : methodName,
                arguments: params.splice.call(arguments, 0)
            };
        try {
            widget.element = widget.element || widget.getElement();
            widget.element.contentWindow.postMessage(message, '*');
        } catch (e) {
            console.error("no access to widget object");
        }
    };
    widget.dispatchEvent({
        type: "methodReady",
        payload: {
            methodName: methodName
        }
    });
};


function checkMessage(event) {
    var data = event.data || {},
        args = data.arguments,
        method = data.method || "";
    if (socket.id !== data.socket_id) {
        return;
    }

    if (data && method) {
        if (method === "dispatchEvent") {
            console.log("dispatchEvent called");
            widget.dispatchEvent(args.shift());
        } else if (method === "addMethod") {
            socket.bind(data.arguments[0]);
        } else {
            console.warn("uncaught " + data.method);
        }
    }
}

function initialize(data) {
    //try { root = window; } catch (ignore) {}
    root = root || data.root;
    widget.data = require('./iFrameData')(data);
    widget.api = socket.api;
    socket.id = widget.data.socket_id;
    widget.setElement = function (el) {
        element = el;
        return widget;
    };
    root.addEventListener('message', checkMessage, false);
    return widget;
}


module.exports = function (data) {
    return initialize(data);
};
