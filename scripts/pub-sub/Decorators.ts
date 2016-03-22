import EventBus = require("EventBus");
import Metadata = require("EventBusDecoratorMetadata");

export function Handle(messageType: any) {
    return function (target: any, key: string, value: TypedPropertyDescriptor<any>) {
        Metadata.registerMessageHandler(messageType, target, target[key]);
    };
}

export function Subscriber(target: any):any {
    // save a reference to the original constructor
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
        var c : any = function () {
            return constructor.apply(this, args);
        }
        
        c.prototype = constructor.prototype;
        
        var result = new c();
        
        Metadata.subscribe(result, EventBus.Root);        
        
        return result;
    }

    // the new constructor behaviour
    var f : any = function (...args) {
        return construct(original, args);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
}