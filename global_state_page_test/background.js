// chrome.storage.sync.get(["key"]).then((result) => {
//     console.log("Value currently is " + result.key);
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//       .then(response => response.json())
//       .then(json => console.log(json))
//   });

const api = async () => {
  let currentTabURL = "";

  async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
  }

  currentTabURL = await getTab();
  currentTabURL = await currentTabURL.slice(0, currentTabURL.indexOf("/cus"));
  console.log("currentTabURL", currentTabURL);

  if (currentTabURL === "https://www.naver.com")
    chrome.storage.sync.get(["key"]).then(async (result) => {
      console.log("Current Naver ON/OFF" + result.key);
      if (result.key) {
        const response = await fetch(
          `${currentTabURL}/cus/member/extendPasswordExpirationDate`,
          {
            method: "POST",
          }
        );
        const data = await response.json();
        console.log(data);
      }
    });
};

// 탭 클릭 했을 때 동작
chrome.tabs.onActivated.addListener((activeInfo) => {
  api();
});

// 이미 페이지 도착했을 때 button을 클릭하면 storage가 바뀐다.
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("state가 바뀌었다.");
  api();
});
