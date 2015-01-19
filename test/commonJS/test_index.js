var test_module = require("../../src/index"),
  chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Sample Test', function() {
	it('should be using mocha', function() {
		if (false) {
			throw new Error('false is true, buckle up...');
		}
	});
	it('should be able to use the module', function () {
		if (test_module.testMethod("test") !== "test:worked") {
			throw new Error("test method not returning correct string");
		}
	});
});