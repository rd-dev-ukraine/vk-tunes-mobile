var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators", "../handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioListController = (function () {
        function AudioListController() {
            this.selectionMode = false;
        }
        AudioListController.prototype.toggleSelection = function () {
            this.selectionMode = !this.selectionMode;
        };
        AudioListController.prototype.cancelSelection = function () {
            this.selectedAudio = [];
            this.selectionMode = false;
        };
        AudioListController.prototype.downloadSelected = function () {
            if (this.selectedAudio) {
                this.publish(new Messages.DownloadAudio(this.selectedAudio));
                this.selectionMode = false;
                this.selectedAudio = [];
            }
        };
        AudioListController.prototype.selectAll = function () {
            this.selectedAudio = this.audio;
        };
        AudioListController.prototype.publish = function (message) { };
        AudioListController = __decorate([
            PS.Subscriber
        ], AudioListController);
        return AudioListController;
    }());
    exports.Component = {
        bindings: {
            audio: "<"
        },
        controller: AudioListController,
        controllerAs: "$c",
        template: "<div class=\"audio-list__button-panel\" \n          ng-show=\"$c.selectionMode\">\n         <button ng-click=\"$c.selectAll()\">Select ALL</button>\n         <button ng-click=\"$c.downloadSelected()\">Download</button>\n         <button ng-click=\"$c.cancelSelection()\">Cancel selection</button>         \n     </div>\n     <list class=\"audio-list__list\" \n           items=\"$c.audio\"\n           selected-items=\"$c.selectedAudio\"\n           selection-mode=\"$c.selectionMode\">\n         <audio-record audio=\"$parent.$item\"></audio-record>\n     </list>"
    };
});
