/* global chrome */
"use strict";

chrome.runtime.onInstalled.addListener(() =>
    chrome.contextMenus.create({ contexts: ["page"], title: "Delete This Url from History", id: "1" })
);

chrome.contextMenus.onClicked.addListener(({ pageUrl: url }) => chrome.history.deleteUrl({ url }));
