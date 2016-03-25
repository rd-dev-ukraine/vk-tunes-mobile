/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/AudioListMessages");

@PS.Subscriber
export class MyAudioController {
    static ControllerName = "MyAudioController";
    static $inject = ["$scope"];

    audio: AudioInfo[]

    constructor(private $scope: ng.IScope) {
    }

    $onInit() {
        this.reloadAudio();
    }

    reloadAudio() {
        this.publish(new Messages.LoadMyAudio());
    }

    @PS.Handle(Messages.MyAudioLoaded)
    onAudioLoaded(message: Messages.MyAudioLoaded) {
        this.audio = message.audio;
        this.$scope.$$phase || this.$scope.$digest();
    }

    publish(message: any) {}
}

export var Configuration: ng.IComponentOptions = {
    controller: MyAudioController.ControllerName,
    templateUrl: "templates/MyAudioComponent.html"
};