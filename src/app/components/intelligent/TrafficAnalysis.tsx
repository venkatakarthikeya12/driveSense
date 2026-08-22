import { Box, Typography, Card, Chip } from '@mui/material';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useId } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const trafficByHour = [
  { hour: '6am', density: 20 }, { hour: '7am', density: 65 }, { hour: '8am', density: 90 },
  { hour: '9am', density: 75 }, { hour: '10am', density: 45 }, { hour: '11am', density: 40 },
  { hour: '12pm', density: 55 }, { hour: '1pm', density: 50 }, { hour: '2pm', density: 42 },
  { hour: '3pm', density: 55 }, { hour: '4pm', density: 80 }, { hour: '5pm', density: 95 },
];

const speedVsTraffic = [
  { t: '8:00', speed: 15, traffic: 95 }, { t: '8:15', speed: 22, traffic: 88 },
  { t: '8:30', speed: 35, traffic: 75 }, { t: '8:45', speed: 48, traffic: 60 },
  { t: '9:00', speed: 62, traffic: 42 }, { t: '9:15', speed: 70, traffic: 30 },
];

const incidents = [
  { type: 'Heavy Traffic', location: 'Ring Road – Km 12', severity: 'high', time: '8 min ago' },
  { type: 'Road Work', location: 'Airport Road – Exit 4', severity: 'medium', time: '23 min ago' },
  { type: 'Minor Incident', location: 'Corniche – North', severity: 'low', time: '41 min ago' },
];

const condPie = [
  { name: 'Free Flow', value: 35, color: '#2E7D32' },
  { name: 'Light', value: 25, color: '#7CB342' },
  { name: 'Moderate', value: 22, color: '#F9A825' },
  { name: 'Heavy', value: 18, color: '#E65100' },
];

const severityColor: Record<string, string> = { high: '#C62828', medium: '#E65100', low: '#F9A825' };
const severityBg: Record<string, string> = { high: '#FFEBEE', medium: '#FFF3E0', low: '#FFFDE7' };

export default function TrafficAnalysis() {
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, '');
  const currentDensity = 72;
  return (
    <Box sx={{ p: 2, pb: 2 }}>
      <Card sx={{ background: 'linear-gradient(135deg, #E65100 0%, #FF6D00 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 12, opacity: 0.85, letterSpacing: 2 }}>TRAFFIC DENSITY</Typography>
            <Typography sx={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1 }}>{currentDensity}%</Typography>
            <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Moderate — Expect delays</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip label="MODERATE" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, mb: 1 }} />
            <Typography sx={{ fontSize: 11, opacity: 0.8 }}>+8 min ETA</Typography>
            <Typography sx={{ fontSize: 11, opacity: 0.8 }}>impact added</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[{ v: '22 km/h', l: 'Avg Speed' }, { v: '3', l: 'Incidents' }, { v: '12 km', l: 'Congested' }].map((s) => (
            <Box key={s.l} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{s.v}</Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>{s.l}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>Traffic Density by Hour</Typography>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart id={`${uid}-bar`} data={trafficByHour} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="density" fill="#E65100" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Card sx={{ borderRadius: 3, p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#37474F', mb: 0.5 }}>Conditions Split</Typography>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart><Pie data={condPie} cx="50%" cy="50%" outerRadius={42} dataKey="value" paddingAngle={2}>
              {condPie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip contentStyle={{ fontSize: 10 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
        <Card sx={{ borderRadius: 3, p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#37474F', mb: 0.5 }}>Speed vs Traffic</Typography>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart id={`${uid}-area`} data={speedVsTraffic}>
              <Area key="speed" type="monotone" dataKey="speed" stroke="#1565C0" fill="#E3F2FD" strokeWidth={1.5} />
              <Area key="traffic" type="monotone" dataKey="traffic" stroke="#E65100" fill="#FFF3E0" strokeWidth={1.5} />
              <Tooltip contentStyle={{ fontSize: 9 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Active Incidents</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {incidents.map((inc, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: severityBg[inc.severity], borderRadius: 2, border: `1px solid ${severityColor[inc.severity]}22` }}>
              <AlertTriangle size={16} color={severityColor[inc.severity]} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: severityColor[inc.severity] }}>{inc.type}</Typography>
                <Typography sx={{ fontSize: 11, color: '#546E7A' }}>{inc.location}</Typography>
              </Box>
              <Typography sx={{ fontSize: 10, color: '#90A4AE' }}>{inc.time}</Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
