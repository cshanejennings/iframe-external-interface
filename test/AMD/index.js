var test_module = require("../../src/index"),
  chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Browser context test', function() {
	it('should have access to the window', function() {
		if (!window) {
			throw new Error('no window object');
		}
	});
});