/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('lib/thundermole', function () {
	var thundermole, underscore;

	beforeEach(function () {

		underscore = require('../mock/underscore');
		mockery.registerMock('underscore', underscore);

		thundermole = require('../../..');

	});

	it('should be a function', function () {
		assert.isFunction(thundermole);
	});

	it('should have a `defaults` property', function () {
		assert.isObject(thundermole.defaults);
	});

	describe('.defaults', function () {
		var defaults;

		beforeEach(function () {
			defaults = thundermole.defaults;
		});

		it('should have a `routes` property', function () {
			assert.isObject(defaults.routes);
			assert.deepEqual(defaults.routes, {});
		});

	});

	describe('thundermole()', function () {
		var instance, options;

		beforeEach(function () {
			options = {};
			instance = thundermole(options);
		});

		it('should default the options', function () {
			assert.isTrue(underscore.defaults.calledOnce);
			assert.deepEqual(underscore.defaults.firstCall.args[0], {});
			assert.strictEqual(underscore.defaults.firstCall.args[1], options);
			assert.strictEqual(underscore.defaults.firstCall.args[2], thundermole.defaults);
		});

		it('should return an object', function () {
			assert.isObject(instance);
		});

	});

});
