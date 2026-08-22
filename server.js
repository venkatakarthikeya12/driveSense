import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tryPorts = [8080, 8081, 3000, 5000, 8000, 8088, 9000, 8090];

// State Store for Live Telematics, OBD-II & AI Coaching
let connectionStatus = 'connected'; // 'disconnected' | 'scanning' | 'pairing' | 'connected'
let connectedDevice = { id: 'obd-001', name: 'ELM327 OBDII Pro Dongle', type: 'bluetooth', signal: 94, paired: true };
let isTripActive = true;
let startTime = Date.now();

let telemetry = {
  speed: 68,
  rpm: 2240,
  throttlePosition: 34,
  fuelLevel: 74.5,
  engineLoad: 42,
  coolantTemp: 89,
  batteryVoltage: 13.8,
  intakeAirTemp: 26,
  distanceTravelled: 14.2,
  fuelConsumption: 7.4,
  currentGear: '4th',
  dtcCodes: [],
  safetyScore: 92,
};

const obdDevices = [
  { id: 'obd-001', name: 'ELM327 OBDII Pro Dongle', type: 'bluetooth', signal: 94, paired: true },
  { id: 'elm-327', name: 'vLinker MC+ OBD2 Bluetooth', type: 'bluetooth', signal: 82, paired: false },
  { id: 'wifi-obd', name: 'Veepeak OBDCheck BLE+', type: 'wifi', signal: 88, paired: false },
  { id: 'carista', name: 'Carista EVO OBD Scanner', type: 'bluetooth', signal: 71, paired: false },
];

const coachingTips = [
  {
    id: 'tip-1',
    category: 'Eco Driving',
    title: 'Smooth Acceleration Pattern Detected',
    description: 'Maintaining gradual throttle changes between 20%-40% reduces fuel consumption by up to 14%.',
    impact: '+14% Fuel Efficiency',
    icon: 'fa-leaf',
    severity: 'success',
  },
  {
    id: 'tip-2',
    category: 'Safety',
    title: 'Optimal Following Distance',
    description: 'Current 3-second buffer at 68 km/h gives safe reaction margin under sudden braking.',
    impact: 'High Safety Margin',
    icon: 'fa-shield-halved',
    severity: 'info',
  },
  {
    id: 'tip-3',
    category: 'Vehicle Care',
    title: 'Coolant & Battery Operating Norms',
    description: 'Engine coolant temp is steady at 89°C and alternator output is healthy at 13.8V.',
    impact: 'Engine Health 100%',
    icon: 'fa-car-battery',
    severity: 'success',
  },
];

const tripsData = [
  {
    id: 'trip-101',
    date: 'Today, 08:30 AM',
    duration: '24 min',
    distance: '18.4 km',
    avgSpeed: '46 km/h',
    topSpeed: '82 km/h',
    fuelUsed: '1.4 L',
    safetyScore: 94,
    hardBrakingEvents: 0,
    rapidAccels: 1,
  },
  {
    id: 'trip-100',
    date: 'Yesterday, 05:45 PM',
    duration: '38 min',
    distance: '31.2 km',
    avgSpeed: '52 km/h',
    topSpeed: '95 km/h',
    fuelUsed: '2.5 L',
    safetyScore: 89,
    hardBrakingEvents: 1,
    rapidAccels: 2,
  },
];

// Telemetry Simulation Engine
setInterval(() => {
  if (isTripActive && connectionStatus === 'connected') {
    const elapsed = (Date.now() - startTime) / 1000;
    const speedVariation = Math.sin(elapsed / 5) * 12 + (Math.random() - 0.5) * 3;
    telemetry.speed = Math.max(30, Math.min(115, Math.round(62 + speedVariation)));
    telemetry.rpm = Math.min(5800, Math.max(1200, Math.round(telemetry.speed * 32 + (Math.random() - 0.5) * 120)));
    telemetry.throttlePosition = Math.min(95, Math.max(12, Math.round((telemetry.speed / 120) * 75 + 15)));
    telemetry.engineLoad = Math.min(92, Math.max(18, Math.round((telemetry.rpm / 6000) * 80 + 20)));
    telemetry.coolantTemp = Math.min(94, Math.max(86, 89 + Math.floor(Math.sin(elapsed / 20) * 3)));
    telemetry.batteryVoltage = parseFloat((13.7 + Math.sin(elapsed / 7) * 0.2).toFixed(1));
    telemetry.fuelLevel = Math.max(5, parseFloat((74.5 - elapsed * 0.002).toFixed(1)));
    telemetry.distanceTravelled = parseFloat((14.2 + elapsed * 0.015).toFixed(1));

    if (telemetry.speed === 0) telemetry.currentGear = 'P';
    else if (telemetry.speed < 20) telemetry.currentGear = '1st';
    else if (telemetry.speed < 40) telemetry.currentGear = '2nd';
    else if (telemetry.speed < 65) telemetry.currentGear = '3rd';
    else if (telemetry.speed < 90) telemetry.currentGear = '4th';
    else telemetry.currentGear = '5th';
  }
}, 1000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  // Enable CORS headers for cross-device mobile access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- API ROUTER ---
  if (parsedUrl.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (parsedUrl === '/api/status') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        status: 'online',
        serverTime: new Date().toISOString(),
        connectionStatus,
        connectedDevice,
        isTripActive,
        telemetryReady: true,
      }));
    }

    if (parsedUrl === '/api/telemetry') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        success: true,
        connectionStatus,
        connectedDevice,
        isTripActive,
        telemetry,
      }));
    }

    if (parsedUrl === '/api/obd2/devices') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        success: true,
        devices: obdDevices,
        currentDevice: connectedDevice,
        status: connectionStatus,
      }));
    }

    if (parsedUrl === '/api/obd2/connect' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          if (data.deviceId) {
            const dev = obdDevices.find(d => d.id === data.deviceId) || { id: data.deviceId, name: 'Connected OBD2 Device', type: 'bluetooth', signal: 90 };
            connectionStatus = 'connected';
            connectedDevice = { ...dev, paired: true };
          } else {
            connectionStatus = 'disconnected';
            connectedDevice = null;
          }
          res.writeHead(200);
          return res.end(JSON.stringify({ success: true, connectionStatus, connectedDevice }));
        } catch {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: 'Invalid payload' }));
        }
      });
      return;
    }

    if (parsedUrl === '/api/coaching') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        success: true,
        score: telemetry.safetyScore,
        tips: coachingTips,
      }));
    }

    if (parsedUrl === '/api/trips') {
      res.writeHead(200);
      return res.end(JSON.stringify({
        success: true,
        trips: tripsData,
      }));
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ error: `API endpoint ${parsedUrl} not found` }));
  }

  // --- STATIC FILES ROUTER ---
  let reqPath = parsedUrl;
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${reqPath}`);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    }
  });
});

function listen(portIndex = 0) {
  if (portIndex >= tryPorts.length) {
    console.error("Error: Could not bind to any available port.");
    process.exit(1);
  }

  const port = tryPorts[portIndex];

  const onError = (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      listen(portIndex + 1);
    } else {
      console.error(err);
    }
  };

  server.once('error', onError);

  server.listen(port, '0.0.0.0', () => {
    server.removeListener('error', onError);

    let localIp = '127.0.0.1';
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }

    console.log(`==================================================`);
    console.log(` DriveSense Telematics & Web App Server Active`);
    console.log(` PC Access: http://localhost:${port}/`);
    console.log(` Mobile Access (Wi-Fi): http://${localIp}:${port}/`);
    console.log(` API Endpoint: http://localhost:${port}/api/telemetry`);
    console.log(` Press Ctrl+C in this window to stop the server`);
    console.log(`==================================================`);
  });
}

listen();
