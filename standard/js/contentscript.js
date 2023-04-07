// 전역 변수가 겹치지 않도록 모듈화
(() => {
    // 페이지 이미 도착 후 체크박스 on상태로 바꾸거나 current page enable 버튼 클릭 시
    chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
        if(msg.from === 'popup') {
            switch(msg.action) {
                case 'enable':
                case 'enableAlways':
                    enable(sendResponse);
            }
        }
    })

    // 이미 체크박스 on상태면 enable 함수 실행
    chrome.storage.local.get(["enableAlways"]).then((result) => {
        if(result.enableAlways) {
            enable();
        }
    })

    async function enable(sendResponse) {
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
        console.log(`extendPasswordExpirationDateResponse success?: ${isExtendPasswordSuccess}`)
        if(sendResponse) {
            sendResponse({success: 'success'});
            location.reload();
        }
    }
})();