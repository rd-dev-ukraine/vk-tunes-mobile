/// <references path="../typings/main.d.ts" />

import Directory = require("filesys/Directory");
import VkAudioService = require("vk/VkAudioService");
import StoredAudioService = require("vk/StoredAudioService");

import EventBus = require("pub-sub/EventBus");

import List = require("components/ListComponent");
import Tabs = require("components/TabComponent");

import App = require("components/AppComponent");
import MyAudio = require("components/MyAudioComponent");
import SearchAudio = require("components/SearchAudioComponent");
import AudioRecord = require("components/AudioRecordComponent");
import AudioList = require("components/AudioListComponent");

import AudioListHandler = require("handlers/AudioListHandler");

export function onDeviceReady() {

    angular.module("vk-tunes", [])
           .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
           .service(Directory.ServiceName, Directory)
           .service(VkAudioService.ServiceName, VkAudioService)
           .service(StoredAudioService.ServiceName, StoredAudioService)
           .service(AudioListHandler.ServiceName, AudioListHandler)
           .component("app", App.Component)           
           .component("list", List.Component)
           .component("tab", Tabs.TabConfiguration)
           .component("tabItem", Tabs.TabItemConfiguration)
           .component("audioList", AudioList.Configuration)
           .component("myAudio", MyAudio.Configuration)
           .component("searchAudio", SearchAudio.Configuration)
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