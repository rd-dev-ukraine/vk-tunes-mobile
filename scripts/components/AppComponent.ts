/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import AudioListMessages = require("../handlers/AudioListMessages");

@PS.Subscriber
export class AppComponentController {
    static ControllerName = "AppComponentController";
    static $inject = ["$scope"];    
    
    constructor(private $scope: ng.IScope) {        
    }  
        
}

export var Component : ng.IComponentOptions = {
    controller: AppComponentController.ControllerName,
    templateUrl: "templates/AppComponent.html"
}
