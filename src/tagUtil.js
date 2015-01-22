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