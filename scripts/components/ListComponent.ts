/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class ListComponentController {
    static ControllerName = "ListComponentController";
    
    items: any[] = [];
}

export var Component: ng.IComponentOptions = {
    bindings: {
        items: "<"        
    }, 
    controller: ListComponentController,    
    template: `
    <ul>
        <li ng-repeat="$item in $ctrl.items">
            <div ng-transclude></div>
            <hr />
        <li>
    </ul>
    `,
    transclude: true
};