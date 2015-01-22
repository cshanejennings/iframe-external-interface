var parentClass = require('../../src/parent/index');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// This test focuses on iframe creation and it's relationship to the parent

describe('iFrame Parent Controller Test', function () {
	var childPostMessage;
	var simWindow = {
		addEventListener: function (id, func) { childPostMessage = func; }
	};
	var messageData = {
		data: {
			method: 'addMethod',
			arguments: [
				'testMethod'
			]
		}
	};
	var params = {
        testParam: 'testMe'
	};
	var iframe;
	var stub;
	var url = 'http://www.site.com/?testParam=testMe&amp;width=640&amp;height=360&amp;widgetId=';

	beforeEach(function () {
		stub = sinon.stub();
		iframe = parentClass({
			root: simWindow,
			protocol: 'http:',
			domain: 'www.site.com',
			path: '',
			id: '0jf28320h',
			width: 640,
			height: 360,
			params: params
		}).setElement({
			contentWindow: {
				'postMessage': stub
			}
		});
		messageData.data.widgetId = iframe.data.widgetId;
	});
	it('should produce the correct url with widgetId', function () {
		if (iframe.data.src !== url + iframe.data.widgetId) {
			throw new Error('test method not returning correct string');
		}

	});
	it('should be able to receive a message from a child', function () {
		childPostMessage(messageData);
		iframe.api.testMethod('test');
		/*jshint -W030 */
		expect(stub).to.have.been.called;
	});
	it('should have correct message signature', function () {
		childPostMessage(messageData);
		iframe.api.testMethod('test');

		var respData = stub.firstCall.args[0];
		expect(respData.id).to.equal(iframe.data.widgetId);
		expect(respData.method).to.equal('testMethod');
		expect(respData.arguments).to.contain('test');
		// creates iframe.api.testMethod, now we need to call that method
	});

	it('should be able to dispatch an event from the child', function () {
		messageData.data.method = 'dispatchEvent';
		messageData.data.arguments = [{
			type: 'test',
			payload: {
				testNode: 'testVal'
			}
		}];
		iframe.addEventListener('test', stub);
		childPostMessage(messageData);
		/*jshint -W030 */
		expect(stub).to.have.been.called;
	});
});
