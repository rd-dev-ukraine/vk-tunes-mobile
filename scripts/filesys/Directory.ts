/// <reference path="../../typings/browser.d.ts"/>

class Directory {
    static ServiceName = "directory";

    files(): Promise<FileInfo[]> {
        return this.resolveRoot()
            .then(dir => this.makePromise<Entry[]>(dir.createReader().readEntries))
            .then(entries => entries.filter(e => e.isFile)
                                    .map(e => ({ path: e.fullPath, name: e.name })));
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
        return this.resolveFileSystemUrl(cordova.file.externalRootDirectory + "Music");
    }

    private requestFileSystem(): Promise<FileSystem> {
        return this.makePromise<FileSystem>(window.requestFileSystem, window.PERSISTENT, 0);
    }
    
    private resolveFileSystemUrl(url: string) : Promise<Entry> {
        return this.requestFileSystem()
                   .then(() => this.makePromise<Entry>(window.resolveLocalFileSystemURL, url));
    }
    
    /** Makes a ES6 promise from any function which accepts success and error callbacks as last two arguments. */
    private makePromise<TResult>(func: Function, ...args: any[]): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            var parameters = [...args, resolve, reject];
            return func.apply(null, parameters);
        });
    }
}

export = Directory;