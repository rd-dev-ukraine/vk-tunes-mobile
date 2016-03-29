/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Directory = (function () {
        function Directory() {
        }
        Directory.prototype.files = function () {
            return this.resolveRoot()
                .then(function (dir) {
                return new Promise(function (resolve, reject) {
                    dir.createReader()
                        .readEntries(function (entries) {
                        var fileInfo = entries.filter(function (e) { return e.isFile; })
                            .map(function (e) { return ({ path: e.fullPath, name: e.name }); });
                        resolve(fileInfo);
                    }, function (error) { return reject(error); });
                });
            });
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
            return this.requestFileSystem()
                .then(function (fs) { return new Promise(function (resolve, reject) {
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Music", function (dirEntry) { return resolve(dirEntry); }, function (err) { return reject(err); });
            }); });
        };
        Directory.prototype.requestFileSystem = function () {
            return new Promise(function (resolve, reject) {
                window.requestFileSystem(window.PERSISTENT, 0, function (fs) { return resolve(fs); }, function (error) { return reject(error); });
            });
        };
        Directory.ServiceName = "directory";
        return Directory;
    }());
    return Directory;
});
