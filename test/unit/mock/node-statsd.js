'use strict';

var sinon = require('sinon');

module.exports = sinon.stub().returns({
	increment: sinon.spy(),
	timing: sinon.spy(),
	socket: {
		on: sinon.spy()
	}
});
