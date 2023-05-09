(async () => {
  const src = chrome.runtime.getURL("js/helper/common.js");
  const commonScript = await import(src);

  console.log(commonScript.matchUrlToRun('/mrs2/manager/screening/list'));

  if(!commonScript.matchUrlToRun('/mrs2/manager/screening/list')) {
    return false;
  }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if(!document.querySelector('.gridH1')) return;

    if (msg.from === 'popup') {
      switch (msg.action) {
        case 'selectedPersonAddData':
          selectedPersonAddData(sendResponse);
        case 'allPersonAddData':
          allPersonAddData(sendResponse);
      }
    }
  });

  function selectedPersonAddData(sendResponse) {
    // 체크된 전형번호, 응시자 번호를 읽는다.
    // 이 때 만약 완료, 미응시, 미완료, 접속횟수 초과가 포함되어 있다면 Alert를 띄운다.
    let checkedScreeningResumeSn
    [...document.querySelectorAll('input.checkbox:checked')].forEach(checkbox => {
      checkbox.getAttribute('data-screeningsn')
    })
  }

  function allPersonAddData(sendResponse) {
    // 전형번호는 빈 배열, 응시자 번호를 보낸다.

  }
  
  // chrome.storage.local.get(['alwaysDontViewPopup']).then((result) => {
  //   if (result.alwaysDontViewPopup) {
  //     dontViewPopup();
  //   }
  // });
  
  // function dontViewPopup(sendResponse) {
  //   let timer = setInterval(() => {
  //     if (document.querySelector('#NoticepopUp')) {
  //       removeDOM();
  //       if (sendResponse) sendResponse({ success: true });
  //       clearInterval(timer);
  //     }
  //   }, 500);
  
  //   function removeDOM() {
  //     [...document.querySelectorAll('#NoticepopUp')].forEach((element) => {
  //       element.remove();
  //     });
  //   }
  // }
})();