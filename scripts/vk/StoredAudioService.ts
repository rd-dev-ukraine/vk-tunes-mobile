/// <reference path="../../typings/browser.d.ts"/>

import Directory = require("../filesys/Directory");

class StoredAudioService {
    private static SplitFileName = /^(\d{1,}) - (.{1, }).(.{1, })$/;

    static ServiceName = "StoredAudioService";
    static $inject = [Directory.ServiceName];

    constructor(private fs: Directory) { }

    load(): Promise<StoredAudioRecord[]> {
        return this.fs
            .files()
            .then(files => {
                return files.map(f => this.parseFileName(f.path));
            });
    }

    download(audio: VkAudioRecord, progress: (progress: IAudioDownloadingProgress) => void): Promise<StoredAudioRecord> {
        var fileName = this.buildFileName(audio);

        return this.fs
            .downloadFile(audio.url,
                fileName,
                p => progress({ audio_id: audio.id, bytesLoaded: p.bytesLoaded, bytesTotal: p.bytesTotal, percent: p.percent }));
    }

    private parseFileName(path: string): StoredAudioRecord {

        var fileName = this.getFileName(path);

        var match = StoredAudioService.SplitFileName.exec(fileName);

        if (!match)
            return null;

        return {
            id: parseInt(match[1]),
            name: fileName,
            path: path
        };
    }

    private buildFileName(audio: VkAudioRecord): string {
        return `${audio.id} - ${this.sanitize(audio.artist)} - ${this.sanitize(audio.title)}`;
    }

    private getFileName(path: string): string {
        if (!path)
            throw "Path is missing.";

        return path.slice(path.indexOf("/") + 1);
    }

    private sanitize(word: string): string {
        return word;
    }
}

export = StoredAudioService;