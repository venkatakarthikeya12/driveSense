import http from 'http';
import https from 'https';

// --- CONFIGURATION ---
const CONCURRENT_USERS = 100; // 100 virtual users
const DURATION_SECONDS = 60;  // 1 minute run time
const TARGET_PORTS = [8080, 8081, 3000, 5000, 8000, 8088, 9000, 8090];

let activePort = 8080;
let targetPath = '/api/telemetry';

// --- METRICS COLLECTION ---
let totalRequests = 0;
let successRequests = 0;
let failedRequests = 0;
let latencies = [];
let windowRequests = 0;
let currentRps = 0;
let isRunning = true;

// Helper to determine active server port
async function findActivePort() {
  for (const port of TARGET_PORTS) {
    const active = await new Promise((resolve) => {
      const req = http.get(`http://localhost:${port}/api/status`, { timeout: 1000 }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    });
    if (active) return port;
  }
  return 8080; // default fallback
}

function sendRequest(port) {
  if (!isRunning) return;

  const start = Date.now();
  totalRequests++;
  windowRequests++;

  const req = http.get(`http://localhost:${port}${targetPath}`, { timeout: 5000 }, (res) => {
    const latency = Date.now() - start;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      successRequests++;
    } else {
      failedRequests++;
    }
    latencies.push(latency);
    
    // Immediately spawn next request for continuous loop per virtual user
    if (isRunning) {
      setImmediate(() => sendRequest(port));
    }
  });

  req.on('error', () => {
    const latency = Date.now() - start;
    failedRequests++;
    latencies.push(latency);
    if (isRunning) {
      setTimeout(() => sendRequest(port), 50); // slight delay on error retry
    }
  });

  req.on('timeout', () => {
    req.destroy();
  });
}

async function startLoadTest() {
  activePort = await findActivePort();
  console.clear();
  console.log(`================================================================`);
  console.log(` 🚀 DRIVESENSE BASELINE / LOAD TESTING SUITE`);
  console.log(`================================================================`);
  console.log(` Target Endpoint : http://localhost:${activePort}${targetPath}`);
  console.log(` Virtual Users   : ${CONCURRENT_USERS} VUs (Concurrent)`);
  console.log(` Duration        : ${DURATION_SECONDS} Seconds (1 Minute)`);
  console.log(`================================================================\n`);
  console.log(`Starting load test now...\n`);

  const startTime = Date.now();

  // Start 100 Virtual User worker loops
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    // Stagger slightly over 500ms to mimic realistic user ramp up
    setTimeout(() => sendRequest(activePort), Math.random() * 500);
  }

  // Live Stats Ticker (Every 1 second)
  const ticker = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, DURATION_SECONDS - elapsedSec);

    currentRps = windowRequests;
    windowRequests = 0; // reset for next second

    const recentLatencies = latencies.slice(-500);
    const avgMs = recentLatencies.length ? Math.round(recentLatencies.reduce((a, b) => a + b, 0) / recentLatencies.length) : 0;
    const minMs = recentLatencies.length ? Math.min(...recentLatencies) : 0;
    const maxMs = recentLatencies.length ? Math.max(...recentLatencies) : 0;

    process.stdout.write(
      `\r⏱️  Time: ${elapsedSec}s/${DURATION_SECONDS}s | ` +
      `⚡ RPS: ${currentRps} req/sec | ` +
      `📊 Total: ${totalRequests.toLocaleString()} | ` +
      `⏱️ Latency: Avg ${avgMs}ms (Min ${minMs}ms / Max ${maxMs}ms) | ` +
      `✅ Success: ${((successRequests / (totalRequests || 1)) * 100).toFixed(1)}%`
    );

    if (elapsedSec >= DURATION_SECONDS) {
      clearInterval(ticker);
      isRunning = false;
      finishTest(startTime);
    }
  }, 1000);
}

function finishTest(startTime) {
  const totalDurationSec = (Date.now() - startTime) / 1000;
  const avgRps = Math.round(totalRequests / totalDurationSec);
  
  latencies.sort((a, b) => a - b);
  const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
  const minMs = latencies.length ? latencies[0] : 0;
  const maxMs = latencies.length ? latencies[latencies.length - 1] : 0;
  const p95Ms = latencies.length ? latencies[Math.floor(latencies.length * 0.95)] : 0;
  const p99Ms = latencies.length ? latencies[Math.floor(latencies.length * 0.99)] : 0;
  const successRate = ((successRequests / (totalRequests || 1)) * 100).toFixed(2);

  console.log(`\n\n================================================================`);
  console.log(` 🎉 BASELINE LOAD TEST COMPLETE - 1 MINUTE RESULTS`);
  console.log(`================================================================`);
  console.log(` 📁 Total Duration       : ${totalDurationSec.toFixed(1)}s`);
  console.log(` 👥 Virtual Users        : ${CONCURRENT_USERS} VUs`);
  console.log(` 🚀 Total Requests Sent  : ${totalRequests.toLocaleString()} requests`);
  console.log(` ⚡ Requests Per Sec (RPS): ${avgRps} req/sec`);
  console.log(` --------------------------------------------------------------`);
  console.log(` ⏱️  Response Times (Latency):`);
  console.log(`     • Average Response : ${avgMs} ms`);
  console.log(`     • Minimum (Fastest): ${minMs} ms`);
  console.log(`     • Maximum (Slowest): ${maxMs} ms`);
  console.log(`     • 95th Percentile  : ${p95Ms} ms`);
  console.log(`     • 99th Percentile  : ${p99Ms} ms`);
  console.log(` --------------------------------------------------------------`);
  console.log(` ✅ Success Rate         : ${successRate}% (${successRequests} OK / ${failedRequests} Failed)`);
  console.log(` 🏆 Performance Status   : ${avgMs < 300 ? 'EXCELLENT (Fast Response < 300ms)' : 'STABLE'}`);
  console.log(`================================================================\n`);
  process.exit(0);
}

startLoadTest();
