/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
class AudioRecordController {
    static $inject = ["$scope"];

    audio: AudioInfo;

    constructor(private $scope: ng.IScope) { }

    @PS.Handle(Messages.AudioInfoUpdated)
    onAudioSizeGot(message: Messages.AudioInfoUpdated) {

        if (this.audio && this.audio.remote.id === message.audio.remote.id) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        }
    }
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioRecordController,
    template:
`
<div>
  <span ng-show="$ctrl.audio.isInMyAudio">[*] </span>
  <strong>{{$ctrl.audio.remote.artist}}</strong> - {{$ctrl.audio.remote.title}}
  <em>{{$ctrl.audio.fileSize}}</em>
</div>
`
};