/// <references path="../typings/main.d.ts" />

import LongClickDirective = require("./directives/LongClick");

import FileSizeFilter = require("./filters/FileSize");
import DurationFilter = require("./filters/Duration");

import Directory = require("./filesys/Directory");
import VkAudioService = require("./vk/VkAudioService");
import StoredAudioService = require("./vk/StoredAudioService");

import EventBus = require("./pub-sub/EventBus");

import List = require("./components/ListComponent");
import Tabs = require("./components/TabComponent");
import ProgressBar = require("./components/ProgressBarComponent");
import SearchBox = require("./components/SearchBoxComponent");

import App = require("./components/AppComponent");
import Header = require("./components/HeaderComponent");
import MyAudio = require("./components/MyAudioComponent");
import SearchAudio = require("./components/SearchAudioComponent");
import AudioRecord = require("./components/AudioRecordComponent");
import AudioList = require("./components/AudioListComponent");
import DownloadInfo = require("./components/DownloadInfoComponent");

import AudioListHandler = require("./handlers/AudioListHandler");
import DownloadAudioHandler = require("./handlers/DownloadAudioHandler");

export function onDeviceReady() {

    angular.module("vk-tunes", [])
           .directive("ngLongTouch", LongClickDirective)
           .filter("filesize", FileSizeFilter)
           .filter("duration", DurationFilter)
           .service(Directory.ServiceName, Directory)
           .service(VkAudioService.ServiceName, VkAudioService)
           .service(StoredAudioService.ServiceName, StoredAudioService)
           .service(AudioListHandler.ServiceName, AudioListHandler)
           .service(DownloadAudioHandler.ServiceName, DownloadAudioHandler)
           .component("app", App.Component)           
           .component("header", Header.Component)
           .component("list", List.Component)
           .component("tab", Tabs.TabComponent)
           .component("tabItem", Tabs.TabItemComponent)
           .component("searchBox", SearchBox.Component)
           .component("progressBar", ProgressBar.Component)           
           .component("audioList", AudioList.Component)
           .component("myAudio", MyAudio.Component)
           .component("searchAudio", SearchAudio.Component)
           .component("audioRecord", AudioRecord.Component)
           .component("downloadInfo", DownloadInfo.Component)
           .config(function($locationProvider) {
               $locationProvider.html5Mode(true);
           })
           .run([
               AudioListHandler.ServiceName,
               DownloadAudioHandler.ServiceName,
               (audioListHandler, downloadAudioHandler) => {
                   // Do nothing, just to ensure all handlers are instantiated.
               }
           ]);

    angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
}

document.addEventListener("deviceready", onDeviceReady, false);