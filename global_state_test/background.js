let state = false;

function changeSetBadgeText() {
  if(state) {
    chrome.action.setBadgeText({text: "ON"});
  } else {
    chrome.action.setBadgeText({text: "OFF"});
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  state = !state;
  changeSetBadgeText();
});

chrome.runtime.onInstalled.addListener(() => {
  if(state) {
    chrome.scripting
    .executeScript({
        target : { tabId : tab.id },
        files : [ "api.js" ],
    })
    .then(() => console.log("injected script file"));
  }
});