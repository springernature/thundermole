'use strict';

var http = require('http');
var parseUrl = require('url').parse;

module.exports = startApiTest;

function startApiTest (testAppsConfig, done) {
	var routes = {

		'/api/routing': function (request, response) {
			response.writeHead(200);
			response.end(JSON.stringify({
				target: testAppsConfig.addresses.backendTest,
				append: {}
			}));
		},

		default: function (request, response) {
			response.writeHead(404);
			response.end('Not Found');
		}

	};
	var api = http.createServer(function (request, response) {
		var url = parseUrl(request.url).pathname;
		api.lastRequest = request;
		(routes[url] || routes.default)(request, response);
	});
	api.listen(testAppsConfig.ports.apiTest, function (error) {
		done(error, api);
	});
}
