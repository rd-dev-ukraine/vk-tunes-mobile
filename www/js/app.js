var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkApi", ["require", "exports"], function (require, exports) {
    "use strict";
    var VkApi = (function () {
        function VkApi() {
            this.authroizationInfo = {
                client_id: "3201403",
                scope: "audio",
                redirect_uri: encodeURI("http://oauth.vk.com/blank.html"),
                response_type: "token",
                display: "touch"
            };
        }
        VkApi.prototype.authorizationUrl = function () {
            var result = "https://oauth.vk.com/authorize?v=5.21";
            for (var prop in this.authroizationInfo) {
                var value = this.authroizationInfo[prop];
                result += "&" + prop + "=" + value;
            }
            return encodeURI(result);
        };
        /// Executes authorization if needded and defers access token
        VkApi.prototype.authorize = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.accessInfo) {
                    resolve(_this.accessInfo);
                }
                else {
                    var authorizationWindow = window.open(_this.authorizationUrl(), "_blank", "location=no");
                    authorizationWindow.addEventListener("loaderror", function (event) { return reject(event.message); });
                    authorizationWindow.addEventListener("loadstop", function (event) {
                        var info = _this.authorizationInfoFromUrl(event.url);
                        if (!info)
                            return;
                        authorizationWindow.close();
                        _this.accessInfo = info;
                        resolve(_this.accessInfo);
                    });
                }
            });
        };
        VkApi.prototype.authorizationInfoFromUrl = function (url) {
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
        };
        VkApi.prototype.currentUser = function () {
            if (this.accessInfo)
                return this.accessInfo.userId;
            return null;
        };
        // Requests vk.com api with performing authorization if required.
        VkApi.prototype.requestApi = function (method, request) {
            var _this = this;
            return this.authorize()
                .then(function (info) {
                request.access_token = info.token;
                request.v = "5.21";
                var param = _this.param(request);
                var url = "https://api.vk.com/method/" + method + "?" + param;
                return fetch(url, {
                    method: "POST",
                    body: JSON.stringify(request)
                })
                    .then(function (response) { return response.json(); })
                    .then(function (r) { return r.response; });
            });
        };
        VkApi.prototype.param = function (a) {
            var s = [], add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };
            for (var prop in a) {
                add(prop, a[prop]);
            }
            return s.join("&");
        };
        VkApi.validReturnUri = "https://oauth.vk.com/blank.html";
        return VkApi;
    }());
    return VkApi;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkTypedApi", ["require", "exports", "vk/VkApi"], function (require, exports, VkApi) {
    "use strict";
    var VkTypedApi = (function () {
        function VkTypedApi() {
            this.api = new VkApi();
        }
        VkTypedApi.prototype.currentUser = function () {
            return this.api.currentUser();
        };
        VkTypedApi.prototype.myAudio = function () {
            return this.api
                .requestApi("audio.get", {})
                .then(function (r) { return r.items; });
        };
        VkTypedApi.prototype.searchAudio = function (query) {
            return this.api
                .requestApi("audio.search", {
                q: query,
                search_own: 1,
                count: 100
            })
                .then(function (r) { return r.items; });
        };
        VkTypedApi.prototype.getFileSize = function (audioId, fileUrl) {
            return fetch(fileUrl, {
                method: "HEAD"
            })
                .then(function (r) {
                console.log(r);
                var contentLength = r.headers.get("Content-Length");
                return parseFloat(contentLength);
            });
        };
        VkTypedApi.prototype.addAudio = function (audioId, ownerId) {
            return this.api
                .requestApi("audio.add", {
                audio_id: audioId,
                owner_id: ownerId
            });
        };
        return VkTypedApi;
    }());
    return VkTypedApi;
});
define("task-queue/LinkedList", ["require", "exports"], function (require, exports) {
    "use strict";
    var LinkedList = (function () {
        function LinkedList() {
            this.head = null;
            this.length = 0;
        }
        LinkedList.prototype.count = function () {
            return this.length;
        };
        LinkedList.prototype.first = function () {
            return this.head;
        };
        LinkedList.prototype.last = function () {
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (!node.next)
                    return node;
            }
            return null;
        };
        LinkedList.prototype.addFirst = function (value) {
            this.addAfter(null, value);
        };
        LinkedList.prototype.addLast = function (value) {
            this.addAfter(this.last(), value);
        };
        LinkedList.prototype.addBefore = function (node, value) {
            if (!node)
                throw "Node is missing.";
            this.addAfter(node.prev, value);
        };
        LinkedList.prototype.addAfter = function (node, value) {
            var newNode = {
                value: value,
                prev: null,
                next: null,
                ownList: this
            };
            // If node is null append to the start of list
            if (!node) {
                newNode.next = this.head;
                if (this.head) {
                    this.head.prev = newNode;
                }
                this.head = newNode;
            }
            else {
                var nextNode = node.next;
                newNode.prev = node;
                node.next = newNode;
                if (nextNode)
                    nextNode.prev = newNode;
            }
            this.length += 1;
        };
        // Adds value after last matched node.
        LinkedList.prototype.addAfterMatched = function (predicate, value) {
            var matchedNode = null;
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (predicate(node.value)) {
                    matchedNode = node;
                }
            }
            if (matchedNode) {
                this.addAfter(matchedNode, value);
                return true;
            }
            return false;
        };
        LinkedList.prototype.addBeforeMatched = function (predicate, value) {
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (predicate(node.value)) {
                    this.addBefore(node, value);
                    return true;
                }
            }
            return false;
        };
        LinkedList.prototype.remove = function (node) {
            if (!node)
                throw "Node is missing.";
            if (node.ownList != this)
                throw "Node does not belong to the list.";
            var next = node.next;
            var prev = node.prev;
            if (next)
                next.prev = prev;
            if (prev)
                prev.next = next;
            if (!prev)
                this.head = next;
            this.length -= 1;
        };
        LinkedList.prototype.removeAll = function (predicate) {
            var nodesToRemove = [];
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (predicate(node.value))
                    nodesToRemove.push(node);
            }
            for (var _b = 0, nodesToRemove_1 = nodesToRemove; _b < nodesToRemove_1.length; _b++) {
                var node = nodesToRemove_1[_b];
                this.remove(node);
            }
        };
        LinkedList.prototype.pop = function () {
            if (this.head) {
                var result = this.head.value;
                this.remove(this.head);
                return result;
            }
            return null;
        };
        LinkedList.prototype.nodes = function () {
            var result = [];
            var node = this.head;
            while (node) {
                result.push(node);
                node = node.next;
            }
            return result;
        };
        return LinkedList;
    }());
    return LinkedList;
});
define("task-queue/PriorityQueue", ["require", "exports", "task-queue/LinkedList"], function (require, exports, LinkedList) {
    "use strict";
    var PriorityQueue = (function () {
        function PriorityQueue() {
            this.isRunning = false;
            this.queue = new LinkedList();
        }
        /// Puts function which performs request into queue after all elements with greater or equal priority.
        /// Returns a promise is resolved when operation completes with the value returned to request's promise.
        PriorityQueue.prototype.enqueueLast = function (workload, priority) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var element = {
                    priority: priority,
                    workload: workload,
                    resolve: resolve,
                    reject: reject
                };
                if (!_this.queue.addAfterMatched(function (q) { return q.priority >= priority; }, element))
                    _this.queue.addLast(element);
                _this.startExecuting();
            });
        };
        /// Puts function which performs request into queue before elements with less or equal priority.
        /// Returns a promise is resolved when operation completes with the value returned to request's promise.
        PriorityQueue.prototype.enqueueFirst = function (workload, priority) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var element = {
                    priority: priority,
                    workload: workload,
                    resolve: resolve,
                    reject: reject
                };
                if (!_this.queue.addBeforeMatched(function (q) { return q.priority <= priority; }, element))
                    _this.queue.addFirst(element);
                _this.startExecuting();
            });
        };
        PriorityQueue.prototype.clear = function (priority) {
            this.queue.removeAll(function (q) { return q.priority == priority; });
        };
        PriorityQueue.prototype.startExecuting = function () {
            var _this = this;
            if (this.isRunning)
                return;
            this.isRunning = true;
            var startExecutingTime = new Date().getTime();
            if (this.queue.count()) {
                var request = this.queue.pop();
                var continueExecuting = function () {
                    var endExecutingTime = new Date().getTime();
                    var timeDifference = endExecutingTime - startExecutingTime;
                    var delay = Math.max(0, 300 - timeDifference);
                    window.setTimeout(function () {
                        _this.isRunning = false;
                        _this.startExecuting();
                    }, delay);
                };
                request.workload()
                    .then(function (result) {
                    request.resolve(result);
                    continueExecuting();
                })
                    .catch(function (error) {
                    request.reject(error);
                    continueExecuting();
                });
            }
            else
                this.isRunning = false;
        };
        return PriorityQueue;
    }());
    return PriorityQueue;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkService", ["require", "exports", "vk/VkTypedApi", "task-queue/PriorityQueue"], function (require, exports, VkTypedApi, PriorityQueue) {
    "use strict";
    var VkService = (function () {
        function VkService() {
            this.vk = new VkTypedApi();
            this.queue = new PriorityQueue();
        }
        VkService.prototype.myAudio = function () {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.myAudio(); }, 100 /* ApiCall */);
        };
        VkService.prototype.searchAudio = function (query) {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.searchAudio(query); }, 100 /* ApiCall */);
        };
        VkService.prototype.getAudioSize = function (audio, callback) {
            var _this = this;
            this.queue.clear(3 /* GetFileSize */);
            audio.forEach(function (record) {
                _this.queue
                    .enqueueLast(function () { return _this.vk.getFileSize(record.id, record.url); }, 3 /* GetFileSize */)
                    .then(function (fileSize) { return callback(record, fileSize); });
            });
        };
        VkService.ServiceName = "VkQueued";
        return VkService;
    }());
    return VkService;
});
/// <reference path="../../typings/browser.d.ts"/>
define("filesys/Directory", ["require", "exports"], function (require, exports) {
    "use strict";
    var Directory = (function () {
        function Directory($q, path) {
            this.$q = $q;
            this.path = path;
        }
        Directory.prototype.files = function () {
            var _this = this;
            return this.init().then(function () {
                if (_this.directoryContent != null)
                    return _this.directoryContent;
                else {
                    return _this.readDirectory()
                        .then(function (result) {
                        _this.directoryContent = result;
                        return _this.directoryContent;
                    });
                }
            });
        };
        Directory.prototype.downloadFile = function (fromUrl, fileName) {
            var _this = this;
            var deferred = this.$q.defer();
            var folder = this.path;
            var targetPath = folder + "/" + fileName + ".mp3";
            this.init().then(function () {
                var transfer = new FileTransfer();
                transfer.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var progressInfo = {
                            percent: Math.round(event.loaded / event.total * 100),
                            bytesLoaded: event.loaded,
                            bytesTotal: event.total
                        };
                        deferred.notify(progressInfo);
                    }
                };
                transfer.download(fromUrl, targetPath, function (file) {
                    _this.directoryContent = null;
                    deferred.resolve({
                        path: file.fullPath,
                        name: file.name
                    });
                }, function (error) {
                    deferred.reject(error);
                }, true);
            });
            return deferred.promise;
        };
        Directory.prototype.init = function () {
            var deferred = this.$q.defer();
            window.requestFileSystem(1, 0, function (fs) { return deferred.resolve(fs); }, function (error) { return deferred.reject(error); });
            return deferred.promise;
        };
        Directory.prototype.readDirectory = function () {
            var deferred = this.$q.defer();
            window.resolveLocalFileSystemURI(this.path, function (dirEntry) {
                dirEntry.createReader()
                    .readEntries(function (entries) {
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
                }, function (error) { return deferred.reject(error); });
            }, function (error) { return deferred.reject(error); });
            return deferred.promise;
        };
        Directory.$inject = ["$q", Directory.PathDependency];
        Directory.ServiceName = "directory";
        Directory.PathDependency = "path";
        return Directory;
    }());
    return Directory;
});
define("pub-sub/EventBus", ["require", "exports"], function (require, exports) {
    "use strict";
    var EventBus = (function () {
        function EventBus() {
            this.handlers = [];
        }
        // Subscribe to message of specified type. 
        // Executes a handler when a message of given type published.
        // Message is compared with its type using instanceof operator.
        EventBus.prototype.subscribe = function (messageType, handler) {
            if (!messageType)
                throw "Message Type is required.";
            if (!handler)
                throw "Handler is required";
            if (!this.handlers.some(function (h) { return h.handler === handler; })) {
                this.handlers.push({
                    messageType: messageType,
                    handler: handler
                });
            }
        };
        // Publishes a message to the event bus. All registered handlers will be called. 
        EventBus.prototype.publish = function (message) {
            if (!message)
                throw "Message is required.";
            this.handlers
                .filter(function (f) { return message instanceof f.messageType; })
                .forEach(function (h) { return h.handler(message); });
        };
        EventBus.Root = new EventBus();
        return EventBus;
    }());
    return EventBus;
});
define("pub-sub/EventBusDecoratorMetadata", ["require", "exports", "pub-sub/EventBus"], function (require, exports, EventBus) {
    "use strict";
    var EventBusDecoratorMetadata = (function () {
        function EventBusDecoratorMetadata() {
            this.messageHandlerInfo = [];
        }
        EventBusDecoratorMetadata.prototype.registerMessageHandler = function (messageType, subscriberType, handlerMethod) {
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
        };
        EventBusDecoratorMetadata.prototype.subscribe = function (subscriber, eventBus) {
            if (!subscriber)
                throw "Subscriber is required.";
            eventBus = eventBus || EventBus.Root;
            subscriber.publish = function (message) { return eventBus.publish(message); };
            this.messageHandlerInfo
                .filter(function (info) { return subscriber instanceof info.subscriberType; })
                .forEach(function (info) {
                eventBus.subscribe(info.messageType, function (message) { return info.handlerMethod.call(subscriber, message); });
            });
        };
        return EventBusDecoratorMetadata;
    }());
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
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var instance = new (ctor.bind.apply(ctor, [void 0].concat(args)))();
            Metadata.subscribe(instance, EventBus.Root);
            return instance;
        };
        Object.getOwnPropertyNames(ctor)
            .filter(function (prop) { return Object.getOwnPropertyDescriptor(ctor, prop).writable; })
            .forEach(function (prop) { return newCtor[prop] = ctor[prop]; });
        newCtor.prototype = ctor.prototype;
        return newCtor;
    }
    exports.Subscriber = Subscriber;
});
define("components/ListComponent", ["require", "exports", "pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var ListComponentController = (function () {
        function ListComponentController() {
            this.items = [];
        }
        ListComponentController.ControllerName = "ListComponentController";
        ListComponentController = __decorate([
            PS.Subscriber
        ], ListComponentController);
        return ListComponentController;
    }());
    exports.ListComponentController = ListComponentController;
    exports.Component = {
        bindings: {
            items: "<"
        },
        controller: ListComponentController.ControllerName,
        templateUrl: "templates/ListComponent.html",
        transclude: true
    };
});
define("handlers/AudioListMessages", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <reference path="../../typings/browser.d.ts" />
    var LoadMyAudio = (function () {
        function LoadMyAudio() {
        }
        return LoadMyAudio;
    }());
    exports.LoadMyAudio = LoadMyAudio;
    var MyAudioLoaded = (function () {
        function MyAudioLoaded(audio) {
            this.audio = audio;
        }
        return MyAudioLoaded;
    }());
    exports.MyAudioLoaded = MyAudioLoaded;
    var AudioSizeLoaded = (function () {
        function AudioSizeLoaded(audio, fileSize) {
            this.audio = audio;
            this.fileSize = fileSize;
        }
        return AudioSizeLoaded;
    }());
    exports.AudioSizeLoaded = AudioSizeLoaded;
});
define("components/AppComponent", ["require", "exports", "pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var AppComponentController = (function () {
        function AppComponentController($scope) {
            this.$scope = $scope;
        }
        AppComponentController.ControllerName = "AppComponentController";
        AppComponentController.$inject = ["$scope"];
        AppComponentController = __decorate([
            PS.Subscriber
        ], AppComponentController);
        return AppComponentController;
    }());
    exports.AppComponentController = AppComponentController;
    exports.Component = {
        controller: AppComponentController.ControllerName,
        templateUrl: "templates/AppComponent.html"
    };
});
define("components/MyAudioComponent", ["require", "exports", "pub-sub/Decorators", "handlers/AudioListMessages"], function (require, exports, PS, Messages) {
    "use strict";
    var MyAudioController = (function () {
        function MyAudioController($scope) {
            this.$scope = $scope;
        }
        MyAudioController.prototype.$onInit = function () {
            this.reloadAudio();
        };
        MyAudioController.prototype.reloadAudio = function () {
            this.publish(new Messages.LoadMyAudio());
        };
        MyAudioController.prototype.onAudioLoaded = function (message) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        };
        MyAudioController.prototype.publish = function (message) { };
        MyAudioController.ControllerName = "MyAudioController";
        MyAudioController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.MyAudioLoaded)
        ], MyAudioController.prototype, "onAudioLoaded", null);
        MyAudioController = __decorate([
            PS.Subscriber
        ], MyAudioController);
        return MyAudioController;
    }());
    exports.MyAudioController = MyAudioController;
    exports.Configuration = {
        controller: MyAudioController.ControllerName,
        templateUrl: "templates/MyAudioComponent.html"
    };
});
define("components/AudioRecordComponent", ["require", "exports", "pub-sub/Decorators", "handlers/AudioListMessages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioRecordController = (function () {
        function AudioRecordController($scope) {
            this.$scope = $scope;
        }
        AudioRecordController.prototype.onAudioSizeGot = function (message) {
            if (this.audio && this.audio.id === message.audio.id) {
                this.fileSize = message.fileSize;
                this.$scope.$$phase || this.$scope.$digest();
            }
        };
        AudioRecordController.ControllerName = "AudioRecordController";
        AudioRecordController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.AudioSizeLoaded)
        ], AudioRecordController.prototype, "onAudioSizeGot", null);
        AudioRecordController = __decorate([
            PS.Subscriber
        ], AudioRecordController);
        return AudioRecordController;
    }());
    exports.AudioRecordController = AudioRecordController;
    exports.Configuration = {
        bindings: {
            audio: "<"
        },
        controller: AudioRecordController.ControllerName,
        templateUrl: "templates/AudioRecordComponent.html"
    };
});
/// <reference path="../../typings/browser.d.ts" />
define("handlers/AudioListHandler", ["require", "exports", "vk/VkService", "handlers/AudioListMessages", "pub-sub/Decorators"], function (require, exports, VkService, Messages, PS) {
    "use strict";
    var AudioListHandler = (function () {
        function AudioListHandler(vk) {
            this.vk = vk;
        }
        AudioListHandler.prototype.loadMyAudio = function (message) {
            var _this = this;
            this.vk
                .myAudio()
                .then(function (audio) {
                _this.publish(new Messages.MyAudioLoaded(audio));
                _this.vk.getAudioSize(audio, function (record, size) {
                    _this.publish(new Messages.AudioSizeLoaded(record, size));
                });
            });
        };
        AudioListHandler.prototype.publish = function (message) { };
        AudioListHandler.ServiceName = "AudioListHandler";
        AudioListHandler.$inject = [VkService.ServiceName];
        __decorate([
            PS.Handle(Messages.LoadMyAudio)
        ], AudioListHandler.prototype, "loadMyAudio", null);
        AudioListHandler = __decorate([
            PS.Subscriber
        ], AudioListHandler);
        return AudioListHandler;
    }());
    return AudioListHandler;
});
/// <references path="../typings/main.d.ts" />
define("app", ["require", "exports", "vk/VkService", "filesys/Directory", "components/ListComponent", "components/AppComponent", "components/MyAudioComponent", "components/AudioRecordComponent", "handlers/AudioListHandler"], function (require, exports, VkService, Directory, List, App, MyAudio, AudioRecord, AudioListHandler) {
    "use strict";
    function onDeviceReady() {
        console.log("Device ready called");
        angular.module("vk-tunes", [])
            .value(Directory.PathDependency, "file:///storage/emulated/0/Music/vk")
            .service(Directory.ServiceName, Directory)
            .service(VkService.ServiceName, VkService)
            .service(AudioListHandler.ServiceName, AudioListHandler)
            .controller(App.AppComponentController.ControllerName, App.AppComponentController)
            .component("app", App.Component)
            .controller(List.ListComponentController.ControllerName, List.ListComponentController)
            .component("list", List.Component)
            .controller(MyAudio.MyAudioController.ControllerName, MyAudio.MyAudioController)
            .component("myAudio", MyAudio.Configuration)
            .controller(AudioRecord.AudioRecordController.ControllerName, AudioRecord.AudioRecordController)
            .component("audioRecord", AudioRecord.Configuration)
            .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        })
            .run([
            AudioListHandler.ServiceName,
            function (audioListHandler) {
                // Do nothing, just to ensure AudioListHandler is instantiated.
            }
        ]);
        angular.bootstrap(document.getElementsByTagName("body")[0], ["vk-tunes"]);
    }
    exports.onDeviceReady = onDeviceReady;
    document.addEventListener("deviceready", onDeviceReady, false);
});
