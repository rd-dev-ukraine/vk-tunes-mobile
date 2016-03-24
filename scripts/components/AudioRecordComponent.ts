/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/AudioListMessages");

@PS.Subscriber
export class AudioRecordController {
    static ControllerName = "AudioRecordController";
    static $inject = ["$scope"];
    
    audio: AudioRecord;
    fileSize: number;
    
    constructor(private $scope: ng.IScope) { }
    
    @PS.Handle(Messages.AudioSizeLoaded)
    onAudioSizeGot(message: Messages.AudioSizeLoaded) {
        if (this.audio && this.audio.id === message.audio.id) {
            this.fileSize = message.fileSize;
            this.$scope.$$phase || this.$scope.$digest();
        }
    }
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"  
    },
    controller: AudioRecordController.ControllerName,
    templateUrl: "templates/AudioRecordComponent.html"        
};