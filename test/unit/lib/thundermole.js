/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('lib/thundermole', function () {
	var http, httpProxy, thundermole, underscore;

	beforeEach(function () {

		http = require('../mock/http');
		mockery.registerMock('http', http);

		httpProxy = require('../mock/http-proxy');
		mockery.registerMock('http-proxy', httpProxy);

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
			options = {
				routes: {
					foo: 'http://foo.api/',
					default: 'http://default.api/'
				}
			};
			instance = thundermole(options);
		});

		it('should default the options', function () {
			assert.isTrue(underscore.defaults.calledOnce);
			assert.deepEqual(underscore.defaults.firstCall.args[0], {});
			assert.strictEqual(underscore.defaults.firstCall.args[1], options);
			assert.strictEqual(underscore.defaults.firstCall.args[2], thundermole.defaults);
		});

		it('should throw if no default route is defined in the options', function () {
			assert.throws(function () {
				thundermole({
					routes: {}
				});
			}, 'No default route is defined');
		});

		it('should create an HTTP proxy', function () {
			assert.isTrue(httpProxy.createProxyServer.calledOnce);
		});

		it('should add a handler for the HTTP proxy "proxyReq" event', function () {
			assert.isTrue(instance.proxy.on.withArgs('proxyReq').calledOnce);
			assert.isFunction(instance.proxy.on.withArgs('proxyReq').firstCall.args[1]);
		});

		describe('"proxyReq" handler', function () {
			var proxyOptions, proxyReqHandler, proxyRequest, request, response;

			beforeEach(function () {
				proxyOptions = {
					append: {
						foo: 'bar'
					}
				};
				proxyReqHandler = instance.proxy.on.withArgs('proxyReq').firstCall.args[1];
				proxyRequest = new http.ClientRequest();
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				proxyReqHandler(proxyRequest, request, response, proxyOptions);
			});

			it('should remove the `X-Proxy-Appended-Data` header from the proxy request', function () {
				assert.isTrue(proxyRequest.removeHeader.withArgs('X-Proxy-Appended-Data').calledOnce);
			});

			it('should set the `X-Proxy-Appended-Data` to a JSON-serialised `proxyOptions.append`', function () {
				assert.isTrue(proxyRequest.setHeader.withArgs('X-Proxy-Appended-Data', '{"foo":"bar"}').calledOnce);
			});

			it('should set the `X-Proxy-Appended-Data` to a JSON-serialised empty object if `proxyOptions.append` is undefined', function () {
				delete proxyOptions.append;
				proxyReqHandler(proxyRequest, request, response, proxyOptions);
				assert.isTrue(proxyRequest.setHeader.withArgs('X-Proxy-Appended-Data', '{}').calledOnce);
			});

		});

		it('should add a handler for the HTTP proxy "error" event', function () {
			assert.isTrue(instance.proxy.on.withArgs('error').calledOnce);
			assert.isFunction(instance.proxy.on.withArgs('error').firstCall.args[1]);
		});

		describe('"error" handler', function () {
			var error, proxyErrorHandler, request, response;

			beforeEach(function () {
				error = new Error();
				proxyErrorHandler = instance.proxy.on.withArgs('error').firstCall.args[1];
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				proxyErrorHandler(error, request, response);
			});

			it('should respond with a `500` status code', function () {
				assert.isTrue(response.writeHead.withArgs(500).calledOnce);
			});

			it('should end the response', function () {
				assert.isTrue(response.end.calledOnce);
				assert.isString(response.end.firstCall.args[0]);
			});

		});

		it('should create an HTTP server', function () {
			assert.isTrue(http.createServer.calledOnce);
			assert.isFunction(http.createServer.firstCall.args[0]);
		});

		describe('HTTP server "request" handler', function () {
			it('should do things');
		});

		it('should bind the HTTP server\'s `listen` method to the server', function () {
			assert.isTrue(instance.server.listen.bind.withArgs().calledOnce);
		});

		it('should return an object', function () {
			assert.isObject(instance);
		});

		describe('returned object', function () {

			it('should have a `proxy` property containing the HTTP proxy', function () {
				assert.strictEqual(instance.proxy, httpProxy.createProxyServer.firstCall.returnValue);
			});

			it('should have a `server` property containing the HTTP server', function () {
				assert.strictEqual(instance.server, http.createServer.firstCall.returnValue);
			});

			it('should have a `listen` method which aliases `server.listen`', function () {
				assert.strictEqual(instance.listen, instance.server.listen);
			});

		});

	});

});
