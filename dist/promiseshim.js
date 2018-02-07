"use strict";
function shim() {
    var doShim = function (promiseInstance) {
        if (typeof promiseInstance.prototype['finally'] != 'function') {
            promiseInstance.prototype['finally'] = function finallyPolyfill(callback) {
                var constructor = this.constructor;
                return this.then(function (value) {
                    return constructor.resolve(callback()).then(function () {
                        return value;
                    });
                }, function (reason) {
                    return constructor.resolve(callback()).then(function () {
                        throw reason;
                    });
                });
            };
        }
        var rethrowError = function (self) {
            self.then(null, function (err) {
                setTimeout(function () {
                    throw err;
                }, 0);
            });
        };
        if (typeof promiseInstance.prototype['done'] !== 'function') {
            promiseInstance.prototype['done'] = function (onFulfilled, onRejected) {
                var self = arguments.length ? this.then.apply(this, arguments) : this;
                rethrowError(self);
                return this;
            };
        }
        if (typeof promiseInstance.prototype['fail'] !== 'function') {
            promiseInstance.prototype['fail'] = function (onFulfilled, onRejected) {
                var self = arguments.length ? this.catch.apply(this, arguments) : this;
                rethrowError(self);
                return this;
            };
        }
    };
    var globalPromise = window['Promise'];
    var localPromise = Promise;
    if (globalPromise) {
        doShim(globalPromise);
    }
    if (localPromise) {
        doShim(localPromise);
    }
}
exports.shim = shim;
//# sourceMappingURL=promiseshim.js.map