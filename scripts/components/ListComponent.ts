/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class ListComponentController {
    static ControllerName = "ListComponentController";
    static $inject = ["$timeout"];
    
    private isSelectionToggleScheduled = true;
    
    items: any[] = [];
    selectedItems: any[] = [];
    
    selectionMode: boolean = false;
    
    constructor(private $timeout: ng.ITimeoutService) {        
    }
    
    isSelected(item: any): boolean {
        return (this.selectedItems || []).some(e => e === item);
    }
    
    toggleSelection(item: any) {
        if (!this.selectionMode)
            return;
        
        if(this.isSelected(item))
            this.selectedItems = this.selectedItems.filter(e => e !== item);            
        else
            this.selectedItems.push(item);   
    }
    
    beginToggleSelection() {
        if (this.selectionMode)
            return;
            
        this.isSelectionToggleScheduled = true;
        this.$timeout(1000, true)
            .then(() => {
                if (this.isSelectionToggleScheduled)
                    this.selectionMode = true; 
            });
    }
    
    cancelToggleSelection() {
        this.isSelectionToggleScheduled = false;
    }
}

export var Component: ng.IComponentOptions = {
    bindings: {
        items: "<",
        selectionMode: "="
    }, 
    controller: ListComponentController,
    controllerAs: "$c",
    template: `
    <ul ng-mousedown="$c.beginToggleSelection()" ng-mouseup="$c.cancelToggleSelection()">
        <li class="list-item"
            ng-repeat="$item in $c.items">
            <div class="list-item__container">
                <div class="list-item__selector"
                     style="float: left"
                     ng-show="$c.selectionMode">
                    <input type="checkbox"
                           ng-checked="$c.isSelected($item)"
                           ng-click="$c.toggleSelection($item)" />
                </div>
                <div ng-transclude></div>
            </div>
            <hr />            
        <li>
    </ul>
    `,
    transclude: true
};