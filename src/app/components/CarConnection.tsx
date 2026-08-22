import { useState, useEffect } from 'react';
import { Box, Typography, Card, Chip, Button, LinearProgress } from '@mui/material';
import { Bluetooth, Wifi, Zap, Car, Signal, RefreshCw, Shield, Cpu } from 'lucide-react';
import { useDriveSense } from '../../context/DriveSenseContext';
import { BluetoothDeviceOption } from '../../services/obd2Service';

export type ConnectionStatus = 'disconnected' | 'scanning' | 'pairing' | 'connected';

interface CarConnectionProps {
  onConnected: (device: BluetoothDeviceOption) => void;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (s: ConnectionStatus) => void;
  connectedDevice: BluetoothDeviceOption | null;
  setConnectedDevice: (d: BluetoothDeviceOption | null) => void;
}

const MOCK_DEVICES: BluetoothDeviceOption[] = [
  { id: 'obd-001', name: 'OBD2 Pro Dongle', type: 'obd2', signal: 92 },
  { id: 'elm-327', name: 'ELM327 Bluetooth', type: 'bluetooth', signal: 78 },
  { id: 'wifi-obd', name: 'WiFi OBD Scanner', type: 'wifi', signal: 85 },
  { id: 'carista', name: 'Carista OBD2', type: 'bluetooth', signal: 65 },
];

const VEHICLE_INFO = {
  make: 'Toyota', model: 'Camry 2023', vin: '4T1BF1FK5CU123456',
  engine: '2.5L 4-Cyl', protocol: 'ISO 15765-4 CAN', firmware: 'v2.4.1',
};

function SignalBars({ value }: { value: number }) {
  const bars = [25, 50, 75, 100];
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 16 }}>
      {bars.map((threshold, i) => (
        <Box key={i} sx={{
          width: 4, height: 4 + i * 3,
          borderRadius: '1px',
          bgcolor: value >= threshold ? '#4caf50' : 'rgba(255,255,255,0.2)',
        }} />
      ))}
    </Box>
  );
}

export default function CarConnection({
  onConnected,
  connectionStatus: _propStatus,
  connectedDevice: _propDevice,
  setConnectionStatus: _setConnectionStatus,
  setConnectedDevice: _setConnectedDevice,
}: CarConnectionProps) {
  const {
    connectionStatus,
    connectedDevice,
    telemetry,
    scanDevices,
    connectDevice,
    disconnectDevice,
  } = useDriveSense();

  const [devices, setDevices] = useState<BluetoothDeviceOption[]>([]);
  const [pairingDevice, setPairingDevice] = useState<BluetoothDeviceOption | null>(null);
  const [pairingProgress, setPairingProgress] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  const vehicleData = {
    rpm: telemetry.rpm,
    temp: telemetry.coolantTemp,
    battery: telemetry.batteryVoltage,
    fuelLevel: Math.round(telemetry.fuelLevel),
  };

  const startScan = async () => {
    setDevices([]);
    setScanProgress(0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 10, 90);
      setScanProgress(progress);
    }, 150);

    try {
      const found = await scanDevices();
      clearInterval(progressInterval);
      setScanProgress(100);
      // scanDevices already returns BluetoothDeviceOption[] — fallback to mock
      setDevices(found.length > 0 ? found : MOCK_DEVICES);
    } catch {
      clearInterval(progressInterval);
      setDevices(MOCK_DEVICES);
    }
  };

  const pairDevice = async (device: BluetoothDeviceOption) => {
    setPairingDevice(device);
    setPairingProgress(0);

    let progress = 0;
    const pairInterval = setInterval(() => {
      progress = Math.min(progress + 10, 90);
      setPairingProgress(progress);
    }, 150);

    await connectDevice(device);
    clearInterval(pairInterval);
    setPairingProgress(100);
    onConnected(device);
    setPairingDevice(null);
  };

  const disconnect = () => {
    disconnectDevice();
    setDevices([]);
    setPairingProgress(0);
  };

  return (
    <Box sx={{ p: 2, pb: 4, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', py: 3, mb: 2 }}>
        <Box sx={{
          width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 2,
          background: connectionStatus === 'connected'
            ? 'radial-gradient(circle, #4caf5033, #4caf5011)'
            : 'radial-gradient(circle, #2196f333, #2196f311)',
          border: `2px solid ${connectionStatus === 'connected' ? '#4caf50' : '#2196f3'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: connectionStatus === 'connected'
            ? '0 0 32px rgba(76,175,80,0.4)'
            : '0 0 24px rgba(33,150,243,0.3)',
        }}>
          <Car size={36} color={connectionStatus === 'connected' ? '#4caf50' : '#64b5f6'} />
        </Box>
        <Typography sx={{ color: '#fff', fontSize: 22, fontWeight: 800, mb: 0.5 }}>
          {connectionStatus === 'connected' ? 'Vehicle Connected' :
            connectionStatus === 'pairing' ? 'Pairing Device…' :
              connectionStatus === 'scanning' ? 'Scanning…' : 'Connect Your Car'}
        </Typography>
        <Typography sx={{ color: '#8b93a7', fontSize: 13 }}>
          {connectionStatus === 'connected'
            ? `${VEHICLE_INFO.make} ${VEHICLE_INFO.model} • ${VEHICLE_INFO.protocol}`
            : 'Connect via OBD-II dongle, Bluetooth, or Wi-Fi'}
        </Typography>
      </Box>

      {/* ── CONNECTED STATE ── */}
      {connectionStatus === 'connected' && connectedDevice && (
        <>
          {/* Status banner */}
          <Card sx={{ bgcolor: '#0d2a1a', border: '1px solid #2e7d3280', borderRadius: 3, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{
                width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
              }} />
              <Typography sx={{ color: '#4caf50', fontWeight: 700, fontSize: 14 }}>LIVE CONNECTION</Typography>
              <Chip label={connectedDevice.name} size="small"
                sx={{ ml: 'auto', bgcolor: '#4caf5022', color: '#4caf50', fontSize: 11 }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {[
                { label: 'Make / Model', value: `${VEHICLE_INFO.make} ${VEHICLE_INFO.model}` },
                { label: 'VIN', value: VEHICLE_INFO.vin.slice(-8) + '…' },
                { label: 'Engine', value: VEHICLE_INFO.engine },
                { label: 'Firmware', value: VEHICLE_INFO.firmware },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography sx={{ color: '#546e7a', fontSize: 10, mb: 0.25 }}>{item.label}</Typography>
                  <Typography sx={{ color: '#e0f2f1', fontSize: 12, fontWeight: 600 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Live ECU data */}
          <Typography sx={{ color: '#8b93a7', fontSize: 11, fontWeight: 700, letterSpacing: 2, mb: 1, px: 0.5 }}>
            LIVE ECU DATA
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
            {[
              { label: 'Engine RPM', value: vehicleData.rpm.toLocaleString(), unit: 'rpm', color: '#64b5f6', icon: <Cpu size={18} /> },
              { label: 'Coolant Temp', value: vehicleData.temp, unit: '°C', color: '#ef5350', icon: <Zap size={18} /> },
              { label: 'Battery', value: vehicleData.battery, unit: 'V', color: '#ffb74d', icon: <Zap size={18} /> },
              { label: 'Fuel Level', value: vehicleData.fuelLevel, unit: '%', color: '#66bb6a', icon: <Signal size={18} /> },
            ].map((m) => (
              <Card key={m.label} sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: m.color }}>
                  {m.icon}
                  <Typography sx={{ fontSize: 10, color: '#8b93a7' }}>{m.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 28, fontWeight: 800, color: m.color, lineHeight: 1 }}>
                  {m.value}
                  <Typography component="span" sx={{ fontSize: 13, color: '#546e7a', ml: 0.5 }}>{m.unit}</Typography>
                </Typography>
              </Card>
            ))}
          </Box>

          {/* Protocol info */}
          <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2, mb: 3 }}>
            <Typography sx={{ color: '#8b93a7', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, mb: 1.5 }}>
              CONNECTION DETAILS
            </Typography>
            {[
              ['Protocol', VEHICLE_INFO.protocol],
              ['Device', connectedDevice.name],
              ['Signal Strength', `${connectedDevice.signal}%`],
              ['Latency', '12 ms'],
              ['Data Rate', '38.4 kbps'],
              ['PIDs Active', '42 / 128'],
            ].map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid #1f2937' }}>
                <Typography sx={{ color: '#546e7a', fontSize: 12 }}>{k}</Typography>
                <Typography sx={{ color: '#e0e0e0', fontSize: 12, fontWeight: 600 }}>{v}</Typography>
              </Box>
            ))}
          </Card>

          <Button fullWidth variant="outlined"
            onClick={disconnect}
            sx={{
              borderColor: '#f4433644', color: '#f44336', borderRadius: 2, py: 1.5,
              '&:hover': { bgcolor: '#f4433611', borderColor: '#f44336' }
            }}>
            Disconnect Vehicle
          </Button>
        </>
      )}

      {/* ── PAIRING STATE ── */}
      {connectionStatus === 'pairing' && pairingDevice && (
        <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 3, mb: 2, textAlign: 'center' }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%', bgcolor: '#2196f322',
            border: '2px solid #2196f3',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
            animation: 'spin 2s linear infinite',
            '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
          }}>
            <RefreshCw size={28} color="#64b5f6" />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 16, mb: 0.5 }}>
            Pairing with {pairingDevice.name}
          </Typography>
          <Typography sx={{ color: '#8b93a7', fontSize: 13, mb: 3 }}>
            {pairingProgress < 25 ? 'Establishing Bluetooth link…' :
              pairingProgress < 55 ? 'Authenticating OBD-II protocol…' :
                pairingProgress < 80 ? 'Reading vehicle ECU…' : 'Syncing sensor channels…'}
          </Typography>
          <LinearProgress variant="determinate" value={pairingProgress}
            sx={{
              height: 8, borderRadius: 4, bgcolor: '#1f2937',
              '& .MuiLinearProgress-bar': { bgcolor: '#2196f3', borderRadius: 4 }, mb: 1.5
            }} />
          <Typography sx={{ color: '#64b5f6', fontSize: 13, fontWeight: 600 }}>{pairingProgress}%</Typography>
        </Card>
      )}

      {/* ── IDLE / SCANNING STATE ── */}
      {(connectionStatus === 'disconnected' || connectionStatus === 'scanning') && (
        <>
          {/* Connection type cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 2 }}>
            {[
              { icon: <Bluetooth size={22} />, label: 'Bluetooth', sublabel: 'BLE 5.0', color: '#2196f3' },
              { icon: <Wifi size={22} />, label: 'Wi-Fi', sublabel: '2.4 / 5 GHz', color: '#9c27b0' },
              { icon: <Zap size={22} />, label: 'OBD-II', sublabel: 'Port Direct', color: '#ff9800' },
            ].map((c) => (
              <Card key={c.label} sx={{
                bgcolor: '#111827', border: `1px solid ${c.color}33`, borderRadius: 3,
                p: 1.5, textAlign: 'center', cursor: 'pointer',
                '&:hover': { bgcolor: `${c.color}11` },
              }}>
                <Box sx={{ color: c.color, mb: 0.5 }}>{c.icon}</Box>
                <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{c.label}</Typography>
                <Typography sx={{ color: '#546e7a', fontSize: 9 }}>{c.sublabel}</Typography>
              </Card>
            ))}
          </Box>

          {/* Scan button / progress */}
          {connectionStatus === 'scanning' ? (
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2.5, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '50%', bgcolor: '#2196f322',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse 1s ease-in-out infinite',
                  '@keyframes pulse': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } },
                }}>
                  <Signal size={18} color="#64b5f6" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Scanning for devices…</Typography>
                  <LinearProgress variant="determinate" value={scanProgress}
                    sx={{
                      mt: 0.75, height: 4, borderRadius: 2, bgcolor: '#1f2937',
                      '& .MuiLinearProgress-bar': { bgcolor: '#2196f3', borderRadius: 2 }
                    }} />
                </Box>
              </Box>
            </Card>
          ) : (
            <Button fullWidth variant="contained" onClick={startScan}
              sx={{
                mb: 2, py: 1.75, borderRadius: 3, fontWeight: 700, fontSize: 15,
                background: 'linear-gradient(135deg, #1565C0, #2196f3)',
                boxShadow: '0 8px 24px rgba(33,150,243,0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #0d47a1, #1565C0)' }
              }}>
              Scan for Devices
            </Button>
          )}

          {/* Discovered devices */}
          {devices.length > 0 && (
            <>
              <Typography sx={{ color: '#8b93a7', fontSize: 11, fontWeight: 700, letterSpacing: 2, mb: 1, px: 0.5 }}>
                FOUND DEVICES ({devices.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {devices.map((device) => (
                  <Card key={device.id} sx={{
                    bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2,
                    display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                    '&:hover': { border: '1px solid #2196f355', bgcolor: '#0d1830' },
                    transition: 'all 0.2s',
                  }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2, bgcolor: '#1f2937',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: device.type === 'bluetooth' ? '#2196f3' : device.type === 'wifi' ? '#9c27b0' : '#ff9800',
                    }}>
                      {device.type === 'bluetooth' ? <Bluetooth size={22} /> : device.type === 'wifi' ? <Wifi size={22} /> : <Zap size={22} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{device.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                        <SignalBars value={device.signal} />
                        <Typography sx={{ color: '#546e7a', fontSize: 11 }}>{device.signal}% signal</Typography>
                      </Box>
                    </Box>
                    <Button size="small" variant="contained"
                      onClick={() => pairDevice(device)}
                      sx={{
                        bgcolor: '#1565C0', borderRadius: 2, fontSize: 12, fontWeight: 700, px: 2,
                        '&:hover': { bgcolor: '#0d47a1' }
                      }}>
                      Pair
                    </Button>
                  </Card>
                ))}
              </Box>
            </>
          )}

          {/* Connection help */}
          <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Shield size={18} color="#546e7a" style={{ flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography sx={{ color: '#e0e0e0', fontSize: 13, fontWeight: 600, mb: 0.5 }}>How to connect</Typography>
                {[
                  'Plug OBD-II dongle into the port under your dashboard (usually near the steering column).',
                  'Enable Bluetooth or Wi-Fi on this device.',
                  'Tap "Scan for Devices" and select your OBD-II adapter.',
                  'Wait for the ECU handshake to complete (~10 seconds).',
                ].map((step, i) => (
                  <Typography key={i} sx={{ color: '#546e7a', fontSize: 12, mb: 0.5 }}>
                    {i + 1}. {step}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Card>
        </>
      )}
    </Box>
  );
}
