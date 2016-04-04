/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class ListComponentController {
    static ControllerName = "ListComponentController";
    static $inject = ["$scope"];

    items: any[] = [];
    selectedItems: any[] = [];

    selectionMode: boolean = false;

    constructor(private $scope: ng.IScope) {
    }

    isSelected(item: any): boolean {
        return (this.selectedItems || []).some(e => e === item);
    }

    toggleSelection(item: any) {
        if (!this.selectionMode)
            return;

        this.selectedItems = this.selectedItems || [];

        if (this.isSelected(item))
            this.selectedItems = this.selectedItems.filter(e => e !== item) || [];
        else
            this.selectedItems.push(item);
    }

    switchToSelectionMode() {
        this.selectionMode = true;
    }
}

export var Component: ng.IComponentOptions = {
    bindings: {
        items: "<",
        selectionMode: "=",
        selectedItems: "="
    },
    controller: ListComponentController,
    controllerAs: "$c",
    template: `
    <ul>
        <li class="list-item"
            ng-repeat="$item in $c.items"
            ng-long-touch="$c.switchToSelectionMode()"
            ng-touch="$c.toggleSelection($item)">            
            <div class="list-item__container">
                <div class="list-item__selector placeholder">
                    <span class="fa fa-check-square-o">&nbsp;</span>
                </div>
                <div class="list-item__selector"
                    ng-show="$c.selectionMode">
                    <span class="fa fa-check-square-o"
                          ng-show="$c.isSelected($item)"></span>
                    <span class="fa fa-square-o" 
                          ng-show="!$c.isSelected($item)"></span>
                </div>
                <div ng-transclude></div>
            </div>
            <div class="list-item__selection-overlay"
                  ng-show="$c.selectionMode">
            </div>            
        <li>
    </ul>`,
    transclude: true
};