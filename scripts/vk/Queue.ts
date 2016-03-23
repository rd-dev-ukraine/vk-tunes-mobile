/// <reference path="../../typings/browser.d.ts"/>

// Queue operations includes requests api.vk.com which has 3 calls per second restriction.
// All request in high-priority queue are executed before normal anytime its appear in queue.
class Queue {
    static LowPriority = 1;
    static HiPriority = 10;
    
    static ServiceName = "queue";
    static $inject = ["$q"];

    private isRunning: boolean = false;
    private queue: IQueueElement[] = [];

    constructor(private $q: ng.IQService) {    }

    /// Puts function which performs request into queue with specified priority.
    /// Returns a promise is resolved when operation completes with the value returned to request's promise.
    enqueue<T>(requestFn: () => ng.IPromise<T>): ng.IPromise<T> {
        var deferred = this.$q.defer();

        var element: IQueueElement = {
            priority: Queue.LowPriority,
            request: requestFn,
            deferred: deferred
        };

        this.queue.push(element);
        this.startExecuting();

        return deferred.promise;
    }

    /// Puts request at start of request executing queue.
    enqueuePriore<T>(requestFn: () => ng.IPromise<T>): ng.IPromise<T> {
        var deferred = this.$q.defer();

        var element: IQueueElement = {
            priority: Queue.HiPriority,
            request: requestFn,
            deferred: deferred
        };

        this.queue.unshift(element);
        this.startExecuting();

        return deferred.promise;
    }

    /// Clears queue with specified priority.
    clearAll() {
        this.queue = [];
    }
    
    clearNonPriore() {
        this.queue = this.queue.filter(e => e.priority !== Queue.LowPriority);
    }
    
    clearHiPriore() {
        this.queue = this.queue.filter(e => e.priority !== Queue.HiPriority);
    }
    
    private startExecuting() {
        if (this.isRunning)
            return;

        this.isRunning = true;

        var startExecutingTime = new Date().getTime();
        
        if (this.queue.length) {
            var request = this.queue.splice(0, 1)[0];

            var continueExecuting = () => {
                var endExecutingTime = new Date().getTime();

                var timeDifference = endExecutingTime - startExecutingTime;
                var delay = Math.max(0, 300 - timeDifference);
                window.setTimeout(() => {
                    this.isRunning = false;
                    this.startExecuting();
                }, delay);
            };

            request.request()
                .then(result => request.deferred.resolve(result))
                .catch(error => request.deferred.reject(error))
                .finally(() => continueExecuting());
        } else
            this.isRunning = false;
    }
}

interface IQueueElement {
    priority: number;
    request: () => ng.IPromise<any>;
    deferred: ng.IDeferred<any>
}
 
 
export = Queue;