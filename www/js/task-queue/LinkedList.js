define(["require", "exports"], function (require, exports) {
    "use strict";
    /// Linked list with some extra methods for maintaining ordered lists.
    var LinkedList = (function () {
        function LinkedList() {
            this.head = null;
            this.length = 0;
        }
        LinkedList.prototype.count = function () {
            return this.length;
        };
        LinkedList.prototype.first = function () {
            return this.head;
        };
        LinkedList.prototype.last = function () {
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (!node.next)
                    return node;
            }
            return null;
        };
        LinkedList.prototype.addFirst = function (value) {
            this.addAfter(null, value);
        };
        LinkedList.prototype.addLast = function (value) {
            this.addAfter(this.last(), value);
        };
        LinkedList.prototype.addBefore = function (node, value) {
            if (!node)
                throw "Node is missing.";
            this.addAfter(node.prev, value);
        };
        LinkedList.prototype.addAfter = function (node, value) {
            var newNode = {
                value: value,
                prev: null,
                next: null,
                ownList: this
            };
            // If node is null append to the start of list
            if (!node) {
                newNode.next = this.head;
                if (this.head) {
                    this.head.prev = newNode;
                }
                this.head = newNode;
            }
            else {
                var nextNode = node.next;
                newNode.prev = node;
                node.next = newNode;
                if (nextNode)
                    nextNode.prev = newNode;
            }
            this.length += 1;
        };
        // Adds value after last matched node.
        LinkedList.prototype.addAfterMatched = function (predicate, value) {
            var matchedNode = null;
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (predicate(node.value)) {
                    matchedNode = node;
                }
            }
            if (matchedNode) {
                this.addAfter(matchedNode, value);
                return true;
            }
            return false;
        };
        LinkedList.prototype.addBeforeMatched = function (predicate, value) {
            for (var _i = 0, _a = this.nodes(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (predicate(node.value)) {
                    this.addBefore(node, value);
                    return true;
                }
            }
            return false;
        };
        LinkedList.prototype.remove = function (node) {
            if (!node)
                throw "Node is missing.";
            if (node.ownList != this)
                throw "Node does not belong to the list.";
            var next = node.next;
            var prev = node.prev;
            if (next)
                next.prev = prev;
            if (prev)
                prev.next = next;
            if (!prev)
                this.head = next;
            this.length -= 1;
        };
        LinkedList.prototype.removeAll = function (predicate) {
            var _this = this;
            this.nodes()
                .filter(function (n) { return predicate(n.value); })
                .forEach(function (n) { return _this.remove(n); });
        };
        LinkedList.prototype.pop = function () {
            if (this.head) {
                var result = this.head.value;
                this.remove(this.head);
                return result;
            }
            return null;
        };
        LinkedList.prototype.nodes = function () {
            var result = [];
            var node = this.head;
            while (node) {
                result.push(node);
                node = node.next;
            }
            return result;
        };
        return LinkedList;
    }());
    return LinkedList;
});
