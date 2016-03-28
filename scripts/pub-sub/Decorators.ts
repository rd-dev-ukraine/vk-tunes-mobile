import EventBus = require("EventBus");
import Metadata = require("EventBusDecoratorMetadata");

export function Handle(messageType: any) {
    return function (target: any, key: string, value: TypedPropertyDescriptor<any>) {
        Metadata.generateSubscriberId(target);
        
        Metadata.registerMessageHandler(messageType, target, target[key]);
    };
}

export function Subscriber(ctor: any):any {
    
    var newCtor = function (...args) {
        var instance = new ctor(...args);
        
        Metadata.subscribe(instance, EventBus.Root);
        
        return instance;
    }
    
    Object.getOwnPropertyNames(ctor)
          .filter(prop => Object.getOwnPropertyDescriptor(ctor, prop).writable)
          .forEach(prop => newCtor[prop] = ctor[prop]);
    
    newCtor.prototype = ctor.prototype;
    
    Metadata.generateSubscriberId(newCtor);
    
    return newCtor;    
}