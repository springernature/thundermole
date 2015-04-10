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
			default: testAppsConfig.addresses.apiDefault + '/api/routing'
		}
	});
	mole.listen(testAppsConfig.ports.mole, function (error) {
		done(error, mole);
	});
}
