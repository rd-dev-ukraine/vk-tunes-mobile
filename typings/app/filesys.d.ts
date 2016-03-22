/// <reference path="../../typings/browser.d.ts"/>
declare module FileSys {
    interface FileInfo {
        path: string
        name: string
    }

    interface IFileDownloadingProgress {
        bytesLoaded: number
        bytesTotal: number
        percent: number
    }

}