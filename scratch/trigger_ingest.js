
async function triggerIngest() {
  console.log("Triggering iChancellor Ingestion (v7)...");
  try {
    const res = await fetch("http://localhost:3000/api/ichancellor/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "seed" })
    });
    
    if (!res.ok) {
      console.error("Ingestion Failed:", res.status, await res.text());
      return;
    }

    const data = await res.json();
    console.log("Ingestion Success:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

triggerIngest();
