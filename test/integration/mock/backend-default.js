'use strict';

var http = require('http');
var parseUrl = require('url').parse;

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

		'/regexp': function (request, response) {
			response.writeHead(200);
			response.end('RegExp 1');
		},

		'/xxregexpxx': function (request, response) {
			response.writeHead(200);
			response.end('RegExp 2');
		},

		'/foo/REGEXP/bar': function (request, response) {
			response.writeHead(200);
			response.end('RegExp 3');
		},

		'/redirected': function (request, response) {
			response.writeHead(200);
			response.end('You got redirected!');
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
		var url = parseUrl(request.url).pathname;
		backend.lastRequest = request;
		(routes[url] || routes.default)(request, response);
	});
	backend.listen(testAppsConfig.ports.backendDefault, function (error) {
		done(error, backend);
	});
}
