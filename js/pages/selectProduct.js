(async () => {
  const src = chrome.runtime.getURL("js/helper/common.js");
  const commonScript = await import(src);

  commonScript.matchUrlToRun("/cus/selectProduct")
    ? console.log("%c [Jobflex Extension] 제품선택 페이지 정상 진입", "color: white; background: #00C17C; padding: 10px;")
    : "";

  if (!commonScript.matchUrlToRun("/cus/selectProduct")) {
    return false;
  }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log("message를 들을 수 있나설마?");
    if (msg.from === "popup") {
      switch (msg.action) {
        case "alwaysDontViewLoginHistory":
          dontViewLoginHistory(sendResponse);
          break;
        case "alwaysDontViewPopup":
          dontViewPopup(sendResponse);
          break;
        case "alwaysExtendPassword":
        case "extendPassword":
          extendPassword(sendResponse);
          break;
      }
    }
  });

  const storageKeysToFunctionMap = {
    alwaysDontViewLoginHistory: dontViewLoginHistory,
    alwaysDontViewPopup: dontViewPopup,
    alwaysExtendPassword: extendPassword,
  };

  Object.entries(storageKeysToFunctionMap).forEach(([key, fn]) => {
    chrome.storage.local.get([key]).then((result) => {
      if (result[key]) {
        fn();
      } else if (key === "alwaysDontViewLoginHistory" && !result[key]) {
        document.cookie = "WELCOME_PAGE=false";
      }
    });
  });

  function dontViewLoginHistory(sendResponse) {
    if (sendResponse) {
      const modalTitle = document.querySelector(".h1.face-lift-h1") || document.querySelector(".h1 ");
      if (modalTitle?.textContent === "로그인 내역") {
        modalTitle.closest("#modalFrm").remove();
        sendResponse({ success: true });
      }
    }
    document.cookie = "WELCOME_PAGE=done";
  }

  function dontViewPopup(sendResponse) {
    let timer = setInterval(() => {
      if (document.querySelector("[data-popup]")) {
        removeDOM();
        if (sendResponse) sendResponse({ success: true });
        clearInterval(timer);
      }
    }, 500);

    function removeDOM() {
      [...document.querySelectorAll("[data-popup]")].forEach((element) => {
        element.remove();
      });
    }
  }

  async function extendPassword(sendResponse) {
    const origin = window.location.origin;

    // 비밀번호 만료가 되었는지 먼저 체크. 만료 되었으면 연장api를 실행.
    const expiredPasswordResponse = await fetch(`${origin}/cus/member/isExpiredPassword`, {
      method: "POST",
    });
    const isExpiredPassword = await expiredPasswordResponse.json();
    if (!isExpiredPassword) return;

    await fetch(`${origin}/chrome-extension/extend-password-expiration-date`, {
      method: "POST",
    });

    // 페이지 진입 전 Always ON이면 local storage데이터를 읽어서 사전에 API를 쏘기 때문에 모달이 안뜬다. 즉, sendResponse가 필요없다.
    if (sendResponse) {
      sendResponse({ success: true });
      document.querySelector('[data-type="changePassword"]').remove();
    }
  }

  function selectedPersonAddData(sendResponse) {
    // 1. 현재 역검센터 전형 결과 그리드인지 확인한다.
    // 2. 역검센터 전형 결과 그리드면 screeningSn, 체크한 screeningResumeSn들을 읽어온다.
    //    이 때 완료, 미응시, 미완료, 접속횟수 초과인지 확인한다.
    // 3.
    /**
     * if (!현재 역검센터 전형 결과 그리드) return;
     *
     * const origin = window.location.origin;
     * const screeningSn = document.querySelector('#screeningSn');
     * const checkAccResume = ['완료', '미응시', '미완료', '접속횟수 초과'];
     * let selectedScreeningResumeSn = [];
     * let data = {};
     *
     * [...document.querySelectorAll('input #screeningResumeSn')].forEach((el) => {
     *   if(!checkAccResume.includes(el.friend.textContent)) {
     *     alert('완료, 미응시, 미완료, 접속횟수 초과에 해당하는 응시자 데이터만 데이터 추가 가능합니다.');
     *     return false;
     *   }
     *   if(el.checked) selectedScreeningResumeSn.push(el.value);
     * });
     *
     * fetch(`${origin}/chrome-extension/extend-password-expiration-date`, {method: 'POST', data: data});
     */
  }

  // function allPersonAddData(sendResponse) {

  // }
})();
