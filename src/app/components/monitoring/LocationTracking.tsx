import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, Chip, LinearProgress } from '@mui/material';
import { Navigation, Satellite, Clock, Route, TrendingUp } from 'lucide-react';
import { useDriveSense } from '../../../context/DriveSenseContext';

interface LocationTrackingProps {
  isConnected: boolean;
}

interface Coord { x: number; y: number; lat: number; lng: number; t: string; speed: number; }

// Simulated route: a winding city path
const ROUTE_WAYPOINTS = [
  { x: 60, y: 260, lat: 24.6800, lng: 46.7200 },
  { x: 90, y: 220, lat: 24.6950, lng: 46.7350 },
  { x: 130, y: 200, lat: 24.7100, lng: 46.7420 },
  { x: 170, y: 185, lat: 24.7200, lng: 46.7530 },
  { x: 210, y: 165, lat: 24.7300, lng: 46.7610 },
  { x: 250, y: 150, lat: 24.7380, lng: 46.7720 },
  { x: 280, y: 120, lat: 24.7500, lng: 46.7800 },
  { x: 300, y: 90, lat: 24.7620, lng: 46.7880 },
  { x: 320, y: 70, lat: 24.7700, lng: 46.7940 },
];

const ROAD_LABELS = [
  { x: 85, y: 245, label: 'King Fahd Rd' },
  { x: 175, y: 210, label: 'Prince Mohammed Blvd' },
  { x: 290, y: 100, label: 'Northern Ring Rd' },
];

const POI = [
  { x: 130, y: 200, label: 'Start', color: '#4caf50', shape: 'circle' },
  { x: 320, y: 70, label: 'Dest', color: '#f44336', shape: 'pin' },
];

function AnimatedMap({ progress, trail }: { progress: number; trail: { x: number; y: number }[] }) {
  const w = 360, h = 320;
  const idx = Math.min(Math.floor(progress * (ROUTE_WAYPOINTS.length - 1)), ROUTE_WAYPOINTS.length - 2);
  const frac = (progress * (ROUTE_WAYPOINTS.length - 1)) - idx;
  const cur = {
    x: ROUTE_WAYPOINTS[idx].x + frac * (ROUTE_WAYPOINTS[idx + 1].x - ROUTE_WAYPOINTS[idx].x),
    y: ROUTE_WAYPOINTS[idx].y + frac * (ROUTE_WAYPOINTS[idx + 1].y - ROUTE_WAYPOINTS[idx].y),
  };

  // heading angle for the car icon
  const dx = ROUTE_WAYPOINTS[Math.min(idx + 1, ROUTE_WAYPOINTS.length - 1)].x - ROUTE_WAYPOINTS[idx].x;
  const dy = ROUTE_WAYPOINTS[Math.min(idx + 1, ROUTE_WAYPOINTS.length - 1)].y - ROUTE_WAYPOINTS[idx].y;
  const headingDeg = (Math.atan2(dy, dx) * 180 / Math.PI);

  // remaining route path
  const remainPts = [
    `${cur.x},${cur.y}`,
    ...ROUTE_WAYPOINTS.slice(idx + 1).map((p) => `${p.x},${p.y}`),
  ].join(' ');

  const traveledPts = trail.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', borderRadius: 12 }}>
      {/* Dark map background */}
      <rect width={w} height={h} fill="#0d1b2a" />
      {/* Grid lines simulating map tiles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`v${i}`} x1={(i + 1) * 45} y1={0} x2={(i + 1) * 45} y2={h}
          stroke="#0e2233" strokeWidth={1} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={(i + 1) * 46} x2={w} y2={(i + 1) * 46}
          stroke="#0e2233" strokeWidth={1} />
      ))}
      {/* Side roads (background) */}
      <line x1={40} y1={80} x2={200} y2={80} stroke="#1a3a52" strokeWidth={5} />
      <line x1={200} y1={80} x2={200} y2={280} stroke="#1a3a52" strokeWidth={5} />
      <line x1={80} y1={150} x2={320} y2={150} stroke="#1a3a52" strokeWidth={5} />
      <line x1={80} y1={150} x2={80} y2={320} stroke="#1a3a52" strokeWidth={5} />
      {/* Main roads */}
      <polyline points={ROUTE_WAYPOINTS.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke="#1e3d5c" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dashed center line */}
      <polyline points={ROUTE_WAYPOINTS.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke="#0d2a40" strokeWidth={2} strokeDasharray="6,6" strokeLinejoin="round" />
      {/* Traveled path */}
      {trail.length > 1 && (
        <polyline points={traveledPts} fill="none" stroke="#2196f3" strokeWidth={4}
          strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      )}
      {/* Remaining route dashed */}
      <polyline points={remainPts} fill="none" stroke="#2196f3" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,5" opacity={0.4} />
      {/* Road labels */}
      {ROAD_LABELS.map((rl) => (
        <text key={rl.label} x={rl.x} y={rl.y} fontSize={8} fill="#2d5a7c"
          textAnchor="middle" fontWeight={600}>{rl.label}</text>
      ))}
      {/* POIs */}
      {POI.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={7} fill={p.color} opacity={0.9} />
          <text x={p.x} y={p.y + 16} fontSize={8} fill={p.color} textAnchor="middle" fontWeight={700}>{p.label}</text>
        </g>
      ))}
      {/* Accuracy ring */}
      <circle cx={cur.x} cy={cur.y} r={18} fill="#2196f322" stroke="#2196f344" strokeWidth={1} />
      {/* Car marker */}
      <g transform={`translate(${cur.x},${cur.y}) rotate(${headingDeg})`}>
        <circle cx={0} cy={0} r={10} fill="#2196f3" stroke="#fff" strokeWidth={2}
          style={{ filter: 'drop-shadow(0 0 6px rgba(33,150,243,0.8))' }} />
        {/* Arrow */}
        <polygon points="0,-6 4,4 0,2 -4,4" fill="#fff" />
      </g>
      {/* Heading pulse */}
      <circle cx={cur.x} cy={cur.y} r={14} fill="none" stroke="#2196f3" strokeWidth={1.5}
        opacity={0.5} style={{ animation: 'none' }}>
        <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Compass */}
      <g transform="translate(330,20)">
        <circle cx={0} cy={0} r={14} fill="#0d1b2a" stroke="#1e3d5c" strokeWidth={1.5} />
        <text x={0} y={-5} textAnchor="middle" fontSize={7} fill="#4fc3f7" fontWeight={700}>N</text>
        <text x={0} y={10} textAnchor="middle" fontSize={7} fill="#546e7a">S</text>
        <text x={-9} y={3} textAnchor="middle" fontSize={7} fill="#546e7a">W</text>
        <text x={9} y={3} textAnchor="middle" fontSize={7} fill="#546e7a">E</text>
      </g>
    </svg>
  );
}

export default function LocationTracking({ isConnected: propIsConnected }: LocationTrackingProps) {
  const { location, connectionStatus } = useDriveSense();
  const isConnected = propIsConnected || connectionStatus === 'connected';

  const [progress, setProgress] = useState(0.18);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [satellites, setSatellites] = useState(14);
  const [accuracy, setAccuracy] = useState(location.accuracy ? Math.round(location.accuracy) : 3);
  const [elapsed, setElapsed] = useState(0);

  // Use real GPS coordinates if available
  const curLat = location.latitude || 37.7749;
  const curLng = location.longitude || -122.4194;
  const totalDist = (progress * 18.4).toFixed(1);
  const eta = Math.max(0, Math.round((1 - progress) * 24));

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.003;
        if (next >= 1) return 0.05;
        const cur = {
          x: ROUTE_WAYPOINTS[Math.min(Math.floor(next * (ROUTE_WAYPOINTS.length - 1)), ROUTE_WAYPOINTS.length - 2)].x,
          y: ROUTE_WAYPOINTS[Math.min(Math.floor(next * (ROUTE_WAYPOINTS.length - 1)), ROUTE_WAYPOINTS.length - 2)].y,
        };
        setTrail((prev) => [...prev.slice(-60), cur]);
        return next;
      });
      setSatellites(12 + Math.floor(Math.random() * 6));
      setAccuracy(location.accuracy ? Math.round(location.accuracy) : Math.floor(Math.random() * 4) + 2);
      setElapsed((e) => e + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [isConnected, location]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh', p: 2, pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isConnected ? '#4caf50' : '#f44336',
          animation: isConnected ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } } }} />
        <Typography sx={{ color: isConnected ? '#4caf50' : '#f44336', fontWeight: 700, fontSize: 12, letterSpacing: 2 }}>
          {isConnected ? 'GPS LIVE' : 'GPS OFFLINE'}
        </Typography>
        <Chip icon={<Satellite size={10} />} label={`${satellites} sats`} size="small"
          sx={{ ml: 'auto', bgcolor: '#1f2937', color: '#64b5f6', fontSize: 11 }} />
      </Box>

      {/* Map */}
      <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, overflow: 'hidden', mb: 2 }}>
        <AnimatedMap progress={progress} trail={trail} />
        {/* Overlay stats */}
        <Box sx={{ p: 1.5, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#546e7a', fontSize: 10 }}>Latitude</Typography>
            <Typography sx={{ color: '#e0e0e0', fontSize: 13, fontWeight: 700 }}>{curLat.toFixed(5)}°N</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#546e7a', fontSize: 10 }}>Longitude</Typography>
            <Typography sx={{ color: '#e0e0e0', fontSize: 13, fontWeight: 700 }}>{curLng.toFixed(5)}°E</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#546e7a', fontSize: 10 }}>Accuracy</Typography>
            <Typography sx={{ color: '#4caf50', fontSize: 13, fontWeight: 700 }}>±{accuracy}m</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#546e7a', fontSize: 10 }}>Altitude</Typography>
            <Typography sx={{ color: '#e0e0e0', fontSize: 13, fontWeight: 700 }}>412m</Typography>
          </Box>
        </Box>
      </Card>

      {/* Route summary */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
        {[
          { icon: <Route size={16} />, label: 'Distance', value: `${totalDist} km`, color: '#64b5f6' },
          { icon: <Clock size={16} />, label: 'Elapsed', value: formatTime(elapsed), color: '#ffb74d' },
          { icon: <Navigation size={16} />, label: 'ETA', value: `${eta} min`, color: '#66bb6a' },
        ].map((s) => (
          <Card key={s.label} sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 1.75, textAlign: 'center' }}>
            <Box sx={{ color: s.color, display: 'flex', justifyContent: 'center', mb: 0.5 }}>{s.icon}</Box>
            <Typography sx={{ color: s.color, fontSize: 16, fontWeight: 800 }}>{s.value}</Typography>
            <Typography sx={{ color: '#546e7a', fontSize: 10 }}>{s.label}</Typography>
          </Card>
        ))}
      </Box>

      {/* Waypoints */}
      <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ color: '#8b93a7', fontSize: 11, fontWeight: 700, letterSpacing: 2, mb: 1.5 }}>ROUTE</Typography>
        {[
          { icon: '🏠', label: 'Home', addr: 'Al Nakheel District, Riyadh', done: true },
          { icon: '📍', label: 'Waypoint', addr: 'King Fahd Road, KAFD', done: progress > 0.5 },
          { icon: '🏢', label: 'Destination', addr: 'Faisaliyah Mall, Al Olaya', done: false },
        ].map((w, i, arr) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '50%',
                bgcolor: w.done ? '#4caf5022' : '#1f2937',
                border: `2px solid ${w.done ? '#4caf50' : '#374151'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                {w.done ? <TrendingUp size={14} color="#4caf50" /> : w.icon}
              </Box>
              {i < arr.length - 1 && (
                <Box sx={{ width: 2, height: 28, my: 0.5,
                  bgcolor: w.done ? '#4caf50' : '#1f2937' }} />
              )}
            </Box>
            <Box sx={{ flex: 1, pb: i < arr.length - 1 ? 1.5 : 0, pt: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: w.done ? '#4caf50' : '#e0e0e0' }}>
                {w.label}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#546e7a' }}>{w.addr}</Typography>
            </Box>
          </Box>
        ))}
      </Card>

      {/* GPS Quality */}
      <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', borderRadius: 3, p: 2 }}>
        <Typography sx={{ color: '#8b93a7', fontSize: 11, fontWeight: 700, letterSpacing: 2, mb: 1.5 }}>GPS QUALITY</Typography>
        {[
          { label: 'Signal Strength', value: `${Math.round(70 + satellites * 2)}%`, pct: 70 + satellites * 2, color: '#4caf50' },
          { label: 'HDOP', value: '0.9 (Excellent)', pct: 91, color: '#64b5f6' },
          { label: 'Satellites Used', value: `${satellites} / 16`, pct: (satellites / 16) * 100, color: '#ffb74d' },
        ].map((item) => (
          <Box key={item.label} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ color: '#8b93a7', fontSize: 12 }}>{item.label}</Typography>
              <Typography sx={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.value}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={Math.min(item.pct, 100)}
              sx={{ height: 5, borderRadius: 3, bgcolor: '#1f2937',
                '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 3 } }} />
          </Box>
        ))}
      </Card>
    </Box>
  );
}
