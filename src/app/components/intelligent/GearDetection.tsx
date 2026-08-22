import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card, Chip } from '@mui/material';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const gears = ['P', 'R', 'N', '1', '2', '3', '4', '5', '6', 'D'];

const gearHistory = [
  { time: '09:00', gear: 1 }, { time: '09:05', gear: 2 }, { time: '09:10', gear: 3 },
  { time: '09:15', gear: 4 }, { time: '09:20', gear: 5 }, { time: '09:25', gear: 6 },
  { time: '09:30', gear: 5 }, { time: '09:35', gear: 4 }, { time: '09:40', gear: 3 },
  { time: '09:45', gear: 4 }, { time: '09:50', gear: 5 }, { time: '09:55', gear: 6 },
];

const gearUsage = [
  { name: '1st', usage: 8, fill: '#E3F2FD' },
  { name: '2nd', usage: 18, fill: '#BBDEFB' },
  { name: '3rd', usage: 25, fill: '#90CAF9' },
  { name: '4th', usage: 30, fill: '#64B5F6' },
  { name: '5th', usage: 45, fill: '#42A5F5' },
  { name: '6th', usage: 60, fill: '#1565C0' },
];

export default function GearDetection() {
  const uid = useId().replace(/:/g, '');
  const [currentGear, setCurrentGear] = useState('4');
  const [rpm, setRpm] = useState(2400);
  const [speed, setSpeed] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
      const g = ['3', '4', '5', '6'][Math.floor(Math.random() * 4)];
      setCurrentGear(g);
      setRpm(1800 + Math.floor(Math.random() * 2000));
      setSpeed(60 + Math.floor(Math.random() * 40));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isOptimal = parseInt(currentGear) >= 4;

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      {/* Current Gear Display */}
      <Card sx={{ background: 'linear-gradient(135deg, #1565C0 0%, #0288D1 100%)', borderRadius: 4, p: 3, mb: 2, color: '#fff', textAlign: 'center' }}>
        <Typography sx={{ fontSize: 12, opacity: 0.85, letterSpacing: 2, mb: 1 }}>CURRENT GEAR</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{currentGear}</Typography>
          </Box>
        </Box>
        <Chip label={isOptimal ? 'Optimal Gear' : 'Shift Up Recommended'} size="small"
          sx={{ mt: 2, bgcolor: isOptimal ? 'rgba(105,240,174,0.25)' : 'rgba(255,171,0,0.25)', color: isOptimal ? '#69F0AE' : '#FFAB00', fontWeight: 700, fontSize: 11 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{rpm.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.8 }}>RPM</Typography>
          </Box>
          <Box sx={{ width: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{speed}</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.8 }}>km/h</Typography>
          </Box>
        </Box>
      </Card>

      {/* Gear Selector Visual */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Gear Selector</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {gears.map((g) => (
            <Box key={g} sx={{
              width: 38, height: 38, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: currentGear === g ? '#1565C0' : '#F5F7FA', border: currentGear === g ? 'none' : '1.5px solid #E0E0E0',
              cursor: 'default', transition: 'all 0.3s',
            }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14, color: currentGear === g ? '#fff' : '#78909C' }}>{g}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Gear Usage Chart */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Gear Usage Distribution</Typography>
        <ResponsiveContainer width="100%" height={160}>
          <RadialBarChart id={`${uid}-radial`} cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={gearUsage}>
            <RadialBar dataKey="usage" cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {gearUsage.map((g) => (
            <Box key={g.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: g.fill }} />
              <Typography sx={{ fontSize: 10, color: '#546E7A' }}>{g.name}: {g.usage}%</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Gear Shift History */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Gear Shift Timeline</Typography>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart id={`${uid}-line`} data={gearHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} domain={[0, 7]} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="stepAfter" dataKey="gear" stroke="#1565C0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#E8F5E9', borderRadius: 2 }}>
          <Typography sx={{ fontSize: 12, color: '#2E7D32', fontWeight: 600 }}>
            AI Tip: You shifted gears 24 times this trip. Optimal shifting detected 87% of the time.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
