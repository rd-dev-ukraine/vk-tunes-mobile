/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import AudioListMessages = require("../handlers/AudioListMessages");

@PS.Subscriber
export class AppComponentController {
    static ControllerName = "AppComponentController";
    static $inject = ["$scope"];    
    audio: AudioRecord[];
    
    constructor(private $scope: ng.IScope) {        
    }
    
    $onInit() {
        console.log("$onInit");
        this.reloadAudio();
    }
    
    @PS.Handle(AudioListMessages.MyAudioLoaded)
    audioLoaded(message: AudioListMessages.MyAudioLoaded) {
        this.audio = message.audio;
        this.$scope.$$phase || this.$scope.$digest();
    }
    
    publish(message: any) {}
    
    reloadAudio() {
        this.publish(new AudioListMessages.MyAudioLoad());
    }    
}

export var componentConfiguration : ng.IComponentOptions = {
    controller: AppComponentController.ControllerName,
    templateUrl: "templates/AppComponent.html"
}
