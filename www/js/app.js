var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
define("pub-sub/EventBus", ["require", "exports"], function (require, exports) {
    "use strict";
    class EventBus {
        constructor() {
            this.handlers = [];
        }
        // Subscribe to message of specified type. 
        // Executes a handler when a message of given type published.
        // Message is compared with its type using instanceof operator.
        subscribe(messageType, handler) {
            if (!messageType)
                throw "Message Type is required.";
            if (!handler)
                throw "Handler is required";
            if (!this.handlers.some(h => h.handler === handler)) {
                this.handlers.push({
                    messageType: messageType,
                    handler: handler
                });
            }
        }
        // Publishes a message to the event bus. All registered handlers will be called. 
        publish(message) {
            if (!message)
                throw "Message is required.";
            this.handlers
                .filter(f => message instanceof f.messageType)
                .forEach(h => h.handler(message));
        }
    }
    EventBus.Root = new EventBus();
    return EventBus;
});
define("pub-sub/EventBusDecoratorMetadata", ["require", "exports", "pub-sub/EventBus"], function (require, exports, EventBus) {
    "use strict";
    class EventBusDecoratorMetadata {
        constructor() {
            this.messageHandlerInfo = [];
        }
        registerMessageHandler(messageType, subscriberType, handlerMethod) {
            if (!messageType)
                throw "Message type is required.";
            if (!subscriberType)
                throw "Subscriber type is required";
            if (!handlerMethod)
                throw "Handler method is required.";
            this.messageHandlerInfo.push({
                messageType: messageType,
                subscriberType: subscriberType,
                handlerMethod: handlerMethod
            });
        }
        subscribe(subscriber, eventBus) {
            if (!subscriber)
                throw "Subscriber is required.";
            eventBus = eventBus || EventBus.Root;
            subscriber.publish = message => eventBus.publish(message);
            this.messageHandlerInfo
                .filter(info => subscriber instanceof info.subscriberType)
                .forEach(info => {
                eventBus.subscribe(info.messageType, message => info.handlerMethod.call(subscriber, message));
            });
        }
    }
    var instance = new EventBusDecoratorMetadata();
    return instance;
});
define("pub-sub/Decorators", ["require", "exports", "pub-sub/EventBus", "pub-sub/EventBusDecoratorMetadata"], function (require, exports, EventBus, Metadata) {
    "use strict";
    function Handle(messageType) {
        return function (target, key, value) {
            Metadata.registerMessageHandler(messageType, target.constructor, target[key]);
        };
    }
    exports.Handle = Handle;
    function Subscriber(ctor) {
        var newCtor = function (...args) {
            var instance = new ctor(...args);
            Metadata.subscribe(instance, EventBus.Root);
            return instance;
        };
        Object.getOwnPropertyNames(ctor)
            .filter(prop => Object.getOwnPropertyDescriptor(ctor, prop).writable)
            .forEach(prop => newCtor[prop] = ctor[prop]);
        return newCtor;
    }
    exports.Subscriber = Subscriber;
});
define("handlers/AudioListMessages", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <reference path="../../typings/browser.d.ts" />
    class MyAudioLoad {
    }
    exports.MyAudioLoad = MyAudioLoad;
    class MyAudioLoaded {
        constructor(audio) {
            this.audio = audio;
        }
    }
    exports.MyAudioLoaded = MyAudioLoaded;
});
define("components/AppComponent", ["require", "exports", "pub-sub/Decorators", "handlers/AudioListMessages"], function (require, exports, PS, AudioListMessages) {
    "use strict";
    let AppComponentController = class AppComponentController {
        constructor() {
            this.publish(new AudioListMessages.MyAudioLoad());
        }
        audioLoaded(message) {
            this.audio = message.audio;
        }
        publish(message) { }
    };
    AppComponentController.ControllerName = "AppComponentController";
    __decorate([
        PS.Handle(AudioListMessages.MyAudioLoaded)
    ], AppComponentController.prototype, "audioLoaded", null);
    AppComponentController = __decorate([
        PS.Subscriber
    ], AppComponentController);
    exports.AppComponentController = AppComponentController;
    exports.componentConfiguration = {
        controller: AppComponentController.ControllerName,
        templateUrl: "/templates/AppComponent.html"
    };
});
/// <reference path="../../typings/browser.d.ts" />
define("handlers/AudioListHandler", ["require", "exports", "vk/VkService", "handlers/AudioListMessages", "pub-sub/Decorators"], function (require, exports, VkService, Messages, PS) {
    "use strict";
    let AudioListHandler = class AudioListHandler {
        constructor(vk) {
            this.vk = vk;
        }
        loadMyAudio(message) {
            this.publish(new Messages.MyAudioLoaded([
                {
                    album_id: 0,
                    artist: "Queen",
                    duration: 233,
                    genre_id: 1,
                    id: 2344234,
                    lyrics_id: -1,
                    owner_id: 3424,
                    title: "Too much love will kill you",
                    url: "http://vk.com/audio-files/asdasd.asdasdlad123234..34234"
                }
            ]));
        }
        publish(message) {
        }
    };
    AudioListHandler.ServiceName = "AudioListHandler";
    AudioListHandler.$inject = [VkService.ServiceName];
    __decorate([
        PS.Handle(Messages.MyAudioLoad)
    ], AudioListHandler.prototype, "loadMyAudio", null);
    AudioListHandler = __decorate([
        PS.Subscriber
    ], AudioListHandler);
    return AudioListHandler;
});
/// <references path="../typings/main.d.ts" />
define("app", ["require", "exports", "vk/VkApi", "vk/VkService", "vk/Queue", "filesys/Directory", "components/AppComponent", "handlers/AudioListHandler"], function (require, exports, VkApi, VkService, Queue, Directory, App, AudioListHandler) {
    "use strict";
    function onDeviceReady() {
        console.log("Device ready called");
        angular.module("vk-tunes", [])
            .service(VkApi.ServiceName, VkApi)
            .service(VkService.ServiceName, VkService)
            .service(Queue.ServiceName, Queue)
            .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
            .service(Directory.ServiceName, Directory)
            .service(AudioListHandler.ServiceName, AudioListHandler)
            .controller(App.AppComponentController.ControllerName, App.AppComponentController)
            .component("app", App.componentConfiguration)
            .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        })
            .run([
            AudioListHandler.ServiceName,
                (audioListHandler) => {
                // Do nothing, just to ensure AudioListHandler is instantiated.
            }
        ]);
        angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
    }
    exports.onDeviceReady = onDeviceReady;
    document.addEventListener("deviceready", onDeviceReady, false);
});
