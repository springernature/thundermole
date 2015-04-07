'use strict';

var _ = require('underscore');
var api = require('./api');
var http = require('http');
var httpProxy = require('http-proxy');
var StatsD = require('node-statsd');

var APPEND_HEADER_NAME = 'X-Proxy-Appended-Data';

module.exports = thundermole;
module.exports.defaults = {
	routes: {}
};

function thundermole (options) {
	var mole = {};
	options = defaultOptions(options);
	mole.proxy = createProxy();
	mole.server = createServer(mole.proxy, options);
	mole.statsd = createStatsDClient(options);
	mole.listen = mole.server.listen;
	return mole;
}

function defaultOptions (options) {
	options = _.defaults({}, options, thundermole.defaults);
	if (!options.routes.default) {
		throw new Error('No default route is defined');
	}
	return options;
}

function createProxy () {
	var proxy = httpProxy.createProxyServer();
	proxy.on('proxyReq', augmentProxyRequest);
	proxy.on('error', handleError);
	return proxy;
}

function createServer (proxy, options) {
	var server = http.createServer(handleUserRequest.bind(null, proxy, options));
	server.listen = server.listen.bind(server);
	return server;
}

function createStatsDClient (options) {
	return new StatsD(options.statsd || {
		mock: true
	});
}

function handleUserRequest (proxy, options, request, response) {
	api.get(request, options.routes, function (error, apiResponse) {
		if (error) {
			return handleError(error, request, response);
		}
		proxy.web(request, response, {
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
