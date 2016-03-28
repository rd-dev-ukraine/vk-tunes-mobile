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
    
    constructor(private vk: VkAudioService, private fs: StoredAudioService) {        
    }
    
    
    @PS.Handle(Messages.DownloadAudio)
    downloadAudio(message: Messages.DownloadAudio) {
        this.downloadQueue.push(...message.audio);
        this.download();
    }
    
    publish(message: any) {}
    
    private download() {
        if (this.isDownloading)
            return;
        
        if (this.downloadQueue.length) {
            this.isDownloading = true;
            
            var next = this.downloadQueue.shift();
            
            this.vk
                .enqueueDownloading(next)
                .then(audio => this.fs.download(audio.remote, p => this.onProgress(p)))
                .then(local => {
                    next.local = local;
                    this.publish(new Messages.AudioInfoUpdated(next));                   
                    
                    this.isDownloading = false;                    

                    this.download();
                });
        }
    }
    
    private onProgress(progress: IAudioDownloadingProgress) {        
    }
}

export = DownloadAudioHandler;