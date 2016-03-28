/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports", "./VkApi"], function (require, exports, VkApi) {
    "use strict";
    var VkTypedApi = (function () {
        function VkTypedApi() {
            this.api = new VkApi();
        }
        VkTypedApi.prototype.currentUser = function () {
            return this.api.currentUser();
        };
        VkTypedApi.prototype.myAudio = function () {
            return this.api
                .requestApi("audio.get", {})
                .then(function (r) { return r.items; });
        };
        VkTypedApi.prototype.searchAudio = function (query) {
            return this.api
                .requestApi("audio.search", {
                q: query,
                search_own: 1,
                count: 100
            })
                .then(function (r) { return r.items; });
        };
        VkTypedApi.prototype.getFileSize = function (audioId, fileUrl) {
            return fetch(fileUrl, {
                method: "HEAD"
            })
                .then(function (r) {
                var contentLength = r.headers.get("Content-Length");
                return parseFloat(contentLength);
            });
        };
        VkTypedApi.prototype.addAudio = function (audioId, ownerId) {
            return this.api
                .requestApi("audio.add", {
                audio_id: audioId,
                owner_id: ownerId
            });
        };
        return VkTypedApi;
    }());
    return VkTypedApi;
});
