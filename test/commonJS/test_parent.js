var parentClass = require('../../src/parent/index');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// This test focuses on iframe creation and it's relationship to the parent

describe('iFrame url test', function () {
	var childPostMessage;
	var simWindow = {
		addEventListener: function (id, func) { childPostMessage = func; }
	};
	var params = {
        testParam: 'testMe'
	};
	var iframe;
	var url = 'http://www.site.com/?testParam=testMe&amp;width=640&amp;height=360&amp;widgetId=';

	beforeEach(function () {
		iframe = parentClass({
			root: simWindow,
			protocol: 'http:',
			domain: 'www.site.com',
			path: '',
			id: '0jf28320h',
			width: 640,
			height: 360,
			params: params
		});
	});
	it('should be able to receive a message from a child', function () {
		var stub = sinon.stub();
		iframe.element = {
			contentWindow: {
				'postMessage': stub
			}
		};
		childPostMessage({
			data: {
				method: 'addMethod',
				arguments: [
					'testMethod'
				],
				widgetId: iframe.data.widgetId
			}
		});
		iframe.api.testMethod('test');
		/*jshint -W030 */
		expect(stub).to.have.been.called;
		expect(stub.firstCall.args[0].id).to.equal(iframe.data.widgetId);
		expect(stub.firstCall.args[0].method).to.equal('testMethod');
		expect(stub.firstCall.args[0].arguments).to.contain('test');
		// creates iframe.api.testMethod, now we need to call that method
	});

	it('should be able recieve a dispatch request from the child', function () {

	});

	it('should produce the correct url with widgetId', function () {
		if (iframe.data.src !== url + iframe.data.widgetId) {
			throw new Error('test method not returning correct string');
		}

	});
});
