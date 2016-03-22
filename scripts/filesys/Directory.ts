/// <reference path="../../typings/browser.d.ts"/>

class Directory {
    static $inject = ["$q", Directory.PathDependency];
    static ServiceName = "directory";
    static PathDependency = "path"

    private directoryContent: FileInfo[]

    constructor(
        private $q: ng.IQService,
        private path: string) {
    }

    files(): ng.IPromise<FileInfo[]> {
        
        return this.init().then(() => {
            if (this.directoryContent != null)
                return this.directoryContent;
            else {
                return this.readDirectory()
                    .then(result => {
                        this.directoryContent = result;
                        return this.directoryContent;
                    });
            }
        });
    }

    downloadFile(fromUrl: string, fileName: string): ng.IPromise<any> {
        var deferred = this.$q.defer();
        var folder = this.path;
        var targetPath = folder + "/" + fileName + ".mp3";

        this.init().then(() => {

            var transfer = new FileTransfer();

            transfer.onprogress = (event) => {
                if (event.lengthComputable) {
                    var progressInfo: IFileDownloadingProgress = {
                        percent: Math.round(event.loaded / event.total * 100),
                        bytesLoaded: event.loaded,
                        bytesTotal: event.total
                    };
                    deferred.notify(progressInfo);
                }
            };

            transfer.download(
                fromUrl,
                targetPath,
                file => {
                    this.directoryContent = null;
                    deferred.resolve({
                        path: file.fullPath,
                        name: file.name
                    });
                },
                error => {
                    deferred.reject(error);
                },
                true);
        });

        return deferred.promise;
    }

    private init(): ng.IPromise<any> {
        var deferred = this.$q.defer();

        window.requestFileSystem(
            1,
            0,
            fs => deferred.resolve(fs),
            error => deferred.reject(error));

        return deferred.promise;
    }

    private readDirectory(): ng.IPromise<FileInfo[]> {
        var deferred = this.$q.defer();
        
        window.resolveLocalFileSystemURI(
            this.path,
            (dirEntry: DirectoryEntry) => {
                dirEntry.createReader()
                    .readEntries(entries => {
                        var result = [];

                        for (var i in entries) {
                            var entry = entries[i];
                            if (entry.isFile) {
                                result.push({
                                    path: entry.fullPath,
                                    name: entry.name
                                });
                            }
                        }

                        deferred.resolve(result);
                    },
                        error => deferred.reject(error));
            },
            error => deferred.reject(error));

        return deferred.promise;
    }
}

export = Directory;