/* global chrome */
import Items from "./Items";
import { parseURL } from "../util";

export default class Bookmarks extends Items {

    add(item) {
        const path = parseURL(item.url, "pathname");
        return super.add(Object.assign({ path, title: path }, item));
    }

    remove(id) {
        return new Promise(resolve =>
            super.remove(id).then(() => chrome.bookmarks.remove(id, resolve))
        );
    }

    static load(url) {
        return new Promise(resolve =>
            chrome.bookmarks.search(url, items => resolve(new Bookmarks(items)))
        );
    }

    static getTree() {
        return new Promise(resolve => chrome.bookmarks.getTree(resolve));
    }

    static create(title, url, parentId) {
        return new Promise(resolve =>
            chrome.bookmarks.create({ title, url, parentId }, resolve)
        );
    }
}

