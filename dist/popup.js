'use strict';

/******/(function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/var installedModules = {};
    /******/
    /******/ // The require function
    /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId])
            /******/return installedModules[moduleId].exports;
        /******/
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
            /******/i: moduleId,
            /******/l: false,
            /******/exports: {}
            /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/__webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/__webpack_require__.c = installedModules;
    /******/
    /******/ // identity function for calling harmony imports with the correct context
    /******/__webpack_require__.i = function (value) {
        return value;
    };
    /******/
    /******/ // define getter function for harmony exports
    /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
            /******/Object.defineProperty(exports, name, {
                /******/configurable: false,
                /******/enumerable: true,
                /******/get: getter
                /******/ });
            /******/
        }
        /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
            return module['default'];
        } :
        /******/function getModuleExports() {
            return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/__webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/return __webpack_require__(__webpack_require__.s = 6);
    /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    const parseURL = (() => {
        const parser = document.createElement("a");

        return (url, ...parts) => {
            parser.setAttribute("href", url);

            switch (parts.length) {
                case 0:
                    return Object.assign({}, parser);
                case 1:
                    return parser[parts[0]];
                default:
                    return parts.map(part => parser[part]);
            }
        };
    })();
    /* harmony export (immutable) */__webpack_exports__["b"] = parseURL;

    const encodeHTML = (() => {
        const encoder = document.createElement("textarea");

        return text => {
            encoder.textContent = text;
            return encoder.innerHTML;
        };
    })();
    /* harmony export (immutable) */__webpack_exports__["c"] = encodeHTML;

    const createLogger = name => console.log.bind(console, name + ":");
    /* harmony export (immutable) */__webpack_exports__["a"] = createLogger;

    /***/
},
/* 1 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /**
     * Represents a collection of items: history entries, bookmarks or cookies
     * every method, that works with chrome (async) api returns Promise instance
     */

    class Items {

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
            return this.toArray().filter(item => Items.match(item.title, query));
        }

        static match(string, query) {
            return string.toLowerCase().indexOf(query.toLowerCase()) > -1;
        }

        // eslint-disable-next-line no-unused-vars
        static load(url) {
            return Promise.resolve(new Items());
        }
    }
    /* harmony export (immutable) */__webpack_exports__["a"] = Items;

    /***/
},
/* 2 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__Items__ = __webpack_require__(1);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
    /* global chrome */

    class Bookmarks extends __WEBPACK_IMPORTED_MODULE_0__Items__["a" /* default */] {

        add(item) {
            const path = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* parseURL */])(item.url, "pathname");
            return super.add(Object.assign({ path, title: path }, item));
        }

        remove(id) {
            return new Promise(resolve => super.remove(id).then(() => chrome.bookmarks.remove(id, resolve)));
        }

        static load(url) {
            return new Promise(resolve => chrome.bookmarks.search(url, items => resolve(new Bookmarks(items))));
        }

        static getTree() {
            return new Promise(resolve => chrome.bookmarks.getTree(resolve));
        }

        static create(title, url, parentId) {
            return new Promise(resolve => chrome.bookmarks.create({ title, url, parentId }, resolve));
        }
    }
    /* harmony export (immutable) */__webpack_exports__["a"] = Bookmarks;

    /***/
},
/* 3 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__Items__ = __webpack_require__(1);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
    /* global chrome */

    class Cookies extends __WEBPACK_IMPORTED_MODULE_0__Items__["a" /* default */] {

        add(item) {
            item.id = item.title = item.name;

            if (Object.prototype.hasOwnProperty.call(item, "url")) {
                const [host, path, protocol] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* parseURL */])(item.url, "host", "pathname", "protocol");

                item.domain = host;
                item.path = path;
                item.secure = "https:" === protocol;
            }

            return super.add(item);
        }

        remove(id) {
            const { name, domain, path, secure } = this.get(id);

            return new Promise(resolve => super.remove(id).then(() => chrome.cookies.remove({
                name,
                url: "http" + (secure ? "s" : "") + "://" + domain + path
            }, resolve)));
        }

        save(id) {
            const { name, value, domain, path, secure } = this.get(id);

            return new Promise(resolve => chrome.cookies.set({
                name,
                value,
                url: "http" + (secure ? "s" : "") + "://" + domain + path
            }, item => resolve(this.add(item))));
        }

        static load(url) {
            return new Promise(resolve => chrome.cookies.getAll({ url }, items => resolve(new Cookies(items))));
        }
    }
    /* harmony export (immutable) */__webpack_exports__["a"] = Cookies;

    /***/
},
/* 4 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__Items__ = __webpack_require__(1);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);
    /* global chrome */

    class History extends __WEBPACK_IMPORTED_MODULE_0__Items__["a" /* default */] {

        add(item) {
            item.path = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* parseURL */])(item.url, "pathname");
            return super.add(item);
        }

        remove(id) {
            const url = this.get(id).url;

            return new Promise(resolve => super.remove(id).then(() => chrome.history.deleteUrl({ url }, resolve)));
        }

        static load(url) {
            // eslint-disable-next-line no-magic-numbers
            const startTime = new Date() - 30 * 24 * 3600 * 1000;

            return new Promise(resolve => chrome.history.search({ text: url, startTime, maxResults: 100 }, items => resolve(new History(items.filter(item => item.title.length > 0)))));
        }
    }
    /* harmony export (immutable) */__webpack_exports__["a"] = History;

    /***/
},
/* 5 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
    /* harmony export (immutable) */__webpack_exports__["showMessage"] = showMessage;
    /* harmony export (immutable) */__webpack_exports__["onDocumentLoaded"] = onDocumentLoaded;
    /* harmony export (immutable) */__webpack_exports__["updateBadge"] = updateBadge;
    /* harmony export (immutable) */__webpack_exports__["displayItemHtml"] = displayItemHtml;
    /* harmony export (immutable) */__webpack_exports__["buildBookmarksHtmlTree"] = buildBookmarksHtmlTree;
    /* global chrome */

    const $ = document.querySelector.bind(document);
    /* harmony export (immutable) */__webpack_exports__["$"] = $;

    const $$ = document.querySelectorAll.bind(document);
    /* harmony export (immutable) */__webpack_exports__["$$"] = $$;

    function showMessage(message, where = $("body"), { hideAfter = 1000, className = "message" } = {}) {
        const block = document.createElement("div");

        block.className = className;
        block.innerHTML = message;

        where.appendChild(block);

        return new Promise(resolve => setTimeout(() => {
            block.remove();resolve();
        }, hideAfter));
    }

    function onDocumentLoaded(callback) {
        if ("loading" === document.readyState) {
            return void document.addEventListener("DOMContentLoaded", callback);
        }

        callback();
    }

    const HISTORY_ID = "history";
    /* harmony export (immutable) */__webpack_exports__["HISTORY_ID"] = HISTORY_ID;

    const COOKIES_ID = "cookies";
    /* harmony export (immutable) */__webpack_exports__["COOKIES_ID"] = COOKIES_ID;

    const BOOKMARKS_ID = "bookmarks";
    /* harmony export (immutable) */__webpack_exports__["BOOKMARKS_ID"] = BOOKMARKS_ID;

    const badgeColors = {
        [HISTORY_ID]: "#00F",
        [BOOKMARKS_ID]: "#080",
        [COOKIES_ID]: "#A00"
    };

    function updateBadge(tabId, itemsId, itemsCount) {
        chrome.browserAction.setBadgeText({
            text: itemsCount > 1000 ? "999+" : itemsCount.toString(),
            tabId
        });

        chrome.browserAction.setBadgeBackgroundColor({
            color: badgeColors[itemsId],
            tabId
        });
    }

    function displayItemHtml(item, block, prepend = false) {
        let form = "";

        if (Object.prototype.hasOwnProperty.call(item, "value")) {
            form = `<form name="${item.id}">
            <input type="text" value="${item.value}" name="${item.title}" />
        </form>`;
        }

        const html = `<a class="item" data-item-id="${item.id}" href="${item.url}">
            <span data-action="goto" class="title-top">${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* encodeHTML */])(item.title)}</span>
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

    function buildBookmarksHtmlTree(tree, depth = 0) {
        let html = "<ul>";

        for (const item of tree) {
            const children = item.children && item.children.filter(node => node.children);

            html += `<li data-id="${item.id}">`;

            if (item.id > 0) {
                html += `<a href="" data-action="expand">${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* encodeHTML */])(item.title)}
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

    /***/
},
/* 6 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__js_util__ = __webpack_require__(0);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__js_popup__ = __webpack_require__(5);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__js_class_History__ = __webpack_require__(4);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__js_class_Cookies__ = __webpack_require__(3);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__js_class_Bookmarks__ = __webpack_require__(2);
    /* global chrome */

    const log = __WEBPACK_IMPORTED_MODULE_0__js_util__["a" /* createLogger */]("main");

    const { $, $$ } = __WEBPACK_IMPORTED_MODULE_1__js_popup__;

    let currentTab;

    const loadedItems = new Map();

    let activeItemsId;

    const updateBadge = () => {
        if (activeItemsId && loadedItems.has(activeItemsId)) {
            __WEBPACK_IMPORTED_MODULE_1__js_popup__["updateBadge"](currentTab.id, activeItemsId, loadedItems.get(activeItemsId).size());
        }
    };

    chrome.tabs.query({ active: true }, tabs => {
        if (!Array.isArray(tabs) || !tabs.length) {
            throw new Error("This should never happen");
        }

        currentTab = tabs[0];

        log("begin");

        const [host, origin] = __WEBPACK_IMPORTED_MODULE_0__js_util__["b" /* parseURL */](currentTab.url, "host", "origin");

        __WEBPACK_IMPORTED_MODULE_2__js_class_History__["a" /* default */].load(host).then(history => {
            const htmlBlock = $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]}`);

            for (const item of history) {
                __WEBPACK_IMPORTED_MODULE_1__js_popup__["displayItemHtml"](item, htmlBlock);
            }

            loadedItems.set(__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"], history);
        }).then(() => $(`header > [data-tab-header=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]}]`).dispatchEvent(new Event("click")));

        __WEBPACK_IMPORTED_MODULE_4__js_class_Bookmarks__["a" /* default */].load(origin).then(bookmarks => {
            const htmlBlock = $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["BOOKMARKS_ID"]}`);

            for (const item of bookmarks) {
                __WEBPACK_IMPORTED_MODULE_1__js_popup__["displayItemHtml"](item, htmlBlock);
            }

            loadedItems.set(__WEBPACK_IMPORTED_MODULE_1__js_popup__["BOOKMARKS_ID"], bookmarks);
        });

        __WEBPACK_IMPORTED_MODULE_3__js_class_Cookies__["a" /* default */].load(currentTab.url).then(cookies => {
            const htmlBlock = $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]}`);

            for (const item of cookies) {
                __WEBPACK_IMPORTED_MODULE_1__js_popup__["displayItemHtml"](item, htmlBlock);
            }

            loadedItems.set(__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"], cookies);
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        const headers = $$("header > [data-tab-header]");

        const form = $("form[name=filter]");
        const input = form.querySelector("input[name=query]");

        headers.forEach(header => {
            const id = header.getAttribute("data-tab-header");

            header.addEventListener("click", () => {
                if (id === activeItemsId) {
                    return;
                }

                if (input.value.length) {
                    form.reset();
                }

                activeItemsId = id;

                headers.forEach(h => h.classList.toggle("active", id === h.getAttribute("data-tab-header")));

                $$("#items > [data-tab-id]").forEach(tab => tab.classList.toggle("hidden", id !== tab.getAttribute("data-tab-id")));

                $("#actions > [data-action=cookie]").classList.toggle("hidden", id !== __WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]);

                $("#actions > [data-action=save]").classList.toggle("hidden", id !== __WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]);

                updateBadge();
            });
        });

        form.addEventListener("submit", e => e.preventDefault());

        input.addEventListener("input", () => {
            if (!activeItemsId || !loadedItems.has(activeItemsId)) {
                return;
            }

            const matches = {};

            loadedItems.get(activeItemsId).search(input.value).forEach(item => {
                matches[item.id] = true;
            });

            $$(`#items > [data-tab-id=${activeItemsId}] > a.item`).forEach(link => link.classList.toggle("hidden", !matches[link.getAttribute("data-item-id")]));
        });

        form.addEventListener("reset", () => $$(`#items > [data-tab-id=${activeItemsId}] > a.item`).forEach(link => link.classList.remove("hidden")));
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        const tabs = $$("#items > [data-tab-id]");

        tabs.forEach(tab => {
            const id = tab.getAttribute("data-tab-id");

            tab.addEventListener("click", event => {
                event.preventDefault();

                log(id, activeItemsId);

                if (activeItemsId !== id || !loadedItems.has(id)) {
                    return;
                }

                const action = event.target.getAttribute("data-action");

                log(action);

                if (!action) {
                    return;
                }

                const parent = event.target.parentElement;

                const itemId = parent.getAttribute("data-item-id");

                switch (action) {
                    case "goto":
                        id !== __WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"] && chrome.tabs.create({ url: parent.getAttribute("href"), active: true });
                        break;
                    case "save":
                        loadedItems.get(id).save(itemId).then(item => item && __WEBPACK_IMPORTED_MODULE_1__js_popup__["showMessage"]("Item has been saved!", parent));
                        break;
                    case "remove":
                        loadedItems.get(id).remove(itemId).then(() => parent.remove()).then(updateBadge);
                        break;
                    default:
                        log(`Undefined action: ${action}`);
                }
            });
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        $("#actions > [data-action=clear]").addEventListener("click", () => {
            if (!activeItemsId || !loadedItems.has(activeItemsId)) {
                return;
            }

            const items = loadedItems.get(activeItemsId);

            $$(`#items > [data-tab-id=${activeItemsId}] > a:not(.hidden)`).forEach(link => items.remove(link.getAttribute("data-item-id")).then(() => link.remove()).then(updateBadge));
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        $("#actions > [data-action=save]").addEventListener("click", () => {
            if (activeItemsId === __WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"] && loadedItems.has(activeItemsId)) {
                $("#bookmarks-tree").historyId = -1;
                $("#bookmarks-tree").show && $("#bookmarks-tree").show();
            }
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        $("#actions > form[data-action=cookie]").addEventListener("submit", function (event) {
            event.preventDefault();

            if (!loadedItems.has(__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"])) {
                return;
            }

            const name = this.querySelector("[name=name]").value;

            if (!name.length) {
                return void __WEBPACK_IMPORTED_MODULE_1__js_popup__["showMessage"]("Error: Cookie Name is empty", this);
            }

            const value = this.querySelector("[name=value]").value;

            const url = __WEBPACK_IMPORTED_MODULE_0__js_util__["b" /* parseURL */](currentTab.url, "origin");

            loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]).add({ name, value, url });

            loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]).save(name).then(item => __WEBPACK_IMPORTED_MODULE_1__js_popup__["displayItemHtml"](item, $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]}]`), true)).then(updateBadge).then(() => __WEBPACK_IMPORTED_MODULE_1__js_popup__["showMessage"]("Cookie has been added!", this)).then(() => this.reset());
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]}]`).addEventListener("input", event => {
            loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["COOKIES_ID"]).get(event.target.getAttribute("name")).value = event.target.value;
        });
    });

    __WEBPACK_IMPORTED_MODULE_1__js_popup__["onDocumentLoaded"](() => {
        const bookmarksNode = $("#bookmarks-tree");

        __WEBPACK_IMPORTED_MODULE_4__js_class_Bookmarks__["a" /* default */].getTree().then(tree => {
            bookmarksNode.innerHTML += __WEBPACK_IMPORTED_MODULE_1__js_popup__["buildBookmarksHtmlTree"](tree);
        });

        bookmarksNode.show = () => {
            bookmarksNode.classList.remove("hidden");
            $("#main").classList.add("hidden");
        };

        bookmarksNode.hide = () => {
            $("#main").classList.remove("hidden");
            bookmarksNode.classList.add("hidden");
        };

        bookmarksNode.addEventListener("click", event => {
            event.preventDefault();

            const action = event.target.getAttribute("data-action");

            if (!action) {
                return;
            }

            const historyId = bookmarksNode.historyId;

            if (!historyId) {
                return;
            }

            let parent = event.target.parentElement;

            while (parent && !parent.hasAttribute("data-id")) {
                parent = parent.parentElement;
            }

            const parentId = parent && parent.getAttribute("data-id");

            switch (action) {
                case "close":
                    delete bookmarksNode.historyId;
                    bookmarksNode.hide();
                    break;
                case "expand":
                    parent.classList.toggle("expand");
                    break;
                case "select":
                    if (parentId && loadedItems.has(__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]) && loadedItems.has(__WEBPACK_IMPORTED_MODULE_1__js_popup__["BOOKMARKS_ID"])) {
                        if (historyId > 0) {
                            saveHistoryAsBookmark(historyId, parentId).then(() => {
                                delete bookmarksNode.historyId;bookmarksNode.hide();
                            }).then(() => __WEBPACK_IMPORTED_MODULE_1__js_popup__["showMessage"]("History entry saved as bookmark!", $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]}] > [data-item-id="${historyId}"]`)));
                        } else if (-1 === historyId) {
                            // save all visible
                            const promises = [];

                            $$(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]}] > [data-item-id]:not(.hidden)`).forEach(link => {
                                promises.push(saveHistoryAsBookmark(link.getAttribute("data-item-id"), parentId));
                            });

                            Promise.all(promises).then(() => {
                                delete bookmarksNode.historyId;bookmarksNode.hide();
                            }).then(() => __WEBPACK_IMPORTED_MODULE_1__js_popup__["showMessage"]("All history items have been saved!", $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]}]`)));
                        }
                    }
                    break;
                default:
                    log(`Undefined action ${action}`);

            }
        });

        const i = setInterval(() => {
            if (!loadedItems.has(__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"])) {
                return;
            }

            clearInterval(i);

            loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]).save = id => {
                bookmarksNode.historyId = id;
                bookmarksNode.show();

                return Promise.resolve();
            };
        }, 500);

        function saveHistoryAsBookmark(historyId, parentId) {
            const { title, url } = loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["HISTORY_ID"]).get(historyId);
            return __WEBPACK_IMPORTED_MODULE_4__js_class_Bookmarks__["a" /* default */].create(title, url, parentId).then(item => loadedItems.get(__WEBPACK_IMPORTED_MODULE_1__js_popup__["BOOKMARKS_ID"]).add(item)).then(item => __WEBPACK_IMPORTED_MODULE_1__js_popup__["displayItemHtml"](item, $(`#items > [data-tab-id=${__WEBPACK_IMPORTED_MODULE_1__js_popup__["BOOKMARKS_ID"]}]`)));
        }
    });

    /***/
}]);
