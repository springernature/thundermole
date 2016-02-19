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

var thundermole = require('../../..');

module.exports = startMole;

function startMole (testAppsConfig, done) {
	var mole = thundermole({
		routes: {
			test: testAppsConfig.addresses.apiTest + '/api/routing',
			incorrect: testAppsConfig.addresses.apiDefault + '/api/incorrect',
			error: testAppsConfig.addresses.apiDefault + '/api/error',
			notfound: testAppsConfig.addresses.apiDefault + '/api/notfound',
			'set-headers': testAppsConfig.addresses.apiDefault + '/api/set-headers',
			redirect: testAppsConfig.addresses.apiDefault + '/api/redirect',
			'/regexp/i': testAppsConfig.addresses.apiDefault + '/api/regexp',
			default: testAppsConfig.addresses.apiDefault + '/api/routing'
		},
		pingUrl: '/ping'
	});
	mole.listen(testAppsConfig.ports.mole, function (error) {
		done(error, mole);
	});
}
