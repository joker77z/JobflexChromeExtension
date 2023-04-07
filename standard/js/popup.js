window.addEventListener('DOMContentLoaded', async () => {
    const $alwaysEnableCheckbox = document.querySelector('#alwaysEnableCheckbox');
    const $enableButton = document.querySelector('#enableButton');

    // Render : checkbox status
    const result = await chrome.storage.local.get(["enableAlways"]);
    $alwaysEnableCheckbox.checked = result.enableAlways;

    // Event : checkbox
    $alwaysEnableCheckbox.addEventListener('change', (event) => {
        if(event.target.checked) {
            chrome.storage.local.set({'enableAlways': true});
            enable();
        } else {
            chrome.storage.local.set({'enableAlways': false});
        }
    })

    // Event : button
    $enableButton.addEventListener('click', () => {
        enable();
    })

    // Send Message
    async function enable() {
        const [tabs] = await chrome.tabs.query({active: true, currentWindow: true});
        const res = await chrome.tabs.sendMessage(tabs.id, { from: 'popup', action: 'enable'});
        if(res?.success) {
            window.close();
        }
    }
})