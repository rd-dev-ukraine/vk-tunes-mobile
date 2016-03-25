/// <reference path="../../typings/browser.d.ts"/>

class Directory {
    static ServiceName = "directory";
    static PathDependency = "path"

    private directoryContent: FileInfo[];

    constructor(private path: string) {
    }

    files(): Promise<FileInfo[]> {        
        return this.init()
                   .then(_ => {
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

    downloadFile(fromUrl: string, fileName: string, notify: (progressInfo: IFileDownloadingProgress) => void): Promise<any> {
        
        var folder = this.path;
        var targetPath = folder + "/" + fileName + ".mp3";

        return this.init()
                   .then(() => new Promise((resolve, reject) => {
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
                                                this.directoryContent = null;                                                 
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

    private init(): Promise<any> {        
        return new Promise((resolve, reject) => {
            window.requestFileSystem(
                1,
                0,
                fs => resolve(fs),
                error => reject(error));
        });
    }

    private readDirectory(): Promise<FileInfo[]> {
        
        return new Promise((resolve, reject) => {
            
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

                                resolve(result);
                            },
                            error => reject(error));
                },
                error => reject(error));
        });
    }
}

export = Directory;