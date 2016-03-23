import LinkedList = require("LinkedList");

class PriorityQueue {
    private isRunning: boolean = false;
    private queue = new LinkedList<IQueueElement>();

    /// Puts function which performs request into queue after all elements with greater or equal priority.
    /// Returns a promise is resolved when operation completes with the value returned to request's promise.
    enqueueLast<T>(workload: () => Promise<T>, priority: number): Promise<T> {

        return new Promise((resolve, reject) => {
            
            var element: IQueueElement = {
                priority: priority,
                workload: workload,
                resolve: resolve,
                reject: reject
            };
            
            if (!this.queue.addAfterMatched(q => q.priority >= priority, element))
                this.queue.addLast(element);            
            
            this.startExecuting();            
        });
    }
    
    /// Puts function which performs request into queue before elements with less or equal priority.
    /// Returns a promise is resolved when operation completes with the value returned to request's promise.
    enqueueFirst<T>(workload: () => Promise<T>, priority: number): Promise<T> {

        return new Promise((resolve, reject) => {
            
            var element: IQueueElement = {
                priority: priority,
                workload: workload,
                resolve: resolve,
                reject: reject
            };
            
            if (!this.queue.addBeforeMatched(q => q.priority <= priority, element))
                this.queue.addFirst(element);            
            
            this.startExecuting();            
        });
    }
    
    clear(priority: number) {
        this.queue.removeAll(q => q.priority == priority);
    }    
    
    private startExecuting() {
        if (this.isRunning)
            return;

        this.isRunning = true;

        var startExecutingTime = new Date().getTime();
        
        if (this.queue.count()) {
            var request = this.queue.pop();

            var continueExecuting = () => {
                var endExecutingTime = new Date().getTime();

                var timeDifference = endExecutingTime - startExecutingTime;
                var delay = Math.max(0, 300 - timeDifference);
                window.setTimeout(() => {
                    this.isRunning = false;
                    this.startExecuting();
                }, delay);
            };

            request.workload()
                .then(result => { 
                    request.resolve(result);
                    continueExecuting(); 
                })
                .catch(error => {
                    request.reject(error);
                    continueExecuting(); 
                });
        } else
            this.isRunning = false;
    }
}

interface IQueueElement {
    priority: number;
    workload: () => Promise<any>;
    resolve: (result: any) => void;
    reject: (error: any) => void;
}
 
 
export = PriorityQueue;