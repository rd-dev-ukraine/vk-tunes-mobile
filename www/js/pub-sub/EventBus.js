define(["require", "exports"], function (require, exports) {
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
