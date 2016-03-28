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
        AudioListController.prototype.downloadSelected = function () {
            if (this.selectedAudio) {
                this.publish(new Messages.DownloadAudio(this.selectedAudio));
            }
        };
        AudioListController.prototype.onSelection = function (items) {
            this.selectedAudio = items;
        };
        AudioListController.prototype.publish = function (message) { };
        AudioListController = __decorate([
            PS.Subscriber
        ], AudioListController);
        return AudioListController;
    }());
    exports.Configuration = {
        bindings: {
            audio: "<"
        },
        controller: AudioListController,
        controllerAs: "$c",
        template: "<div ng-show=\"!$c.selectionMode\">\n         <button ng-click=\"$c.toggleSelection()\">Select</button>\n     </div>\n     <div ng-show=\"$c.selectionMode\">\n         <button ng-click=\"$c.toggleSelection()\">Cancel selection</button>\n         <button ng-click=\"$c.downloadSelected()\">Download</button>\n     </div>\n     <div>{{ $c.selectedAudio | json }}</div>\n     <list items=\"$c.audio\"\n           on-selection=\"$c.onSelection(selectedItems)\"\n           selection-mode=\"$c.selectionMode\">\n         <audio-record audio=\"$parent.$item\"></audio-record>\n     </list>"
    };
});
