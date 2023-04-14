chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.from === 'popup') {
    switch (msg.action) {
      case 'alwaysDontViewPopup':
        dontViewPopup(sendResponse);
    }
  }
});

chrome.storage.local.get(['alwaysDontViewPopup']).then((result) => {
  if (result.alwaysDontViewPopup) {
    dontViewPopup();
  }
});

function dontViewPopup(sendResponse) {
  let timer = setInterval(() => {
    if (document.querySelector('#NoticepopUp')) {
      removeDOM();
      if (sendResponse) sendResponse({ success: true });
      clearInterval(timer);
    }
  }, 500);

  function removeDOM() {
    [...document.querySelectorAll('#NoticepopUp')].forEach((element) => {
      element.remove();
    });
  }
}
