// This file is part of Thundermole.
//
// Thundermole is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Thundermole is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Thundermole.  If not, see <http://www.gnu.org/licenses/>.

// jshint maxstatements: false
// jscs:disable disallowMultipleVarDecl, maximumLineLength
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
