/// <reference path="../../typings/browser.d.ts"/>

import VkTypedApi = require("./VkTypedApi");
import PriorityQueue = require("../task-queue/PriorityQueue");

class VkService {
    static ServiceName = "VkQueued";

    private vk = new VkTypedApi();
    private queue = new PriorityQueue();

    currentUser(): number {
        return this.vk.currentUser();
    }

    myAudio(): Promise<VkAudioRecord[]> {
        return this.queue
                   .enqueueFirst(() => this.vk.myAudio(),
                                 VkOperationPriority.ApiCall);
    }

    searchAudio(query: string): Promise<VkAudioRecord[]> {
        this.queue.clear(VkOperationPriority.SearchApiCall);

        return this.queue
                   .enqueueFirst(() => this.vk.searchAudio(query),
                                 VkOperationPriority.SearchApiCall);
    }
    
    addAudio(audio: AudioInfo): Promise<AudioInfo> {
        return this.queue
                   .enqueueFirst(() => this.vk.addAudio(audio.remote.id, audio.remote.owner_id), 
                                 VkOperationPriority.ApiCall)
                   .then(() => audio);
    }
    
    deleteAudio(audio: AudioInfo): Promise<AudioInfo> {
        return this.queue
                   .enqueueFirst(() => this.vk.deleteAudio(audio.remote.id, audio.remote.owner_id), 
                                 VkOperationPriority.ApiCall)
                   .then(() => audio);
    }

    getAudioSize(audio: AudioInfo[], callback: (audio: AudioInfo, fileSize:number) => void) {
        this.queue.clear(VkOperationPriority.GetFileSize);

        audio.forEach(record => {
            this.queue
                .enqueueLast(() => this.vk.getFileSize(record.remote.id, record.remote.url),
                             VkOperationPriority.GetFileSize)
                .then(fileSize => {
                    record.fileSize = fileSize;
                    callback(record, fileSize);
                });
        });
    }
    
    /**
     * Don't perform any vk API call, just enqueue empty operation to ensure downloading is 
     * not violates API call frequency.
     */
    enqueueDownloading(audio: AudioInfo): Promise<AudioInfo> {
        return this.queue
                    .enqueueLast(() => Promise.resolve(audio),
                                 VkOperationPriority.DownloadFile);
    }
}

const enum VkOperationPriority {
    SearchApiCall = 101,
    ApiCall = 100,
    DownloadFile = 10,
    GetFileSize = 3
}

export = VkService;