/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('lib/try-require', function () {
	var tryRequire, fooModule;

	beforeEach(function () {
		fooModule = {};
		mockery.registerMock('foo', fooModule);
		tryRequire = require('../../../lib/try-require');
	});

	it('should be a function', function () {
		assert.isFunction(tryRequire);
	});

	describe('tryRequire()', function () {

		it('should return the required module if it exists', function () {
			assert.strictEqual(tryRequire('foo'), fooModule);
		});

		it('should return `undefined` if a module does not exist', function () {
			assert.isUndefined(tryRequire('bar'));
		});

		it('should not throw if a module does not exist', function () {
			assert.doesNotThrow(function () {
				tryRequire('bar');
			});
		});

	});

});
