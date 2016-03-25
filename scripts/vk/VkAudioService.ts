/// <reference path="../../typings/browser.d.ts"/>

import VkTypedApi = require("VkTypedApi");
import PriorityQueue = require("../task-queue/PriorityQueue");

class VkService {
    static ServiceName = "VkQueued";

    private vk = new VkTypedApi();
    private queue = new PriorityQueue();

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
}

const enum VkOperationPriority {
    SearchApiCall = 101,
    ApiCall = 100,
    DownloadFile = 10,
    GetFileSize = 3
}

export = VkService;