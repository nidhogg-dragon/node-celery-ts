"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility");
class List {
    constructor() {
        this.head = undefined;
        this.tail = undefined;
        this.size = 0;
    }
    get length() {
        return this.size;
    }
    static from(init) {
        const list = new List();
        for (const elem of init) {
            list.push(elem);
        }
        return list;
    }
    static of(...elements) {
        return List.from(elements);
    }
    push(...elements) {
        for (const element of elements) {
            this.pushOne(element);
        }
        return this.size;
    }
    pop() {
        if (utility_1.isNullOrUndefined(this.tail)) {
            return undefined;
        }
        --this.size;
        const popped = this.tail.element;
        this.tail = this.tail.previous;
        if (!utility_1.isNullOrUndefined(this.tail)) {
            this.tail.next = undefined;
        }
        else {
            this.head = undefined;
        }
        return popped;
    }
    shift() {
        if (utility_1.isNullOrUndefined(this.head)) {
            return undefined;
        }
        --this.size;
        const shifted = this.head.element;
        this.head = this.head.next;
        if (!utility_1.isNullOrUndefined(this.head)) {
            this.head.previous = undefined;
        }
        else {
            this.tail = undefined;
        }
        return shifted;
    }
    unshift(...elements) {
        for (let i = elements.length - 1; i >= 0; --i) {
            this.unshiftOne(elements[i]);
        }
        return this.size;
    }
    *[Symbol.iterator]() {
        let current = this.head;
        while (!utility_1.isNullOrUndefined(current)) {
            const toYield = current.element;
            current = current.next;
            yield toYield;
        }
        return;
    }
    pushOne(element) {
        ++this.size;
        const toPush = {
            element,
            next: undefined,
            previous: this.tail,
        };
        if (utility_1.isNullOrUndefined(this.tail)) {
            this.head = toPush;
            this.tail = toPush;
        }
        else {
            this.tail.next = toPush;
            this.tail = toPush;
        }
        return this.size;
    }
    unshiftOne(element) {
        ++this.size;
        const toUnshift = {
            element,
            next: this.head,
            previous: undefined,
        };
        if (utility_1.isNullOrUndefined(this.head)) {
            this.head = toUnshift;
            this.tail = toUnshift;
        }
        else {
            this.head.previous = toUnshift;
            this.head = toUnshift;
        }
        return this.size;
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map