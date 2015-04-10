/* jshint maxstatements: false, maxlen: false */
/* global before */
'use strict';

var async = require('async');
var startApiDefault = require('./mock/api-default');
var startApiTest = require('./mock/api-test');
var startBackendDefault = require('./mock/backend-default');
var startBackendTest = require('./mock/backend-test');
var startMole = require('./mock/mole');

before(function (done) {
	var testAppsConfig = buildTestApplicationsConfig();
	var testApps;
	startTestApplications(testAppsConfig, function (error, result) {
		if (error) {
			return done(error);
		}
		testApps = result;
		done();
	});
});

function buildTestApplicationsConfig () {
	var testAppsConfig = {};
	var ports = testAppsConfig.ports = {};
	var addresses = testAppsConfig.addresses = {};
	ports.mole = process.env.PORT || 6540;
	ports.apiDefault = ports.mole + 1;
	ports.apiTest = ports.mole + 2;
	ports.backendDefault = ports.mole + 3;
	ports.backendTest = ports.mole + 4;
	Object.keys(ports).forEach(function (key) {
		addresses[key] = 'http://localhost:' + ports[key];
	});
	return testAppsConfig;
}

function startTestApplications (testAppsConfig, done) {
	async.parallel({
		apiDefault: startApiDefault.bind(null, testAppsConfig),
		apiTest: startApiTest.bind(null, testAppsConfig),
		backendDefault: startBackendDefault.bind(null, testAppsConfig),
		backendTest: startBackendTest.bind(null, testAppsConfig),
		mole: startMole.bind(null, testAppsConfig)
	}, done);
}
