/**
 * 블로깅
 * - chrome extension console 찍는 방법 (console 안찍힐 때)
 * - 일치 연산자 사용 방법
 */

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
});

async function unregisterAllDynamicContentScripts() {
    try {
      const scripts = await chrome.scripting.getRegisteredContentScripts();
      const scriptIds = scripts.map(script => script.id);
      return chrome.scripting.unregisterContentScripts(scriptIds);
    } catch (error) {
      const message = [
        "An unexpected error occurred while",
        "unregistering dynamic content scripts.",
      ].join(" ");
      throw new Error(message, {cause : error});
    }
  }

const extensions = 'selectProduct';

chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab.url.indexOf(extensions));
    if (tab.url.indexOf(extensions) != '-1') {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Next state will always be the opposite
        let nextState = prevState === 'ON' ? 'OFF' : 'ON'

        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension on
            // await chrome.scripting.insertCSS({
            //   files: ["css/focus-mode.css"],
            //   target: { tabId: tab.id },
            // });

            chrome.scripting
                .executeScript({
                    target : { tabId : tab.id },
                    files : [ "scripts/api.js" ],
                })
                .then(() => console.log("injected script file"));

            // chrome.scripting
            //     .registerContentScripts([{
            //       id: "apiscript",
            //       js: ["scripts/api.js"],
            //       persistAcrossSessions: false,
            //       matches: ["*://*/selectproduct"],
            //       runAt: "document_start",
            //     }])
            //     .then(() => console.log("registration complete"))
            //     .catch((err) => console.warn("unexpected error", err))
            

          } else if (nextState === "OFF") {
            // Remove the CSS file when the user turns the extension off
            // await chrome.scripting.removeCSS({
            //   files: ["css/focus-mode.css"],
            //   target: { tabId: tab.id },
            // });

            unregisterAllDynamicContentScripts();
          }

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
    }
})
   