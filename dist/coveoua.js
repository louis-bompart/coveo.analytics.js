!function(t){function e(o){if(r[o])return r[o].exports;var n=r[o]={exports:{},id:o,loaded:!1};return t[o].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){(function(t){"use strict";var o=r(1),n=r(6),i=r(7),s=t.coveoua||{};if(s.q&&s.q.forEach(function(t){return o["default"].apply(void 0,t)}),!s.disableAutoHistory){var a=new i.HistoryStore,u={name:"PageView",value:document.location.toString(),time:JSON.stringify(new Date),title:document.title};a.addElement(u)}t.coveoua=o["default"],t.coveoanalytics=n,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=s}).call(e,function(){return this}())},function(t,e,r){"use strict";var o=r(2),n=r(4),i=r(5),s=function(){function t(){}return t.prototype.init=function(t,e){if("undefined"==typeof t)throw new Error("You must pass your token when you call 'init'");if("string"==typeof t)e=e||o.Endpoints["default"],this.client=new o.Client({token:t,endpoint:e});else{if("object"!=typeof t||"undefined"==typeof t.sendEvent)throw new Error("You must pass either your token or a valid object when you call 'init'");this.client=t}},t.prototype.send=function(t,e){if("undefined"==typeof this.client)throw new Error("You must call init before sending an event");switch(e=n["default"]({},{hash:window.location.hash},e),t){case"pageview":return void this.client.sendViewEvent({location:window.location.toString(),referrer:document.referrer,language:navigator.language,title:document.title,contentIdKey:i.popFromObject(e,"contentIdKey"),contentIdValue:i.popFromObject(e,"contentIdValue"),contentType:i.popFromObject(e,"contentType"),customData:e});default:throw new Error("Event type: '"+t+"' not implemented")}},t}();e.SimpleAPI=s;var a=new s;e.SimpleAnalytics=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];var o=a[t];if(o)return o.apply(a,e)},Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=e.SimpleAnalytics},function(t,e,r){(function(t){"use strict";function r(t){return t.json().then(function(e){return e.raw=t,e})}e.Version="v15",e.Endpoints={"default":"https://usageanalytics.coveo.com",production:"https://usageanalytics.coveo.com",dev:"https://usageanalyticsdev.coveo.com",staging:"https://usageanalyticsstaging.coveo.com"};var o=function(){function o(t){if("undefined"==typeof t)throw new Error("You have to pass options to this constructor");this.endpoint=t.endpoint||e.Endpoints["default"],this.token=t.token,this.version=t.version||e.Version}return o.prototype.sendEvent=function(e,r){return t(this.getRestEndpoint()+"/analytics/"+e,{method:"POST",headers:this.getHeaders(),mode:"cors",body:JSON.stringify(r),credentials:"include"})},o.prototype.sendSearchEvent=function(t){return this.sendEvent("search",t).then(r)},o.prototype.sendClickEvent=function(t){return this.sendEvent("click",t).then(r)},o.prototype.sendCustomEvent=function(t){return this.sendEvent("custom",t).then(r)},o.prototype.sendViewEvent=function(t){return""===t.referrer&&delete t.referrer,this.sendEvent("view",t).then(r)},o.prototype.getVisit=function(){return t(this.getRestEndpoint()+"/analytics/visit").then(r)},o.prototype.getHealth=function(){return t(this.getRestEndpoint()+"/analytics/monitoring/health").then(r)},o.prototype.getRestEndpoint=function(){return this.endpoint+"/rest/"+this.version},o.prototype.getHeaders=function(){var t={"Content-Type":"application/json"};return this.token&&(t.Authorization="Bearer "+this.token),t},o}();e.Client=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o}).call(e,r(3))},function(t,e){!function(t){"use strict";function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function r(t){return"string"!=typeof t&&(t=String(t)),t}function o(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return m.iterable&&(e[Symbol.iterator]=function(){return e}),e}function n(t){this.map={},t instanceof n?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function i(t){return t.bodyUsed?Promise.reject(new TypeError("Already read")):void(t.bodyUsed=!0)}function s(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function a(t){var e=new FileReader,r=s(e);return e.readAsArrayBuffer(t),r}function u(t){var e=new FileReader,r=s(e);return e.readAsText(t),r}function c(t){for(var e=new Uint8Array(t),r=new Array(e.length),o=0;o<e.length;o++)r[o]=String.fromCharCode(e[o]);return r.join("")}function f(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function l(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(m.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(m.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(m.arrayBuffer&&m.blob&&w(t))this._bodyArrayBuffer=f(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!m.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!g(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=f(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):m.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},m.blob&&(this.blob=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},m.formData&&(this.formData=function(){return this.text().then(p)}),this.json=function(){return this.text().then(JSON.parse)},this}function h(t){var e=t.toUpperCase();return E.indexOf(e)>-1?e:t}function d(t,e){e=e||{};var r=e.body;if(t instanceof d){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new n(t.headers)),this.method=t.method,this.mode=t.mode,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new n(e.headers)),this.method=h(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function p(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),o=r.shift().replace(/\+/g," "),n=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(o),decodeURIComponent(n))}}),e}function y(t){var e=new n;return t.split(/\r?\n/).forEach(function(t){var r=t.split(":"),o=r.shift().trim();if(o){var n=r.join(":").trim();e.append(o,n)}}),e}function b(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new n(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var m={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(m.arrayBuffer)var v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],w=function(t){return t&&DataView.prototype.isPrototypeOf(t)},g=ArrayBuffer.isView||function(t){return t&&v.indexOf(Object.prototype.toString.call(t))>-1};n.prototype.append=function(t,o){t=e(t),o=r(o);var n=this.map[t];this.map[t]=n?n+","+o:o},n.prototype["delete"]=function(t){delete this.map[e(t)]},n.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},n.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},n.prototype.set=function(t,o){this.map[e(t)]=r(o)},n.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},n.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),o(t)},n.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),o(t)},n.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),o(t)},m.iterable&&(n.prototype[Symbol.iterator]=n.prototype.entries);var E=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];d.prototype.clone=function(){return new d(this,{body:this._bodyInit})},l.call(d.prototype),l.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new n(this.headers),url:this.url})},b.error=function(){var t=new b(null,{status:0,statusText:""});return t.type="error",t};var _=[301,302,303,307,308];b.redirect=function(t,e){if(_.indexOf(e)===-1)throw new RangeError("Invalid status code");return new b(null,{status:e,headers:{location:t}})},t.Headers=n,t.Request=d,t.Response=b,t.fetch=function(t,e){return new Promise(function(r,o){var n=new d(t,e),i=new XMLHttpRequest;i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:y(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;r(new b(e,t))},i.onerror=function(){o(new TypeError("Network request failed"))},i.ontimeout=function(){o(new TypeError("Network request failed"))},i.open(n.method,n.url,!0),"include"===n.credentials&&(i.withCredentials=!0),"responseType"in i&&m.blob&&(i.responseType="blob"),n.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send("undefined"==typeof n._bodyInit?null:n._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:this),t.exports=self.fetch},function(t,e){"use strict";var r=Object.prototype.hasOwnProperty,o=Object.getOwnPropertySymbols,n=Object.prototype.propertyIsEnumerable,i=function(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(void 0===t||null===t)throw new TypeError("Cannot convert undefined or null to object");var s=Object(t);return e.forEach(function(t){var e=Object(t);for(var i in e)r.call(e,i)&&(s[i]=e[i]);if(o){var a=o(e);a.forEach(function(t){n.call(e,t)&&(s[t]=e[t])})}}),s};e.assign="function"==typeof Object.assign?Object.assign:i,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=e.assign},function(t,e){"use strict";function r(t,e){if(t){var r=t[e];return delete t[e],r}}e.popFromObject=r},function(t,e,r){"use strict";var o=r(2);e.analytics=o;var n=r(1);e.SimpleAnalytics=n;var i=r(7);e.history=i;var s=r(11);e.donottrack=s},function(t,e,r){"use strict";var o=r(8);e.STORE_KEY="__coveo.analytics.history",e.MAX_NUMBER_OF_HISTORY_ELEMENTS=20;var n=function(){function t(t){this.store=t||o.getAvailableStorage()}return t.prototype.addElement=function(t){null!=this.getHistory()?this.setHistory([t].concat(this.getHistory())):this.setHistory([t])},t.prototype.getHistory=function(){try{return JSON.parse(this.store.getItem(e.STORE_KEY))}catch(t){return[]}},t.prototype.setHistory=function(t){try{this.store.setItem(e.STORE_KEY,JSON.stringify(t.slice(0,e.MAX_NUMBER_OF_HISTORY_ELEMENTS)))}catch(r){}},t.prototype.clear=function(){try{this.store.removeItem(e.STORE_KEY)}catch(t){}},t}();e.HistoryStore=n,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n},function(t,e,r){"use strict";function o(){return n.hasCookieStorage()?new s:n.hasSessionStorage()?sessionStorage:n.hasLocalStorage()?localStorage:new a}var n=r(9),i=r(10);e.getAvailableStorage=o;var s=function(){function t(){}return t.prototype.getItem=function(t){return i.Cookie.get(t)},t.prototype.removeItem=function(t){i.Cookie.erase(t)},t.prototype.setItem=function(t,e){i.Cookie.set(t,e)},t}();e.CookieStorage=s;var a=function(){function t(){}return t.prototype.getItem=function(t){return""},t.prototype.removeItem=function(t){},t.prototype.setItem=function(t,e){},t}();e.NullStorage=a},function(t,e){"use strict";function r(){try{return"localStorage"in window&&null!==window.localStorage}catch(t){return!1}}function o(){try{return"sessionStorage"in window&&null!==window.sessionStorage}catch(t){return!1}}function n(){return navigator.cookieEnabled}e.hasLocalStorage=r,e.hasSessionStorage=o,e.hasCookieStorage=n},function(t,e){"use strict";var r=function(){function t(){}return t.set=function(e,r,o){var n,i,s,a,u;o?(s=new Date,s.setTime(s.getTime()+o),a="; expires="+s.toGMTString()):a="",u=location.hostname,u.indexOf(".")===-1?document.cookie=e+"="+r+a+"; path=/":(i=u.split("."),i.shift(),n="."+i.join("."),document.cookie=e+"="+r+a+"; path=/; domain="+n,null!=t.get(e)&&t.get(e)==r||(n="."+u,document.cookie=e+"="+r+a+"; path=/; domain="+n))},t.get=function(t){for(var e=t+"=",r=document.cookie.split(";"),o=0;o<r.length;o++){var n=r[o];if(n=n.replace(/^\s+/,""),0==n.indexOf(e))return n.substring(e.length,n.length)}return null},t.erase=function(e){t.set(e,"",-1)},t}();e.Cookie=r},function(t,e){"use strict";e.doNotTrack=[!0,"yes","1"].indexOf(navigator.doNotTrack||navigator.msDoNotTrack||window.doNotTrack),Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=e.doNotTrack}]);
//# sourceMappingURL=coveoua.js.map