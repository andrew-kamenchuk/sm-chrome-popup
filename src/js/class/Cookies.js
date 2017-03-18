/* global chrome */
import Items from "./Items";

export default class Cookies extends Items {

    add(item) {
        item.id = item.title = item.name;

        return super.add(item);
    }

    remove(id) {
        const { name, domain, path, secure } = this.get(id);

        return new Promise(resolve =>
            super.remove(id).then(() => chrome.cookies.remove({
                name,
                url: "http" + (secure ? "s" : "") + "://" + domain + path
            }, resolve))
        );
    }

    save(id) {
        const { name, value, domain, path, secure } = this.get(id);

        return new Promise(resolve =>
            chrome.cookies.set({
                name,
                value,
                url: "http" + (secure ? "s" : "") + "://" + domain + path
            }, item => resolve(this.add(item)))
        );
    }

    static load(url) {
        return new Promise(resolve =>
            chrome.cookies.getAll({ url }, items => resolve(new Cookies(items)))
        );
    }
}
