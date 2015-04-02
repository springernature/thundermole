'use strict';

var sinon = require('sinon');

module.exports = {
	createProxyServer: sinon.stub().returns({
		on: sinon.spy(),
		web: sinon.spy()
	})
};
