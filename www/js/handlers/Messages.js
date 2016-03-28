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
});
