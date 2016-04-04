/// <reference path="../../typings/browser.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../vk/VkAudioService", "../vk/StoredAudioService", "./Messages", "../pub-sub/Decorators"], function (require, exports, VkAudioService, StoredAudioService, Messages, PS) {
    "use strict";
    var AudioListHandler = (function () {
        function AudioListHandler(vk, storage) {
            this.vk = vk;
            this.storage = storage;
        }
        AudioListHandler.prototype.loadMyAudio = function (message) {
            var _this = this;
            Promise.all([
                this.vk.myAudio(),
                this.storage.load()
            ])
                .then(function (_a) {
                var remote = _a[0], local = _a[1];
                var list = _this.audio(remote, local);
                _this.publish(new Messages.MyAudioLoaded(list));
                _this.vk.getAudioSize(list, function (record, size) {
                    record.fileSize = size;
                    _this.publish(new Messages.AudioInfoUpdated(record));
                });
            });
        };
        AudioListHandler.prototype.searchAudio = function (message) {
            var _this = this;
            Promise.all([
                this.vk.searchAudio(message.query),
                this.storage.load()
            ])
                .then(function (_a) {
                var remote = _a[0], local = _a[1];
                var list = _this.audio(remote, local);
                _this.publish(new Messages.SearchAudioResultLoaded(list));
                _this.vk.getAudioSize(list, function (record, size) {
                    record.fileSize = size;
                    _this.publish(new Messages.AudioInfoUpdated(record));
                });
            });
        };
        AudioListHandler.prototype.addAudio = function (message) {
            var _this = this;
            this.vk.addAudio(message.audio)
                .then(function (audio) {
                audio.isInMyAudio = true;
                _this.publish(new Messages.AudioInfoUpdated(audio));
            });
        };
        AudioListHandler.prototype.deleteAudio = function (message) {
            var _this = this;
            this.vk.deleteAudio(message.audio)
                .then(function (audio) {
                audio.isInMyAudio = false;
                _this.publish(new Messages.AudioDeleted(audio));
                _this.publish(new Messages.AudioInfoUpdated(audio));
            });
        };
        AudioListHandler.prototype.publish = function (message) { };
        AudioListHandler.prototype.audio = function (remote, local) {
            var _this = this;
            var storedAudioIndex = {};
            local.forEach(function (l) { return storedAudioIndex[l.id] = l; });
            return remote.map(function (r) { return ({
                remote: r,
                local: storedAudioIndex[r.id],
                fileSize: null,
                isInMyAudio: r.owner_id === _this.vk.currentUser()
            }); });
        };
        AudioListHandler.ServiceName = "AudioListHandler";
        AudioListHandler.$inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];
        __decorate([
            PS.Handle(Messages.LoadMyAudio)
        ], AudioListHandler.prototype, "loadMyAudio", null);
        __decorate([
            PS.Handle(Messages.SearchAudio)
        ], AudioListHandler.prototype, "searchAudio", null);
        __decorate([
            PS.Handle(Messages.AddAudio)
        ], AudioListHandler.prototype, "addAudio", null);
        __decorate([
            PS.Handle(Messages.DeleteAudio)
        ], AudioListHandler.prototype, "deleteAudio", null);
        AudioListHandler = __decorate([
            PS.Subscriber
        ], AudioListHandler);
        return AudioListHandler;
    }());
    return AudioListHandler;
});
