/// <reference path="../../typings/browser.d.ts"/>

interface FileInfo {
    path: string
    name: string
}

interface IFileDownloadingProgress {
    bytesLoaded: number
    bytesTotal: number
    percent: number
}