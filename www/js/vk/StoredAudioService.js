/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports", "../filesys/Directory"], function (require, exports, Directory) {
    "use strict";
    var StoredAudioService = (function () {
        function StoredAudioService(fs) {
            this.fs = fs;
        }
        StoredAudioService.prototype.load = function () {
            var _this = this;
            return this.fs
                .files()
                .then(function (files) {
                return files.map(function (f) { return _this.parseFileName(f.path); });
            });
        };
        StoredAudioService.prototype.download = function (audio, progress) {
            var fileName = this.buildFileName(audio);
            return this.fs
                .downloadFile(audio.url, fileName, function (p) { return progress({ audio_id: audio.id, bytesLoaded: p.bytesLoaded, bytesTotal: p.bytesTotal, percent: p.percent }); });
        };
        StoredAudioService.prototype.parseFileName = function (path) {
            var fileName = this.getFileName(path);
            var match = StoredAudioService.SplitFileName.exec(fileName);
            if (!match)
                return null;
            return {
                id: parseInt(match[1]),
                name: fileName,
                path: path
            };
        };
        StoredAudioService.prototype.buildFileName = function (audio) {
            return audio.id + " - " + this.sanitize(audio.artist) + " - " + this.sanitize(audio.title);
        };
        StoredAudioService.prototype.getFileName = function (path) {
            if (!path)
                throw "Path is missing.";
            return path.slice(path.lastIndexOf("/") + 1);
        };
        StoredAudioService.prototype.sanitize = function (word) {
            return word;
        };
        StoredAudioService.SplitFileName = /^(\d{1,}) - (.{1,})\.(.{1,})$/;
        StoredAudioService.ServiceName = "StoredAudioService";
        StoredAudioService.$inject = [Directory.ServiceName];
        return StoredAudioService;
    }());
    return StoredAudioService;
});
