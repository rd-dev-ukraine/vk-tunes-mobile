/// <reference path="../../typings/browser.d.ts" />

import VkService = require("../vk/VkService");
import Messages = require("AudioListMessages");
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class AudioListHandler {
    static ServiceName = "AudioListHandler";
    static $inject = [VkService.ServiceName];
    
    constructor(private vk: VkService) {        
    }
    
    @PS.Handle(Messages.LoadMyAudio)
    loadMyAudio(message: Messages.LoadMyAudio) {
        
        this.vk
            .myAudio()
            .then(audio => {             
                
                this.publish(new Messages.MyAudioLoaded(audio));
                
                this.vk.getAudioSize(audio, (record, size) => {
                    this.publish(new Messages.AudioSizeLoaded(record, size));
                });
            });
    }
    
    public publish(message: any) { }
}

export = AudioListHandler;