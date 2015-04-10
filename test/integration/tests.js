/* jshint maxstatements: false, maxlen: false */
/* global describe, it */
'use strict';

var assert = require('proclaim');
var describeRequest = require('./helper/describe-request');

describe('ThunderMole ➞ Default API ➞ Default Backend', function () {

	describeRequest('GET', '/', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello From Backend Default!');
		});

		it('should send the API append data to the backend', function () {
			var backendRequest = this.testApps.backendDefault.lastRequest;
			assert.strictEqual(backendRequest.headers['x-proxy-appended-data'], '{"fromDefaultApi":true}');
		});

	});

	describeRequest('POST', '/', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello From Backend Default!');
		});

	});

	describeRequest('GET', '/foo?bar=baz', null, function () {

		it('should send the full path to the API', function () {
			var apiRequest = this.testApps.apiDefault.lastRequest;
			assert.strictEqual(apiRequest.url, '/api/routing?resource=%2Ffoo%3Fbar%3Dbaz');
		});

	});

	describeRequest('GET', '/', {Cookie: 'foo=bar'}, function () {

		it('should send the `Cookie` header to the API', function () {
			var apiRequest = this.testApps.apiDefault.lastRequest;
			assert.strictEqual(apiRequest.headers.cookie, 'foo=bar');
		});

	});

	describeRequest('GET', '/headers', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello From Backend Default!');
		});

		it('should respond with the expected headers', function () {
			assert.strictEqual(this.lastResponse.headers['x-foo'], 'bar');
			assert.strictEqual(this.lastResponse.headers['x-bar'], 'baz');
		});

	});

	describeRequest('GET', '/400', null, function () {

		it('should respond with a 400 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 400);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Bad Request');
		});

	});

	describeRequest('GET', '/404', null, function () {

		it('should respond with a 404 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 404);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Not Found');
		});

	});

	describeRequest('GET', '/500', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Internal Server Error');
		});

	});

});

describe('ThunderMole ➞ Test API ➞ Test Backend', function () {

	describeRequest('GET', '/test', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello From Backend Test!');
		});

		it('should send the API append data to the backend', function () {
			var backendRequest = this.testApps.backendTest.lastRequest;
			assert.strictEqual(backendRequest.headers['x-proxy-appended-data'], '{"fromTestApi":true}');
		});

	});

	describeRequest('POST', '/test', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello From Backend Test!');
		});

	});

	describeRequest('GET', '/test/foo?bar=baz', null, function () {

		it('should send the full path to the API', function () {
			var apiRequest = this.testApps.apiTest.lastRequest;
			assert.strictEqual(apiRequest.url, '/api/routing?resource=%2Ftest%2Ffoo%3Fbar%3Dbaz');
		});

	});

	describeRequest('GET', '/test', {Cookie: 'foo=bar'}, function () {

		it('should send the `Cookie` header to the API', function () {
			var apiRequest = this.testApps.apiTest.lastRequest;
			assert.strictEqual(apiRequest.headers.cookie, 'foo=bar');
		});

	});

	describeRequest('GET', '/test/404', null, function () {

		it('should respond with a 404 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 404);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Not Found');
		});

	});

});

describe('ThunderMole ➞ Incorrect API', function () {

	describeRequest('GET', '/incorrect', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});

describe('ThunderMole ➞ Erroring API', function () {

	describeRequest('GET', '/error', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});

describe('ThunderMole ➞ Not Found API', function () {

	describeRequest('GET', '/notfound', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});
