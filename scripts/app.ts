/// <references path="../typings/main.d.ts" />

import VkApi = require("vk/VkApi");
import VkService = require("vk/VkService");
import Queue = require("vk/Queue");
import Directory = require("filesys/Directory");

function onDeviceReady() {
    angular.module("vk-tunes", ["ngComponentRouter"])
        .service(VkApi.ServiceName, VkApi)
        .service(VkService.ServiceName, VkService)
        .service(Queue.ServiceName, Queue)
        .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
        .service(Directory.ServiceName, Directory);
        
    angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
}

document.addEventListener("deviceready", onDeviceReady, false);