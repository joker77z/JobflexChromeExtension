window.addEventListener("DOMContentLoaded", () => {
  let state = false;

  const $btn = document.querySelector("#btn");

  chrome.storage.sync.get(["key"]).then((result) => {
    $btn.innerHTML = result.key ? "ON" : "OFF";
  });

  $btn.addEventListener("click", () => {
    state = !state;

    chrome.storage.sync.set({ key: state }).then(() => {
      console.log("Value is set to " + state);
      $btn.innerHTML = state ? "ON" : "OFF";
    });
  });
});
