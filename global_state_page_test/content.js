let timer;
timer = setInterval(checkStorage, 1000);

async function checkStorage() {
  chrome.storage.sync.get(["key"]).then(async (result) => {
    console.log("Current Naver ON/OFF" + result.key);
    if (result.key) {
      const origin = window.origin;
      const response = await fetch(
        `${origin}/cus/member/extendPasswordExpirationDate`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log(data);
      await clearInterval(timer);
    }
  });
}

setTimeout(function () {
  clearInterval(timer);
}, 5000);
