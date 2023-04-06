
document.addEventListener('DOMContentLoaded', () => {
  console.log('completed dom')
  const $btn = document.querySelector('#btn');

  function initializeUI(res) {
    const $body = document.querySelector('body');
    $body.innerHTML = res;
  }

  chrome.runtime.sendMessage('get-user-data', (res) => {
    console.log('received data', res);
    initializeUI(res);
  })
})