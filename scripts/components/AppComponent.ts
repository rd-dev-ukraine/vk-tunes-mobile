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
<div class="app">
    <h1 class="app__header">VK-Tunes mobile app</h1>
    <download-info class="app__download-info"></download-info>
    <div class="app__content">
        <tab class="app__tab">
            <tab-item header-class="tab-button my-audio"
                      title="My Audio">
                <my-audio></my-audio>
            </tab-item>
            <tab-item header-class="tab-button search-audio" 
                      title="Search Audio">
                <search-audio></search-audio>
            </tab-item>
        </tab>
    </div>
</div>
`
}
