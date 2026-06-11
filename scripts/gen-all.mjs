// Generate TTS + lip-sync video for every Sia line.
// Usage: KIE_KEY=... node scripts/gen-all.mjs
import { createTask, getTask } from "./kie.mjs";
import { writeFile } from "node:fs/promises";

const IMG = "https://raw.githubusercontent.com/nishthaspeakx/demo_sat2/dev/public/assets/sia-stage.png";
const VOICE = "Rachel"; // ElevenLabs female voice for Sia

// keys must match the message text in the app (see lipsyncMap)
const LINES = [
  ["intro1", "Welcome to Taj Mahal! Aapko yahan guide karna hoga. Let’s learn guide se English mein kese baat karte hai."],
  ["intro2", "Sabse pehle let’s greet the guide. Say “Hello!”"],
  ["after_hello", "Great! fir aap guide se bolo “I am looking for guide.”"],
  ["wrong_guide", "Aapko bolna hai “I am looking for guide.” sahi uttar chuno"],
  ["after_mcq", "Great! Now ask “What will be the cost?”"],
  ["after_anagram", "Awesome! now aapko guide ko kehna hai “Ok, I will hire you.” Repeat after me."],
  ["final", "Great ab aap ready hai guide hire karne ke liye. Let’s meet the guide and talk to him."],
  ["try_hello", "Almost! Bas “Hello” boliye."],
  ["wrong_cost", "Aapko bolna hai “What will be the cost?” — let’s arrange it."],
  ["result", "Great! You spoke with guide well. Taj Mahal ghumke I think you will be hungry. So let’s go to cafe after that."],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const data = (res) => JSON.parse(res.body).data;

async function poll(taskId, label, maxMin = 12) {
  const deadline = Date.now() + maxMin * 60000;
  while (Date.now() < deadline) {
    const d = data(await getTask(taskId));
    if (d.state === "success") return JSON.parse(d.resultJson).resultUrls[0];
    if (d.state === "fail") throw new Error(`${label} failed: ${d.failMsg}`);
    await sleep(12000);
  }
  throw new Error(`${label} timed out`);
}

async function run() {
  // 1) TTS for all lines (parallel submit)
  console.log("== TTS ==");
  const tts = [];
  for (const [key, text] of LINES) {
    const d = data(await createTask("elevenlabs/text-to-speech-turbo-2-5", { text, voice: VOICE }));
    console.log(`tts ${key} -> ${d.taskId}`);
    tts.push({ key, taskId: d.taskId });
  }
  const audio = {};
  for (const t of tts) {
    audio[t.key] = await poll(t.taskId, `tts:${t.key}`, 5);
    console.log(`audio ${t.key}: ${audio[t.key]}`);
  }

  // 2) Lip-sync video for all lines (parallel submit)
  console.log("== LIPSYNC ==");
  const vids = [];
  for (const [key] of LINES) {
    const d = data(await createTask("infinitalk/from-audio", {
      image_url: IMG,
      audio_url: audio[key],
      prompt: "A young woman speaking warmly, standing in a Taj Mahal archway",
      resolution: "480p",
    }));
    console.log(`vid ${key} -> ${d.taskId}`);
    vids.push({ key, taskId: d.taskId });
  }

  // 3) Poll + download
  console.log("== DOWNLOAD ==");
  for (const v of vids) {
    try {
      const url = await poll(v.taskId, `vid:${v.key}`, 15);
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      await writeFile(`public/assets/lipsync/${v.key}.mp4`, buf);
      console.log(`saved ${v.key}.mp4 (${buf.length} bytes)`);
    } catch (e) {
      console.log(`ERROR ${v.key}: ${e.message}`);
    }
  }
  console.log("DONE");
}
run();
