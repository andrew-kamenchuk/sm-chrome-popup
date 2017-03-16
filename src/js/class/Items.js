/**
 * Represents a collection of items: history entries, bookmarks or cookies
 * every method, that works with chrome (async) api returns Promise instance
 */
export default class Items {

    constructor(items) {
        this.items = new Map();

        items.forEach(item => this.add(item));
    }

    add(item) {
        this.items.set(item.id, item);
        return item;
    }

    get(id) {
        return this.items.get(id);
    }

    has(id) {
        return this.items.has(id);
    }

    remove(id) {
        this.items.delete(id);
        return Promise.resolve();
    }

    save(id) {
        return Promise.resolve(this.get(id));
    }

    removeAll() {
        const promises = [];
        for (const id of this.items.keys()) {
            promises.push(this.remove(id));
        }

        return Promise.all(promises);
    }

    toArray() {
        return Array.from(this.items.values());
    }

    [Symbol.iterator]() {
        return this.items.values();
    }

    size() {
        return this.items.size;
    }

    search(query) {
        return this.toArray().filter(item => this.constructor.match(item.title, query));
    }

    static match(string, query) {
        return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
    }

    // eslint-disable-next-line no-unused-vars
    static load(url) {
        return Promise.resolve(new Items());
    }
}
