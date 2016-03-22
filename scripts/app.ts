/// <references path="../typings/main.d.ts" />

import VkApi = require("vk/VkApi");
import VkService = require("vk/VkService");
import Queue = require("vk/Queue");
import Directory = require("filesys/Directory");

import appComponent = require("components/AppComponent");

export function onDeviceReady() {
    console.log("Device ready called");
    
    angular.module("vk-tunes", [])
           .service(VkApi.ServiceName, VkApi)
           .service(VkService.ServiceName, VkService)
           .service(Queue.ServiceName, Queue)
           .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
           .service(Directory.ServiceName, Directory)
           .component("app", appComponent)
           .config(function($locationProvider) {
               $locationProvider.html5Mode(true);
           });
        
    angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
}

document.addEventListener("deviceready", onDeviceReady, false);