/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
export class SearchAudioController {
    static ControllerName = "SearchAudioController";
    static $inject = ["$scope"];

    query: string;
    audio: AudioInfo[]

    constructor(private $scope: ng.IScope) {
    }

    $onInit() {
        this.reloadAudio();
    }

    reloadAudio() {
        this.publish(new Messages.SearchAudio(this.query));
    }

    @PS.Handle(Messages.SearchAudioResultLoaded)
    onAudioLoaded(message: Messages.SearchAudioResultLoaded) {
        this.audio = message.audio;
        this.$scope.$$phase || this.$scope.$digest();
    }

    publish(message: any) {}
}

export var Configuration: ng.IComponentOptions = {
    controller: SearchAudioController.ControllerName,
    templateUrl: "templates/SearchAudioComponent.html"
};