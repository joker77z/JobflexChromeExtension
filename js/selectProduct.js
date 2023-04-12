chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.from === 'popup') {
    switch (msg.action) {
      case 'alwaysDontLoginHistory':
        dontViewLoginHistory(sendResponse);
      case 'alwaysDontViewPopup':
        dontViewPopup(sendResponse);
      case 'alwaysExtendPassword':
      case 'extendPassword':
        extendPassword(sendResponse);
        break;
    }
  }
});

const storageKeysToFunctionMap = {
  alwaysDontLoginHistory: dontViewLoginHistory,
  alwaysDontViewPopup: dontViewLoginHistory,
  alwaysExtendPassword: dontViewPopup,
};

Object.entries(storageKeysToFunctionMap).forEach(([key, fn]) => {
  chrome.storage.local.get([key]).then((result) => {
    if (result[key]) {
      fn();
    }
  });
});

function dontViewLoginHistory(sendResponse) {
  if (sendResponse) {
    const modalTitle =
      document.querySelector('.h1.face-lift-h1') ||
      document.querySelector('.h1 ');
    if (modalTitle.textContent === '로그인 내역') {
      modalTitle.closest('#modalFrm').remove();
    }
    sendResponse({ success: 'success' });
  }
  document.cookie = 'WELCOME_PAGE=done';
}

function dontViewPopup(sendResponse) {
  let timer = setInterval(() => {
    if (document.querySelector('[data-popup]')) {
      removeDOM();
      sendResponse({ success: 'success' });
      clearInterval(timer);
    }
  }, 500);

  function removeDOM() {
    [...document.querySelectorAll('[data-popup]')].forEach((element) => {
      element.remove();
    });
  }
}

async function extendPassword(sendResponse) {
  const origin = window.location.origin;

  // 비밀번호 만료가 되었는지 먼저 체크. 만료 되었으면 연장api를 실행.
  const expiredPasswordResponse = await fetch(
    `${origin}/cus/member/isExpiredPassword`,
    {
      method: 'POST',
    },
  );
  const isExpiredPassword = await expiredPasswordResponse.json();
  if (!isExpiredPassword) return;

  await fetch(`${origin}/cus/member/extendPasswordExpirationDate`, {
    method: 'POST',
  });

  // 페이지 진입 전 Always ON이면 local storage데이터를 읽어서 사전에 API를 쏘기 때문에 모달이 안뜬다. 즉, sendResponse가 필요없다.
  if (sendResponse) {
    sendResponse({ success: 'success' });
    document.querySelector('[data-type="changePassword"]').remove();
  }
}
