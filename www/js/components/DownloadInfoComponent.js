var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var DownloadInfoController = (function () {
        function DownloadInfoController($scope) {
            this.$scope = $scope;
        }
        DownloadInfoController.prototype.onDownloadNotification = function (message) {
            this.currentDownloadNumber = message.index;
            this.totalDownloads = message.total;
            this.$apply();
        };
        DownloadInfoController.prototype.onDownloadProgress = function (message) {
            this.currentDownload = message.audio;
            this.currentDownloadProgress = message.progress;
            this.$apply();
        };
        DownloadInfoController.prototype.totalDownloadPercent = function () {
            if (!this.totalDownloads)
                return 0;
            return (this.currentDownloadNumber / this.totalDownloads) * 100;
        };
        DownloadInfoController.prototype.$apply = function () {
            this.$scope.$$phase || this.$scope.$digest();
        };
        DownloadInfoController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.DownloadInfoNotification)
        ], DownloadInfoController.prototype, "onDownloadNotification", null);
        __decorate([
            PS.Handle(Messages.DownloadProgress)
        ], DownloadInfoController.prototype, "onDownloadProgress", null);
        DownloadInfoController = __decorate([
            PS.Subscriber
        ], DownloadInfoController);
        return DownloadInfoController;
    }());
    exports.Component = {
        controller: DownloadInfoController,
        controllerAs: "$c",
        template: "\n    <div class=\"download-info__content\" ng-show=\"$c.totalDownloads\">\n        <div class=\"download-info__title\">\n            [{{$c.currentDownloadNumber}}/{{$c.totalDownloads}}] {{$c.currentDownload.remote.artist}} - {{$c.currentDownload.remote.title}}\n        </div>\n        <progress-bar class=\"download-info__current-progress\" \n                      progress=\"$c.currentDownloadProgress.percent\"></progress-bar>\n        <progress-bar class=\"download-info__total-progress\" \n                      progress=\"$c.totalDownloadPercent()\"></progress-bar>\n    </div>\n"
    };
});
