var urlUtil = require("../../src/parent/urlUtil");

describe('iFrame url test', function() {
	var params = {
	        "mIxEdCaseParam": "testMe",
	        "number": 1,
	        "url": "http://my.site.com/my/path/rf243664.json",
	        "another_url": "http://your.site.com/ws/test/v1/c7q37k69.xml",
	        "api_key": "hds94whfewo-9234-8hf4-9fh3-fh94377ehtso",
	        "project_uuid": "fh493f42",
	        "lang": "us_en",
	        "width": 640,
	        "height": 360
		},
		url,
		final = "http://www.my.site.com/my/least-favorite-folder/least_favorite_file.html?mIxEdCaseParam=testMe&amp;number=1&amp;url=http%3A%2F%2Fmy.site.com%2Fmy%2Fpath%2Frf243664.json&amp;another_url=http%3A%2F%2Fyour.site.com%2Fws%2Ftest%2Fv1%2Fc7q37k69.xml&amp;api_key=hds94whfewo-9234-8hf4-9fh3-fh94377ehtso&amp;project_uuid=fh493f42&amp;lang=us_en&amp;width=640&amp;height=360";

	it('should produce the correct src attribute', function () {
		url = urlUtil({
		    "protocol": "http:",
		    "domain": "www.my.site.com",
		    "path": "my/least-favorite-folder/least_favorite_file.html",
		    "id": "0jf28320h",
		    "params": params
		});
		if (url !== final) {
			throw new Error("test method not returning correct string");
		}
	});

	it('should produce src attribute with extra slashes', function () {
		url = urlUtil({
		    "protocol": "http://",
		    "domain": "www.my.site.com/",
		    "path": "/my/least-favorite-folder/least_favorite_file.html/",
		    "id": "0jf28320h",
		    "params": params
		});
		if (url !== final) {
			throw new Error("test method not returning correct string");
		}
	});
});