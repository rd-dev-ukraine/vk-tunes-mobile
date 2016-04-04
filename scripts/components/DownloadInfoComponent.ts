/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");


@PS.Subscriber
class DownloadInfoController {
    static $inject = ["$scope"];
        
    currentDownload: AudioInfo;
    currentDownloadProgress: IAudioDownloadingProgress;
    currentDownloadNumber: number;
    totalDownloads: number;

    constructor(private $scope: ng.IScope) { }

    @PS.Handle(Messages.DownloadInfoNotification)
    onDownloadNotification(message: Messages.DownloadInfoNotification) {
        this.currentDownloadNumber = message.index;
        this.totalDownloads = message.total;
        
        this.$apply();
    }

    @PS.Handle(Messages.DownloadProgress)
    onDownloadProgress(message: Messages.DownloadProgress) {
        this.currentDownload = message.audio;
        this.currentDownloadProgress = message.progress;
        
        this.$apply();
    }
    
    totalDownloadPercent(): number {
        if (!this.totalDownloads)
            return 0;
            
        return (this.currentDownloadNumber / this.totalDownloads) * 100;
    }

    private $apply() {
        this.$scope.$$phase || this.$scope.$digest();
    }
}

export var Component: ng.IComponentOptions = {
    controller: DownloadInfoController,
    controllerAs: "$c",
    template:
    `
    <div class="download-info__content" ng-show="$c.totalDownloads">
        <div class="download-info__title">
            [{{$c.currentDownloadNumber}}/{{$c.totalDownloads}}] {{$c.currentDownload.remote.artist}} - {{$c.currentDownload.remote.title}}
        </div>
        <progress-bar class="download-info__current-progress" 
                      progress="$c.currentDownloadProgress.percent"></progress-bar>
        <progress-bar class="download-info__total-progress" 
                      progress="$c.totalDownloadPercent()"></progress-bar>
    </div>
`
};