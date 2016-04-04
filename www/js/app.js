/// <references path="../typings/main.d.ts" />
define(["require", "exports", "./directives/LongClick", "./filters/FileSize", "./filters/Duration", "./filesys/Directory", "./vk/VkAudioService", "./vk/StoredAudioService", "./components/ListComponent", "./components/TabComponent", "./components/ProgressBarComponent", "./components/SearchBoxComponent", "./components/AppComponent", "./components/HeaderComponent", "./components/MyAudioComponent", "./components/SearchAudioComponent", "./components/AudioRecordComponent", "./components/AudioListComponent", "./components/DownloadInfoComponent", "./handlers/AudioListHandler", "./handlers/DownloadAudioHandler"], function (require, exports, LongClickDirective, FileSizeFilter, DurationFilter, Directory, VkAudioService, StoredAudioService, List, Tabs, ProgressBar, SearchBox, App, Header, MyAudio, SearchAudio, AudioRecord, AudioList, DownloadInfo, AudioListHandler, DownloadAudioHandler) {
    "use strict";
    function onDeviceReady() {
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
