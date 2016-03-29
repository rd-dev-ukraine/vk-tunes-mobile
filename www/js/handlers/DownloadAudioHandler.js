/// <reference path="../../typings/browser.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../vk/VkAudioService", "../vk/StoredAudioService", "./Messages", "../pub-sub/Decorators"], function (require, exports, VkAudioService, StoredAudioService, Messages, PS) {
    "use strict";
    var DownloadAudioHandler = (function () {
        function DownloadAudioHandler(vk, fs) {
            this.vk = vk;
            this.fs = fs;
            this.downloadQueue = [];
            this.isDownloading = false;
        }
        DownloadAudioHandler.prototype.downloadAudio = function (message) {
            (_a = this.downloadQueue).push.apply(_a, message.audio);
            this.download();
            var _a;
        };
        DownloadAudioHandler.prototype.publish = function (message) { };
        DownloadAudioHandler.prototype.download = function () {
            var _this = this;
            if (this.isDownloading)
                return;
            if (this.downloadQueue.length) {
                this.isDownloading = true;
                var next = this.downloadQueue.shift();
                this.vk
                    .enqueueDownloading(next)
                    .then(function (audio) {
                    return _this.fs.download(audio.remote, function (p) { return _this.onProgress(audio, p); });
                })
                    .then(function (local) {
                    next.local = local;
                    _this.onProgress(next);
                    _this.publish(new Messages.AudioInfoUpdated(next));
                    _this.isDownloading = false;
                    _this.download();
                }, function (err) {
                    _this.isDownloading = false;
                    _this.download();
                });
            }
        };
        DownloadAudioHandler.prototype.onProgress = function (audio, progress) {
            if (progress === void 0) { progress = null; }
            this.publish(new Messages.DownloadProgress(audio, progress));
        };
        DownloadAudioHandler.ServiceName = "DownloadAudioHandler";
        DownloadAudioHandler.$inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];
        __decorate([
            PS.Handle(Messages.DownloadAudio)
        ], DownloadAudioHandler.prototype, "downloadAudio", null);
        DownloadAudioHandler = __decorate([
            PS.Subscriber
        ], DownloadAudioHandler);
        return DownloadAudioHandler;
    }());
    return DownloadAudioHandler;
});
