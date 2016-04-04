/// <reference path="../../typings/browser.d.ts" />

import VkAudioService = require("../vk/VkAudioService");
import StoredAudioService = require("../vk/StoredAudioService");
import Messages = require("./Messages");
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class DownloadAudioHandler {
    static ServiceName = "DownloadAudioHandler";
    static $inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];

    private downloadQueue: AudioInfo[] = [];
    private isDownloading = false;

    private totalDownloading = 0;

    constructor(private vk: VkAudioService, private fs: StoredAudioService) {
    }


    @PS.Handle(Messages.DownloadAudio)
    downloadAudio(message: Messages.DownloadAudio) {
        this.downloadQueue.push(...message.audio);
        this.totalDownloading += message.audio.length;

        this.download();
    }

    publish(message: any) { }

    private download() {
        if (this.isDownloading)
            return;

        if (this.downloadQueue.length) {
            this.isDownloading = true;

            var next = this.downloadQueue.shift();

            this.vk
                .enqueueDownloading(next)
                .then(audio => {
                    return this.fs.download(audio.remote, p => this.onProgress(audio, p));
                })
                .then(local => {
                    next.local = local;

                    this.onProgress(next);
                    this.publish(new Messages.AudioInfoUpdated(next));

                    this.isDownloading = false;

                    this.download();
                },
                err => {
                    this.isDownloading = false;
                    this.download();
                });
        } else {
            this.totalDownloading = 0;
            this.publish(new Messages.DownloadInfoNotification(0, 0));
        }
    }

    private onProgress(audio: AudioInfo, progress: IAudioDownloadingProgress = null) {
        if (progress) {
            audio.fileSize = progress.bytesTotal;
            this.publish(new Messages.AudioInfoUpdated(audio));
        }

        this.publish(new Messages.DownloadProgress(audio, progress));
        this.publish(new Messages.DownloadInfoNotification(
            this.totalDownloading - this.downloadQueue.length,
            this.totalDownloading));
    }
}

export = DownloadAudioHandler;