'use strict';

var _ = require('underscore');

module.exports = thundermole;
module.exports.defaults = {
	routes: {}
};

function thundermole (options) {
	var mole = {};
	options = defaultOptions(options);
	return mole;
}

function defaultOptions (options) {
	return _.defaults({}, options, thundermole.defaults);
}
