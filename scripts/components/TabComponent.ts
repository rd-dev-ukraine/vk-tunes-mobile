/// <reference path="../../typings/browser.d.ts" />

export var TabActivatedEvent = "$tabActivated";

class TabComponentController {
    tabs: TabItemController[] = [];

    addTab(tab: TabItemController) {
        this.tabs.push(tab);
        if (this.tabs.length === 1)
            this.select(tab);
    }

    select(tab: TabItemController) {
        this.tabs.forEach(t => t.selected = false);
        tab.selected = true;
        tab.$onActivate();
    }
}

class TabItemController {
    static $inject = ["$scope"];
    
    selected = false;
    title: string = "";
    
    constructor(private $scope: ng.IScope) {        
    }

    tab: TabComponentController;

    $onInit() {
        this.tab.addTab(this);
    }
    
    $onActivate() {
        this.$scope.$broadcast(TabActivatedEvent, this);
    }
}

export var TabComponent: ng.IComponentOptions = {
    transclude: true,
    controller: TabComponentController,
    template: 
`
<div class="tab">
    <ul class="tab__header">
        <li class="tab-header__item {{tab.headerCss}}"        
            ng-repeat="tab in $ctrl.tabs"
            ng-click="$ctrl.select(tab)"
            ng-class="{ active: tab.selected }">
            {{tab.title}}            
        </li>
    </ul>
    <div class="tab__tab-container">
        <div class="tab__content" ng-transclude>
        </div>
    </div>
</div>
`
};

export var TabItemComponent: ng.IComponentOptions = {
    bindings: {
        title: "@",
        headerCss: "@headerClass"
    },
    controller: TabItemController,
    require: {
        tab: "^tab"
    },
    transclude: true,
    template: 
`
<div class="tab-item__content" ng-show="$ctrl.selected" ng-transclude></div>
`
};