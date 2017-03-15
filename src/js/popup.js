/* global chrome */
import { encodeHTML } from "./util";

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function showMessage(message, where = $("body"), { hideAfter = 1000, className = "message" } = {}) {
    const block = document.createElement("div");

    block.className = className;
    block.innerHTML = message;

    where.appendChild(block);

    return new Promise(resolve => setTimeout(() => { block.remove(); resolve(); }, hideAfter));
}

export function onDocumentLoaded(callback) {
    if ("loading" === document.readyState) {
        return void document.addEventListener("DOMContentLoaded", callback);
    }

    callback();
}

export const HISTORY_ID = "history";
export const COOKIES_ID = "cookies";
export const BOOKMARKS_ID = "bookmarks";

const badgeColors = {
    [HISTORY_ID]: "#00F",
    [BOOKMARKS_ID]: "#080",
    [COOKIES_ID]: "#A00",
};

export function updateBadge(tabId, itemsId, itemsCount) {
    chrome.browserAction.setBadgeText({
        text: itemsCount > 1000 ? "999+" : itemsCount.toString(),
        tabId,
    });

    chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColors[itemsId],
        tabId,
    });
}

export function displayItemHtml(item, block, prepend = false) {
    let form = "";

    if (Object.prototype.hasOwnProperty.call(item, "value")) {
        form = `<form name="${item.id}">
            <input type="text" value="${item.value}" name="${item.title}" />
        </form>`;
    }

    const html = `<a class="item" data-item-id="${item.id}" href="${item.url}">
            <span data-action="goto" class="title-top">${encodeHTML(item.title)}</span>
            <span data-action="remove" title="remove"></span>
            <span data-action="save" title="save"></span>
            <span data-action="goto" class="title-bottom">path: ${item.path}</span>
            ${form}
        </a>`;

    if (prepend) {
        block.innerHTML = html + block.innerHTML;
    } else {
        block.innerHTML += html;
    }
}

export function buildBookmarksHtmlTree(tree, depth = 0) {
    let html = "<ul>";

    for (const item of tree) {
        const children = item.children && item.children.filter(node => node.children);

        html += `<li data-id="${item.id}">`;

        if (item.id > 0) {
            html += `<a href="" data-action="expand">${encodeHTML(item.title)}
                ${children && children.length && depth > 1 ? "<span data-action=\"expand\">expand</span>" : ""}
                <span data-action="select">choose</span></a>`;
        } else {
            html += "<span>TREE:</span>";
        }

        if (children && children.length) {
            html += buildBookmarksHtmlTree(children, depth + 1);
        }

        html += "</li>";
    }

    html += "</ul>";

    return html;
}
