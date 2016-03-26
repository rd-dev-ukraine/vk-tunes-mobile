/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");

@PS.Subscriber
class AppComponentController {
    static $inject = ["$scope"];    
    
    constructor(private $scope: ng.IScope) {        
    }  
        
}

export var Component : ng.IComponentOptions = {
    controller: AppComponentController,
    template:
`
<div>
    <h1>VK-Tunes mobile app</h1>
    <tab>
        <tab-item title="My Audio">
            <my-audio></my-audio>
        </tab-item>
        <tab-item title="Search Audio">
            <search-audio></search-audio>
        </tab-item>
    </tab>
</div>
`
}
