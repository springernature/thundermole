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
var describeRequest = require('./helper/describe-request');
var url = require('url');

describe('Thundermole ➞ Default API ➞ Default Backend', function () {

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

	describeRequest('GET', '/foo', null, function () {

		it('should send the request method to the API', function () {
			var query = url.parse(this.testApps.apiDefault.lastRequest.url, true).query;
			assert.strictEqual(query.method, 'GET');
		});

	});

	describeRequest('POST', '/foo', null, function () {

		it('should send the request method to the API', function () {
			var query = url.parse(this.testApps.apiDefault.lastRequest.url, true).query;
			assert.strictEqual(query.method, 'POST');
		});

	});

	describeRequest('GET', '/foo?bar=baz', null, function () {

		it('should send the full path to the API', function () {
			var query = url.parse(this.testApps.apiDefault.lastRequest.url, true).query;
			assert.strictEqual(query.resource, '/foo?bar=baz');
		});

	});

	describeRequest('GET', '/', {Cookie: 'foo=bar'}, function () {

		it('should send the `Cookie` header to the API', function () {
			var apiRequest = this.testApps.apiDefault.lastRequest;
			assert.strictEqual(apiRequest.headers.cookie, 'foo=bar');
		});

	});

	describeRequest('GET', '/', {'User-Agent': 'foo'}, function () {

		it('should send the `User-Agent` header to the API', function () {
			var query = url.parse(this.testApps.apiDefault.lastRequest.url, true).query;
			assert.strictEqual(query.useragent, 'foo');
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

	describeRequest('GET', '/set-headers', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'Hello with added headers!');
		});

		it('should send the expected additional headers to the back-end', function () {
			var backendRequest = this.testApps.backendDefault.lastRequest;
			assert.strictEqual(backendRequest.headers['x-foo'], 'bar');
			assert.strictEqual(backendRequest.headers['x-bar'], 'baz');
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

describe('Thundermole ➞ Default API (via RegExp route) ➞ Default Backend', function () {

	describeRequest('GET', '/regexp', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'RegExp 1');
		});

		it('should send the API append data to the backend', function () {
			var backendRequest = this.testApps.backendDefault.lastRequest;
			assert.strictEqual(backendRequest.headers['x-proxy-appended-data'], '{"fromDefaultApi":true,"regexpRoute":true}');
		});

	});

	describeRequest('GET', '/xxregexpxx', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'RegExp 2');
		});

		it('should send the API append data to the backend', function () {
			var backendRequest = this.testApps.backendDefault.lastRequest;
			assert.strictEqual(backendRequest.headers['x-proxy-appended-data'], '{"fromDefaultApi":true,"regexpRoute":true}');
		});

	});

	describeRequest('GET', '/foo/REGEXP/bar', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'RegExp 3');
		});

		it('should send the API append data to the backend', function () {
			var backendRequest = this.testApps.backendDefault.lastRequest;
			assert.strictEqual(backendRequest.headers['x-proxy-appended-data'], '{"fromDefaultApi":true,"regexpRoute":true}');
		});

	});

});


describe('Thundermole ➞ Test API ➞ Test Backend', function () {

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

	describeRequest('GET', '/test/foo', null, function () {

		it('should send the request method to the API', function () {
			var query = url.parse(this.testApps.apiTest.lastRequest.url, true).query;
			assert.strictEqual(query.method, 'GET');
		});

	});

	describeRequest('POST', '/test/foo', null, function () {

		it('should send the request method to the API', function () {
			var query = url.parse(this.testApps.apiTest.lastRequest.url, true).query;
			assert.strictEqual(query.method, 'POST');
		});

	});

	describeRequest('GET', '/test/foo?bar=baz', null, function () {

		it('should send the full path to the API', function () {
			var query = url.parse(this.testApps.apiTest.lastRequest.url, true).query;
			assert.strictEqual(query.resource, '/test/foo?bar=baz');
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

describe('Thundermole ➞ Incorrect API', function () {

	describeRequest('GET', '/incorrect', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});

describe('Thundermole ➞ Erroring API', function () {

	describeRequest('GET', '/error', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});

describe('Thundermole ➞ Not Found API', function () {

	describeRequest('GET', '/notfound', null, function () {

		it('should respond with a 500 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 500);
		});

	});

});

describe('Thundermole ➞ Redirect API', function () {

	describeRequest('GET', '/redirect', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'You got redirected!');
		});

	});

});


describe('Thundermole ➞ Ping URL', function () {

	describeRequest('GET', '/ping', null, function () {

		it('should respond with a 200 status', function () {
			assert.strictEqual(this.lastResponse.statusCode, 200);
		});

		it('should respond with the expected body', function () {
			assert.strictEqual(this.lastResponseBody, 'pong');
		});

	});

});
