'use strict';

var http = require('http');
var httpProxy = require('http-proxy');
var _ = require('underscore');

var APPEND_HEADER_NAME = 'X-Proxy-Appended-Data';

module.exports = thundermole;
module.exports.defaults = {
	routes: {}
};

function thundermole (options) {
	var mole = {};
	options = defaultOptions(options);
	mole.proxy = createProxy();
	mole.server = createServer();
	mole.listen = mole.server.listen;
	return mole;
}

function defaultOptions (options) {
	return _.defaults({}, options, thundermole.defaults);
}

function createProxy () {
	var proxy = httpProxy.createProxyServer();
	proxy.on('proxyReq', augmentProxyRequest);
	proxy.on('error', handleError);
	return proxy;
}

function createServer () {
	var server = http.createServer(handleUserRequest);
	server.listen = server.listen.bind(server);
	return server;
}

function handleUserRequest () {
	// TODO
}

function augmentProxyRequest (proxyRequest, request, response, proxyOptions) {
	proxyRequest.removeHeader(APPEND_HEADER_NAME);
	proxyRequest.setHeader(APPEND_HEADER_NAME, JSON.stringify(proxyOptions.append || {}));
}

function handleError (error, request, response) {
	response.writeHead(500);
	response.end('Something went wrong.\n\n' + error.stack);
}
