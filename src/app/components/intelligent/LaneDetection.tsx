import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card, Chip, Alert } from '@mui/material';
import { Layers, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const laneOffsetHistory = [
  { t: '09:00', offset: 0.1 }, { t: '09:05', offset: -0.2 }, { t: '09:10', offset: 0.3 },
  { t: '09:15', offset: 0.8 }, { t: '09:20', offset: 0.1 }, { t: '09:25', offset: -0.5 },
  { t: '09:30', offset: 0.2 }, { t: '09:35', offset: 0.1 }, { t: '09:40', offset: -0.3 },
  { t: '09:45', offset: 0.4 }, { t: '09:50', offset: 0.0 }, { t: '09:55', offset: 0.1 },
];

function LaneView({ offset }: { offset: number }) {
  const carX = 50 + offset * 25;
  return (
    <Box sx={{ bgcolor: '#37474F', borderRadius: 3, p: 2, position: 'relative', height: 160, overflow: 'hidden' }}>
      {/* Road markings */}
      <Box sx={{ position: 'absolute', left: '20%', top: 0, bottom: 0, width: 2, bgcolor: '#FFAB40', opacity: 0.7 }} />
      <Box sx={{ position: 'absolute', right: '20%', top: 0, bottom: 0, width: 2, bgcolor: '#FFAB40', opacity: 0.7 }} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} sx={{ position: 'absolute', left: '48%', top: `${i * 30}%`, width: 4, height: '18%', bgcolor: '#FFEB3B', borderRadius: 1 }} />
      ))}
      {/* Car icon */}
      <Box sx={{ position: 'absolute', bottom: '20%', left: `${carX}%`, transform: 'translateX(-50%)', width: 28, height: 48, bgcolor: '#1565C0', borderRadius: 3, border: '2px solid #42A5F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        <Box sx={{ width: 20, height: 10, bgcolor: '#90CAF9', borderRadius: 1 }} />
        <Box sx={{ width: 18, height: 16, bgcolor: '#0D47A1', borderRadius: 1 }} />
        <Box sx={{ width: 22, height: 6, bgcolor: '#1565C0', borderRadius: 1 }} />
      </Box>
      <Typography sx={{ position: 'absolute', top: 8, right: 12, color: '#fff', fontSize: 11, fontWeight: 700, opacity: 0.85 }}>
        Offset: {offset > 0 ? '+' : ''}{offset.toFixed(2)}m
      </Typography>
    </Box>
  );
}

export default function LaneDetection() {
  const uid = useId().replace(/:/g, '');
  const [offset, setOffset] = useState(0.1);
  const [laneDepartures, setLaneDepartures] = useState(3);
  const [laneChangeScore, setLaneChangeScore] = useState(88);
  const isWarning = Math.abs(offset) > 0.6;

  useEffect(() => {
    const interval = setInterval(() => {
      const newOffset = (Math.random() - 0.5) * 1.5;
      setOffset(parseFloat(newOffset.toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      <Card sx={{ background: isWarning ? 'linear-gradient(135deg, #E65100 0%, #FF6D00 100%)' : 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Layers size={24} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Lane Detection</Typography>
            <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Computer Vision Active</Typography>
          </Box>
          <Chip label={isWarning ? 'WARNING' : 'IN LANE'} size="small"
            sx={{ ml: 'auto', bgcolor: isWarning ? 'rgba(255,255,255,0.25)' : 'rgba(105,240,174,0.25)', color: isWarning ? '#fff' : '#69F0AE', fontWeight: 700, fontSize: 10 }} />
        </Box>
        <LaneView offset={offset} />
      </Card>

      {isWarning && (
        <Alert severity="warning" icon={<AlertTriangle size={18} />} sx={{ mb: 2, borderRadius: 2, fontSize: 12 }}>
          Lane departure detected! Please return to your lane.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 2 }}>
        {[
          { label: 'Lane Score', value: `${laneChangeScore}%`, color: '#2E7D32' },
          { label: 'Departures', value: laneDepartures, color: '#E65100' },
          { label: 'Lane Changes', value: 7, color: '#1565C0' },
        ].map((s) => (
          <Card key={s.label} sx={{ borderRadius: 3, p: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</Typography>
            <Typography sx={{ fontSize: 10, color: '#78909C', mt: 0.25 }}>{s.label}</Typography>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Lane Offset History (meters)</Typography>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart id={`${uid}-line`} data={laneOffsetHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="t" tick={{ fontSize: 9 }} />
            <YAxis domain={[-1, 1]} tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="offset" stroke="#1565C0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2, bgcolor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <CheckCircle size={18} color="#2E7D32" />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#2E7D32' }}>Lane Keeping Summary</Typography>
            <Typography sx={{ fontSize: 12, color: '#388E3C', mt: 0.5 }}>You maintained proper lane discipline 94% of today's trip. Only 3 minor departures detected — all self-corrected within 2 seconds.</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
