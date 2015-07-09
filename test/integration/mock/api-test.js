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

var http = require('http');
var parseUrl = require('url').parse;

module.exports = startApiTest;

function startApiTest (testAppsConfig, done) {
	var routes = {

		'/api/routing': function (request, response) {
			response.writeHead(200);
			response.end(JSON.stringify({
				target: testAppsConfig.addresses.backendTest,
				append: {
					fromTestApi: true
				}
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
