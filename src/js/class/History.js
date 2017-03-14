/* global chrome */
import Items from "./Items";
import { parseURL } from "../util";

export default class History extends Items {

    add(item) {
        item.path = parseURL(item.url, "pathname");
        return super.add(item);
    }

    remove(id) {
        const url = this.get(id).url;

        return new Promise(resolve =>
            super.remove(id).then(() => chrome.history.deleteUrl({ url }, resolve))
        );
    }

    static load(url) {
        // eslint-disable-next-line no-magic-numbers
        const startTime = new Date() - 30 * 24 * 3600 * 1000;

        return new Promise(resolve =>
            chrome.history.search({ text: url, startTime, maxResults: 100 }, items =>
                resolve(new History(items.filter(item => item.title.length > 0)))
            )
        );
    }
}
