/* global beforeEach, describe */
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

