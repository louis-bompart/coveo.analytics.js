"use strict";
var storage_1 = require('./storage');
var detector = require('./detector');
exports.STORE_KEY = '__coveo.analytics.history';
exports.MAX_NUMBER_OF_HISTORY_ELEMENTS = 20;
exports.MIN_THRESHOLD_FOR_DUPLICATE_VALUE = 1000 * 60;
exports.MAX_VALUE_SIZE = 75;
var HistoryStore = (function () {
    function HistoryStore(store) {
        this.store = store || storage_1.getAvailableStorage();
        if (!(this.store instanceof storage_1.CookieStorage) && detector.hasCookieStorage()) {
            new storage_1.CookieStorage().removeItem(exports.STORE_KEY);
        }
    }
    ;
    HistoryStore.prototype.addElement = function (elem) {
        elem.internalTime = new Date().getTime();
        this.cropQueryElement(elem);
        var currentHistory = this.getHistoryWithInternalTime();
        if (currentHistory != null) {
            if (this.isValidEntry(elem)) {
                this.setHistory([elem].concat(currentHistory));
            }
        }
        else {
            this.setHistory([elem]);
        }
    };
    HistoryStore.prototype.getHistory = function () {
        var history = this.getHistoryWithInternalTime();
        return this.stripInternalTime(history);
    };
    HistoryStore.prototype.getHistoryWithInternalTime = function () {
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
    HistoryStore.prototype.getMostRecentElement = function () {
        var currentHistory = this.getHistoryWithInternalTime();
        if (currentHistory != null) {
            var sorted = currentHistory.sort(function (first, second) {
                if (first.internalTime == null && second.internalTime == null) {
                    return 0;
                }
                if (first.internalTime == null && second.internalTime != null) {
                    return 1;
                }
                if (first.internalTime != null && second.internalTime == null) {
                    return -1;
                }
                return second.internalTime - first.internalTime;
            });
            return sorted[0];
        }
        return null;
    };
    HistoryStore.prototype.cropQueryElement = function (elem) {
        if (elem.name && elem.name.toLowerCase() == 'query' && elem.value != null) {
            elem.value = elem.value.slice(0, exports.MAX_VALUE_SIZE);
        }
    };
    HistoryStore.prototype.isValidEntry = function (elem) {
        var lastEntry = this.getMostRecentElement();
        if (lastEntry && lastEntry.value == elem.value) {
            return elem.internalTime - lastEntry.internalTime > exports.MIN_THRESHOLD_FOR_DUPLICATE_VALUE;
        }
        return true;
    };
    HistoryStore.prototype.stripInternalTime = function (history) {
        history.forEach(function (part, index, array) {
            delete part.internalTime;
        });
        return history;
    };
    return HistoryStore;
}());
exports.HistoryStore = HistoryStore;
;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStore;
//# sourceMappingURL=history.js.map