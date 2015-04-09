'use strict';

var _ = require('underscore');
var api = require('./api');
var http = require('http');
var httpProxy = require('http-proxy');
var StatsD = require('node-statsd');
var createTimer = require('./timer');

var APPEND_HEADER_NAME = 'X-Proxy-Appended-Data';

module.exports = thundermole;
module.exports.defaults = {
	routes: {},
	logger: {
		debug: emptyFunction,
		error: emptyFunction,
		info: emptyFunction,
		warn: emptyFunction
	}
};

function thundermole (options) {
	var mole = {};
	options = defaultOptions(options);
	mole.proxy = createProxy(mole, options);
	mole.server = createServer(mole, options);
	mole.statsd = createStatsDClient(mole, options);
	mole.logger = options.logger;
	mole.listen = mole.server.listen;
	return mole;
}

function defaultOptions (options) {
	options = _.defaults({}, options, thundermole.defaults);
	if (!options.routes.default) {
		throw new Error('No default route is defined');
	}
	validateLogger(options.logger);
	return options;
}

function validateLogger (logger) {
	if (typeof logger.debug !== 'function') {
		throw new Error('Logger must have a "debug" method');
	}
	if (typeof logger.error !== 'function') {
		throw new Error('Logger must have an "error" method');
	}
	if (typeof logger.info !== 'function') {
		throw new Error('Logger must have an "info" method');
	}
	if (typeof logger.warn !== 'function') {
		throw new Error('Logger must have a "warn" method');
	}
}

function createProxy (mole) {
	var proxy = httpProxy.createProxyServer();
	proxy.on('proxyReq', augmentProxyRequest);
	proxy.on('error', function (error) {
		mole.logger.error(error.message);
		mole.statsd.increment('proxy_error');
		handleError.apply(null, arguments);
	});
	return proxy;
}

function createServer (mole, options) {
	var server = http.createServer(handleUserRequest.bind(null, mole, options));
	server.listen = server.listen.bind(server);
	return server;
}

function createStatsDClient (mole, options) {
	return new StatsD(options.statsd || {
		mock: true
	});
}

function handleUserRequest (mole, options, request, response) {
	var apiTimer = createTimer();
	mole.logger.info('Incoming request to %s', request.url);
	mole.statsd.increment('user_request');
	api.get(request, options.routes, function (error, apiResponse) {
		mole.statsd.increment('api_response');
		mole.statsd.timing('api_response_time', apiTimer.end());
		if (error) {
			mole.logger.error(error.message);
			mole.statsd.increment('api_error');
			return handleError(error, request, response);
		}
		mole.logger.info('Proxying request %s to %s', request.url, apiResponse.target);
		mole.proxy.web(request, response, {
			append: apiResponse.append,
			target: apiResponse.target
		});
	});
}

function augmentProxyRequest (proxyRequest, request, response, proxyOptions) {
	proxyRequest.removeHeader(APPEND_HEADER_NAME);
	proxyRequest.setHeader(APPEND_HEADER_NAME, JSON.stringify(proxyOptions.append || {}));
}

function handleError (error, request, response) {
	response.writeHead(500);
	response.end('Something went wrong.\n\n' + error.stack);
}

// Used by default logger
function emptyFunction () {}
