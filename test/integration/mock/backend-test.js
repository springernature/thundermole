'use strict';

var http = require('http');
var parseUrl = require('url').parse;

module.exports = startBackendTest;

function startBackendTest (testAppsConfig, done) {
	var routes = {

		'/': function (request, response) {
			response.writeHead(200);
			response.end('Hello From Backend Test!');
		},

		default: function (request, response) {
			response.writeHead(404);
			response.end('Not Found');
		}

	};
	var backend = http.createServer(function (request, response) {
		var url = parseUrl(request.url).pathname;
		backend.lastRequest = request;
		(routes[url] || routes.default)(request, response);
	});
	backend.listen(testAppsConfig.ports.backendTest, function (error) {
		done(error, backend);
	});
}
