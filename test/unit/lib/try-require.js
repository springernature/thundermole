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
