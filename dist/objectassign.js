"use strict";
var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var objectAssignPonyfill = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    sources.forEach(function (source) {
        var from = Object(source);
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                output[key] = from[key];
            }
        }
        if (getOwnPropertySymbols) {
            var symbols = getOwnPropertySymbols(from);
            symbols.forEach(function (symbol) {
                if (propIsEnumerable.call(from, symbol)) {
                    output[symbol] = from[symbol];
                }
            });
        }
    });
    return output;
};
exports.ponyfill = objectAssignPonyfill;
exports.assign = typeof Object.assign === 'function' ? Object.assign : objectAssignPonyfill;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.assign;
//# sourceMappingURL=objectassign.js.map