import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card, Chip } from '@mui/material';
import { MapPin, Navigation, Satellite } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const pathData = [
  { t: '09:00', lat: 24.68, lng: 46.72 }, { t: '09:10', lat: 24.70, lng: 46.74 },
  { t: '09:20', lat: 24.72, lng: 46.76 }, { t: '09:30', lat: 24.74, lng: 46.75 },
  { t: '09:40', lat: 24.76, lng: 46.77 }, { t: '09:50', lat: 24.78, lng: 46.79 },
];

const waypoints = [
  { label: 'Home', addr: 'Al Nakheel District, Riyadh', time: '09:00', icon: '🏠' },
  { label: 'Office', addr: 'King Fahd Road, KAFD Tower', time: '09:42', icon: '🏢' },
  { label: 'Destination', addr: 'Faisaliyah Mall, Al Olaya', time: 'ETA 10:15', icon: '📍' },
];

export default function GPSTracking() {
  const uid = useId().replace(/:/g, '');
  const [lat, setLat] = useState(24.7136);
  const [lng, setLng] = useState(46.6753);
  const [accuracy, setAccuracy] = useState(4);
  const [satellites, setSatellites] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLat((l) => parseFloat((l + (Math.random() - 0.5) * 0.002).toFixed(6)));
      setLng((l) => parseFloat((l + (Math.random() - 0.5) * 0.002).toFixed(6)));
      setAccuracy(Math.floor(Math.random() * 5) + 2);
      setSatellites(10 + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      <Card sx={{ background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <MapPin size={24} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>GPS Location</Typography>
            <Typography sx={{ fontSize: 11, opacity: 0.8 }}>GNSS Active — High Precision</Typography>
          </Box>
          <Chip icon={<Satellite size={10} />} label={`${satellites} Sats`} size="small"
            sx={{ ml: 'auto', bgcolor: 'rgba(105,240,174,0.2)', color: '#69F0AE', fontWeight: 700, fontSize: 10 }} />
        </Box>

        {/* Map placeholder with grid */}
        <Box sx={{ bgcolor: '#1E3A5F', borderRadius: 3, height: 150, position: 'relative', overflow: 'hidden', mb: 1.5 }}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={`v${i}`} sx={{ position: 'absolute', left: `${25 * (i + 1)}%`, top: 0, bottom: 0, width: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
          ))}
          {[0, 1, 2].map((i) => (
            <Box key={`h${i}`} sx={{ position: 'absolute', top: `${33.3 * (i + 1)}%`, left: 0, right: 0, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
          ))}
          {/* Route line */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <polyline points="20,120 60,95 100,80 140,65 180,50 220,35" stroke="#42A5F5" strokeWidth="2" fill="none" strokeDasharray="4,2" />
          </svg>
          {/* Current position */}
          <Box sx={{ position: 'absolute', left: '53%', top: '42%', transform: 'translate(-50%, -50%)' }}>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#FFAB40', border: '3px solid #fff', boxShadow: '0 0 12px rgba(255,171,64,0.8)' }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 8, left: 12 }}>
            <Typography sx={{ color: '#fff', fontSize: 9, opacity: 0.7 }}>King Fahd Road, Riyadh</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{lat.toFixed(4)}°N</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.7 }}>Latitude</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{lng.toFixed(4)}°E</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.7 }}>Longitude</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>±{accuracy}m</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.7 }}>Accuracy</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>412m</Typography>
            <Typography sx={{ fontSize: 10, opacity: 0.7 }}>Altitude</Typography>
          </Box>
        </Box>
      </Card>

      {/* Waypoints */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Route Waypoints</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {waypoints.map((w, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, position: 'relative' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{w.icon}</Box>
                {i < waypoints.length - 1 && <Box sx={{ width: 2, height: 28, bgcolor: '#90CAF9', my: 0.25 }} />}
              </Box>
              <Box sx={{ flex: 1, pb: i < waypoints.length - 1 ? 1.5 : 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1565C0' }}>{w.label}</Typography>
                <Typography sx={{ fontSize: 11, color: '#78909C' }}>{w.addr}</Typography>
                <Typography sx={{ fontSize: 10, color: '#90A4AE' }}>{w.time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Latitude Track</Typography>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart id={`${uid}-line`} data={pathData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="t" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} domain={[24.67, 24.80]} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }} />
            <Line dataKey="lat" stroke="#1A237E" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
