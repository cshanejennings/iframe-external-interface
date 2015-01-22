/*! iframe-external-interface - v1.0.0 - 2015-01-22
* Copyright (c) 2015 [object Object];*/

require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (obj, eventListeners) {
    obj = obj || {};
    eventListeners = eventListeners || {};
    function addEventListener(event, func) {
        if (typeof func === "function") {
            eventListeners[event] = eventListeners[event] || [];
            eventListeners[event].push(func);
        }
    }
    function removeEventListener(event, func) {
        var listeners = eventListeners[event] || [],
            i,
            len = listeners.length;
        for (i = 0; i < len; i += 1) {
            if (listeners[i] === func) {
                listeners.splice(i, 1);
                break;
            }
        }
    }
    function dispatchEvent(event) {
        var eventType = event.type,
            listeners = eventListeners[eventType] || [],
            j,
            len = listeners.length,
            loop = listeners.concat();
        function getFunction(callback) {
            if (typeof callback === "function") {
                return callback;
            }
            return function () { return; };
        }
        for (j = 0; j < len; j += 1) {
            getFunction(loop[j])(event);
        }
    }
    obj.addEventListener = addEventListener;
    obj.removeEventListener = removeEventListener;
    obj.dispatchEvent = dispatchEvent;
    return obj;
};
},{}],2:[function(require,module,exports){
var urlUtil = require('./urlUtil'),
	tagUtil = require('./tagUtil'),
	widgetId = require ('./widgetId');

module.exports = function (data) {
	data.params.width = data.params.width || data.width || null;
	data.params.height = data.params.height || data.height || null;
	data.params.widgetId = widgetId(16);
	var src = urlUtil(data);
	return {
		html: tagUtil(data, src),
		src: src,
		widgetId: data.params.widgetId
	};
};
},{"./tagUtil":4,"./urlUtil":5,"./widgetId":6}],3:[function(require,module,exports){
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

},{"./iFrameData":2,"dispatch-token":1}],4:[function(require,module,exports){
module.exports = function (data, src) {
	var html = '<iframe ';
	html += 'id="' + data.id + '" ';
	html += 'height="' + data.height + '" ';
	html += 'width="' + data.width + '" ';
	html += 'frameborder="0" ';
	html += 'scrolling="no" ';
	html += 'style="border: none; ';
	html += 'overflow: hidden; ';
	html += 'width: 640px; ';
	html += 'height: 360px; ';
	html += 'visibility: visible;" ';
	html += 'src="' + src + '"';
	return html + '></iframe>';
};
},{}],5:[function(require,module,exports){
function stripSlashes(str) {
	str = str || "";
	return str.replace(/^\/+|\/+$/g, '');
}

function getParam(key, val) {
	return key + "=" + encodeURIComponent(val);
}

function getParams(params) {
	var key,
		queryString = [];
	for (key in params) {
		if (params.hasOwnProperty(key)) {
			queryString.push(getParam(key, params[key]));
		}
	}
	if (queryString.length) {
		return "?" + queryString.join("&amp;");
	}
	return "";
}

function getIFrameSrc(data) {
	var protocol = stripSlashes(data.protocol),
		domain = stripSlashes(data.domain),
    	path = stripSlashes(data.path),
    	qs = getParams(data.params);
   	return protocol + "//" + domain + "/" + path + qs;
}

module.exports = function (config) {
	return getIFrameSrc(config);
};
},{}],6:[function(require,module,exports){
// unique identifier for the socket
module.exports = function (l) {
    var text = "",
    	p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    	i;
    for (i=0; i < l; i += 1) {
        text += p.charAt(Math.floor(Math.random() * p.length));
    }
    return text;
};
},{}]},{},[3]);
