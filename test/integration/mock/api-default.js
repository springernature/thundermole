'use strict';

var http = require('http');

module.exports = startApiDefault;

function startApiDefault (testAppsConfig, done) {
	var routes = {

		'/api/routing': function (request, response) {
			response.writeHead(200);
			response.end(JSON.stringify({
				target: testAppsConfig.addresses.backendDefault,
				append: {}
			}));
		},

		'/api/incorrect': function (request, response) {
			response.writeHead(200);
			response.end(JSON.stringify({}));
		},

		'/api/error': function (request, response) {
			response.writeHead(400);
			response.end(JSON.stringify({}));
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
	api.listen(testAppsConfig.ports.apiDefault, function (error) {
		done(error, api);
	});
}
