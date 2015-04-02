/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('lib/thundermole', function () {
	var thundermole, underscore;

	beforeEach(function () {

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
			options = {};
			instance = thundermole(options);
		});

		it('should default the options', function () {
			assert.isTrue(underscore.defaults.calledOnce);
			assert.deepEqual(underscore.defaults.firstCall.args[0], {});
			assert.strictEqual(underscore.defaults.firstCall.args[1], options);
			assert.strictEqual(underscore.defaults.firstCall.args[2], thundermole.defaults);
		});

		it('should create an HTTP proxy');

		it('should add a handler for the HTTP proxy "proxyReq" event');

		describe('"proxyReq" handler', function () {
			it('should remove the `X-Proxy-Appended-Data` header from the proxy request');
			it('should set the `X-Proxy-Appended-Data` to a JSON-serialised `proxyOptions.append`');
			it('should set the `X-Proxy-Appended-Data` to a JSON-serialised empty object if `proxyOptions.append` is undefined');
		});

		it('should add a handler for the HTTP proxy "error" event');

		describe('"error" handler', function () {
			it('should respond with a `500` status code');
			it('should end the response');
		});

		it('should create an HTTP server');

		describe('HTTP server "request" handler', function () {
			it('should do things');
		});

		it('should bind the HTTP server\'s `listen` method to the server');

		it('should return an object', function () {
			assert.isObject(instance);
		});

		describe('returned object', function () {
			it('should have a `proxy` property containing the HTTP proxy');
			it('should have a `server` property containing the HTTP server');
			it('should have a `listen` method which aliases `server.listen`');
		});

	});

});
