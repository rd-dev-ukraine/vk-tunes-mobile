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
    
    @PS.Handle(Messages.MyAudioLoad)
    loadMyAudio(message: Messages.MyAudioLoad) {
        this.publish(new Messages.MyAudioLoaded([
            {
                album_id: 0,
                artist: "Queen",
                duration: 233,
                genre_id: 1,
                id: 2344234,
                lyrics_id: -1,
                owner_id: 3424,
                title: "Too much love will kill you",
                url: "http://vk.com/audio-files/asdasd.asdasdlad123234..34234"
            }
        ]));
    }
    
    public publish(message: any) {        
    }
}

export = AudioListHandler;