// 전역 변수가 겹치지 않도록 모듈화
(() => {
    chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
        if(msg.from === 'popup') {
            switch(msg.action) {
                case 'enableAlwaysDontLoginHistory':
                    dontViewLoginHistory(sendResponse);
                case 'enableAlwaysDontViewPopup':
                    dontViewPopup();
                // 페이지 이미 도착 후 체크박스 on상태로 toggle하거나 Once 클릭 시
                case 'enableAlwaysExtendPassword':
                case 'enableExtendPassword':
                    extendPassword(sendResponse);
                    break;
            }
        }
    })

    chrome.storage.local.get(["enableAlwaysDontLoginHistory"]).then((result) => {
        if(result.enableAlwaysDontLoginHistory) {
            dontViewLoginHistory();
        }
    })

    chrome.storage.local.get(["enableAlwaysDontViewPopup"]).then((result) => {
        if(result.enableAlwaysDontViewPopup) {
            dontViewPopup();
        }
    })

    chrome.storage.local.get(["enableAlwaysExtendPassword"]).then((result) => {
        if(result.enableAlwaysExtendPassword) {
            extendPassword();
        }
    })

    function dontViewLoginHistory(sendResponse) {
        if(sendResponse) {
            const modalTitle = document.querySelector('.h1.face-lift-h1') || document.querySelector('.h1 ');
            if(modalTitle.textContent === '로그인 내역') {
                modalTitle.closest('#modalFrm').remove()
            }
            sendResponse({success: 'success'});
        }
        document.cookie = "WELCOME_PAGE=done"
    }

    function dontViewPopup() {
        let timer = setInterval(() => {
            if(document.querySelector('[data-popup]')) {
                removeDOM();
                clearInterval(timer);
            }
        }, 500);

        function removeDOM() {
            [...document.querySelectorAll('[data-popup]')].forEach(element => {
                element.remove();
            })
        }
    }

    // [ Extend Password ] API전송하고 만약 selectProduct페이지에서 Toggle ON 혹은 Once 버튼 클릭 시 reload까지.
    async function extendPassword(sendResponse) {
        const origin = window.location.origin;

        // 비밀번호 만료가 되었는지 먼저 체크. 만료 되었으면 연장api를 실행할 것.
        const expiredPasswordResponse = await fetch(`${origin}/cus/member/isExpiredPassword`, {
            method: "POST"
        })
        const isExpiredPassword = await expiredPasswordResponse.json();
        if(!isExpiredPassword) return;

        const extendPasswordExpirationDateResponse = await fetch(
            `${origin}/cus/member/extendPasswordExpirationDate`,
            {
                method: "POST",
            }
        );
        const isExtendPasswordSuccess = extendPasswordExpirationDateResponse.ok;

        // 페이지 진입 전 Always ON이면 local storage데이터를 읽어서 사전에 API를 쏘기 때문에 모달이 안뜬다. 즉, sendResponse가 필요없다.
        if(sendResponse) {
            sendResponse({success: 'success'});
            document.querySelector('[data-type="changePassword"]').remove();
        }
    }
})();