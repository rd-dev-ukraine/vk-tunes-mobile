/// <reference path="../../typings/browser.d.ts"/>

class Directory {
    static ServiceName = "directory";

    files(): Promise<FileInfo[]> {
        return this.resolveRoot()
            .then(dir => {
                return new Promise((resolve, reject) => {
                    dir.createReader()
                        .readEntries(entries => {
                            const fileInfo = entries.filter(e => e.isFile)
                                .map(e => ({ path: e.fullPath, name: e.name }));
                            resolve(fileInfo);
                        },
                        error => reject(error));
                });
            });
    }

    downloadFile(fromUrl: string, fileName: string, notify: (progressInfo: IFileDownloadingProgress) => void): Promise<FileInfo> {

        return this.resolveRoot()
            .then(path => new Promise((resolve, reject) => {
                var targetPath = encodeURI(path.toInternalURL() + fileName + ".mp3");

                var transfer = new FileTransfer();

                transfer.onprogress = (event) => {
                    if (event.lengthComputable) {
                        var progressInfo: IFileDownloadingProgress = {
                            percent: Math.round(event.loaded / event.total * 100),
                            bytesLoaded: event.loaded,
                            bytesTotal: event.total
                        };

                        if (notify)
                            notify(progressInfo);
                    }
                };

                transfer.download(fromUrl,
                    targetPath,
                    file => {
                        resolve({
                            path: file.fullPath,
                            name: file.name
                        });
                    },
                    error => { 
                        reject(error); 
                    },
                    true);
            }));
    }

    private resolveRoot(): Promise<DirectoryEntry> {
        return this.requestFileSystem()
            .then(fs => new Promise((resolve, reject) => {
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Music",
                    dirEntry => resolve(dirEntry),
                    err => reject(err));
            }));
    }

    private requestFileSystem(): Promise<FileSystem> {
        return new Promise((resolve, reject) => {
            window.requestFileSystem(
                window.PERSISTENT,
                0,
                fs => resolve(fs),
                error => reject(error));
        });
    }
}

export = Directory;