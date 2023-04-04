(async () => {
  const origin = window.origin;
  // const response = await fetch(`${origin}/cus/member/extendPasswordExpirationDate`, {
  //   method: "POST"
  // });
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`, {
    method: "GET"
  });
  const data = await response.json();
  console.log(data);
})();