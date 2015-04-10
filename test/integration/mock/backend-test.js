'use strict';

var http = require('http');

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
		backend.lastRequest = request;
		(routes[request.url] || routes.default)(request, response);
	});
	backend.listen(testAppsConfig.ports.backendTest, function (error) {
		done(error, backend);
	});
}
