'use strict';

var http = require('http');

module.exports = startBackendDefault;

function startBackendDefault (testAppsConfig, done) {
	var routes = {

		'/': function (request, response) {
			response.writeHead(200);
			response.end('Hello From Backend Default!');
		},

		'/headers': function (request, response) {
			response.writeHead(200, {
				'X-Foo': 'bar',
				'X-Bar': 'baz'
			});
			response.end('Hello From Backend Default!');
		},

		'/400': function (request, response) {
			response.writeHead(400);
			response.end('Bad Request');
		},

		'/500': function (request, response) {
			response.writeHead(500);
			response.end('Internal Server Error');
		},

		default: function (request, response) {
			response.writeHead(404);
			response.end('Not Found');
		}

	};
	var backend = http.createServer(function (request, response) {
		(routes[request.url] || routes.default)(request, response);
	});
	backend.listen(testAppsConfig.ports.backendDefault, function (error) {
		done(error, backend);
	});
}
