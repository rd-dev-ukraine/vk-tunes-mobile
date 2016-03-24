/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/AudioListMessages");


export class AudioRecordController {
    static ControllerName = "AudioRecordController";
    static $inject = ["$scope"];
    
    audio: AudioRecord;
    
    constructor(private $scope: ng.IScope) { }
}

export var Configuration: ng.IComponentOptions = {
    bindings: {
        audio: "<"  
    },
    controller: AudioRecordController.ControllerName,
    templateUrl: "templates/AudioRecordComponent.html"        
};