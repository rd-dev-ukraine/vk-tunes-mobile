/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Directory = (function () {
        function Directory() {
        }
        Directory.prototype.files = function () {
            return this.resolveRoot()
                .then(function (dir) { return new Promise(function (resolve, reject) {
                dir.createReader()
                    .readEntries(resolve, reject);
            }); })
                .then(function (entries) { return entries.filter(function (e) { return e.isFile; })
                .map(function (e) { return ({ path: e.fullPath, name: e.name }); }); });
        };
        Directory.prototype.downloadFile = function (fromUrl, fileName, notify) {
            return this.resolveRoot()
                .then(function (path) { return new Promise(function (resolve, reject) {
                var targetPath = encodeURI(path.toInternalURL() + fileName + ".mp3");
                var transfer = new FileTransfer();
                transfer.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var progressInfo = {
                            percent: Math.round(event.loaded / event.total * 100),
                            bytesLoaded: event.loaded,
                            bytesTotal: event.total
                        };
                        if (notify)
                            notify(progressInfo);
                    }
                };
                transfer.download(fromUrl, targetPath, function (file) {
                    resolve({
                        path: file.fullPath,
                        name: file.name
                    });
                }, function (error) {
                    reject(error);
                }, true);
            }); });
        };
        Directory.prototype.resolveRoot = function () {
            return this.resolveFileSystemUrl(cordova.file.externalRootDirectory + "Music");
        };
        Directory.prototype.requestFileSystem = function () {
            return this.makePromise(window.requestFileSystem, window.PERSISTENT, 0);
        };
        Directory.prototype.resolveFileSystemUrl = function (url) {
            var _this = this;
            return this.requestFileSystem()
                .then(function () { return _this.makePromise(window.resolveLocalFileSystemURL, url); });
        };
        /** Makes a ES6 promise from any function which accepts success and error callbacks as last two arguments. */
        Directory.prototype.makePromise = function (func) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var parameters = args.concat([resolve, reject]);
                return func.apply(null, parameters);
            });
        };
        Directory.ServiceName = "directory";
        return Directory;
    }());
    return Directory;
});
