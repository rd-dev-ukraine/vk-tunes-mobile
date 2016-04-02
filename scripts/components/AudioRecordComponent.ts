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

export var Component: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioRecordController,
    controllerAs: "$c",
    template:
    `
<div class="audio-record-headline">
    <div class="audio-record-headline__content audio-record-title">  
        <span class="audio-record-title__artist">
            {{$c.audio.remote.artist}}
        </span> - 
        <span class="audio-record-title__title">
            {{$c.audio.remote.title}}
        </span>    
    </div>
    <div class="audio-record-headline__badge audio-record-duration">
        {{$c.audio.remote.duration | duration}}
    </div>
</div>
<div>
    <span ng-show="$c.audio.isInMyAudio">[*] </span>
    <span ng-show="$c.audio.local">[@]</span>
    File size <em>{{$c.audio.fileSize | filesize}}</em> 
</div>
<div ng-show="$c.downloadProgress">
    Downloading {{$c.downloadProgress.percent}}%   [{{$c.downloadProgress.bytesLoaded}}/{{$c.downloadProgress.bytesTotal}}]
    <progress-bar progress="$c.downloadProgress.percent"></progress-bar>
</div>
`
};