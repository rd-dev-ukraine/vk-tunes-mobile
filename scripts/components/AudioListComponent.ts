/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

class AudioListController {
    audio: AudioInfo[];
    selectionMode: boolean = false;    
    
    toggleSelection() {
        this.selectionMode = !this.selectionMode;
    }
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"
    },
    controller: AudioListController,        
    template: 
    `<div>
         <button ng-click="$ctrl.toggleSelection()">Select</button>
     </div>
     <list items="$ctrl.audio" selectionMode="$ctrl.selectionMode">
         <audio-record audio="$parent.$item"></audio-record>
     </list>`    
};