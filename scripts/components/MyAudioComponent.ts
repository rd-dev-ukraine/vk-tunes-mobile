/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");
import Tabs = require("./TabComponent");

@PS.Subscriber
class MyAudioController {
    static $inject = ["$scope"];

    audio: AudioInfo[]

    constructor(private $scope: ng.IScope) {        
    }

    $onInit() {
        this.reloadAudio();
        this.$scope.$on(Tabs.TabActivatedEvent, () => this.reloadAudio());
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
    controller: MyAudioController,
    template: 
`
<h2>My audio</h2>
<audio-list audio="$ctrl.audio"></audio-list>
`
};