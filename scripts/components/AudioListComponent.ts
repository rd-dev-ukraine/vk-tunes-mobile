/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
class AudioListController {
    audio: AudioInfo[];
    selectedAudio: AudioInfo[];
    
    selectionMode: boolean = false;    
    
    toggleSelection() {
        this.selectionMode = !this.selectionMode;
    }
    
    downloadSelected() {
        if (this.selectedAudio) {
            this.publish(new Messages.DownloadAudio(this.selectedAudio));
        }
    }
    
    publish(message: any) {}
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioListController,
    controllerAs: "$c",        
    template: 
    `<div ng-show="!$c.selectionMode">
         <button ng-click="$c.toggleSelection()">Select</button>
     </div>
     <div ng-show="$c.selectionMode">
         <button ng-click="$c.toggleSelection()">Cancel selection</button>
         <button ng-click="$c.downloadSelected()">Download</button>
     </div>
     <div>{{ $c.selectedAudio | json }}</div>
     <list items="$c.audio"
           selectedItems="$c.selectedAudio"
           selection-mode="$c.selectionMode">
         <audio-record audio="$parent.$item"></audio-record>
     </list>`    
};