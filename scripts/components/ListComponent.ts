/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class ListComponentController {
    static ControllerName = "ListComponentController";
    static $inject = ["$scope", "$timeout"];

    private selectionTogglePromise: ng.IPromise<any>;

    items: any[] = [];
    selectedItems: any[] = [];

    selectionMode: boolean = false;

    constructor(private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService) {
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

    beginToggleSelection() {
        if (this.selectionMode)
            return;

        this.selectionTogglePromise = this.$timeout(1000, true);

        this.selectionTogglePromise
            .then(() => {
                this.selectionMode = true;
            });
    }

    cancelToggleSelection() {
        if (this.selectionTogglePromise)
            this.$timeout.cancel(this.selectionTogglePromise);
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
            ng-mousedown="$c.beginToggleSelection()" 
            ng-mouseup="$c.cancelToggleSelection()" 
            ng-mousemove="$c.cancelToggleSelection()"
            ng-touchstart="$c.beginToggleSelection()" 
            ng-touchend="$c.cancelToggleSelection()" 
            ng-touchmove="$c.cancelToggleSelection()">            
            <div class="list-item__container"
                ng-touchstart="$c.toggleSelection($item)"
                ng-mousedown="$c.toggleSelection($item)">
                <div class="list-item__selector placeholder">
                    <span class="fa">&nbsp;</span>
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
        <li>
    </ul>`,
    transclude: true
};