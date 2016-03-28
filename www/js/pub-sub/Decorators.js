define(["require", "exports", "./EventBus", "./EventBusDecoratorMetadata"], function (require, exports, EventBus, Metadata) {
    "use strict";
    function Handle(messageType) {
        return function (target, key, value) {
            Metadata.generateSubscriberId(target);
            Metadata.registerMessageHandler(messageType, target, target[key]);
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
        Metadata.generateSubscriberId(ctor.prototype);
        Object.getOwnPropertyNames(ctor)
            .filter(function (prop) { return Object.getOwnPropertyDescriptor(ctor, prop).writable; })
            .forEach(function (prop) { return newCtor[prop] = ctor[prop]; });
        newCtor.prototype = ctor.prototype;
        return newCtor;
    }
    exports.Subscriber = Subscriber;
});
