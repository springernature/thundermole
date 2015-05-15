'use strict';

var _ = require('underscore');
var api = require('./api');
var buildErrorPage = require('./error-page');
var createTimer = require('./timer');
var http = require('http');
var httpProxy = require('http-proxy');
var parseUrl = require('url').parse;
var StatsD = require('node-statsd');
var url = require('url');

module.exports = thundermole;
module.exports.defaults = {
	routes: {},
	appendHeader: 'X-Proxy-Appended-Data',
	rewriteHostHeader: true,
	logger: {
		debug: emptyFunction,
		error: emptyFunction,
		info: emptyFunction,
		warn: emptyFunction
	},
	pingUrl: null
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

function createProxy (mole, options) {
	var proxy = httpProxy.createProxyServer();
	proxy.on('proxyReq', augmentProxyRequest.bind(null, options));
	proxy.on('proxyRes', function (proxyResponse, request, response) {
		mole.statsd.increment('proxy_response');
		mole.statsd.timing('proxy_response_time', response.timer.end());
	});
	proxy.on('error', function (error) {
		mole.logger.error('Error in HTTP proxy: %s', error.stack);
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
	var client = new StatsD(options.statsd || {
		mock: true
	});
	client.socket.on('error', function (error) {
		mole.logger.error('Error in StatsD socket: %s', error.stack);
	});
	return client;
}

function handleUserRequest (mole, options, request, response) {
	if (url.parse(request.url).pathname === options.pingUrl) {
		response.writeHead(200);
		return response.end('pong');
	}
	response.timer = createTimer();
	mole.logger.info('Incoming request to %s', request.url);
	mole.statsd.increment('user_request');
	api.get(request, options.routes, function (error, apiResponse) {
		mole.statsd.increment('api_response');
		mole.statsd.timing('api_response_time', response.timer.end());
		if (error) {
			mole.logger.error('Error in API request: %s', error.stack);
			mole.statsd.increment('api_error');
			return handleError(error, request, response);
		}
		if (apiResponse.redirect && !apiResponse.target) {
			mole.logger.info(
				'Redirecting request %s to %s (%d)',
				request.url,
				apiResponse.redirect,
				(apiResponse.redirect_type || 301)
			);
			response.writeHead((apiResponse.redirect_type || 301), {
				Location: apiResponse.redirect
			});
			return response.end();
		}
		mole.logger.info('Proxying request %s to %s', request.url, apiResponse.target);
		mole.proxy.web(request, response, {
			append: apiResponse.append,
			target: apiResponse.target
		});
	});
}

function augmentProxyRequest (options, proxyRequest, request, response, proxyOptions) {
	if (options.rewriteHostHeader) {
		proxyRequest.setHeader('Host', parseUrl(proxyOptions.target).host);
	}
	proxyRequest.removeHeader(options.appendHeader);
	proxyRequest.setHeader(options.appendHeader, JSON.stringify(proxyOptions.append || {}));
}

function handleError (error, request, response) {
	response.writeHead(500);
	response.end(buildErrorPage({
		error: error,
		request: request,
		response: response
	}));
}

// Used by default logger
function emptyFunction () {}
