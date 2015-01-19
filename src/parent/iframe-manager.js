function getParam(key, val) {
	return key + "=" + encodeURIComponent(val);
}

function stripSlashes(str) {
	return str.replace(/^\/|\/$/g, '');
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
	var protocol = data.protocol || "",
		domain = stripSlashes(data.domain),
    	path = stripSlashes(data.path),
    	qs = getParams(data.params);
   	return protocol + "//" + domain + "/" + path + qs;
}

module.exports = function (config) {
	config.params.id = config.id;
	var src = getIFrameSrc(config);
	console.log(src);
	return src;
};