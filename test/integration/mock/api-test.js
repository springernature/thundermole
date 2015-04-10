'use strict';

var http = require('http');

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
		api.lastRequest = request;
		(routes[request.url] || routes.default)(request, response);
	});
	api.listen(testAppsConfig.ports.apiTest, function (error) {
		done(error, api);
	});
}
