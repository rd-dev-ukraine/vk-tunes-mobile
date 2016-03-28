/// <references path="../typings/main.d.ts" />
define(["require", "exports", "./filesys/Directory", "./vk/VkAudioService", "./vk/StoredAudioService", "./components/ListComponent", "./components/TabComponent", "./components/AppComponent", "./components/MyAudioComponent", "./components/SearchAudioComponent", "./components/AudioRecordComponent", "./components/AudioListComponent", "./handlers/AudioListHandler", "./handlers/DownloadAudioHandler"], function (require, exports, Directory, VkAudioService, StoredAudioService, List, Tabs, App, MyAudio, SearchAudio, AudioRecord, AudioList, AudioListHandler, DownloadAudioHandler) {
    "use strict";
    function onDeviceReady() {
        angular.module("vk-tunes", ["ngTouch"])
            .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
            .service(Directory.ServiceName, Directory)
            .service(VkAudioService.ServiceName, VkAudioService)
            .service(StoredAudioService.ServiceName, StoredAudioService)
            .service(AudioListHandler.ServiceName, AudioListHandler)
            .service(DownloadAudioHandler.ServiceName, DownloadAudioHandler)
            .component("app", App.Component)
            .component("list", List.Component)
            .component("tab", Tabs.TabConfiguration)
            .component("tabItem", Tabs.TabItemConfiguration)
            .component("audioList", AudioList.Configuration)
            .component("myAudio", MyAudio.Configuration)
            .component("searchAudio", SearchAudio.Configuration)
            .component("audioRecord", AudioRecord.Configuration)
            .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        })
            .run([
            AudioListHandler.ServiceName,
            DownloadAudioHandler.ServiceName,
            function (audioListHandler, downloadAudioHandler) {
                // Do nothing, just to ensure all handlers are instantiated.
            }
        ]);
        angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
    }
    exports.onDeviceReady = onDeviceReady;
    document.addEventListener("deviceready", onDeviceReady, false);
});
