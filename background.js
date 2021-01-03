var current_tab = -1;
var urls = []

const filter = {
    properties: ["status"]
  }
  

function onError(error) {
    console.log(`An error: ${error}`);
}

function setItems(bookmarkItem) {
    if (bookmarkItem.url) {
        urls.push(bookmarkItem.url)
    }
    if (bookmarkItem.children) {
        for (child of bookmarkItem.children) {
            setItems(child);
        }
    }
}

function openItem() {
    if (urls.length > 350) {
        url = urls.pop();
        browser.tabs.create({ url: url, active: false }).then(onCreated, onError);
    }
    else {
        browser.tabs.onUpdated.removeListener(updateListener);
    }
}

function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
    current_tab = tab.id;
}

function onComplete() {
    console.log(`Discarded tab: ` + current_tab);
    current_tab = -1;
    openItem();
}

function onAccepted(bookmarkItems) {
    setItems(bookmarkItems[0]);
    console.log('num of urls: ' + urls.length)
    openItem();
}

function updateListener(tabId, changeInfo, tab) {
    if (tabId == current_tab && tab.status == "complete") {
        browser.tabs.remove(tabId).then(onComplete, onError);
    }
}

browser.tabs.onUpdated.addListener(updateListener, filter);
browser.bookmarks.getTree().then(onAccepted, onError);