/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
class AudioRecordController {
    static $inject = ["$scope"];

    audio: AudioInfo;
    downloadProgress: IAudioDownloadingProgress;
    
    isExpanded = false;

    constructor(private $scope: ng.IScope) { }
    
    bitrate () {
        if (this.audio.fileSize && this.audio.remote && this.audio.remote.duration) {
            const bitrate = (this.audio.fileSize / this.audio.remote.duration / 1024 * 8).toFixed(0);
            return `${bitrate}Kbps`;
        }
        
        return "";
    }
    
    toggleExpand() {
        this.isExpanded = !this.isExpanded;
    }

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
<div ng-long-touch="" ng-touch="$c.toggleExpand()">
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
    <div class="audio-record-badges">
        <span class="audio-record-badge my-audio"
            ng-show="$c.audio.isInMyAudio">
            <span class="fa fa-star-o audio-record-badge__icon"></span>
            <span class="audio-record-badge__text">
                My audio
            </span>
        </span>
        <span class="audio-record-badge on-device"
            ng-show="$c.audio.local">
            <span class="fa fa-hdd-o audio-record-badge__icon"></span>
            <span class="audio-record-badge__text">
                On device
            </span>
        </span>
        <span class="audio-record-badge file-size"
            ng-show="$c.audio.fileSize">        
            <span class="audio-record-badge__text">
                {{$c.audio.fileSize | filesize}}
            </span>
        </span>
        <span class="audio-record-badge bitrate"
            ng-show="$c.audio.fileSize">        
            <span class="audio-record-badge__text">
                {{$c.bitrate()}}
            </span>
        </span>
        
    </div>
    <div class="audio-record-download-progress"
        ng-show="$c.downloadProgress">
        Downloading {{$c.downloadProgress.percent}}%   [{{$c.downloadProgress.bytesLoaded | filesize}}/{{$c.downloadProgress.bytesTotal | filesize}}]
        <progress-bar progress="$c.downloadProgress.percent"></progress-bar>
    </div>
</div>
<div class="audio-record__expand-area"
     ng-show="$c.isExpanded">
    <button ng-disabled="$c.audio.isInMyAudio" 
            type="button">
        Add to my audio
    </button>
    <button ng-disabled="!$c.audio.isInMyAudio" 
            type="button">
        Remove from my audio
    </button>
</div>
`
};