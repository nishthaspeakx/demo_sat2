// Generic kie.ai job runner. Key comes from env KIE_KEY (never hard-coded).
const KEY = process.env.KIE_KEY;
const BASE = "https://api.kie.ai";

export async function createTask(model, input) {
  const r = await fetch(`${BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, input }),
  });
  return { status: r.status, body: await r.text() };
}

export async function getTask(taskId) {
  const r = await fetch(`${BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  return { status: r.status, body: await r.text() };
}

// CLI: node scripts/kie.mjs create '<model>' '<inputJSON>'  |  node scripts/kie.mjs get '<taskId>'
const [cmd, a, b] = process.argv.slice(2);
if (cmd === "create") console.log((await createTask(a, JSON.parse(b))).body);
else if (cmd === "get") console.log((await getTask(a)).body);
