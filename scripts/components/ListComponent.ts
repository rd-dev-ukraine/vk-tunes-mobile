/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class ListComponentController {
    static ControllerName = "ListComponentController";
    
    items: any[] = [];
    selectedItems: any[] = [];
    
    selectionMode: boolean = false;
    
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
}

export var Component: ng.IComponentOptions = {
    bindings: {
        items: "<",
        selectionMode: "="
    }, 
    controller: ListComponentController,    
    template: `
    <ul>
        <li class="list-item"
            ng-repeat="$item in $ctrl.items">
            <div class="list-item__container">
                <div class="list-item__selector"
                     style="float: left"
                     ng-show="$ctrl.selectionMode">
                    <input type="checkbox"
                           ng-checked="$ctrl.isSelected($item)"
                           ng-click="$ctrl.toggleSelection($item)" />
                </div>
                <div ng-transclude></div>
            </div>
            <hr />            
        <li>
    </ul>
    `,
    transclude: true
};