/* global chrome */
import Items from "./Items";
import { parseURL } from "../util";

export default class Cookies extends Items {

    add(item) {
        item.id = item.title = item.name;

        if (Object.prototype.hasOwnProperty.call(item, "url")) {
            const [host, path, protocol] = parseURL(item.url, "host", "pathname", "protocol");

            item.domain = host;
            item.path = path;
            item.secure = "https:" === protocol;
        }

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
