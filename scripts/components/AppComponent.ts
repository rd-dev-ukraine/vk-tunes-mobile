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
    <div class="app__content">
        <tab class="app__tab">
            <tab-item header-class="tab-button my-audio"
                      title="My Audio">
                <div class="audio-page">      
                    <header title="My audio"></header>                    
                    <download-info class="app__download-info"></download-info>
                    <my-audio ></my-audio>
                </div>
            </tab-item>
            <tab-item header-class="tab-button search-audio" 
                      title="Search Audio">
                <div class="audio-page">
                    <header title="Search audio"></header>                    
                    <download-info class="app__download-info"></download-info>
                    <search-audio></search-audio>
                </div>
            </tab-item>
        </tab>
    </div>
</div>
`
}
