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