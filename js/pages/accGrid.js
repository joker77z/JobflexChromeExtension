(async () => {
  const origin = window.location.origin;

  const src = chrome.runtime.getURL('js/helper/common.js');
  const commonScript = await import(src);

  commonScript.matchUrlToRun('/mrs2/manager/screening/list')
    ? console.log(
        '%c [Jobflex Extension] 전형진행현황 페이지 정상 진입, Extension은 그리드에서 동작합니다.',
        'color: white; background: #00C17C; padding: 10px;',
      )
    : '';
  if (!commonScript.matchUrlToRun('/mrs2/manager/screening/list')) {
    return false;
  }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.from === 'popup') {
      switch (msg.action) {
        case 'allPersonAddData':
          if (document.querySelector('.gridH1').textContent !== '역검센터전형 결과') {
            alert('역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)');
            return false;
          }
          allPersonWorkData('add', sendResponse);
          break;
        case 'selectedPersonAddData':
          if (document.querySelector('.gridH1').textContent !== '역검센터전형 결과') {
            alert('역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)');
            return false;
          }
          selectedPersonWorkData('add', sendResponse);
          break;
        case 'allPersonRemoveData':
          if (document.querySelector('.gridH1').textContent !== '역검센터전형 결과') {
            alert('역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)');
            return false;
          }
          allPersonWorkData('remove', sendResponse);
          break;
        case 'selectedPersonRemoveData':
          if (document.querySelector('.gridH1').textContent !== '역검센터전형 결과') {
            alert('역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)');
            return false;
          }
          selectedPersonWorkData('remove', sendResponse);
          break;
      }
    }
  });

  async function allPersonWorkData(addOrRemove, sendResponse) {
    // 전형번호는 빈 배열, 응시자 번호를 보낸다.
    const checkedData = {
      screeningResumeSns: [],
      screeningSn: 0,
    };

    checkedData.screeningSn = Number(document.querySelector('input.checkbox[name="resumeSn"]').getAttribute('data-screeningsn'));

    fetch(`${origin}/chrome-extension/${addOrRemove === 'add' ? 'create' : 'reset'}/acc-examination-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkedData),
    });

    if (addOrRemove === 'add') {
      commonScript.modal(
        '응시자 데이터 추가 작업이 시작되었습니다',
        '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 멈추지 않습니다.',
        true,
        'dontViewAddAccDataModal',
      );
      console.log(`%c [Jobflex Extension] 전체 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, 'color: green');
    } else {
      commonScript.modal(
        '응시자 데이터 삭제 작업이 시작되었습니다',
        '현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 진행됩니다.',
        true,
        'dontViewRemoveAccDataModal',
      );
      console.log(`%c [Jobflex Extension] 전체 응시자 데이터 삭제 성공! ${JSON.stringify(checkedData)}`, 'color: green');
    }

    if (sendResponse) sendResponse({ success: true });
  }

  async function selectedPersonWorkData(addOrRemove, sendResponse) {
    // 체크된 전형번호, 응시자 번호를 읽는다.
    const checkedData = {
      screeningResumeSns: [],
      screeningSn: 0,
    };

    const checkedInput = [...document.querySelectorAll('input.checkbox[name="resumeSn"]:checked')];
    if (checkedInput.length === 0) {
      commonScript.modal('체크한 지원자가 없습니다', '', true);
      if (sendResponse) sendResponse({ success: true });
      return false;
    }

    checkedData.screeningSn = Number(document.querySelector('input.checkbox[name="resumeSn"]').getAttribute('data-screeningsn'));

    checkedInput.forEach((checkbox) => {
      const checkedScreeningResumeSn = checkbox.getAttribute('data-screeningresumesn');
      const accStatusButton = document.querySelector(`button[data-screeningresumesn="${checkedScreeningResumeSn}"]`);
      const accStatusText = accStatusButton.previousSibling.textContent;

      checkedData.screeningResumeSns.push(Number(checkedScreeningResumeSn));
    });

    fetch(`${origin}/chrome-extension/${addOrRemove === 'add' ? 'create' : 'reset'}/acc-examination-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkedData),
    });

    if (addOrRemove === 'add') {
      commonScript.modal(
        '응시자 데이터 추가 작업이 시작되었습니다',
        '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 진행 됩니다.',
        true,
        'dontViewAddAccDataModal',
      );
      console.log(`%c [Jobflex Extension] 선택 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, 'color: green;');
    } else {
      commonScript.modal(
        '응시자 데이터 삭제 작업이 시작되었습니다',
        '현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 진행됩니다.',
        true,
        'dontViewRemoveAccDataModal',
      );
      console.log(`%c [Jobflex Extension] 선택 응시자 데이터 삭제 성공! ${JSON.stringify(checkedData)}`, 'color: green;');
    }

    if (sendResponse) sendResponse({ success: true });
  }
})();
