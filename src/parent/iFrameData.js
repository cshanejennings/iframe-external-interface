var urlUtil = require('./urlUtil'),
	tagUtil = require('./tagUtil'),
	socketId = require ('./socketId');

module.exports = function (data) {
	data.params.width = data.params.width || data.width || null;
	data.params.height = data.params.height || data.height || null;
	data.params.socket_id = socketId(16);
	var src = urlUtil(data);
	return {
		html: tagUtil(data, src),
		src: src,
		socket_id: data.params.socket_id
	};
};