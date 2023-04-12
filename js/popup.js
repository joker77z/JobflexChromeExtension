import { $ } from './util';

window.addEventListener('DOMContentLoaded', () => {
  // Selector
  const $alwaysDontViewLoginHistoryToggle = $(
    'alwaysDontViewLoginHistoryToggle',
  );
  const $alwaysDontViewPopupToggle = $('alwaysDontViewPopupToggle');
  const $alwaysExtendPasswordToggle = $('alwaysExtendPasswordToggle');
  const $extendPasswordButton = $('extendPasswordButton');

  /**
   * ToggleRender
   * Toggle을 추가하면 chrome.storage.local.key: dom 형식으로 넣어주면 됌.
   */
  const storageKeysToElementMap = {
    alwaysDontLoginHistory: $alwaysDontViewLoginHistoryToggle,
    alwaysDontViewPopup: $alwaysDontViewPopupToggle,
    alwaysExtendPassword: $alwaysExtendPasswordToggle,
  };

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
      window.close();
    }
  }
});
