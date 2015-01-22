var testModule = require('../../src/index');
var chai = require('chai');
//var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Sample Test', function () {
	it('should be using mocha', function () {
		if (false) {
			throw new Error('false is true, buckle up...');
		}
	});
	it('should be able to use the module', function () {
		if (testModule.testMethod('test') !== 'test:worked') {
			throw new Error('test method not returning correct string');
		}
	});
});
