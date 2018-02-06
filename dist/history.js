"use strict";
var storage_1 = require('./storage');
exports.STORE_KEY = '__coveo.analytics.history';
exports.MAX_NUMBER_OF_HISTORY_ELEMENTS = 20;
var HistoryStore = (function () {
    function HistoryStore(store) {
        this.store = store || storage_1.getAvailableStorage();
    }
    ;
    HistoryStore.prototype.addElement = function (elem) {
        if (this.getHistory() != null) {
            this.setHistory([elem].concat(this.getHistory()));
        }
        else {
            this.setHistory([elem]);
        }
    };
    HistoryStore.prototype.getHistory = function () {
        try {
            return JSON.parse(this.store.getItem(exports.STORE_KEY));
        }
        catch (e) {
            return [];
        }
    };
    HistoryStore.prototype.setHistory = function (history) {
        try {
            this.store.setItem(exports.STORE_KEY, JSON.stringify(history.slice(0, exports.MAX_NUMBER_OF_HISTORY_ELEMENTS)));
        }
        catch (e) { }
    };
    HistoryStore.prototype.clear = function () {
        try {
            this.store.removeItem(exports.STORE_KEY);
        }
        catch (e) { }
    };
    return HistoryStore;
}());
exports.HistoryStore = HistoryStore;
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStore;
//# sourceMappingURL=history.js.map