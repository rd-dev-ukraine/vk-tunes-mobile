define(["require", "exports"], function (require, exports) {
    "use strict";
    /// <reference path="../../typings/browser.d.ts" />
    var LoadMyAudio = (function () {
        function LoadMyAudio() {
        }
        return LoadMyAudio;
    }());
    exports.LoadMyAudio = LoadMyAudio;
    var MyAudioLoaded = (function () {
        function MyAudioLoaded(audio) {
            this.audio = audio;
        }
        return MyAudioLoaded;
    }());
    exports.MyAudioLoaded = MyAudioLoaded;
    var SearchAudio = (function () {
        function SearchAudio(query) {
            this.query = query;
        }
        return SearchAudio;
    }());
    exports.SearchAudio = SearchAudio;
    var SearchAudioResultLoaded = (function () {
        function SearchAudioResultLoaded(audio) {
            this.audio = audio;
        }
        return SearchAudioResultLoaded;
    }());
    exports.SearchAudioResultLoaded = SearchAudioResultLoaded;
    var AudioInfoUpdated = (function () {
        function AudioInfoUpdated(audio) {
            this.audio = audio;
        }
        return AudioInfoUpdated;
    }());
    exports.AudioInfoUpdated = AudioInfoUpdated;
    var DownloadAudio = (function () {
        function DownloadAudio(audio) {
            this.audio = audio;
        }
        return DownloadAudio;
    }());
    exports.DownloadAudio = DownloadAudio;
    var DownloadProgress = (function () {
        function DownloadProgress(audio, progress) {
            this.audio = audio;
            this.progress = progress;
        }
        return DownloadProgress;
    }());
    exports.DownloadProgress = DownloadProgress;
    var DownloadInfoNotification = (function () {
        function DownloadInfoNotification(index, total) {
            this.index = index;
            this.total = total;
        }
        return DownloadInfoNotification;
    }());
    exports.DownloadInfoNotification = DownloadInfoNotification;
    var AddAudio = (function () {
        function AddAudio(audio) {
            this.audio = audio;
        }
        return AddAudio;
    }());
    exports.AddAudio = AddAudio;
    var DeleteAudio = (function () {
        function DeleteAudio(audio) {
            this.audio = audio;
        }
        return DeleteAudio;
    }());
    exports.DeleteAudio = DeleteAudio;
    var AudioDeleted = (function () {
        function AudioDeleted(audio) {
            this.audio = audio;
        }
        return AudioDeleted;
    }());
    exports.AudioDeleted = AudioDeleted;
});
