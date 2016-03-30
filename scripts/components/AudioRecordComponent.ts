/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
class AudioRecordController {
    static $inject = ["$scope"];

    audio: AudioInfo;
    downloadProgress: IAudioDownloadingProgress;

    constructor(private $scope: ng.IScope) { }

    @PS.Handle(Messages.AudioInfoUpdated)
    onAudioUpdated(message: Messages.AudioInfoUpdated) {
        if (this.audio && this.audio.remote.id === message.audio.remote.id) {
            this.audio = message.audio;
            this.$apply()
        }
    }
    
    @PS.Handle(Messages.DownloadProgress)
    onAudioDownloading(message: Messages.DownloadProgress) {
        if (this.audio && this.audio.remote.id === message.audio.remote.id) {
            this.downloadProgress = message.progress;
            this.$apply();
        }
    }
    
    private $apply() {
        this.$scope.$$phase || this.$scope.$digest();
    }
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioRecordController,
    controllerAs: "$c",
    template:
    `
<div>
  <span ng-show="$c.audio.isInMyAudio">[*] </span>
  <span ng-show="$c.audio.local">[@]</span>
  <strong>{{$c.audio.remote.artist}}</strong> - {{$c.audio.remote.title}}  
</div>
<div>
    File size <em>{{$c.audio.fileSize}}</em> bytes
</div>
<div ng-show="$c.downloadProgress">
    Downloading {{$c.downloadProgress.percent}}%   [{{$c.downloadProgress.bytesLoaded}}/{{$c.downloadProgress.bytesTotal}}]
</div>
`
};