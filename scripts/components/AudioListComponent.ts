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
    
    cancelSelection() {
        this.selectedAudio = [];
        this.selectionMode = false;
    }
    
    downloadSelected() {
        if (this.selectedAudio) {
            this.publish(new Messages.DownloadAudio(this.selectedAudio));
            this.selectionMode = false;
            this.selectedAudio = [];
        }
    }
    
    selectAll() {
        this.selectedAudio = this.audio;
    }
    
    publish(message: any) {}
}

export var Component: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioListController,
    controllerAs: "$c",        
    template: 
    `<div class="audio-list__button-panel" 
          ng-show="$c.selectionMode">
         <button ng-click="$c.selectAll()">Select ALL</button>
         <button ng-click="$c.downloadSelected()">Download</button>
         <button ng-click="$c.cancelSelection()">Cancel selection</button>         
     </div>
     <list items="$c.audio"
           selected-items="$c.selectedAudio"
           selection-mode="$c.selectionMode">
         <audio-record audio="$parent.$item"></audio-record>
     </list>`    
};