/* jshint maxstatements: false, maxlen: false */
/* global it */
'use strict';

var assert = require('proclaim');
var describeRequest = require('./helper/describe-request');

describeRequest('GET', '/', null, function () {

	it('should respond with the expected status', function () {
		assert.strictEqual(this.lastResponse.statusCode, 200);
	});

	it('should respond with the expected body', function () {
		assert.strictEqual(this.lastResponseBody, 'Hello From Backend Default!');
	});

});
