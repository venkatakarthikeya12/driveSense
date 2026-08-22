import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card, Chip, Alert } from '@mui/material';
import { Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const historyData = [
  { time: '08:00', applied: 1, speed: 0 }, { time: '08:15', applied: 0, speed: 45 },
  { time: '08:30', applied: 0, speed: 62 }, { time: '08:45', applied: 1, speed: 0 },
  { time: '09:00', applied: 0, speed: 38 }, { time: '09:15', applied: 0, speed: 70 },
  { time: '09:30', applied: 1, speed: 0 }, { time: '09:45', applied: 0, speed: 55 },
  { time: '10:00', applied: 1, speed: 0 }, { time: '10:15', applied: 0, speed: 42 },
];

const stats = [
  { label: 'Times Applied', value: 8, unit: '' },
  { label: 'Avg Hold Time', value: 4.2, unit: 'min' },
  { label: 'Safety Score', value: 96, unit: '%' },
  { label: 'Incidents', value: 1, unit: '' },
];

export default function HandbrakeStatus() {
  const uid = useId().replace(/:/g, '');
  const [isApplied, setIsApplied] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [engineOn, setEngineOn] = useState(true);
  const [forgotAlert, setForgotAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = Math.floor(Math.random() * 80);
      setSpeed(s);
      const applied = s === 0 && Math.random() > 0.4;
      setIsApplied(applied);
      setForgotAlert(!applied && s > 5 && Math.random() > 0.85);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      {/* Main Status */}
      <Card sx={{
        background: isApplied ? 'linear-gradient(135deg, #C62828 0%, #E53935 100%)' : 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
        borderRadius: 4, p: 3, mb: 2, color: '#fff', textAlign: 'center',
      }}>
        <Typography sx={{ fontSize: 12, opacity: 0.85, letterSpacing: 2, mb: 1.5 }}>HANDBRAKE STATUS</Typography>
        <Box sx={{ width: 110, height: 110, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <Pause size={40} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, mt: 0.5 }}>{isApplied ? 'ON' : 'OFF'}</Typography>
        </Box>
        <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 0.5 }}>
          {isApplied ? 'Handbrake Engaged' : 'Handbrake Released'}
        </Typography>
        <Typography sx={{ fontSize: 12, opacity: 0.85 }}>
          {speed === 0 ? 'Vehicle Stationary' : `Current Speed: ${speed} km/h`}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[{ v: engineOn ? 'ON' : 'OFF', l: 'Engine' }, { v: `${speed}`, l: 'km/h' }, { v: isApplied ? '✓' : '—', l: 'Brake' }].map((s) => (
            <Box key={s.l} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{s.v}</Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>{s.l}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {forgotAlert && (
        <Alert severity="error" icon={<AlertTriangle size={16} />} sx={{ mb: 2, borderRadius: 2, fontSize: 12 }}>
          Handbrake may have been left engaged while driving! Check immediately.
        </Alert>
      )}

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
        {stats.map((s) => (
          <Card key={s.label} sx={{ borderRadius: 3, p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pause size={18} color="#1565C0" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1565C0' }}>{s.value}{s.unit}</Typography>
              <Typography sx={{ fontSize: 10, color: '#78909C' }}>{s.label}</Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Handbrake Activity Timeline</Typography>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart id={`${uid}-line`} data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }} />
            <Line key="applied" type="stepAfter" dataKey="applied" stroke="#C62828" strokeWidth={2} dot={false} name="Handbrake" />
            <Line key="speed" type="monotone" dataKey="speed" stroke="#1565C0" strokeWidth={1.5} dot={false} name="Speed" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2, bgcolor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <CheckCircle size={18} color="#2E7D32" />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>Safe Handbrake Habit</Typography>
            <Typography sx={{ fontSize: 12, color: '#388E3C' }}>You correctly engaged the handbrake in 96% of parking situations. No driving-with-brake incidents this week.</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
