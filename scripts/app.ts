/// <references path="../typings/main.d.ts" />

import VkApi = require("vk/VkApi");
import VkService = require("vk/VkService");
import PriorityQueue = require("task-queue/PriorityQueue");
import Directory = require("filesys/Directory");

import EventBus = require("pub-sub/EventBus");

import App = require("components/AppComponent");
import AudioListHandler = require("handlers/AudioListHandler");

export function onDeviceReady() {
    console.log("Device ready called");
    
    angular.module("vk-tunes", [])           
           .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
           .service(Directory.ServiceName, Directory)           
           .service(VkService.ServiceName, VkService)
           .service(AudioListHandler.ServiceName, AudioListHandler)
           .controller(App.AppComponentController.ControllerName, App.AppComponentController)
           .component("app", App.componentConfiguration)
           .config(function($locationProvider) {
               $locationProvider.html5Mode(true);
           })
           .run([
               AudioListHandler.ServiceName,
               (audioListHandler: AudioListHandler) => {
                   // Do nothing, just to ensure AudioListHandler is instantiated.
               }
           ]);
        
    angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
}

document.addEventListener("deviceready", onDeviceReady, false);