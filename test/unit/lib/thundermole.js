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
var mockery = require('mockery');

describe('lib/thundermole', function () {
	var api, createTimer, http, httpProxy, logger, StatsD, thundermole, underscore;

	beforeEach(function () {

		api = require('../mock/api');
		mockery.registerMock('./api', api);

		http = require('../mock/http');
		mockery.registerMock('http', http);

		httpProxy = require('../mock/http-proxy');
		mockery.registerMock('http-proxy', httpProxy);

		logger = require('../mock/logger');

		StatsD = require('../mock/statsd-client');
		mockery.registerMock('statsd-client', StatsD);

		createTimer = require('../mock/timer');
		mockery.registerMock('./timer', createTimer);

		underscore = require('../mock/underscore');
		mockery.registerMock('underscore', underscore);

		thundermole = require('../../../lib/thundermole');

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

		it('should have a `appendHeader` property', function () {
			assert.deepEqual(defaults.appendHeader, 'X-Proxy-Appended-Data');
		});

		it('should have a `rewriteHostHeader` property', function () {
			assert.isTrue(defaults.rewriteHostHeader);
		});

		it('should have a `logger` property', function () {
			assert.isObject(defaults.logger);
		});

		it('should have a `logger.debug` method', function () {
			assert.isFunction(defaults.logger.debug);
		});

		it('should have a `logger.error` method', function () {
			assert.isFunction(defaults.logger.error);
		});

		it('should have a `logger.info` method', function () {
			assert.isFunction(defaults.logger.info);
		});

		it('should have a `logger.warn` method', function () {
			assert.isFunction(defaults.logger.warn);
		});

		it('should have a `pingUrl` property', function () {
			assert.isNull(defaults.pingUrl);
		});

	});

	describe('thundermole()', function () {
		var instance, options;

		beforeEach(function () {
			options = {
				routes: {
					foo: 'http://foo.api/',
					default: 'http://default.api/'
				},
				appendHeader: 'X-Proxy-Appended-Data',
				rewriteHostHeader: true,
				statsd: {
					host: 'localhost'
				},
				logger: logger,
				pingUrl: '/ping'
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

		it('should create a new StatsD client with the correct options', function () {
			assert.isTrue(StatsD.calledOnce);
			assert.isTrue(StatsD.calledWithNew());
			assert.isTrue(StatsD.calledWith(options.statsd));
		});

		it('should create a mock StatsD client if the `statsd` option is not present', function () {
			StatsD.reset();
			delete options.statsd;
			instance = thundermole(options);
			assert.isTrue(StatsD.calledOnce);
			assert.isTrue(StatsD.calledWithNew());
			assert.deepEqual(StatsD.firstCall.args[0], {mock: true});
		});

		it('should throw if the `logger` option does not have a `debug` method', function () {
			delete options.logger.debug;
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have a "debug" method');
			options.logger.debug = '...';
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have a "debug" method');
		});

		it('should throw if the `logger` option does not have an `error` method', function () {
			delete options.logger.error;
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have an "error" method');
			options.logger.error = '...';
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have an "error" method');
		});

		it('should throw if the `logger` option does not have an `info` method', function () {
			delete options.logger.info;
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have an "info" method');
			options.logger.info = '...';
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have an "info" method');
		});

		it('should throw if the `logger` option does not have a `warn` method', function () {
			delete options.logger.warn;
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have a "warn" method');
			options.logger.warn = '...';
			assert.throws(function () {
				instance = thundermole(options);
			}, 'Logger must have a "warn" method');
		});


		it('should create an HTTP proxy', function () {
			assert.isTrue(httpProxy.createProxyServer.calledOnce);
		});

		it('should add a handler for the HTTP proxy "proxyReq" event', function () {
			assert.isTrue(instance.proxy.on.withArgs('proxyReq').calledOnce);
			assert.isFunction(instance.proxy.on.withArgs('proxyReq').firstCall.args[1]);
		});

		describe('HTTP proxy "proxyReq" handler', function () {
			var proxyOptions, proxyReqHandler, proxyRequest, request, response;

			beforeEach(function () {
				proxyOptions = {
					target: 'http://foo:1234/',
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

			it('should set the `Host` header to the target host', function () {
				assert.isTrue(proxyRequest.setHeader.withArgs('Host', 'foo:1234').calledOnce);
			});

			it('should not set the `Host` header to the target host if `options.rewriteHostHeader` is `false`', function () {
				options.rewriteHostHeader = false;
				proxyRequest.setHeader.reset();
				instance = thundermole(options);
				proxyReqHandler = instance.proxy.on.withArgs('proxyReq').firstCall.args[1];
				proxyReqHandler(proxyRequest, request, response, proxyOptions);
				assert.isFalse(proxyRequest.setHeader.withArgs('Host').called);
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

			it('should set custom headers if `proxyOptions.set_headers` is set', function () {
				proxyOptions.set_headers = {
					'X-Foo': 'bar',
					'X-Bar': 'baz'
				};
				proxyReqHandler(proxyRequest, request, response, proxyOptions);
				assert.isTrue(proxyRequest.setHeader.withArgs('X-Foo', 'bar').calledOnce);
				assert.isTrue(proxyRequest.setHeader.withArgs('X-Bar', 'baz').calledOnce);
			});

		});

		it('should add a handler for the HTTP proxy "proxyRes" event', function () {
			assert.isTrue(instance.proxy.on.withArgs('proxyRes').calledOnce);
			assert.isFunction(instance.proxy.on.withArgs('proxyRes').firstCall.args[1]);
		});

		describe('HTTP proxy "proxyRes" handler', function () {
			var proxyOptions, proxyResHandler, proxyResponse, request, response;

			beforeEach(function () {
				proxyOptions = {
					append: {
						foo: 'bar'
					}
				};
				proxyResHandler = instance.proxy.on.withArgs('proxyRes').firstCall.args[1];
				proxyResponse = new http.ServerResponse();
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				response.timer = createTimer();
				response.timer.end.returns(100);
				proxyResHandler(proxyResponse, request, response, proxyOptions);
			});

			it('should increment the `proxy_response` statistic', function () {
				assert.isTrue(instance.statsd.increment.withArgs('proxy_response').calledOnce);
			});

			it('should set the `proxy_response_time` statistic with the response timer', function () {
				assert.isTrue(instance.statsd.timing.withArgs('proxy_response_time', 100).calledOnce);
			});

			it('should increment the `proxy_response_404` statistic on 404 responses', function () {
				response.writeHead(404);
				assert.isTrue(instance.statsd.increment.withArgs('proxy_response_404').calledOnce);
			});

			it('should increment the `proxy_response_500` statistic on 500 responses', function () {
				response.writeHead(500);
				assert.isTrue(instance.statsd.increment.withArgs('proxy_response_500').calledOnce);
			});

		});

		it('should add a handler for the HTTP proxy "error" event', function () {
			assert.isTrue(instance.proxy.on.withArgs('error').calledOnce);
			assert.isFunction(instance.proxy.on.withArgs('error').firstCall.args[1]);
		});

		describe('HTTP proxy "error" handler', function () {
			var error, proxyErrorHandler, request, response;

			beforeEach(function () {
				error = new Error();
				proxyErrorHandler = instance.proxy.on.withArgs('error').firstCall.args[1];
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				proxyErrorHandler(error, request, response);
			});

			it('should increment the `proxy_error` statistic', function () {
				assert.isTrue(instance.statsd.increment.withArgs('proxy_error').calledOnce);
			});

			it('should increment the `proxy_response_502` statistic', function () {
				assert.isTrue(instance.statsd.increment.withArgs('proxy_response_502').calledOnce);
			});

			it('should respond with a `502` status code', function () {
				assert.isTrue(response.writeHead.withArgs(502).calledOnce);
				assert.isObject(response.writeHead.withArgs(502).firstCall.args[1]);
				assert.strictEqual(response.writeHead.withArgs(502).firstCall.args[1]['Content-Type'], 'text/html');
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

		describe('HTTP server "request" handler (no ping)', function () {
			var request, response, serverRequestHandler;

			beforeEach(function () {
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				request.url = '/';
				serverRequestHandler = http.createServer.firstCall.args[0];
				serverRequestHandler(request, response);
			});

			it('should increment the `user_request` statistic', function () {
				assert.isTrue(instance.statsd.increment.withArgs('user_request').calledOnce);
			});

			it('should create a timer', function () {
				assert.isTrue(createTimer.calledOnce);
			});

			it('should call the API', function () {
				assert.isTrue(api.get.withArgs(request, options.routes).calledOnce);
				assert.isFunction(api.get.firstCall.args[2]);
			});

			describe('API "response" handler', function () {
				var apiResponse, apiResponseHandler;

				beforeEach(function () {
					apiResponse = {
						target: 'foo-target',
						append: {
							foo: 'foo-append',
							bar: 'bar-append'
						},
						nonStandardProperty: true
					};
					apiResponseHandler = api.get.firstCall.args[2];
				});

				describe('when API call is successful', function () {

					beforeEach(function () {
						request.headers = {
							'x-forwarded-for': '127.0.0.1',
							cookie: 'name=value',
							host: 'www.nature.com'
						};
						createTimer.firstCall.returnValue.end.returns(100);
						apiResponseHandler(null, apiResponse);
					});

					it('should set the `api_response_time` statistic with the timer set in the handler', function () {
						assert.isTrue(instance.statsd.timing.withArgs('api_response_time', 100).calledOnce);
					});

					it('should increment the `api_response` statistic', function () {
						assert.isTrue(instance.statsd.increment.withArgs('api_response').calledOnce);
					});

					it('should proxy the original request', function () {
						assert.isTrue(instance.proxy.web.withArgs(request, response).calledOnce);
					});

					it('should log the request headers except for cookies', function () {
						assert.isTrue(instance.logger.info.calledWith('Request headers: %s', 'x-forwarded-for=127.0.0.1,host=www.nature.com'));
					});

					it('should pass the proxy the API response `target`, `append`, and `set_headers` properties', function () {
						assert.deepEqual(instance.proxy.web.withArgs(request, response).firstCall.args[2], {
							target: apiResponse.target,
							append: apiResponse.append,
							set_headers: undefined
						});
					});

					it('should not pass the proxy any additional API response properties', function () {
						assert.isUndefined(instance.proxy.web.withArgs(request, response).firstCall.args[2].nonStandardProperty);
					});

				});

				describe('when API call is successful (and responds with headers to set)', function () {

					beforeEach(function () {
						apiResponse = {
							target: 'foo-target',
							append: {},
							set_headers: {
								'X-Foo': 'bar',
								'X-Bar': 'baz'
							}
						};
						apiResponseHandler(null, apiResponse);
					});

					it('should pass the proxy the API response with the expected `set_headers` property', function () {
						assert.deepEqual(instance.proxy.web.withArgs(request, response).firstCall.args[2].set_headers, {
							'X-Foo': 'bar',
							'X-Bar': 'baz'
						});
					});

				});

				describe('when API call is successful (and responds with a redirect)', function () {

					beforeEach(function () {
						apiResponse = {
							redirect: 'foo-redirect',
							set_headers: {foo: 'bar'},
							redirect_type: 303
						};
						apiResponseHandler(null, apiResponse);
					});

					it('should not proxy the request', function () {
						assert.isFalse(instance.proxy.web.calledOnce);
					});

					it('should redirect the original request', function () {
						assert.isTrue(response.writeHead.withArgs(303).calledOnce);
						assert.isObject(response.writeHead.firstCall.args[1]);
						assert.strictEqual(response.writeHead.firstCall.args[1].Location, 'foo-redirect');
						assert.isTrue(response.end.calledOnce);
					});

					it('should default the redirect status code', function () {
						delete apiResponse.redirect_type;
						response.writeHead.reset();
						response.end.reset();
						apiResponseHandler(null, apiResponse);
						assert.isTrue(response.writeHead.withArgs(301).calledOnce);
						assert.isObject(response.writeHead.firstCall.args[1]);
						assert.strictEqual(response.writeHead.firstCall.args[1].Location, 'foo-redirect');
						assert.isTrue(response.end.calledOnce);
					});

					it('should pass the `set_headers` API repsonse on with the redirect', function () {
						underscore.extend.returnsArg(1);
						response.writeHead.reset();
						response.end.reset();
						apiResponseHandler(null, apiResponse);
						assert.strictEqual(underscore.extend.firstCall.args[0].Location, 'foo-redirect');
						assert.strictEqual(underscore.extend.firstCall.args[1].foo, 'bar');
						assert.isTrue(response.writeHead.withArgs(303).calledOnce);
						assert.isObject(response.writeHead.firstCall.args[1]);
						assert.strictEqual(response.writeHead.firstCall.args[1].foo, 'bar');
						assert.isTrue(response.end.calledOnce);
					});

				});

				describe('when API call is unsuccessful', function () {

					beforeEach(function () {
						apiResponseHandler(new Error(), apiResponse);
					});

					it('should increment the `api_response` statistic', function () {
						assert.isTrue(instance.statsd.increment.withArgs('api_response').calledOnce);
					});

					it('should increment the `api_error` statistic', function () {
						assert.isTrue(instance.statsd.increment.withArgs('api_error').calledOnce);
					});

					it('should respond with a `500` status code', function () {
						assert.isTrue(response.writeHead.withArgs(500).calledOnce);
						assert.isObject(response.writeHead.withArgs(500).firstCall.args[1]);
						assert.strictEqual(response.writeHead.withArgs(500).firstCall.args[1]['Content-Type'], 'text/html');
					});

					it('should end the response', function () {
						assert.isTrue(response.end.calledOnce);
						assert.isString(response.end.firstCall.args[0]);
					});

					it('should not proxy the original request', function () {
						assert.isFalse(instance.proxy.web.called);
					});

				});

			});

		});

		describe('HTTP server "request" handler (with ping)', function () {
			var request, response, serverRequestHandler;

			beforeEach(function () {
				request = new http.IncomingMessage();
				response = new http.ServerResponse();
				request.url = '/ping?foo=bar';
				serverRequestHandler = http.createServer.firstCall.args[0];
				serverRequestHandler(request, response);
			});

			it('should respond with a `200` status code', function () {
				assert.isTrue(response.writeHead.withArgs(200).calledOnce);
			});

			it('should end the response', function () {
				assert.isTrue(response.end.withArgs('pong').calledOnce);
			});

			it('should not call the API', function () {
				assert.isFalse(api.get.called);
			});

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

			it('should have a `statsd` property containing the StatsD client', function () {
				assert.strictEqual(instance.statsd, StatsD.firstCall.returnValue);
			});

			it('should have a `logger` property containing the passed in logger', function () {
				assert.strictEqual(instance.logger, logger);
			});

			it('should have a `listen` method which aliases `server.listen`', function () {
				assert.strictEqual(instance.listen, instance.server.listen);
			});

		});

	});

});
