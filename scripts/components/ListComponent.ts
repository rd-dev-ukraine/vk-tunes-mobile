/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
export class ListComponentController {
    static ControllerName = "ListComponentController";
    
    items: any[] = [];
}

export var Component: ng.IComponentOptions = {
    bindings: {
        items: "<"        
    }, 
    controller: ListComponentController.ControllerName,    
    templateUrl: "templates/ListComponent.html",
    transclude: true
};