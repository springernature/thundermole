/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');

describe('lib/thundermole', function () {
	var thundermole;

	beforeEach(function () {
		thundermole = require('../../..');
	});

	it('should be a function', function () {
		assert.isFunction(thundermole);
	});

});
