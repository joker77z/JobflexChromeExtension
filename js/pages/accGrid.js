(async () => {
  const origin = window.location.origin;

  const src = chrome.runtime.getURL("js/helper/common.js");
  const commonScript = await import(src);

  commonScript.matchUrlToRun("/mrs2/manager/screening/list")
    ? console.log(
        "%c [Jobflex Extension] 전형진행현황 페이지 정상 진입, Extension은 그리드에서 동작합니다.",
        "color: white; background: #00C17C; padding: 10px;"
      )
    : "";
  if (!commonScript.matchUrlToRun("/mrs2/manager/screening/list")) {
    return false;
  }

  // 응시자 데이터가 바로 추가되지 않기 때문에 바로 리로드 할 필요가 없어서 일단 주석처리.
  // function accGridReload() {
  //   // 제목을 기억하고, 그리드를 끄고, 다시 그리드 클릭
  //   const recordScreeningName = document.querySelector('#screeningName').textContent;
  //   document.querySelector('#modalGrid').remove();

  //   [...document.querySelectorAll('[data-button="modifyScreening"]')].forEach((el) => {
  //     if (recordScreeningName === el.textContent) {
  //       el.closest('tr').querySelector('[data-button="result"]').click();
  //     }
  //   });
  // }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.from === "popup") {
      switch (msg.action) {
        case "selectedPersonAddData":
          if (document.querySelector(".gridH1").textContent !== "역검센터전형 결과") {
            alert("역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)");
            return false;
          }
          selectedPersonAddData(sendResponse);
          break;
        case "allPersonAddData":
          if (document.querySelector(".gridH1").textContent !== "역검센터전형 결과") {
            alert("역검센터전형 평가 결과 그리드 내에서만 사용할 수 있습니다 :)");
            return false;
          }
          allPersonAddData(sendResponse);
          break;
      }
    }
  });

  async function allPersonAddData(sendResponse) {
    // 전형번호는 빈 배열, 응시자 번호를 보낸다.
    const checkedData = {
      screeningResumeSns: [],
      screeningSn: 0,
    };

    checkedData.screeningSn = Number(document.querySelector('input.checkbox[name="resumeSn"]').getAttribute("data-screeningsn"));

    fetch(`${origin}/chrome-extension/create/acc-examination-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkedData),
    });

    commonScript.modal(
      "응시자 데이터 추가 작업이 시작되었습니다",
      '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 멈추지 않습니다.',
      true,
      true
    );

    console.log(`%c [Jobflex Extension] 전체 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, "color: green");

    // 에러 뱉을 때를 고려했으나, 정상일 때 pending 상태가 길어서 로딩 + dim처리해서 기다리게 하면 데이터를 확인할 때 좋지 않을듯..
    // 페이지 우측 하단에 로딩 게이지라던지 고려해봤는데 만약 페이지를 이동하면 없어지니까 이것도 좋은 방법이 아닌듯. 물론 강제로 계속 넣어줄 수 있긴하지만 일단은 중요도 낮으니 스킵
    // try {
    //   const response = await fetch(`${origin}/chrome-extension/create/acc-examination-data`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(checkedData),
    //   });

    //   if (!response.ok) {
    //     throw new Error(response.status);
    //   } else {
    //     commonScript.modal(
    //       "응시자 데이터 추가 작업이 시작되었습니다",
    //       '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 멈추지 않습니다.',
    //       true,
    //       true
    //     );
    //     console.log(`%c [Jobflex Extension] 전체 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, "color: green");
    //   }
    // } catch (e) {
    //   commonScript.modal("응시자 데이터 생성 실패", "", true);
    // }

    if (sendResponse) sendResponse({ success: true });
  }

  async function selectedPersonAddData(sendResponse) {
    // 체크된 전형번호, 응시자 번호를 읽는다.
    // 이 때 만약 완료, 미응시, 미완료, 접속횟수 초과가 포함되어 있다면 Alert를 띄운다.
    const checkedData = {
      screeningResumeSns: [],
      screeningSn: 0,
    };

    const checkedInput = [...document.querySelectorAll('input.checkbox[name="resumeSn"]:checked')];
    if (checkedInput.length === 0) {
      commonScript.modal("체크한 지원자가 없습니다", "", true);
      if (sendResponse) sendResponse({ success: true });
      return false;
    }

    checkedData.screeningSn = Number(document.querySelector('input.checkbox[name="resumeSn"]').getAttribute("data-screeningsn"));

    checkedInput.forEach((checkbox) => {
      const checkedScreeningResumeSn = checkbox.getAttribute("data-screeningresumesn");
      const accStatusButton = document.querySelector(`button[data-screeningresumesn="${checkedScreeningResumeSn}"]`);
      const accStatusText = accStatusButton.previousSibling.textContent;

      // const accStatus = ["완료", "미응시", "미완료", "접속횟수 초과"];

      // if (!accStatus.includes(accStatusText)) {
      //   commonScript.modal(
      //     "",
      //     '응시 데이터를 추가하려는 지원자 중에 "완료", "미용시", "미완료", "접속횟수 초과" 상태가 아닌 지원자가 있습니다. 해당 지원자를 제외한 나머지 지원자에 대해 적용됩니다.'
      //   );
      // }
      checkedData.screeningResumeSns.push(Number(checkedScreeningResumeSn));
    });

    fetch(`${origin}/chrome-extension/create/acc-examination-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkedData),
    });

    commonScript.modal(
      "응시자 데이터 추가 작업이 시작되었습니다",
      '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 멈추지 않습니다.',
      true,
      true
    );

    console.log(`%c [Jobflex Extension] 선택 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, "color: green;");

    // 위 전체 응시자 데이터 추가 주석과 같은 이유.
    // try {
    //   const response = await fetch(`${origin}/chrome-extension/create/acc-examination-data`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(checkedData),
    //   });

    //   if (!response.ok) {
    //     throw new Error(response.status);
    //   } else {
    //     commonScript.modal(
    //       "응시자 데이터 추가 작업이 시작되었습니다",
    //       '<strong>응시현황 상태가 "완료", "미용시", "미완료", "접속횟수 초과" 상태인 지원자만 적용됩니다.</strong> 응시자 데이터 추가 시 미응시->완료->분석가능 인원으로 전환되고 그리드에 정상적으로 나타나기까지 오랜 시간이 소요됩니다. 현재 페이지를 벗어나거나 브라우저를 종료해도 작업은 멈추지 않습니다.',
    //       true,
    //       true
    //     );
    //     console.log(`%c [Jobflex Extension] 선택 응시자 데이터 추가 성공! ${JSON.stringify(checkedData)}`, "color: green;");
    //   }
    // } catch (e) {
    //   commonScript.modal("응시자 데이터 생성 실패", "", true);
    // }

    if (sendResponse) sendResponse({ success: true });
  }
})();
