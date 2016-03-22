import EventBus = require("EventBus");

class EventBusDecoratorMetadata {
    private messageHandlerInfo: MessageHandlerInfo[] = [];
           
    registerMessageHandler(messageType: any, subscriberType: any, handlerMethod: (message: any) => void) {
        if(!messageType)
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
    
    subscribe(subscriber: any, eventBus: EventBus) {
        if (!subscriber)
            throw "Subscriber is required.";
            
       eventBus = eventBus || EventBus.Root;
       
       this.messageHandlerInfo
           .filter(info => subscriber instanceof info.subscriberType)
           .forEach(info => {
               eventBus.subscribe(info.messageType, message => info.handlerMethod.call(subscriber, message));
               subscriber.publish = message => eventBus.publish(message); 
           });
    }
}

interface MessageHandlerInfo {
    messageType: any;
    subscriberType: any;
    handlerMethod: (message: any) => void;
}

var instance = new EventBusDecoratorMetadata();

export = instance;