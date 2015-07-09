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

var _ = require('underscore');
var parseUrl = require('url').parse;
var request = require('request');

module.exports = {
	get: get,
	buildApiRequest: buildApiRequest,
	buildApiRequestUrl: buildApiRequestUrl
};

function get (incomingRequest, routes, done) {
	var apiRequest = module.exports.buildApiRequest(incomingRequest, routes);
	request(apiRequest, function (error, apiResponse, apiResponseBody) {
		error = (error || getApiResponseErrors(apiRequest, apiResponse, apiResponseBody));
		done(error, apiResponseBody);
	});
}

function getApiResponseErrors (apiRequest, apiResponse, apiResponseBody) {
	// jshint maxcomplexity: false
	// jscs:disable disallowMultipleVarDecl, maximumLineLength
	if (apiResponse.statusCode !== 200) {
		return new Error('API (' + apiRequest.url + ') responded with a non-200 status code');
	}
	if (apiResponseBody === null || typeof apiResponseBody !== 'object') {
		return new Error('API (' + apiRequest.url + ') responded with a non-object');
	}
	if (!_.isString(apiResponseBody.target) && !_.isString(apiResponseBody.redirect)) {
		return new Error(
			'API (' + apiRequest.url + ') response does not have a target or redirect property'
		);
	}
	if (apiResponseBody.redirect_type && [301, 302, 303, 307].indexOf(apiResponseBody.redirect_type) === -1) {
		return new Error('API (' + apiRequest.url + ') response redirect_type property is invalid. Should be 301, 302, 303, or 307');
	}
	return null;
}

function buildApiRequest (incomingRequest, routes) {
	var apiRequest = {
		method: 'GET',
		url: module.exports.buildApiRequestUrl(incomingRequest.url, routes),
		qs: {
			resource: parseUrl(incomingRequest.url).path
		},
		headers: {
			Accept: 'application/json'
		},
		json: true
	};
	if (incomingRequest.headers && incomingRequest.headers.cookie) {
		apiRequest.headers.Cookie = incomingRequest.headers.cookie;
	}
	return apiRequest;
}

function buildApiRequestUrl (url, routes) {
	var urlPath = resolveUrlPath(url);
	var firstPathSegment = getFirstPathSegment(urlPath);
	var route = routes[firstPathSegment];
	if (!route) {
		Object.keys(routes).forEach(function (key) {
			if (!route && isRegExpRoute(key)) {
				if (buildRegexpRoute(key).test(urlPath)) {
					route = routes[key];
				}
			}
		});
	}
	return (route || routes.default);
}

function resolveUrlPath (url) {
	var pathName = parseUrl(url).pathname;
	if (pathName) {
		return pathName.replace(/^\//, '');
	}
}

function getFirstPathSegment (pathName) {
	if (pathName) {
		return pathName.split('/').shift();
	}
}

function isRegExpRoute (route) {
	return /^\/.+\/[gim]*$/.test(route);
}

function buildRegexpRoute (route) {
	var chunks = route.split('/');
	var modifiers = chunks.pop();
	var pattern = chunks.slice(1).join('/');
	return new RegExp(pattern, modifiers);
}
