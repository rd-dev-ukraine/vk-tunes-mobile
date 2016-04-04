/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports", "./VkTypedApi", "../task-queue/PriorityQueue"], function (require, exports, VkTypedApi, PriorityQueue) {
    "use strict";
    var VkService = (function () {
        function VkService() {
            this.vk = new VkTypedApi();
            this.queue = new PriorityQueue();
        }
        VkService.prototype.currentUser = function () {
            return this.vk.currentUser();
        };
        VkService.prototype.myAudio = function () {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.myAudio(); }, 100 /* ApiCall */);
        };
        VkService.prototype.searchAudio = function (query) {
            var _this = this;
            this.queue.clear(101 /* SearchApiCall */);
            return this.queue
                .enqueueFirst(function () { return _this.vk.searchAudio(query); }, 101 /* SearchApiCall */);
        };
        VkService.prototype.addAudio = function (audio) {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.addAudio(audio.remote.id, audio.remote.owner_id); }, 100 /* ApiCall */)
                .then(function () { return audio; });
        };
        VkService.prototype.deleteAudio = function (audio) {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.deleteAudio(audio.remote.id, audio.remote.owner_id); }, 100 /* ApiCall */)
                .then(function () { return audio; });
        };
        VkService.prototype.getAudioSize = function (audio, callback) {
            var _this = this;
            this.queue.clear(3 /* GetFileSize */);
            audio.forEach(function (record) {
                _this.queue
                    .enqueueLast(function () { return _this.vk.getFileSize(record.remote.id, record.remote.url); }, 3 /* GetFileSize */)
                    .then(function (fileSize) {
                    record.fileSize = fileSize;
                    callback(record, fileSize);
                });
            });
        };
        /**
         * Don't perform any vk API call, just enqueue empty operation to ensure downloading is
         * not violates API call frequency.
         */
        VkService.prototype.enqueueDownloading = function (audio) {
            return this.queue
                .enqueueLast(function () { return Promise.resolve(audio); }, 10 /* DownloadFile */);
        };
        VkService.ServiceName = "VkQueued";
        return VkService;
    }());
    return VkService;
});
