
async function testChat() {
  console.log("Testing iChancellor Chat on port 3001...");
  try {
    const res = await fetch("http://localhost:3001/api/ichancellor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "What is the soft-delete policy?",
        messages: []
      })
    });
    
    if (!res.ok) {
      console.error("Chat Failed:", res.status, await res.text());
      return;
    }

    const reader = res.body.getReader();
    console.log("Response stream started:");
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      process.stdout.write(new TextDecoder().decode(value));
    }
    console.log("\nDone.");
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testChat();
