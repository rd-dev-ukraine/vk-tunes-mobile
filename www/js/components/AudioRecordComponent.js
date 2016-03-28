var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioRecordController = (function () {
        function AudioRecordController($scope) {
            this.$scope = $scope;
        }
        AudioRecordController.prototype.onAudioUpdated = function (message) {
            if (this.audio && this.audio.remote.id === message.audio.remote.id) {
                this.audio = message.audio;
                this.$scope.$$phase || this.$scope.$digest();
            }
        };
        AudioRecordController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.AudioInfoUpdated)
        ], AudioRecordController.prototype, "onAudioUpdated", null);
        AudioRecordController = __decorate([
            PS.Subscriber
        ], AudioRecordController);
        return AudioRecordController;
    }());
    exports.Configuration = {
        bindings: {
            audio: "<"
        },
        controller: AudioRecordController,
        controllerAs: "$c",
        template: "\n<div>\n  <span ng-show=\"$c.audio.isInMyAudio\">[*] </span>\n  <span ng-show=\"$c.audio.local\">[@]</span>\n  <strong>{{$c.audio.remote.artist}}</strong> - {{$c.audio.remote.title}}\n  <em>{{$c.audio.fileSize}}</em>\n</div>\n"
    };
});
