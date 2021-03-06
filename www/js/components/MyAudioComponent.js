var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages", "./TabComponent"], function (require, exports, PS, Messages, Tabs) {
    "use strict";
    var MyAudioController = (function () {
        function MyAudioController($scope) {
            this.$scope = $scope;
        }
        MyAudioController.prototype.$onInit = function () {
            var _this = this;
            this.reloadAudio();
            this.$scope.$on(Tabs.TabActivatedEvent, function () { return _this.reloadAudio(); });
        };
        MyAudioController.prototype.reloadAudio = function () {
            this.publish(new Messages.LoadMyAudio());
        };
        MyAudioController.prototype.onAudioLoaded = function (message) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        };
        MyAudioController.prototype.onAudioDeleted = function (message) {
            if (message.audio) {
                this.audio = this.audio.filter(function (a) { return a.remote.id !== message.audio.remote.id; });
                this.$scope.$$phase || this.$scope.$digest();
            }
        };
        MyAudioController.prototype.publish = function (message) { };
        MyAudioController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.MyAudioLoaded)
        ], MyAudioController.prototype, "onAudioLoaded", null);
        __decorate([
            PS.Handle(Messages.AudioDeleted)
        ], MyAudioController.prototype, "onAudioDeleted", null);
        MyAudioController = __decorate([
            PS.Subscriber
        ], MyAudioController);
        return MyAudioController;
    }());
    exports.Component = {
        controller: MyAudioController,
        template: "\n<audio-list audio=\"$ctrl.audio\">\n</audio-list>\n"
    };
});
