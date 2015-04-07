/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var sinon = require('sinon');

describe('lib/timer', function () {
	var createTimer;

	beforeEach(function () {
		createTimer = require('../../../lib/timer');
	});

	it('should be a function', function () {
		assert.isFunction(createTimer);
	});

	describe('createTimer()', function () {

		it('should return an object', function () {
			assert.isObject(createTimer());
		});

		describe('returned object', function () {
			var timer;

			beforeEach(function () {
				sinon.stub(Date.prototype, 'getTime');
				Date.prototype.getTime.returns(1000000000000);
				timer = createTimer();
			});

			afterEach(function () {
				Date.prototype.getTime.restore();
			});

			it('should have a `start` property set to the timestamp the object was created at', function () {
				assert.strictEqual(timer.start, 1000000000000);
			});

			it('should have an `end` method', function () {
				assert.isFunction(timer.end);
			});

			describe('.end()', function () {

				it('should return the current time minus the start time', function () {
					Date.prototype.getTime.returns(1000000000200);
					assert.strictEqual(timer.end(), 200);
				});

			});

		});

	});

});
