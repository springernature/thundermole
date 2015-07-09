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

var request = require('request');

module.exports = describeRequest;

function describeRequest (method, path, headers, testFunction) {
	describe(method + ' request to "' + path + '"' + (headers ? ' with headers' : ''), function () {
		beforeEach(function (done) {
			var self = this;
			request({
				method: method,
				url: self.testAppsConfig.addresses.mole + path,
				headers: headers
			}, function (error, response, body) {
				self.lastResponse = response;
				self.lastResponseBody = body;
				done(error);
			});
		});
		testFunction.call(this);
	});
}

