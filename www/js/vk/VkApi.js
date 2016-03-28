/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var VkApi = (function () {
        function VkApi() {
            this.authroizationInfo = {
                client_id: "3201403",
                scope: "audio",
                redirect_uri: encodeURI("http://oauth.vk.com/blank.html"),
                response_type: "token",
                display: "touch"
            };
        }
        VkApi.prototype.authorizationUrl = function () {
            var result = "https://oauth.vk.com/authorize?v=5.21";
            for (var prop in this.authroizationInfo) {
                var value = this.authroizationInfo[prop];
                result += "&" + prop + "=" + value;
            }
            return encodeURI(result);
        };
        /// Executes authorization if needded and defers access token
        VkApi.prototype.authorize = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.accessInfo) {
                    resolve(_this.accessInfo);
                }
                else {
                    var authorizationWindow = window.open(_this.authorizationUrl(), "_blank", "location=no");
                    authorizationWindow.addEventListener("loaderror", function (event) { return reject(event.message); });
                    authorizationWindow.addEventListener("loadstop", function (event) {
                        var info = _this.authorizationInfoFromUrl(event.url);
                        if (!info)
                            return;
                        authorizationWindow.close();
                        _this.accessInfo = info;
                        resolve(_this.accessInfo);
                    });
                }
            });
        };
        VkApi.prototype.authorizationInfoFromUrl = function (url) {
            if (!url)
                throw "Url is required.";
            if (url.indexOf(VkApi.validReturnUri) != 0)
                return null;
            var parts = url.split('#');
            if (parts.length != 2)
                return null;
            var returnUri = parts[0];
            if (returnUri != VkApi.validReturnUri)
                return null;
            var result = /access_token=([a-zA-Z0-9]+)&/.exec(url);
            if (result.length != 2)
                return null;
            var userMatch = /user_id=([0-9]+)/.exec(url);
            if (!userMatch || userMatch.length != 2)
                return null;
            return {
                token: result[1],
                userId: parseInt(userMatch[1])
            };
        };
        VkApi.prototype.currentUser = function () {
            if (this.accessInfo)
                return this.accessInfo.userId;
            return null;
        };
        // Requests vk.com api with performing authorization if required.
        VkApi.prototype.requestApi = function (method, request) {
            var _this = this;
            return this.authorize()
                .then(function (info) {
                request.access_token = info.token;
                request.v = "5.21";
                var param = _this.param(request);
                var url = "https://api.vk.com/method/" + method + "?" + param;
                return fetch(url, {
                    method: "POST",
                    body: JSON.stringify(request)
                })
                    .then(function (response) { return response.json(); })
                    .then(function (r) { return r.response; });
            });
        };
        VkApi.prototype.param = function (a) {
            var s = [], add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
            for (var prop in a) {
                add(prop, a[prop]);
            }
            return s.join("&");
        };
        VkApi.validReturnUri = "https://oauth.vk.com/blank.html";
        return VkApi;
    }());
    return VkApi;
});
