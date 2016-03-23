/// Linked list with some extra methods for maintaining ordered lists.
class LinkedList<T> {
    private head: INode<T> = null;    
    private length: number = 0;
    
    count() {
        return this.length;
    }
    
    first(): INode<T> {
        return this.head;
    }
    
    last(): INode<T> {
        for(let node of this.nodes()) 
            if (!node.next)
                return node;
                
        return null;
    }
    
    addFirst(value: T) {
        this.addAfter(null, value);
    }
    
    addLast(value: T) {
        this.addAfter(this.last(), value);
    }
    
    addBefore(node: INode<T>, value: T) {
        if (!node)
            throw "Node is missing.";
        
        this.addAfter(node.prev, value);
    }
    
    addAfter(node: INode<T>, value: T) {
                
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
    
    // Adds value after last matched node.
    addAfterMatched(predicate: (value: T) => boolean, value: T): boolean {
        var matchedNode: INode<T> = null;
        
        for(let node of this.nodes()) 
            if (predicate(node.value)) {
                matchedNode = node;
            }
            
        if (matchedNode) {
            this.addAfter(matchedNode, value);
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
    
    pop(): T {
        if (this.head) {
            let result = this.head.value;
            this.remove(this.head);
            
            return result;
        }
        
        return null;
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
        yield *this.values();
    }
}

interface INode<T> {
    value: T;
    next: INode<T>;
    prev: INode<T>;
    ownList: LinkedList<T>;
}

export = LinkedList;