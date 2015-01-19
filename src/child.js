var JSAPI = {},
    initialized = false,
    iframeId = "",
    api = {},
    root;

function onMessage(event) {
    var data = event.data || {},
        method = JSAPI[data.method] || {},
        args = data.arguments || [];
    if (typeof args !== "object" || args.hasOwnProperty("length")) {
        args = [args];
    }
    if (method && typeof method === "function") {
        data.returnedBy = data.method;
        delete data[method];
        try {
            data.response = method.apply(null, args);
         } catch (e) {
             data.response = "error:" + e;
         }
    }
    if (data.hasOwnProperty("callback")) {
    }
    data.iframeId = iframeId;
    parent.postMessage(data, "*");
}

function post() {
    var c = [];
    c = c.splice.call(arguments, 0);
    parent.postMessage({
        "method" : c.shift(),
        "arguments" : c,
        "iframeId" : iframeId
    }, "*");
}

function addCallback(name, method) {
    JSAPI[name] = method;
    if (initialized) {
        post("addMethod", name);
    }
}

function call(method) {
    if (!method) { return; }
    var params = [];
    params = params.splice.call(arguments,0);
    post(params.shift(), params);
}

function addInitializeCallback() {
    //add JSAPI methods to the parent
    addCallback("initialize", function (iframe) {
        var method;
        iframeId = iframe;
        for (method in JSAPI) {
            post("addMethod", method);
        }
        delete JSAPI["initialize"];
        initialized = true;
        api.objectID = iframeId;
    });
}

api = {
    addCallback: addCallback,
    call: call,
    objectID: iframeId,
    post: post
};

module.exports = function (config) {
    root = config.root;
    iframeId = config.id;

    addInitializeCallback();

    root.addEventListener('message', onMessage, false);

    return api;
};