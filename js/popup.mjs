import { $ } from '/js/helper/util.mjs';

window.addEventListener('DOMContentLoaded', () => {
  // Selector
  const $allPersonAddDataButton = $('allPersonAddDataButton');
  const $selectedPersonAddDataButton = $('selectedPersonAddDataButton');
  const $allPersonRemoveDataButton = $('allPersonRemoveDataButton');
  const $selectedPersonRemoveDataButton = $('selectedPersonRemoveDataButton');

  const $alwaysDontViewLoginHistoryToggle = $('alwaysDontViewLoginHistoryToggle');
  const $alwaysDontViewPopupToggle = $('alwaysDontViewPopupToggle');

  const $alwaysExtendPasswordToggle = $('alwaysExtendPasswordToggle');
  const $extendPasswordButton = $('extendPasswordButton');

  const storageKeysToElementMap = {
    alwaysDontViewLoginHistory: $alwaysDontViewLoginHistoryToggle,
    alwaysDontViewPopup: $alwaysDontViewPopupToggle,
    alwaysExtendPassword: $alwaysExtendPasswordToggle,
  };

  document.getElementById('header').addEventListener('click', () => {
    window.open('https://midasitweb-jira.atlassian.net/wiki/spaces/AATS/pages/3702718544/Jobflex+Chrome+Extension');
  });

  /**
   * ToggleRender
   * Toggle을 추가하면 chrome.storage.local.key: dom 형식으로 넣어주면 됌.
   */
  Object.entries(storageKeysToElementMap).forEach(([key, $dom]) => {
    chrome.storage.local.get([key], (result) => {
      $dom.checked = result[key];
    });
  });

  // Event
  Object.entries(storageKeysToElementMap).forEach(([key, $dom]) => {
    $dom.addEventListener('change', (e) => {
      if (e.target.checked) {
        chrome.storage.local.set({ [key]: true });
        sendMessageToContentScript(key);
      } else {
        chrome.storage.local.set({ [key]: false });
      }
    });
  });

  $allPersonAddDataButton.addEventListener('click', () => {
    sendMessageToContentScript('allPersonAddData');
  });

  $selectedPersonAddDataButton.addEventListener('click', () => {
    sendMessageToContentScript('selectedPersonAddData');
  });

  $allPersonRemoveDataButton.addEventListener('click', () => {
    sendMessageToContentScript('allPersonRemoveData');
  });

  $selectedPersonRemoveDataButton.addEventListener('click', () => {
    sendMessageToContentScript('selectedPersonRemoveData');
  });

  $extendPasswordButton.addEventListener('click', () => {
    sendMessageToContentScript('extendPassword');
  });

  async function sendMessageToContentScript(key) {
    const [tabs] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const receivedMessage = await chrome.tabs.sendMessage(tabs.id, {
      from: 'popup',
      action: key,
    });
    if (receivedMessage?.success) {
      window?.close();
    }
  }
});
