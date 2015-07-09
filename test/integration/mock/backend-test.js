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

module.exports = startBackendTest;

function startBackendTest (testAppsConfig, done) {
	var routes = {

		'/test': function (request, response) {
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
