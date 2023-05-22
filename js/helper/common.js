/**
 * domainList를 순회하면서 뒤에 특정 url을 붙이고 현재 페이지가 url에 맞는지 확인한다.
 * 정규식을 사용해서 st- 가 붙은 도메인들에서 실행되게 할 수 있지만, extension이 PR환경에서 동작할 염려가 있기 때문에 정확한 주소를 사용한다.
 */
function matchUrlToRun(path) {
  const domainList = [
    'http://demo01-cms-recruiter-co-kr.kr-dv-midasitwebsol.com:3000',
    'http://demo01-cms-recruiter-co-kr.kr-dv-midasitwebsol.com:8080',
    'https://demo01-cms-recruiter-co-kr.kr-dv-midasitwebsol.com',
    'https://st-jobflexqaqc-cms-recruiter-co-kr.midasweb.net',
    'https://st-smw1020-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobflex-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobflexqa04-cms-recruiter-co-kr.midasweb.net',
    'https://st-sec01-cms-recruiter-co-kr.midasweb.net',
    'https://st-sec001-cms-recruiter-co-kr.midasweb.net',
    'https://st-sec02-cms-recruiter-co-kr.midasweb.net',
    'https://st-kjm07-cms-recruiter-co-kr.midasweb.net',
    'https://st-sec04-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda02-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda03-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda04-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda05-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda06-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda07-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda08-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda09-cms-recruiter-co-kr.midasweb.net',
    'https://st-jobda10-cms-recruiter-co-kr.midasweb.net',
    'https://st-jf2-cms-recruiter-co-kr.midasweb.net',
    'https://st-smw10203-cms-recruiter-co-kr.midasweb.net',
    'https://st-simson-cms-recruiter-co-kr.midasweb.net',
    'https://st-jax20-cms-recruiter-co-kr.midasweb.net',
    'https://st-jax20isd-cms-recruiter-co-kr.midasweb.net',
    'https://st-11325re-cms-recruiter-co-kr.midasweb.net',
    'https://st-jax10-cms-recruiter-co-kr.midasweb.net',
    'https://st-jax20itv-cms-recruiter-co-kr.midasweb.net',
    'https://st-sec03-cms-recruiter-co-kr.midasweb.net',
    'https://st-inair01-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jf-smw1020-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobflex01-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobflex02-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobisd-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobitv-cms-recruiter-co-kr.midasweb.net',
    'https://st2-interview01-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobflex-cms-recruiter-co-kr.midasweb.net',
    'https://test02-cms-recruiter-co-kr.midasweb.net',
    'https://acc01-all-cms-recruiter-co-kr.midasweb.net',
    'https://acc02-integ-cms-recruiter-co-kr.midasweb.net',
    'https://acc03-sr-game-cms-recruiter-co-kr.midasweb.net',
    'https://acc04-sr-cms-recruiter-co-kr.midasweb.net',
    'https://acc05-v2-cms-recruiter-co-kr.midasweb.net',
    'https://acc06-custom-cms-recruiter-co-kr.midasweb.net',
    'https://pdm-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobflex2-02-cms-recruiter-co-kr.midasweb.net',
    'https://st2-deletetest-cms-recruiter-co-kr.midasweb.net',
    'https://qa-jobflex03-cms-recruiter-co-kr.midasweb.net',
    'https://qa-jobflex04-cms-recruiter-co-kr.midasweb.net',
    'https://qa-jobda02-cms-recruiter-co-kr.midasweb.net',
    'https://st2-inair01-cms-recruiter-co-kr.midasweb.net',
    'https://st2-inair02-cms-recruiter-co-kr.midasweb.net',
    'https://st2-inair-cms-recruiter-co-kr.midasweb.net',
    'https://st2-inairisd-cms-recruiter-co-kr.midasweb.net',
    'https://st2-inairitv-cms-recruiter-co-kr.midasweb.net',
    'https://qa-inair04-cms-recruiter-co-kr.midasweb.net',
    'https://qa-inair03-cms-recruiter-co-kr.midasweb.net',
    'https://testsvc-mit213-cms-recruiter-co-kr.midasweb.net',
    'https://st-lsh0503-cms-recruiter-co-kr.midasweb.net',
    'https://st2-jobflex01-acca-cms-recruiter-co-kr.midasweb.net',
  ];

  const includePathDomain = domainList.map((domain) => domain + path);
  let currentUrl = window.location.href;

  // 맨 뒤에 #이 붙는 경우가 있음.
  if (currentUrl.slice(-1) === '#') {
    currentUrl = currentUrl.slice(0, currentUrl.indexOf('#'));
  }

  if (includePathDomain.includes(currentUrl)) {
    return true;
  } else {
    return false;
  }
}

function modal(title, description, useConfirmButton, useAlwaysConfirmButton) {
  if (localStorage.getItem('dontViewAddAccDataModal') !== 'true') {
    // DIM
    const dim = document.createElement('div');
    dim.classList = 'modal-bg';
    dim.setAttribute('style', 'display: block;');
    document.body.insertAdjacentElement('beforeend', dim);

    // MODAL
    const modalWrapper = document.createElement('div');
    modalWrapper.classList = 'modal-wrapper';
    modalWrapper.innerHTML = `
      ${title ? `<span class="title">${title}</span>` : ''}
      ${description ? `<p class="description">${description}</p>` : ''}
      <div class="button-wrapper">
        <button id="confirmButton" class="confirm-button">확인</button>
        ${
          useAlwaysConfirmButton
            ? `<button id="alwaysConfirmButton" class="always-confirm-button">
              다시는 보지 않기
            </button>`
            : ''
        }
      </div>
    `;

    dim.insertAdjacentElement('beforeend', modalWrapper);

    document.querySelector('#confirmButton')?.addEventListener('click', () => {
      dim.remove();
    });

    document.querySelector('#alwaysConfirmButton')?.addEventListener('click', () => {
      dim.remove();
      localStorage.setItem('dontViewAddAccDataModal', true);
    });
  }
}

export { matchUrlToRun, modal };
