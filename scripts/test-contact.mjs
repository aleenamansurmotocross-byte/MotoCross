const payload = JSON.stringify({
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  message: "Hello"
});

fetch("http://localhost:3000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: payload
})
  .then(async (res) => {
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
    console.log("Body:", text);
  })
  .catch((err) => console.error("Fetch error:", err.message));
