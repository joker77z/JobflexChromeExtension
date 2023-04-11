window.addEventListener('DOMContentLoaded', async () => {
    // Selector
    const $alwaysEnableDontViewLoginHistory = document.querySelector('#alwaysEnableDontViewLoginHistory');
    const $alwaysEnableDontViewPopup = document.querySelector('#alwaysEnableDontViewPopup');

    const $alwaysEnableExtendPassword = document.querySelector('#alwaysEnableExtendPassword');
    const $enableExtendPasswordButton = document.querySelector('#enableExtendPasswordButton');

    // Render
    const alwaysEnableDontLoginHistoryResult = await chrome.storage.local.get(["enableAlwaysDontLoginHistory"]);
    $alwaysEnableDontViewLoginHistory.checked = alwaysEnableDontLoginHistoryResult.enableAlwaysDontLoginHistory;

    const alwaysEnableDontViewPopupResult = await chrome.storage.local.get(["enableAlwaysDontViewPopup"]);
    $alwaysEnableDontViewPopup.checked = alwaysEnableDontViewPopupResult.enableAlwaysDontViewPopup;

    const alwaysEnableExtendPasswordResult = await chrome.storage.local.get(["enableAlwaysExtendPassword"]);
    $alwaysEnableExtendPassword.checked = alwaysEnableExtendPasswordResult.enableAlwaysExtendPassword;

    // Event
    $alwaysEnableDontViewLoginHistory.addEventListener('change', (event) => {
        if(event.target.checked) {
            chrome.storage.local.set({'enableAlwaysDontLoginHistory': true});
            enable('enableAlwaysDontLoginHistory');
        } else {
            chrome.storage.local.set({'enableAlwaysDontLoginHistory': false});
        }
    })

    $alwaysEnableDontViewPopup.addEventListener('change', (event) => {
        if(event.target.checked) {
            chrome.storage.local.set({'enableAlwaysDontViewPopup': true});
            enable('enableAlwaysDontViewPopup');
        } else {
            chrome.storage.local.set({'enableAlwaysDontViewPopup': false});
        }
    })

    $alwaysEnableExtendPassword.addEventListener('change', (event) => {
        if(event.target.checked) {
            chrome.storage.local.set({'enableAlwaysExtendPassword': true});
            enable('enableAlwaysExtendPassword');
        } else {
            chrome.storage.local.set({'enableAlwaysExtendPassword': false});
        }
    })

    $enableExtendPasswordButton.addEventListener('click', () => {
        enable('enableExtendPassword');
    })

    async function enable(enableType) {
        const [tabs] = await chrome.tabs.query({active: true, currentWindow: true});
        const res = await chrome.tabs.sendMessage(tabs.id, { from: 'popup', action: enableType});
        if(res?.success) {
            window.close();
        }
    }
})