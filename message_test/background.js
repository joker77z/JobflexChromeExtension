const user = {
  username: 'demo-user'
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg === 'get-user-data') {
    console.log(user);
    sendResponse(user);
  }
})