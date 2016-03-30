/// <reference path="../../typings/browser.d.ts" />

class ProgressBarComponentController {
    progress: number;
    
    width() {
        return `${this.progress || 0}%`;
    }
}

export var Component: ng.IComponentOptions = {
    bindings: {
        progress: "="        
    },
    controller: ProgressBarComponentController,
    controllerAs: "$c",
    template:
 `
    <div class="progress-bar">
        <div class="progress-bar__progress-indicator"
             ng-style="{ 'width': $c.width()  }"></div>
    </div>
 `
};