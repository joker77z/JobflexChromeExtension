(async () => {
  const origin = window.origin;
  const response = await fetch(`${origin}/cus/member/extendPasswordExpirationDate`, {
    method: "POST"
  });
  const data = await response.json();
  console.log(data);
})();