(async () => {
  const origin = window.location.origin;
  const accStatus = ['완료', '미응시', '미완료', '접속횟수 초과'];

  const src = chrome.runtime.getURL('js/helper/common.js');
  const commonScript = await import(src);

  commonScript.matchUrlToRun('/mrs2/manager/screening/list') ? console.log('%c [Insight Extension] 전형진행현황 페이지 정상 진입, Extension은 그리드에서 동작합니다.', "color: green") : ''
  if (!commonScript.matchUrlToRun('/mrs2/manager/screening/list')) {
    return false;
  }

  function accGridReload() {
    // 제목을 기억하고, 그리드를 끄고, 다시 그리드 클릭
    const recordScreeningName = document.querySelector('#screeningName').textContent;
    document.querySelector('#modalGrid').remove();

    [...document.querySelectorAll('[data-button="modifyScreening"]')].forEach(el => {
      if(recordScreeningName === el.textContent) {
        el.closest('tr').querySelector('[data-button="result"]').click();
      }
    });
  }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (!document.querySelector('.gridH1')) {
      alert('평가 결과 그리드 내에서만 사용할 수 있습니다 :)');
      return false;
    }

    if (msg.from === 'popup') {
      switch (msg.action) {
        case 'selectedPersonAddData':
          selectedPersonAddData(sendResponse);
          break;
        case 'allPersonAddData':
          allPersonAddData(sendResponse);
          break;
      }
    }
  });

  function allPersonAddData(sendResponse) {
    // 전형번호는 빈 배열, 응시자 번호를 보낸다.
    const checkedData = {
      checkedScreeningResumeSn: [],
      checkedScreeningSn: 0,
    };

    [...document.querySelectorAll('input.checkbox[name="resumeSn"]')].forEach((checkbox) => {
      const checkedScreeningResumeSn = checkbox.getAttribute('data-screeningresumesn');
      const accStatusButton = document.querySelector(`button[data-screeningresumesn="${checkedScreeningResumeSn}"]`);
      const accStatusText = accStatusButton.previousSibling.textContent;

      if (!accStatus.includes(accStatusText)) {
        alert('응시 데이터를 추가하려는 지원자 중에 "완료", "미용시", "미완료", "접속횟수 초과" 상태가 아닌 지원자가 있습니다!');
        return;
      }

      checkedData.checkedScreeningResumeSn.push(checkedScreeningResumeSn);

      if (!checkedData.checkedScreeningSn) {
        checkedData.checkedScreeningSn = Number(checkbox.getAttribute('data-screeningsn'));
      }
    });

    // fetch(`${origin}/chrome-extension/extend-password-expiration-date`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(checkedData),
    // });

    accGridReload();
    console.log(checkedData);
  }

  function selectedPersonAddData(sendResponse) {
    // 체크된 전형번호, 응시자 번호를 읽는다.
    // 이 때 만약 완료, 미응시, 미완료, 접속횟수 초과가 포함되어 있다면 Alert를 띄운다.
    const checkedData = {
      checkedScreeningResumeSn: [],
      checkedScreeningSn: 0,
    };

    const checkedInput = [...document.querySelectorAll('input.checkbox:checked')];
    if(checkedInput.length === 0) {
      alert('체크한 지원자가 없습니다 :(')
      return false;
    }

    checkedInput.forEach((checkbox) => {
      const checkedScreeningResumeSn = checkbox.getAttribute('data-screeningresumesn');
      const accStatusButton = document.querySelector(`button[data-screeningresumesn="${checkedScreeningResumeSn}"]`);
      const accStatusText = accStatusButton.previousSibling.textContent;

      if (!accStatus.includes(accStatusText)) {
        alert('응시 데이터를 추가하려는 지원자 중에 "완료", "미용시", "미완료", "접속횟수 초과" 상태가 아닌 지원자가 있습니다!');
        return;
      }

      checkedData.checkedScreeningResumeSn.push(checkedScreeningResumeSn);

      if (!checkedData.checkedScreeningSn) {
        checkedData.checkedScreeningSn = Number(checkbox.getAttribute('data-screeningsn'));
      }
    });

    // fetch(`${origin}/chrome-extension/extend-password-expiration-date`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(checkedData),
    // });

    accGridReload();
    console.log(checkedData);
  }
})();
