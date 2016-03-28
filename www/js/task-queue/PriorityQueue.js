define(["require", "exports", "./LinkedList"], function (require, exports, LinkedList) {
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
