var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioRecordController = (function () {
        function AudioRecordController($scope) {
            this.$scope = $scope;
        }
        AudioRecordController.prototype.bitrate = function () {
            if (this.audio.fileSize && this.audio.remote && this.audio.remote.duration) {
                var bitrate = (this.audio.fileSize / this.audio.remote.duration / 1024 * 8).toFixed(0);
                return bitrate + "Kbps";
            }
            return "";
        };
        AudioRecordController.prototype.onAudioUpdated = function (message) {
            if (this.audio && this.audio.remote.id === message.audio.remote.id) {
                this.audio = message.audio;
                this.$apply();
            }
        };
        AudioRecordController.prototype.onAudioDownloading = function (message) {
            if (this.audio && this.audio.remote.id === message.audio.remote.id) {
                this.downloadProgress = message.progress;
                this.$apply();
            }
        };
        AudioRecordController.prototype.$apply = function () {
            this.$scope.$$phase || this.$scope.$digest();
        };
        AudioRecordController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.AudioInfoUpdated)
        ], AudioRecordController.prototype, "onAudioUpdated", null);
        __decorate([
            PS.Handle(Messages.DownloadProgress)
        ], AudioRecordController.prototype, "onAudioDownloading", null);
        AudioRecordController = __decorate([
            PS.Subscriber
        ], AudioRecordController);
        return AudioRecordController;
    }());
    exports.Component = {
        bindings: {
            audio: "<"
        },
        controller: AudioRecordController,
        controllerAs: "$c",
        template: "\n<div class=\"audio-record-headline\">\n    <div class=\"audio-record-headline__content audio-record-title\">  \n        <span class=\"audio-record-title__artist\">\n            {{$c.audio.remote.artist}}\n        </span> - \n        <span class=\"audio-record-title__title\">\n            {{$c.audio.remote.title}}\n        </span>    \n    </div>\n    <div class=\"audio-record-headline__badge audio-record-duration\">\n        {{$c.audio.remote.duration | duration}}\n    </div>\n</div>\n<div class=\"audio-record-badges\">\n    <span class=\"audio-record-badge my-audio\"\n          ng-show=\"$c.audio.isInMyAudio\">\n        <span class=\"fa fa-star-o audio-record-badge__icon\"></span>\n        <span class=\"audio-record-badge__text\">\n            My audio\n        </span>\n    </span>\n    <span class=\"audio-record-badge on-device\"\n          ng-show=\"$c.audio.local\">\n        <span class=\"fa fa-hdd-o audio-record-badge__icon\"></span>\n        <span class=\"audio-record-badge__text\">\n            On device\n        </span>\n    </span>\n    <span class=\"audio-record-badge file-size\"\n          ng-show=\"$c.audio.fileSize\">        \n        <span class=\"audio-record-badge__text\">\n            {{$c.audio.fileSize | filesize}}\n        </span>\n    </span>\n    <span class=\"audio-record-badge bitrate\"\n          ng-show=\"$c.audio.fileSize\">        \n        <span class=\"audio-record-badge__text\">\n            {{$c.bitrate()}}\n        </span>\n    </span>\n    \n</div>\n<div class=\"audio-record-download-progress\"\n     ng-show=\"$c.downloadProgress\">\n    Downloading {{$c.downloadProgress.percent}}%   [{{$c.downloadProgress.bytesLoaded | filesize}}/{{$c.downloadProgress.bytesTotal | filesize}}]\n    <progress-bar progress=\"$c.downloadProgress.percent\"></progress-bar>\n</div>\n"
    };
});
