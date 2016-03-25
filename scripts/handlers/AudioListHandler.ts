/// <reference path="../../typings/browser.d.ts" />

import VkAudioService = require("../vk/VkAudioService");
import StoredAudioService = require("../vk/StoredAudioService");
import Messages = require("Messages");
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class AudioListHandler {
    static ServiceName = "AudioListHandler";
    static $inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];
    
    constructor(private vk: VkAudioService,
                private storage: StoredAudioService) {
    }
    
    @PS.Handle(Messages.LoadMyAudio)
    loadMyAudio(message: Messages.LoadMyAudio) {       
        
        Promise.all<any>([
            this.vk.myAudio(),
            this.storage.load()
        ])
        .then(([remote, local ]) => {
            
            var list = this.audio(remote, local);
            
            this.publish(new Messages.MyAudioLoaded(list));
                
            this.vk.getAudioSize(list, (record, size) => {
                record.fileSize = size;
                this.publish(new Messages.AudioInfoUpdated(record));
            });
        });
    }
    
    public publish(message: any) { }
    
    private audio(remote: VkAudioRecord[], local: StoredAudioRecord[]): AudioInfo[] {
        
        var storedAudioIndex: { [audioId: number]: StoredAudioRecord } = {};        
        local.forEach(l => storedAudioIndex[l.id] = l);
        
        return remote.map(r => ({
            remote: r,
            local: storedAudioIndex[r.id],
            fileSize: null
        }));
    }
}

export = AudioListHandler;