import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card } from '@mui/material';
import { Compass, ArrowUp, ArrowRight, ArrowLeft, ArrowDown } from 'lucide-react';
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const headingHistory = [
  { t: '09:00', heading: 45 }, { t: '09:05', heading: 90 }, { t: '09:10', heading: 135 },
  { t: '09:15', heading: 180 }, { t: '09:20', heading: 200 }, { t: '09:25', heading: 220 },
  { t: '09:30', heading: 270 }, { t: '09:35', heading: 310 }, { t: '09:40', heading: 340 },
  { t: '09:45', heading: 10 }, { t: '09:50', heading: 45 }, { t: '09:55', heading: 90 },
];

const turnData = [
  { type: 'Left Turns', count: 14, color: '#1565C0' },
  { type: 'Right Turns', count: 18, color: '#0288D1' },
  { type: 'U-Turns', count: 2, color: '#E65100' },
  { type: 'Straight', count: 67, color: '#2E7D32' },
];

function CompassDial({ heading }: { heading: number }) {
  const cardinalDir = (h: number) => {
    if (h >= 337.5 || h < 22.5) return { label: 'N', icon: ArrowUp };
    if (h < 67.5) return { label: 'NE', icon: ArrowUp };
    if (h < 112.5) return { label: 'E', icon: ArrowRight };
    if (h < 157.5) return { label: 'SE', icon: ArrowRight };
    if (h < 202.5) return { label: 'S', icon: ArrowDown };
    if (h < 247.5) return { label: 'SW', icon: ArrowLeft };
    if (h < 292.5) return { label: 'W', icon: ArrowLeft };
    return { label: 'NW', icon: ArrowLeft };
  };
  const dir = cardinalDir(heading);
  return (
    <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto' }}>
      <Box sx={{ width: 140, height: 140, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {['N', 'E', 'S', 'W'].map((c, i) => (
          <Typography key={c} sx={{ position: 'absolute', color: c === dir.label.charAt(0) ? '#69F0AE' : 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 13, top: i === 0 ? 4 : 'auto', bottom: i === 2 ? 4 : 'auto', left: i === 3 ? 8 : 'auto', right: i === 1 ? 8 : 'auto' }}>{c}</Typography>
        ))}
        <Box sx={{ position: 'absolute', width: 4, height: 55, bottom: '50%', left: '50%', transform: `translateX(-50%) rotate(${heading}deg)`, transformOrigin: 'bottom center', bgcolor: '#F44336', borderRadius: '2px 2px 0 0' }} />
        <Box sx={{ position: 'absolute', width: 4, height: 30, top: '50%', left: '50%', transform: `translateX(-50%) rotate(${heading}deg)`, transformOrigin: 'top center', bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '0 0 2px 2px' }} />
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#fff', zIndex: 1 }} />
      </Box>
      <Typography sx={{ textAlign: 'center', mt: 1, color: '#fff', fontWeight: 800, fontSize: 18 }}>{heading}° {dir.label}</Typography>
    </Box>
  );
}

export default function DirectionTracking() {
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, '');
  const [heading, setHeading] = useState(90);
  const [speed, setSpeed] = useState(68);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeading((h) => (h + Math.floor(Math.random() * 20) - 10 + 360) % 360);
      setSpeed(60 + Math.floor(Math.random() * 30));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      <Card sx={{ background: 'linear-gradient(135deg, #00695C 0%, #00897B 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 2 }}>
          <Compass size={18} />
          <Typography sx={{ fontSize: 12, opacity: 0.85, letterSpacing: 2 }}>DIRECTION TRACKING</Typography>
        </Box>
        <CompassDial heading={heading} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{speed} km/h</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.8 }}>Speed</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>12.4 km</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.8 }}>Distance</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>18 min</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.8 }}>ETA</Typography>
          </Box>
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Heading History (degrees)</Typography>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart id={`${uid}-area`} data={headingHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="t" tick={{ fontSize: 9 }} />
            <YAxis domain={[0, 360]} tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="heading" stroke="#00695C" fill="#E0F2F1" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Turn Distribution</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {turnData.map((t) => (
            <Box key={t.type}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: '#546E7A' }}>{t.type}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.count}%</Typography>
              </Box>
              <Box sx={{ height: 6, bgcolor: '#F5F5F5', borderRadius: 3 }}>
                <Box sx={{ height: '100%', width: `${t.count}%`, bgcolor: t.color, borderRadius: 3, transition: 'width 1s ease' }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
