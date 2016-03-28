/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Directory = (function () {
        function Directory(path) {
            this.path = path;
        }
        Directory.prototype.files = function () {
            var _this = this;
            return this.init()
                .then(function (_) { return _this.readDirectory(); });
        };
        Directory.prototype.downloadFile = function (fromUrl, fileName, notify) {
            var folder = this.path;
            var targetPath = folder + "/" + fileName + ".mp3";
            return this.init()
                .then(function () { return new Promise(function (resolve, reject) {
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
                }, function (error) { return reject(error); }, true);
            }); });
        };
        Directory.prototype.init = function () {
            return new Promise(function (resolve, reject) {
                window.requestFileSystem(1, 0, function (fs) { return resolve(fs); }, function (error) { return reject(error); });
            });
        };
        Directory.prototype.readDirectory = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                window.resolveLocalFileSystemURL(_this.path, function (dirEntry) {
                    dirEntry.createReader()
                        .readEntries(function (entries) {
                        resolve(entries.map(function (e) { return ({ path: e.fullPath, name: e.name }); }));
                    }, function (error) { return reject(error); });
                }, function (error) { return reject(error); });
            });
        };
        Directory.ServiceName = "directory";
        Directory.PathDependency = "path";
        return Directory;
    }());
    return Directory;
});
