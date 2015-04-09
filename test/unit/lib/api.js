/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('lib/api', function () {
	var api, http, request;

	beforeEach(function () {

		http = require('../mock/http');
		mockery.registerMock('http', http);

		request = sinon.stub();
		mockery.registerMock('request', request);

		api = require('../../../lib/api');

	});

	it('should be an object', function () {
		assert.isObject(api);
	});

	it('should have a `get` method', function () {
		assert.isFunction(api.get);
	});

	describe('.get()', function () {
		var apiRequest, apiResponse, apiResponseBody, incomingRequest, routes;

		beforeEach(function () {
			apiRequest = {
				url: 'foo'
			};
			apiResponse = new http.ServerResponse();
			apiResponseBody = {
				target: 'foo-target'
			};
			incomingRequest = new http.IncomingMessage();
			routes = {
				foo: 'foo-route'
			};
			api.buildApiRequest = sinon.stub().withArgs(incomingRequest, routes).returns(apiRequest);
		});

		it('should call the callback', function (done) {
			request.yields(null, apiResponse, apiResponseBody);
			api.get(incomingRequest, routes, function () {
				done();
			});
		});

		it('should call `request` with the output of `buildApiRequest`', function (done) {
			request.yields(null, apiResponse, apiResponseBody);
			api.get(incomingRequest, routes, function () {
				assert.isTrue(request.withArgs(apiRequest).calledOnce);
				done();
			});
		});

		it('should call `request` with a response handler', function (done) {
			request.yields(null, apiResponse, apiResponseBody);
			api.get(incomingRequest, routes, function () {
				assert.isFunction(request.withArgs(apiRequest).firstCall.args[1]);
				done();
			});
		});

		describe('response handler', function () {
			var callback, responseHandler;

			beforeEach(function () {
				callback = sinon.spy();
				api.get(incomingRequest, routes, callback);
				responseHandler = request.withArgs(apiRequest).firstCall.args[1];
			});

			it('should call the callback with no error and the response body as an object', function () {
				responseHandler(null, apiResponse, apiResponseBody);
				assert.isTrue(callback.calledOnce);
				assert.isTrue(callback.withArgs(null, apiResponseBody).calledOnce);
			});

			it('should call the callback with an error if error is non-null', function () {
				var error = new Error();
				responseHandler(error, apiResponse, apiResponseBody);
				assert.isTrue(callback.calledOnce);
				assert.isTrue(callback.withArgs(error, apiResponseBody).calledOnce);
				assert.strictEqual(callback.firstCall.args[0], error);
			});

			it('should call the callback with an error if `response.statusCode` is not `200`', function () {
				apiResponse.statusCode = 404;
				responseHandler(null, apiResponse, apiResponseBody);
				assert.isTrue(callback.calledOnce);
				assert.isTrue(callback.withArgs(new Error(), apiResponseBody).calledOnce);
				assert.strictEqual(callback.firstCall.args[0].message, 'API (foo) responded with a non-200 status code');
			});

			it('should call the callback with an error if the response body is not an object', function () {
				apiResponseBody = null;
				responseHandler(null, apiResponse, apiResponseBody);
				assert.isTrue(callback.calledOnce);
				assert.isTrue(callback.withArgs(new Error(), apiResponseBody).calledOnce);
				assert.strictEqual(callback.firstCall.args[0].message, 'API (foo) responded with a non-object');
			});

			it('should call the callback with an error if the response body does not have a `target` property', function () {
				delete apiResponseBody.target;
				responseHandler(null, apiResponse, apiResponseBody);
				assert.isTrue(callback.calledOnce);
				assert.isTrue(callback.withArgs(new Error(), apiResponseBody).calledOnce);
				assert.strictEqual(callback.firstCall.args[0].message, 'API (foo) response does not have a target property');
			});

		});

	});

	it('should have a `buildApiRequest` method', function () {
		assert.isFunction(api.buildApiRequest);
	});

	describe('.buildApiRequest()', function () {
		var builtRequest, incomingRequest, routes;

		beforeEach(function () {
			incomingRequest = new http.IncomingMessage();
			incomingRequest.url = 'http://example.com/foo/bar?baz=qux';
			incomingRequest.headers.cookie = 'cookies!';
			routes = {
				foo: 'foo-route'
			};
			api.buildApiRequestUrl = sinon.stub().withArgs(incomingRequest.url, routes).returns('foo');
			builtRequest = api.buildApiRequest(incomingRequest, routes);
		});

		it('should return an object', function () {
			assert.isObject(builtRequest);
		});

		describe('returned object', function () {

			it('should have a `method` property set to "GET"', function () {
				assert.strictEqual(builtRequest.method, 'GET');
			});

			it('should have a `url` property set to the output of `buildApiRequestUrl`', function () {
				assert.isTrue(api.buildApiRequestUrl.withArgs(incomingRequest.url, routes).calledOnce);
				assert.strictEqual(builtRequest.url, 'foo');
			});

			it('should have a `qs` property set to an object', function () {
				assert.isObject(builtRequest.qs);
			});

			it('should have a `qs.resource` property set to the path/query of the original request', function () {
				assert.strictEqual(builtRequest.qs.resource, '/foo/bar?baz=qux');
			});

			it('should have a `headers` property set to an object', function () {
				assert.isObject(builtRequest.headers);
			});

			it('should have a `headers.Accept` property set to "application/json"', function () {
				assert.deepEqual(builtRequest.headers.Accept, 'application/json');
			});

			it('should have a `headers.Cookie` property set to the cookies from the original request', function () {
				assert.deepEqual(builtRequest.headers.Cookie, 'cookies!');
			});

			it('should have a `json` property set to `true`', function () {
				assert.isTrue(builtRequest.json);
			});

		});

	});

	it('should have a `buildApiRequestUrl` method', function () {
		assert.isFunction(api.buildApiRequestUrl);
	});

	describe('.buildApiRequestUrl()', function () {
		var routes;

		beforeEach(function () {
			routes = {
				foo: 'foo-route',
				bar: 'bar-route',
				default: 'default-route'
			};
		});

		it('should return the expected URL when a route is matched', function () {
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/foo', routes), 'foo-route');
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/bar', routes), 'bar-route');
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/foo/baz', routes), 'foo-route');
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/foo/bar/baz', routes), 'foo-route');
		});

		it('should return a default URL when no route is matched', function () {
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/', routes), 'default-route');
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/baz', routes), 'default-route');
			assert.strictEqual(api.buildApiRequestUrl('http://example.com/baz/foo', routes), 'default-route');
		});

	});

});
