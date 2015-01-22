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