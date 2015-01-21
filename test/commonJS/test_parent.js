var parentClass = require("../../src/parent/index"),
  dispatcher = require('dispatch-token')(),
  chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai');
chai.use(sinonChai);

// This test focuses on iframe creation and it's relationship to the parent


describe('iFrame url test', function() {
	var sendWindowMsg,
		simChildPostMessage = function (message, domain) {
			console.log(message, domain);
		},
		simWindow = {
			addEventListener: function (id, func) { sendWindowMsg = func; }
		},
		simIframe = {
			contentWindow: {
				"postMessage": simChildPostMessage
			}
		},
		params = {
	        testParam: "testMe"
		},
		iframe,
		url = "http://www.site.com/?testParam=testMe&amp;width=640&amp;height=360&amp;socket_id=";

	beforeEach(function () {
		iframe = parentClass({
			"root": simWindow,
		    "protocol": "http:",
		    "domain": "www.site.com",
		    "path": "",
		    "id": "0jf28320h",
		    "width": 640,
		    "height": 360,
		    "params": params
		}).setElement(simIframe);
	});

	it('should produce the correct url with socket_id', function () {
		if (iframe.data.src !== url + iframe.data.socket_id) {
			console.log("different?");
			throw new Error("test method not returning correct string");
		}
		sendWindowMsg({
			data: {
				arguments: [
					"testMethod"
				],
				socket_id: iframe.data.socket_id,
				method: "addMethod"
			}
		});
	});
});