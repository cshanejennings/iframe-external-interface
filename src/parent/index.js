var userToken = require('dispatch-token')({
        api: {}
    }),
    iFrameData = require('./iFrameData'),
    socket = {
        api: {},
        userToken: userToken
    },
    element,
    root;
function dispatchMethodReady(method) {
    socket.userToken.dispatchEvent({
        type: "methodReady",
        payload: {
            methodName: method
        }
    });
}

socket.bind = function (methodName) {
    var userToken = socket.userToken;
    userToken.api[methodName] = function () {
        var params = [],
            message = {
                id : socket.id,
                method : methodName
            };
        message.arguments = params.splice.call(arguments, 0);
        try {
            userToken.element = userToken.element || userToken.getElement();
            return userToken.element.contentWindow.postMessage(message, '*');
        } catch (e) {
            console.error("no access to userToken object");
        }
    };
    dispatchMethodReady(methodName);
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
            userToken.dispatchEvent(args.shift());
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
    userToken.data = iFrameData(data);
    userToken.api = socket.api;
    socket.id = userToken.data.socket_id;
    userToken.setElement = function (el) {
        element = el;
        return userToken;
    };
    root.addEventListener('message', checkMessage, false);
    return userToken;
}


module.exports = function (data) {
    return initialize(data);
};
