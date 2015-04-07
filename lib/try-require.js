'use strict';

module.exports = tryRequire;

function tryRequire (moduleName) {
	try {
		return require(moduleName);
	} catch (error) {}
}
