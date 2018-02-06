"use strict";
var simpleanalytics_1 = require('./simpleanalytics');
var analytics = require('./index');
var coveoua = global.coveoua || {};
global.coveoua = simpleanalytics_1.default;
global.coveoanalytics = analytics;
if (coveoua.q) {
    coveoua.q.forEach(function (args) { return simpleanalytics_1.default.apply(void 0, args); });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = coveoua;
//# sourceMappingURL=browser.js.map