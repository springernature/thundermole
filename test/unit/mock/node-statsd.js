'use strict';

var sinon = require('sinon');

module.exports = sinon.stub().returns({
	decrement: sinon.spy(),
	gauge: sinon.spy(),
	histogram: sinon.spy(),
	increment: sinon.spy(),
	set: sinon.spy(),
	timing: sinon.spy(),
	unique: sinon.spy()
});
