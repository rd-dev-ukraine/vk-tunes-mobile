/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkApi", ["require", "exports"], function (require, exports) {
    "use strict";
    class VkApi {
        constructor($q, $http) {
            this.$q = $q;
            this.$http = $http;
            this.authroizationInfo = {
                client_id: "3201403",
                scope: "audio",
                redirect_uri: encodeURI("http://oauth.vk.com/blank.html"),
                response_type: "token",
                display: "touch"
            };
        }
        authorizationUrl() {
            var result = "https://oauth.vk.com/authorize?v=5.21";
            for (var prop in this.authroizationInfo) {
                var value = this.authroizationInfo[prop];
                result += "&" + prop + "=" + value;
            }
            return encodeURI(result);
        }
        /// Executes authorization if needded and defers access token
        authorize() {
            var deferred = this.$q.defer();
            if (this.accessInfo) {
                deferred.resolve(this.accessInfo);
            }
            else {
                var authorizationWindow = window.open(this.authorizationUrl(), "_blank", "location=no");
                authorizationWindow.addEventListener("loaderror", (event) => deferred.reject(event.message));
                authorizationWindow.addEventListener("loadstop", (event) => {
                    var info = this.authorizationInfoFromUrl(event.url);
                    if (!info)
                        return;
                    authorizationWindow.close();
                    this.accessInfo = info;
                    deferred.resolve(this.accessInfo);
                });
            }
            return deferred.promise;
        }
        authorizationInfoFromUrl(url) {
            if (!url)
                throw "Url is required.";
            if (url.indexOf(VkApi.validReturnUri) != 0)
                return null;
            var parts = url.split('#');
            if (parts.length != 2)
                return null;
            var returnUri = parts[0];
            if (returnUri != VkApi.validReturnUri)
                return null;
            var result = /access_token=([a-zA-Z0-9]+)&/.exec(url);
            if (result.length != 2)
                return null;
            var userMatch = /user_id=([0-9]+)/.exec(url);
            if (!userMatch || userMatch.length != 2)
                return null;
            return {
                token: result[1],
                userId: parseInt(userMatch[1])
            };
        }
        currentUser() {
            if (this.accessInfo)
                return this.accessInfo.userId;
            return null;
        }
        // Requests vk.com api with performing authorization if required.
        requestApi(method, request) {
            return this.authorize()
                .then((info) => {
                request.access_token = info.token;
                request.v = "5.21";
                var param = this.param(request);
                var url = "https://api.vk.com/method/" + method + "?" + param;
                return this.$http
                    .post(url, request)
                    .then(r => r.data.response);
            });
        }
        param(a) {
            var s = [], add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
            for (var prop in a) {
                add(prop, a[prop]);
            }
            return s.join("&");
        }
    }
    VkApi.validReturnUri = "https://oauth.vk.com/blank.html";
    VkApi.ServiceName = "vk-api";
    VkApi.$inject = ["$q", "$http"];
    return VkApi;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkService", ["require", "exports", "vk/VkApi"], function (require, exports, VkApi) {
    "use strict";
    class VkService {
        constructor($q, $http, api) {
            this.$q = $q;
            this.$http = $http;
            this.api = api;
        }
        currentUser() {
            return this.api.currentUser();
        }
        myAudio() {
            return this.api
                .requestApi("audio.get", {})
                .then((r) => r.items);
        }
        searchAudio(query) {
            return this.api
                .requestApi("audio.search", {
                q: query,
                search_own: 1,
                count: 100
            })
                .then((r) => r.items);
        }
        getFileSize(audioId, fileUrl) {
            return this.$http
                .head(fileUrl, {
                timeout: 3000
            })
                .then(r => {
                return parseFloat(r.headers("Content-Length"));
            });
        }
        addAudio(audioId, ownerId) {
            return this.api.requestApi("audio.add", {
                audio_id: audioId,
                owner_id: ownerId
            });
        }
    }
    VkService.$inject = ["$q", "$http", VkApi.ServiceName];
    VkService.ServiceName = "vk-service";
    return VkService;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/Queue", ["require", "exports"], function (require, exports) {
    "use strict";
    // Queue operations includes requests api.vk.com which has 3 calls per second restriction.
    // All request in high-priority queue are executed before normal anytime its appear in queue.
    class Queue {
        constructor($q) {
            this.$q = $q;
            this.isRunning = false;
            this.queue = [];
        }
        /// Puts function which performs request into queue with specified priority.
        /// Returns a promise is resolved when operation completes with the value returned to request's promise.
        enqueue(requestFn) {
            var deferred = this.$q.defer();
            var element = {
                priority: Queue.LowPriority,
                request: requestFn,
                deferred: deferred
            };
            this.queue.push(element);
            this.startExecuting();
            return deferred.promise;
        }
        /// Puts request at start of request executing queue.
        enqueuePriore(requestFn) {
            var deferred = this.$q.defer();
            var element = {
                priority: Queue.HiPriority,
                request: requestFn,
                deferred: deferred
            };
            this.queue.unshift(element);
            this.startExecuting();
            return deferred.promise;
        }
        /// Clears queue with specified priority.
        clearAll() {
            this.queue = [];
        }
        clearNonPriore() {
            this.queue = this.queue.filter(e => e.priority !== Queue.LowPriority);
        }
        clearHiPriore() {
            this.queue = this.queue.filter(e => e.priority !== Queue.HiPriority);
        }
        startExecuting() {
            if (this.isRunning)
                return;
            this.isRunning = true;
            var startExecutingTime = new Date().getTime();
            if (this.queue.length) {
                var request = this.queue.splice(0, 1)[0];
                var continueExecuting = () => {
                    var endExecutingTime = new Date().getTime();
                    var timeDifference = endExecutingTime - startExecutingTime;
                    var delay = Math.max(0, 300 - timeDifference);
                    window.setTimeout(() => {
                        this.isRunning = false;
                        this.startExecuting();
                    }, delay);
                };
                request.request()
                    .then(result => request.deferred.resolve(result))
                    .catch(error => request.deferred.reject(error))
                    .finally(() => continueExecuting());
            }
            else
                this.isRunning = false;
        }
    }
    Queue.LowPriority = 1;
    Queue.HiPriority = 10;
    Queue.ServiceName = "queue";
    Queue.$inject = ["$q"];
    return Queue;
});
/// <reference path="../../typings/browser.d.ts"/>
define("filesys/Directory", ["require", "exports"], function (require, exports) {
    "use strict";
    class Directory {
        constructor($q, path) {
            this.$q = $q;
            this.path = path;
        }
        files() {
            return this.init().then(() => {
                if (this.directoryContent != null)
                    return this.directoryContent;
                else {
                    return this.readDirectory()
                        .then(result => {
                        this.directoryContent = result;
                        return this.directoryContent;
                    });
                }
            });
        }
        downloadFile(fromUrl, fileName) {
            var deferred = this.$q.defer();
            var folder = this.path;
            var targetPath = folder + "/" + fileName + ".mp3";
            this.init().then(() => {
                var transfer = new FileTransfer();
                transfer.onprogress = (event) => {
                    if (event.lengthComputable) {
                        var progressInfo = {
                            percent: Math.round(event.loaded / event.total * 100),
                            bytesLoaded: event.loaded,
                            bytesTotal: event.total
                        };
                        deferred.notify(progressInfo);
                    }
                };
                transfer.download(fromUrl, targetPath, file => {
                    this.directoryContent = null;
                    deferred.resolve({
                        path: file.fullPath,
                        name: file.name
                    });
                }, error => {
                    deferred.reject(error);
                }, true);
            });
            return deferred.promise;
        }
        init() {
            var deferred = this.$q.defer();
            window.requestFileSystem(1, 0, fs => deferred.resolve(fs), error => deferred.reject(error));
            return deferred.promise;
        }
        readDirectory() {
            var deferred = this.$q.defer();
            window.resolveLocalFileSystemURI(this.path, (dirEntry) => {
                dirEntry.createReader()
                    .readEntries(entries => {
                    var result = [];
                    for (var i in entries) {
                        var entry = entries[i];
                        if (entry.isFile) {
                            result.push({
                                path: entry.fullPath,
                                name: entry.name
                            });
                        }
                    }
                    deferred.resolve(result);
                }, error => deferred.reject(error));
            }, error => deferred.reject(error));
            return deferred.promise;
        }
    }
    Directory.$inject = ["$q", Directory.PathDependency];
    Directory.ServiceName = "directory";
    Directory.PathDependency = "path";
    return Directory;
});
define("components/AppComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    var appComponent = {
        templateUrl: "/templates/AppComponent.html"
    };
    return appComponent;
});
/// <references path="../typings/main.d.ts" />
define("app", ["require", "exports", "vk/VkApi", "vk/VkService", "vk/Queue", "filesys/Directory", "components/AppComponent"], function (require, exports, VkApi, VkService, Queue, Directory, appComponent) {
    "use strict";
    function onDeviceReady() {
        console.log("Device ready called");
        angular.module("vk-tunes", [])
            .service(VkApi.ServiceName, VkApi)
            .service(VkService.ServiceName, VkService)
            .service(Queue.ServiceName, Queue)
            .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
            .service(Directory.ServiceName, Directory)
            .component("app", appComponent)
            .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        });
        angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
    }
    exports.onDeviceReady = onDeviceReady;
    document.addEventListener("deviceready", onDeviceReady, false);
});
