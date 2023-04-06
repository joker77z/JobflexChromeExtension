let timer;
timer = setInterval(checkStorage, 1000);

async function checkStorage() {
  chrome.storage.sync.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
    if (result.key) {
      fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(() => clearInterval(timer));
    }
  });
}

setTimeout(function () {
  clearInterval(timer);
}, 5000);
