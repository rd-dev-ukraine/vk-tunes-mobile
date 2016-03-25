/// <references path="../typings/main.d.ts" />

import Directory = require("filesys/Directory");
import VkService = require("vk/VkService");
import StoredAudioService = require("vk/StoredAudioService");

import EventBus = require("pub-sub/EventBus");

import List = require("components/ListComponent");

import App = require("components/AppComponent");
import MyAudio = require("components/MyAudioComponent");
import AudioRecord = require("components/AudioRecordComponent");

import AudioListHandler = require("handlers/AudioListHandler");

export function onDeviceReady() {
    console.log("Device ready called");
    
    angular.module("vk-tunes", [])           
           .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
           .service(Directory.ServiceName, Directory)           
           .service(VkService.ServiceName, VkService)
           .service(StoredAudioService.ServiceName, StoredAudioService)
           .service(AudioListHandler.ServiceName, AudioListHandler)
           .controller(App.AppComponentController.ControllerName, App.AppComponentController)
           .component("app", App.Component)
           .controller(List.ListComponentController.ControllerName, List.ListComponentController)
           .component("list", List.Component)  
           .controller(MyAudio.MyAudioController.ControllerName, MyAudio.MyAudioController)
           .component("myAudio", MyAudio.Configuration)
           .controller(AudioRecord.AudioRecordController.ControllerName, AudioRecord.AudioRecordController)
           .component("audioRecord", AudioRecord.Configuration)
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