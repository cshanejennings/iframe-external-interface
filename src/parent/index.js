var config,
	urlUtil = require('./urlUtil');

module.exports = function (data) {
	data.params.id = data.id;
	config = data;
	return {
		src: urlUtil(data)
	};
};