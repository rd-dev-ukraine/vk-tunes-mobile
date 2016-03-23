/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import AudioListMessages = require("../handlers/AudioListMessages");

@PS.Subscriber
export class AppComponentController {
    static ControllerName = "AppComponentController";    
    audio: AudioRecord[];
    
    $onInit() {
        this.publish(new AudioListMessages.MyAudioLoad());
    }
    
    @PS.Handle(AudioListMessages.MyAudioLoaded)
    audioLoaded(message: AudioListMessages.MyAudioLoaded) {
        this.audio = message.audio;
    }
    
    publish(message: any) {}    
}

export var componentConfiguration : ng.IComponentOptions = {
    controller: AppComponentController.ControllerName,
    templateUrl: "templates/AppComponent.html"
}
