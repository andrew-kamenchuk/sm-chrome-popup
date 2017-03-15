/* global chrome */
import * as util from "./js/util";
import * as popup from "./js/popup";
import History from "./js/class/History";
import Cookies from "./js/class/Cookies";
import Bookmarks from "./js/class/Bookmarks";

const log = util.createLogger("main");

const { $, $$ } = popup;

let currentTab;

const loadedItems = new Map();

let activeItemsId;

const updateBadge = () => {
    if (activeItemsId && loadedItems.has(activeItemsId)) {
        popup.updateBadge(currentTab.id, activeItemsId, loadedItems.get(activeItemsId).size());
    }
};

chrome.tabs.query({ active: true }, tabs => {
    if (!Array.isArray(tabs) || !tabs.length) {
        throw new Error("This should never happen");
    }

    currentTab = tabs[0];

    log("begin");

    const [host, origin] = util.parseURL(currentTab.url, "host", "origin");

    History.load(host)
        .then(history => {
            const htmlBlock = $(`#items > [data-tab-id=${popup.HISTORY_ID}`);

            for (const item of history) {
                popup.displayItemHtml(item, htmlBlock);
            }

            loadedItems.set(popup.HISTORY_ID, history);
        })
        .then(() => $(`header > [data-tab-header=${popup.HISTORY_ID}]`).dispatchEvent(new Event("click")));

    Bookmarks.load(origin)
        .then(bookmarks => {
            const htmlBlock = $(`#items > [data-tab-id=${popup.BOOKMARKS_ID}`);

            for (const item of bookmarks) {
                popup.displayItemHtml(item, htmlBlock);
            }

            loadedItems.set(popup.BOOKMARKS_ID, bookmarks);
        });

    Cookies.load(currentTab.url)
        .then(cookies => {
            const htmlBlock = $(`#items > [data-tab-id=${popup.COOKIES_ID}`);

            for (const item of cookies) {
                popup.displayItemHtml(item, htmlBlock);
            }

            loadedItems.set(popup.COOKIES_ID, cookies);
        });
});

popup.onDocumentLoaded(() => {
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

            headers.forEach(h =>
                h.classList.toggle("active", id === h.getAttribute("data-tab-header"))
            );

            $$("#items > [data-tab-id]").forEach(tab =>
                tab.classList.toggle("hidden", id !== tab.getAttribute("data-tab-id"))
            );

            $("#actions > [data-action=cookie]").classList.toggle("hidden", id !== popup.COOKIES_ID);

            $("#actions > [data-action=save]").classList.toggle("hidden", id !== popup.HISTORY_ID);

            updateBadge();
        });
    });

    form.addEventListener("submit", e => e.preventDefault());

    input.addEventListener("input", () => {
        if (!activeItemsId || !loadedItems.has(activeItemsId)) {
            return;
        }

        const matches = {};

        loadedItems.get(activeItemsId).search(input.value).forEach(item => { matches[item.id] = true; });

        $$(`#items > [data-tab-id=${activeItemsId}] > a.item`).forEach(link =>
            link.classList.toggle("hidden", !matches[link.getAttribute("data-item-id")])
        );
    });

    form.addEventListener("reset", () =>
        $$(`#items > [data-tab-id=${activeItemsId}] > a.item`).forEach(link => link.classList.remove("hidden"))
    );
});

popup.onDocumentLoaded(() => {
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
                    id !== popup.COOKIES_ID && chrome.tabs.create({ url: parent.getAttribute("href"), active: true });
                    break;
                case "save":
                    loadedItems.get(id).save(itemId).then(item => item && popup.showMessage("Item has been saved!", parent));
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

popup.onDocumentLoaded(() => {
    $("#actions > [data-action=clear]").addEventListener("click", () => {
        if (!activeItemsId || !loadedItems.has(activeItemsId)) {
            return;
        }

        const items = loadedItems.get(activeItemsId);

        $$(`#items > [data-tab-id=${activeItemsId}] > a:not(.hidden)`).forEach(link =>
            items.remove(link.getAttribute("data-item-id")).then(() => link.remove()).then(updateBadge)
        );
    });
});

popup.onDocumentLoaded(() => {
    $("#actions > [data-action=save]").addEventListener("click", () => {
        if (activeItemsId === popup.HISTORY_ID && loadedItems.has(activeItemsId)) {
            $("#bookmarks-tree").historyId = -1;
            $("#bookmarks-tree").show && $("#bookmarks-tree").show();
        }
    });
});

popup.onDocumentLoaded(() => {
    $("#actions > form[data-action=cookie]").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!loadedItems.has(popup.COOKIES_ID)) {
            return;
        }

        const name = this.querySelector("[name=name]").value;

        if (!name.length) {
            return void popup.showMessage("Error: Cookie Name is empty", this);
        }

        const value = this.querySelector("[name=value]").value;

        const url = util.parseURL(currentTab.url, "origin");

        loadedItems.get(popup.COOKIES_ID).add({ name, value, url });

        loadedItems.get(popup.COOKIES_ID).save(name)
            .then(item =>
                popup.displayItemHtml(item, $(`#items > [data-tab-id=${popup.COOKIES_ID}]`), true)
            )
            .then(updateBadge)
            .then(() => popup.showMessage("Cookie has been added!", this))
            .then(() => this.reset());
    });
});

popup.onDocumentLoaded(() => {
    $(`#items > [data-tab-id=${popup.COOKIES_ID}]`).addEventListener("input", event => {
        loadedItems.get(popup.COOKIES_ID).get(event.target.getAttribute("name")).value = event.target.value;
    });
});

popup.onDocumentLoaded(() => {
    const bookmarksNode = $("#bookmarks-tree");

    Bookmarks.getTree().then(tree => { bookmarksNode.innerHTML += popup.buildBookmarksHtmlTree(tree); });

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
                if (parentId && loadedItems.has(popup.HISTORY_ID) && loadedItems.has(popup.BOOKMARKS_ID)) {
                    const history = loadedItems.get(popup.HISTORY_ID);
                    const bookmarks = loadedItems.get(popup.BOOKMARKS_ID);

                    if (historyId > 0) {
                        const { title, url } = history.get(historyId);

                        Bookmarks.create(title, url, parentId)
                            .then(item => bookmarks.add(item))
                            .then(item => popup.displayItemHtml(item, $(`#items > [data-tab-id=${popup.BOOKMARKS_ID}]`)))
                            .then(() => { delete bookmarksNode.historyId; bookmarksNode.hide(); })
                            .then(() => popup.showMessage("History entry saved as bookmark!",
                                $(`#items > [data-tab-id=${popup.HISTORY_ID}] > [data-item-id="${historyId}"]`)))
                            .catch(log);
                    } else if (-1 === historyId) { // save all visible
                        const promises = [];

                        $$(`#items > [data-tab-id=${popup.HISTORY_ID}] > [data-item-id]:not(.hidden)`).forEach(link => {
                            const { title, url } = history.get(link.getAttribute("data-item-id"));
                            promises.push(Bookmarks.create(title, url, parentId)
                                .then(item => bookmarks.add(item))
                                .then(item => popup.displayItemHtml(item, $(`#items > [data-tab-id=${popup.BOOKMARKS_ID}]`)))
                            );
                        });

                        Promise.all(promises)
                            .then(() => { delete bookmarksNode.historyId; bookmarksNode.hide(); })
                            .then(() => popup.showMessage("All history items have been saved!",
                                $(`#items > [data-tab-id=${popup.HISTORY_ID}]`)
                            ))
                            .catch(log);
                    }
                }
                break;
            default:
                log(`Undefined action ${action}`);

        }
    });

    const i = setInterval(() => {
        if (!loadedItems.has(popup.HISTORY_ID)) {
            return;
        }

        clearInterval(i);

        loadedItems.get(popup.HISTORY_ID).save = id => {
            bookmarksNode.historyId = id;
            bookmarksNode.show();

            return Promise.resolve();
        };
    }, 500);
});
