var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var SearchAudioController = (function () {
        function SearchAudioController($scope) {
            this.$scope = $scope;
        }
        SearchAudioController.prototype.$onInit = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.query; }, function () { return _this.reloadAudio(); });
        };
        SearchAudioController.prototype.reloadAudio = function () {
            if (this.query)
                this.publish(new Messages.SearchAudio(this.query));
            else
                this.audio = [];
        };
        SearchAudioController.prototype.onAudioLoaded = function (message) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        };
        SearchAudioController.prototype.publish = function (message) { };
        SearchAudioController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.SearchAudioResultLoaded)
        ], SearchAudioController.prototype, "onAudioLoaded", null);
        SearchAudioController = __decorate([
            PS.Subscriber
        ], SearchAudioController);
        return SearchAudioController;
    }());
    exports.Component = {
        controller: SearchAudioController,
        controllerAs: "$c",
        template: "\n<search-box value=\"$c.query\"></search-box>\n<audio-list audio=\"$c.audio\"></audio-list>\n"
    };
});
