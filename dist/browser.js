"use strict";
var simpleanalytics_1 = require('./simpleanalytics');
var analytics = require('./index');
var history_1 = require('./history');
var coveoua = global.coveoua || {};
if (coveoua.q) {
    coveoua.q.forEach(function (args) { return simpleanalytics_1.default.apply(void 0, args); });
}
if (!coveoua.disableAutoHistory) {
    var store = new history_1.HistoryStore();
    var historyElement = {
        name: 'PageView',
        value: document.location.toString(),
        time: JSON.stringify(new Date()),
        title: document.title
    };
    store.addElement(historyElement);
}
global.coveoua = simpleanalytics_1.default;
global.coveoanalytics = analytics;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = coveoua;
//# sourceMappingURL=browser.js.map