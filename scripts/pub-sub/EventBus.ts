class EventBus {
    private handlers: RegisteredHandler[] = [];
    
    // Subscribe to message of specified type.
    // Executes a handler when a message of given type published.
    // Message is compared with its type using instanceof operator.
    subscribe(messageType: any, handler: EventHandler) {
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
    publish(message: any) {
        if (!message)
            throw "Message is required.";
            
        this.handlers
            .filter(f => message instanceof f.messageType)
            .forEach(h => h.handler(message));
    }
}

interface EventHandler {
    (message: any);
}

interface RegisteredHandler {
    messageType: any;
    handler: EventHandler;
}


export = EventBus;