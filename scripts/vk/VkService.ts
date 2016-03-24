/// <reference path="../../typings/browser.d.ts"/>

import VkTypedApi = require("VkTypedApi");
import PriorityQueue = require("../task-queue/PriorityQueue");

class VkService {
    static ServiceName = "VkQueued";

    private vk = new VkTypedApi();
    private queue = new PriorityQueue();

    myAudio(): Promise<AudioRecord[]> {
        return this.queue
                   .enqueueFirst(() => this.vk.myAudio(),
                                 VkOperationPriority.ApiCall);
    }

    searchAudio(query: string): Promise<AudioRecord[]> {
        return this.queue
                   .enqueueFirst(() => this.vk.searchAudio(query),
                                 VkOperationPriority.ApiCall);
    }

    getAudioSize(audio: AudioRecord[], callback: (audio: AudioRecord, fileSize:number) => void) {
        this.queue.clear(VkOperationPriority.GetFileSize);

        audio.forEach(record => {
            this.queue
                .enqueueLast(() => this.vk.getFileSize(record.id, record.url),
                             VkOperationPriority.GetFileSize)
                .then(fileSize => callback(record, fileSize));
        });
    }
}

const enum VkOperationPriority {
    ApiCall = 100,
    DownloadFile = 10,
    GetFileSize = 3
}

export = VkService;