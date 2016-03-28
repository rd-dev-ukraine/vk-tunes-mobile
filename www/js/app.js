var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../typings/browser.d.ts"/>
define("filesys/Directory", ["require", "exports"], function (require, exports) {
    "use strict";
    var Directory = (function () {
        function Directory(path) {
            this.path = path;
        }
        Directory.prototype.files = function () {
            var _this = this;
            return this.init()
                .then(function (_) { return _this.readDirectory(); });
        };
        Directory.prototype.downloadFile = function (fromUrl, fileName, notify) {
            var folder = this.path;
            var targetPath = folder + "/" + fileName + ".mp3";
            return this.init()
                .then(function () { return new Promise(function (resolve, reject) {
                var transfer = new FileTransfer();
                transfer.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var progressInfo = {
                            percent: Math.round(event.loaded / event.total * 100),
                            bytesLoaded: event.loaded,
                            bytesTotal: event.total
                        };
                        if (notify)
                            notify(progressInfo);
                    }
                };
                transfer.download(fromUrl, targetPath, function (file) {
                    resolve({
                        path: file.fullPath,
                        name: file.name
                    });
                }, function (error) { return reject(error); }, true);
            }); });
        };
        Directory.prototype.init = function () {
            return new Promise(function (resolve, reject) {
                window.requestFileSystem(1, 0, function (fs) { return resolve(fs); }, function (error) { return reject(error); });
            });
        };
        Directory.prototype.readDirectory = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                window.resolveLocalFileSystemURL(_this.path, function (dirEntry) {
                    dirEntry.createReader()
                        .readEntries(function (entries) {
                        resolve(entries.map(function (e) { return ({ path: e.fullPath, name: e.name }); }));
                    }, function (error) { return reject(error); });
                }, function (error) { return reject(error); });
            });
        };
        Directory.ServiceName = "directory";
        Directory.PathDependency = "path";
        return Directory;
    }());
    return Directory;
});
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
            var _this = this;
            this.nodes()
                .filter(function (n) { return predicate(n.value); })
                .forEach(function (n) { return _this.remove(n); });
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
                if (!_this.queue.addBeforeMatched(function (q) { return q.priority < priority; }, element))
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
                if (!_this.queue.addAfterMatched(function (q) { return q.priority > priority; }, element))
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
                })
                    .catch(function (error) {
                    request.reject(error);
                });
                continueExecuting();
            }
            else
                this.isRunning = false;
        };
        return PriorityQueue;
    }());
    return PriorityQueue;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/VkAudioService", ["require", "exports", "vk/VkTypedApi", "task-queue/PriorityQueue"], function (require, exports, VkTypedApi, PriorityQueue) {
    "use strict";
    var VkService = (function () {
        function VkService() {
            this.vk = new VkTypedApi();
            this.queue = new PriorityQueue();
        }
        VkService.prototype.currentUser = function () {
            return this.vk.currentUser();
        };
        VkService.prototype.myAudio = function () {
            var _this = this;
            return this.queue
                .enqueueFirst(function () { return _this.vk.myAudio(); }, 100 /* ApiCall */);
        };
        VkService.prototype.searchAudio = function (query) {
            var _this = this;
            this.queue.clear(101 /* SearchApiCall */);
            return this.queue
                .enqueueFirst(function () { return _this.vk.searchAudio(query); }, 101 /* SearchApiCall */);
        };
        VkService.prototype.getAudioSize = function (audio, callback) {
            var _this = this;
            this.queue.clear(3 /* GetFileSize */);
            audio.forEach(function (record) {
                _this.queue
                    .enqueueLast(function () { return _this.vk.getFileSize(record.remote.id, record.remote.url); }, 3 /* GetFileSize */)
                    .then(function (fileSize) {
                    record.fileSize = fileSize;
                    callback(record, fileSize);
                });
            });
        };
        /**
         * Don't perform any vk API call, just enqueue empty operation to ensure downloading is
         * not violates API call frequency.
         */
        VkService.prototype.enqueueDownloading = function (audio) {
            return this.queue
                .enqueueLast(function () { return Promise.resolve(audio); }, 10 /* DownloadFile */);
        };
        VkService.ServiceName = "VkQueued";
        return VkService;
    }());
    return VkService;
});
/// <reference path="../../typings/browser.d.ts"/>
define("vk/StoredAudioService", ["require", "exports", "filesys/Directory"], function (require, exports, Directory) {
    "use strict";
    var StoredAudioService = (function () {
        function StoredAudioService(fs) {
            this.fs = fs;
        }
        StoredAudioService.prototype.load = function () {
            /*return this.fs
                       .files()
                       .then(files => {
                           return files.map(f => this.parseFileName(f.path));
                       });*/
            return Promise.resolve([]);
        };
        StoredAudioService.prototype.download = function (audio, progress) {
            var fileName = this.buildFileName(audio);
            this.fs
                .downloadFile(audio.url, fileName, function (p) { return progress({ audio_id: audio.id, bytesLoaded: p.bytesLoaded, bytesTotal: p.bytesTotal, percent: p.percent }); })
                .then(function (f) { return ({}); });
            return null;
        };
        StoredAudioService.prototype.parseFileName = function (path) {
            var fileName = this.getFileName(path);
            var match = StoredAudioService.SplitFileName.exec(fileName);
            if (!match)
                return null;
            return {
                id: parseInt(match[1]),
                name: fileName,
                path: path
            };
        };
        StoredAudioService.prototype.buildFileName = function (audio) {
            return audio.id + " - " + this.sanitize(audio.artist) + " - " + this.sanitize(audio.title);
        };
        StoredAudioService.prototype.getFileName = function (path) {
            if (!path)
                throw "Path is missing.";
            return path.slice(path.indexOf("/") + 1);
        };
        StoredAudioService.prototype.sanitize = function (word) {
            return word;
        };
        StoredAudioService.SplitFileName = /^(\d{1,}) - (.{1, }).(.{1, })$/;
        StoredAudioService.ServiceName = "StoredAudioService";
        StoredAudioService.$inject = [Directory.ServiceName];
        return StoredAudioService;
    }());
    return StoredAudioService;
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
        function ListComponentController($timeout) {
            this.$timeout = $timeout;
            this.items = [];
            this.selectedItems = [];
            this.selectionMode = false;
        }
        ListComponentController.prototype.isSelected = function (item) {
            return (this.selectedItems || []).some(function (e) { return e === item; });
        };
        ListComponentController.prototype.toggleSelection = function (item) {
            if (!this.selectionMode)
                return;
            if (this.isSelected(item))
                this.selectedItems = this.selectedItems.filter(function (e) { return e !== item; });
            else
                this.selectedItems.push(item);
        };
        ListComponentController.prototype.beginToggleSelection = function () {
            var _this = this;
            if (this.selectionMode)
                return;
            this.selectionTogglePromise = this.$timeout(1000, true);
            this.selectionTogglePromise
                .then(function () {
                _this.selectionMode = true;
            });
        };
        ListComponentController.prototype.cancelToggleSelection = function () {
            if (this.selectionTogglePromise)
                this.$timeout.cancel(this.selectionTogglePromise);
        };
        ListComponentController.ControllerName = "ListComponentController";
        ListComponentController.$inject = ["$timeout"];
        ListComponentController = __decorate([
            PS.Subscriber
        ], ListComponentController);
        return ListComponentController;
    }());
    exports.Component = {
        bindings: {
            items: "<",
            selectionMode: "=",
            selectedItems: "="
        },
        controller: ListComponentController,
        controllerAs: "$c",
        template: "\n    <ul ng-mousedown=\"$c.beginToggleSelection()\" ng-mouseup=\"$c.cancelToggleSelection()\" ng-mousemove=\"$c.cancelToggleSelection()\"\n        ng-touchstart=\"$c.beginToggleSelection()\" ng-touchend=\"$c.cancelToggleSelection()\" ng-touchmove=\"$c.cancelToggleSelection()\">\n        <li class=\"list-item\"\n            ng-repeat=\"$item in $c.items\">\n            <div class=\"list-item__container\">\n                <div class=\"list-item__selector\"\n                     style=\"float: left\"\n                     ng-show=\"$c.selectionMode\">\n                    <input type=\"checkbox\"\n                           ng-checked=\"$c.isSelected($item)\"\n                           ng-click=\"$c.toggleSelection($item)\" />\n                </div>\n                <div ng-transclude></div>\n            </div>\n            <hr />            \n        <li>\n    </ul>\n    ",
        transclude: true
    };
});
/// <reference path="../../typings/browser.d.ts" />
define("components/TabComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.TabActivatedEvent = "$tabActivated";
    var TabComponentController = (function () {
        function TabComponentController() {
            this.tabs = [];
        }
        TabComponentController.prototype.addTab = function (tab) {
            this.tabs.push(tab);
            if (this.tabs.length === 1)
                this.select(tab);
        };
        TabComponentController.prototype.select = function (tab) {
            this.tabs.forEach(function (t) { return t.selected = false; });
            tab.selected = true;
            tab.$onActivate();
        };
        return TabComponentController;
    }());
    var TabItemController = (function () {
        function TabItemController($scope) {
            this.$scope = $scope;
            this.selected = false;
            this.title = "";
        }
        TabItemController.prototype.$onInit = function () {
            this.tab.addTab(this);
        };
        TabItemController.prototype.$onActivate = function () {
            this.$scope.$broadcast(exports.TabActivatedEvent, this);
        };
        TabItemController.$inject = ["$scope"];
        return TabItemController;
    }());
    exports.TabConfiguration = {
        transclude: true,
        controller: TabComponentController,
        template: "\n        <div class=\"tab\">\n            <ul class=\"tab-header\">\n                <li class=\"tab-header__item\"\n                    ng-repeat=\"tab in $ctrl.tabs\"\n                    ng-class=\"{ active: tab.selected }\">\n                    <a ng-click=\"$ctrl.select(tab)\"\n                       href=\"javascript:void(0)\">\n                        {{tab.title}}\n                    </a>\n                </li>\n            </ul>\n            <div class=\"tab-content\" ng-transclude></div>\n        </div>\n    "
    };
    exports.TabItemConfiguration = {
        bindings: {
            title: "@"
        },
        controller: TabItemController,
        require: {
            tab: "^tab"
        },
        transclude: true,
        template: "<div ng-show=\"$ctrl.selected\" ng-transclude></div>"
    };
});
define("components/AppComponent", ["require", "exports", "pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var AppComponentController = (function () {
        function AppComponentController($scope) {
            this.$scope = $scope;
        }
        AppComponentController.$inject = ["$scope"];
        AppComponentController = __decorate([
            PS.Subscriber
        ], AppComponentController);
        return AppComponentController;
    }());
    exports.Component = {
        controller: AppComponentController,
        template: "\n<div>\n    <h1>VK-Tunes mobile app</h1>\n    <tab>\n        <tab-item title=\"My Audio\">\n            <my-audio></my-audio>\n        </tab-item>\n        <tab-item title=\"Search Audio\">\n            <search-audio></search-audio>\n        </tab-item>\n    </tab>\n</div>\n"
    };
});
define("handlers/Messages", ["require", "exports"], function (require, exports) {
    "use strict";
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
    var SearchAudio = (function () {
        function SearchAudio(query) {
            this.query = query;
        }
        return SearchAudio;
    }());
    exports.SearchAudio = SearchAudio;
    var SearchAudioResultLoaded = (function () {
        function SearchAudioResultLoaded(audio) {
            this.audio = audio;
        }
        return SearchAudioResultLoaded;
    }());
    exports.SearchAudioResultLoaded = SearchAudioResultLoaded;
    var AudioInfoUpdated = (function () {
        function AudioInfoUpdated(audio) {
            this.audio = audio;
        }
        return AudioInfoUpdated;
    }());
    exports.AudioInfoUpdated = AudioInfoUpdated;
    var DownloadAudio = (function () {
        function DownloadAudio(audio) {
            this.audio = audio;
        }
        return DownloadAudio;
    }());
    exports.DownloadAudio = DownloadAudio;
});
define("components/MyAudioComponent", ["require", "exports", "pub-sub/Decorators", "handlers/Messages", "components/TabComponent"], function (require, exports, PS, Messages, Tabs) {
    "use strict";
    var MyAudioController = (function () {
        function MyAudioController($scope) {
            this.$scope = $scope;
        }
        MyAudioController.prototype.$onInit = function () {
            var _this = this;
            this.reloadAudio();
            this.$scope.$on(Tabs.TabActivatedEvent, function () { return _this.reloadAudio(); });
        };
        MyAudioController.prototype.reloadAudio = function () {
            this.publish(new Messages.LoadMyAudio());
        };
        MyAudioController.prototype.onAudioLoaded = function (message) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        };
        MyAudioController.prototype.publish = function (message) { };
        MyAudioController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.MyAudioLoaded)
        ], MyAudioController.prototype, "onAudioLoaded", null);
        MyAudioController = __decorate([
            PS.Subscriber
        ], MyAudioController);
        return MyAudioController;
    }());
    exports.Configuration = {
        controller: MyAudioController,
        template: "\n<h2>My audio</h2>\n<audio-list audio=\"$ctrl.audio\"></audio-list>\n"
    };
});
define("components/SearchAudioComponent", ["require", "exports", "pub-sub/Decorators", "handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var SearchAudioController = (function () {
        function SearchAudioController($scope) {
            this.$scope = $scope;
        }
        SearchAudioController.prototype.$onInit = function () {
            var _this = this;
            this.$scope.$watch(function () { return _this.query; }, function () { return _this.reloadAudio(); });
        };
        SearchAudioController.prototype.reloadAudio = function () {
            if (this.query)
                this.publish(new Messages.SearchAudio(this.query));
            else
                this.audio = [];
        };
        SearchAudioController.prototype.onAudioLoaded = function (message) {
            this.audio = message.audio;
            this.$scope.$$phase || this.$scope.$digest();
        };
        SearchAudioController.prototype.publish = function (message) { };
        SearchAudioController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.SearchAudioResultLoaded)
        ], SearchAudioController.prototype, "onAudioLoaded", null);
        SearchAudioController = __decorate([
            PS.Subscriber
        ], SearchAudioController);
        return SearchAudioController;
    }());
    exports.Configuration = {
        controller: SearchAudioController,
        template: "\n<h2>Search audio</h2>\n<div>\n    <input ng-model=\"$ctrl.query\"\n        ng-model-options=\"{ debounce: 100 }\"\n        type=\"text\" />\n</div>\n<audio-list audio=\"$ctrl.audio\"></audio-list>\n"
    };
});
define("components/AudioRecordComponent", ["require", "exports", "pub-sub/Decorators", "handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioRecordController = (function () {
        function AudioRecordController($scope) {
            this.$scope = $scope;
        }
        AudioRecordController.prototype.onAudioSizeGot = function (message) {
            if (this.audio && this.audio.remote.id === message.audio.remote.id) {
                this.audio = message.audio;
                this.$scope.$$phase || this.$scope.$digest();
            }
        };
        AudioRecordController.$inject = ["$scope"];
        __decorate([
            PS.Handle(Messages.AudioInfoUpdated)
        ], AudioRecordController.prototype, "onAudioSizeGot", null);
        AudioRecordController = __decorate([
            PS.Subscriber
        ], AudioRecordController);
        return AudioRecordController;
    }());
    exports.Configuration = {
        bindings: {
            audio: "<"
        },
        controller: AudioRecordController,
        template: "\n<div>\n  <span ng-show=\"$ctrl.audio.isInMyAudio\">[*] </span>\n  <strong>{{$ctrl.audio.remote.artist}}</strong> - {{$ctrl.audio.remote.title}}\n  <em>{{$ctrl.audio.fileSize}}</em>\n</div>\n"
    };
});
define("components/AudioListComponent", ["require", "exports", "pub-sub/Decorators", "handlers/Messages"], function (require, exports, PS, Messages) {
    "use strict";
    var AudioListController = (function () {
        function AudioListController() {
            this.selectionMode = false;
        }
        AudioListController.prototype.toggleSelection = function () {
            this.selectionMode = !this.selectionMode;
        };
        AudioListController.prototype.downloadSelected = function () {
            if (this.selectedAudio) {
                this.publish(new Messages.DownloadAudio(this.selectedAudio));
            }
        };
        AudioListController.prototype.publish = function (message) { };
        AudioListController = __decorate([
            PS.Subscriber
        ], AudioListController);
        return AudioListController;
    }());
    exports.Configuration = {
        bindings: {
            audio: "<"
        },
        controller: AudioListController,
        controllerAs: "$c",
        template: "<div ng-show=\"$c.selectionMode\">\n         <button ng-click=\"$c.toggleSelection()\">Select</button>\n     </div>\n     <div ng-show=\"!$c.selectionMode\">\n         <button ng-click=\"$c.toggleSelection()\">Cancel selection</button>\n         <button ng-click=\"$c.downloadSelected()\">Download</button>\n     </div>\n     <div>{{ $c.selectedAudio | json }}</div>\n     <list items=\"$c.audio\"\n           selectedItems=\"$c.selectedAudio\"\n           selection-mode=\"$c.selectionMode\">\n         <audio-record audio=\"$parent.$item\"></audio-record>\n     </list>"
    };
});
/// <reference path="../../typings/browser.d.ts" />
define("handlers/AudioListHandler", ["require", "exports", "vk/VkAudioService", "vk/StoredAudioService", "handlers/Messages", "pub-sub/Decorators"], function (require, exports, VkAudioService, StoredAudioService, Messages, PS) {
    "use strict";
    var AudioListHandler = (function () {
        function AudioListHandler(vk, storage) {
            this.vk = vk;
            this.storage = storage;
        }
        AudioListHandler.prototype.loadMyAudio = function (message) {
            var _this = this;
            Promise.all([
                this.vk.myAudio(),
                this.storage.load()
            ])
                .then(function (_a) {
                var remote = _a[0], local = _a[1];
                var list = _this.audio(remote, local);
                _this.publish(new Messages.MyAudioLoaded(list));
                _this.vk.getAudioSize(list, function (record, size) {
                    record.fileSize = size;
                    _this.publish(new Messages.AudioInfoUpdated(record));
                });
            });
        };
        AudioListHandler.prototype.searchAudio = function (message) {
            var _this = this;
            Promise.all([
                this.vk.searchAudio(message.query),
                this.storage.load()
            ])
                .then(function (_a) {
                var remote = _a[0], local = _a[1];
                var list = _this.audio(remote, local);
                _this.publish(new Messages.SearchAudioResultLoaded(list));
                _this.vk.getAudioSize(list, function (record, size) {
                    record.fileSize = size;
                    _this.publish(new Messages.AudioInfoUpdated(record));
                });
            });
        };
        AudioListHandler.prototype.publish = function (message) { };
        AudioListHandler.prototype.audio = function (remote, local) {
            var _this = this;
            var storedAudioIndex = {};
            local.forEach(function (l) { return storedAudioIndex[l.id] = l; });
            return remote.map(function (r) { return ({
                remote: r,
                local: storedAudioIndex[r.id],
                fileSize: null,
                isInMyAudio: r.owner_id === _this.vk.currentUser()
            }); });
        };
        AudioListHandler.ServiceName = "AudioListHandler";
        AudioListHandler.$inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];
        __decorate([
            PS.Handle(Messages.LoadMyAudio)
        ], AudioListHandler.prototype, "loadMyAudio", null);
        __decorate([
            PS.Handle(Messages.SearchAudio)
        ], AudioListHandler.prototype, "searchAudio", null);
        AudioListHandler = __decorate([
            PS.Subscriber
        ], AudioListHandler);
        return AudioListHandler;
    }());
    return AudioListHandler;
});
/// <reference path="../../typings/browser.d.ts" />
define("handlers/DownloadAudioHandler", ["require", "exports", "vk/VkAudioService", "vk/StoredAudioService", "handlers/Messages", "pub-sub/Decorators"], function (require, exports, VkAudioService, StoredAudioService, Messages, PS) {
    "use strict";
    var DownloadAudioHandler = (function () {
        function DownloadAudioHandler(vk, fs) {
            this.vk = vk;
            this.fs = fs;
            this.downloadQueue = [];
            this.isDownloading = false;
        }
        DownloadAudioHandler.prototype.downloadAudio = function (message) {
            (_a = this.downloadQueue).push.apply(_a, message.audio);
            this.download();
            var _a;
        };
        DownloadAudioHandler.prototype.publish = function (message) { };
        DownloadAudioHandler.prototype.download = function () {
            var _this = this;
            if (this.isDownloading)
                return;
            if (this.downloadQueue.length) {
                this.isDownloading = true;
                var next = this.downloadQueue.shift();
                this.vk
                    .enqueueDownloading(next)
                    .then(function (audio) { return _this.fs.download(audio.remote, function (p) { return _this.onProgress(p); }); })
                    .then(function (local) {
                    next.local = local;
                    _this.publish(new Messages.AudioInfoUpdated(next));
                    _this.isDownloading = false;
                    _this.download();
                });
            }
        };
        DownloadAudioHandler.prototype.onProgress = function (progress) {
        };
        DownloadAudioHandler.ServiceName = "AudioListHandler";
        DownloadAudioHandler.$inject = [VkAudioService.ServiceName, StoredAudioService.ServiceName];
        __decorate([
            PS.Handle(Messages.DownloadAudio)
        ], DownloadAudioHandler.prototype, "downloadAudio", null);
        DownloadAudioHandler = __decorate([
            PS.Subscriber
        ], DownloadAudioHandler);
        return DownloadAudioHandler;
    }());
    return DownloadAudioHandler;
});
/// <references path="../typings/main.d.ts" />
define("app", ["require", "exports", "filesys/Directory", "vk/VkAudioService", "vk/StoredAudioService", "components/ListComponent", "components/TabComponent", "components/AppComponent", "components/MyAudioComponent", "components/SearchAudioComponent", "components/AudioRecordComponent", "components/AudioListComponent", "handlers/AudioListHandler", "handlers/DownloadAudioHandler"], function (require, exports, Directory, VkAudioService, StoredAudioService, List, Tabs, App, MyAudio, SearchAudio, AudioRecord, AudioList, AudioListHandler, DownloadAudioHandler) {
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
//# sourceMappingURL=app.js.map