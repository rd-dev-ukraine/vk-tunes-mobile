/// Linked list with some extra methods for maintaining ordered lists.
class LinkedList<T> {
    private head: INode<T>;    
    private length: number = 0;
    
    first(): INode<T> {
        return this.head;
    }
    
    addFirst(value: T) {
        this.addAfter(null, value);
    }
    
    addBefore(node: INode<T>, value: T) {
        if (!node)
            throw "Node is missing.";
        
        this.addAfter(node.prev, value);
    }
    
    addAfter(node: INode<T>, value: T) {
        if (!node)
            throw "Node is missing.";
        
        var newNode: INode<T> = {
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
    }
    
    addAfterMatched(predicate: (value: T) => boolean, value: T): boolean {
        for(let node of this.nodes()) 
            if (predicate(node.value)) {
                this.addAfter(node, value);
                return true;
            }
        return false;  
    }
    
    addBeforeMatched(predicate: (value: T) => boolean, value: T): boolean {
        for(let node of this.nodes()) 
            if (predicate(node.value)) {
                this.addBefore(node, value);
                return true;
            }
        return false;
    }
    
    remove(node: INode<T>) {
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
    }
    
    removeAll(predicate: (value:T) => boolean) {
        var nodesToRemove = [];
        for(let node of this.nodes())
            if (predicate(node.value))
                nodesToRemove.push(node);
                
        for(let node of nodesToRemove)
            this.remove(node);
    }
    
    *nodes() {
        var node = this.head;
        
        while(node) {
            yield node;
            node = node.next;
        }
    }
    
    *values() {
        for(var node of this.nodes()) {
            yield node.value;
        }
    }
    
    *[Symbol.iterator]() {
        var node = this.first();
        if (node) {
            do {
                yield node.value;
                node = node.next;              
            } while(node);
        }
    }
}

interface INode<T> {
    value: T;
    next: INode<T>;
    prev: INode<T>;
    ownList: LinkedList<T>;
}

export = LinkedList;