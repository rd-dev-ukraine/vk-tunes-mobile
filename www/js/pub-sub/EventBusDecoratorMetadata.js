define(["require", "exports", "./EventBus"], function (require, exports, EventBus) {
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
            var subscriberId = this.getSubscriberId(subscriberType);
            if (subscriberId)
                this.messageHandlerInfo.push({
                    messageType: messageType,
                    subscriberId: subscriberId,
                    handlerMethod: handlerMethod
                });
            else
                console.debug("Subscriber decorator missing for " + subscriberType);
        };
        EventBusDecoratorMetadata.prototype.subscribe = function (subscriber, eventBus) {
            if (!subscriber)
                throw "Subscriber is required.";
            eventBus = eventBus || EventBus.Root;
            var subscriberId = this.getSubscriberId(subscriber);
            subscriber.publish = function (message) { return eventBus.publish(message); };
            this.messageHandlerInfo
                .filter(function (info) { return subscriberId === info.subscriberId; })
                .forEach(function (info) {
                eventBus.subscribe(info.messageType, function (message) { return info.handlerMethod.call(subscriber, message); });
            });
        };
        /** Adds subscriber ID to constructor if not added and returns the id. */
        EventBusDecoratorMetadata.prototype.generateSubscriberId = function (obj) {
            var id = obj[EventBusDecoratorMetadata.SubscriberPropertyName];
            if (!id) {
                EventBusDecoratorMetadata.SubscriberCounter += 1;
                obj[EventBusDecoratorMetadata.SubscriberPropertyName] = "Subscriber" + EventBusDecoratorMetadata.SubscriberCounter;
            }
        };
        EventBusDecoratorMetadata.prototype.getSubscriberId = function (value) {
            var subscriberId = value[EventBusDecoratorMetadata.SubscriberPropertyName];
            if (!subscriberId && value.prototype)
                subscriberId = value.prototype[EventBusDecoratorMetadata.SubscriberPropertyName];
            return subscriberId;
        };
        EventBusDecoratorMetadata.SubscriberPropertyName = "$$__subscriberId";
        EventBusDecoratorMetadata.SubscriberCounter = 0;
        return EventBusDecoratorMetadata;
    }());
    var instance = new EventBusDecoratorMetadata();
    return instance;
});
