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
var httpStatus = require('http-status-codes');

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
		var writeHead = response.writeHead;
		response.writeHead = function (code) {
			mole.statsd.increment('proxy_response_' + code);
			writeHead.apply(response, arguments);
		};
		mole.statsd.increment('proxy_response');
		mole.statsd.timing('proxy_response_time', response.timer.end());
	});
	proxy.on('error', function (error) {
		arguments[0].status = httpStatus.BAD_GATEWAY;
		mole.logger.error('Error in HTTP proxy: %s', error.stack);
		mole.statsd.increment('proxy_response_' + arguments[0].status);
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
		response.writeHead(httpStatus.OK);
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
				(apiResponse.redirect_type || httpStatus.MOVED_PERMANENTLY)
			);
			response.writeHead(
				(apiResponse.redirect_type || httpStatus.MOVED_PERMANENTLY),
				apiRedirectHeaders(apiResponse)
			);
			return response.end();
		}
		mole.logger.info('Proxying request %s to %s', request.url, apiResponse.target);
		mole.proxy.web(request, response, {
			append: apiResponse.append,
			set_headers: apiResponse.set_headers,
			target: apiResponse.target
		});
	});
}

function apiRedirectHeaders (apiResponse) {
	return _.extend({Location: apiResponse.redirect}, apiResponse.set_headers || {});
}

function augmentProxyRequest (options, proxyRequest, request, response, proxyOptions) {
	if (options.rewriteHostHeader) {
		proxyRequest.setHeader('Host', parseUrl(proxyOptions.target).host);
	}
	proxyRequest.removeHeader(options.appendHeader);
	proxyRequest.setHeader(options.appendHeader, JSON.stringify(proxyOptions.append || {}));
	if (proxyOptions.set_headers) {
		setProxyRequestHeaders(proxyRequest, proxyOptions.set_headers);
	}
}

function setProxyRequestHeaders (proxyRequest, headers) {
	for (var headerName in headers) {
		if (headers.hasOwnProperty(headerName)) {
			proxyRequest.setHeader(headerName, headers[headerName]);
		}
	}
}

function handleError (error, request, response) {
	if (!error.status) {
		error.status = httpStatus.INTERNAL_SERVER_ERROR;
	}
	response.writeHead(error.status, {
		'Content-Type': 'text/html'
	});
	response.end(buildErrorPage({
		error: error,
		request: request,
		response: response
	}));
}

// Used by default logger
function emptyFunction () {}
