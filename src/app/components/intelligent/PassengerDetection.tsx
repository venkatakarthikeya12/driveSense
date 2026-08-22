import { useState, useId } from 'react';
import { Box, Typography, Card, Chip, LinearProgress } from '@mui/material';
import { Users, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const seatData = [
  { id: 'driver', label: 'Driver', x: '50%', y: '30%', occupied: true, beltOn: true },
  { id: 'front-passenger', label: 'Front Right', x: '75%', y: '30%', occupied: true, beltOn: false },
  { id: 'rear-left', label: 'Rear Left', x: '25%', y: '65%', occupied: false, beltOn: false },
  { id: 'rear-center', label: 'Rear Center', x: '50%', y: '65%', occupied: true, beltOn: true },
  { id: 'rear-right', label: 'Rear Right', x: '75%', y: '65%', occupied: false, beltOn: false },
];

const historyData = [
  { day: 'Mon', passengers: 1 }, { day: 'Tue', passengers: 3 }, { day: 'Wed', passengers: 2 },
  { day: 'Thu', passengers: 4 }, { day: 'Fri', passengers: 2 }, { day: 'Sat', passengers: 1 }, { day: 'Sun', passengers: 3 },
];

const occupancyPie = [
  { name: 'Solo', value: 42, color: '#90CAF9' },
  { name: '2 People', value: 30, color: '#1565C0' },
  { name: '3 People', value: 18, color: '#0288D1' },
  { name: '4+ People', value: 10, color: '#01579B' },
];

export default function PassengerDetection() {
  const uid = useId().replace(/:/g, '');
  const [seats] = useState(seatData);
  const occupiedCount = seats.filter((s) => s.occupied).length;
  const beltViolations = seats.filter((s) => s.occupied && !s.beltOn).length;

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      {/* Status Card */}
      <Card sx={{ background: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Users size={28} />
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{occupiedCount} / 5</Typography>
            <Typography sx={{ fontSize: 12, opacity: 0.85 }}>Seats Occupied</Typography>
          </Box>
          {beltViolations > 0 && (
            <Chip icon={<AlertTriangle size={12} />} label={`${beltViolations} Belt Alert`}
              size="small" sx={{ ml: 'auto', bgcolor: 'rgba(255,171,0,0.3)', color: '#FFAB00', fontWeight: 700, fontSize: 10 }} />
          )}
        </Box>
        <LinearProgress variant="determinate" value={(occupiedCount / 5) * 100}
          sx={{ borderRadius: 2, height: 8, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#CE93D8' } }} />
      </Card>

      {/* Seat Map */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Seat Occupancy Map</Typography>
        <Box sx={{ position: 'relative', bgcolor: '#F8F9FA', borderRadius: 3, p: 2, overflow: 'hidden' }}>
          {/* Car outline */}
          <Box sx={{ width: '100%', height: 180, position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50%', top: '5%', transform: 'translateX(-50%)', width: '55%', height: '90%', border: '2px solid #BDBDBD', borderRadius: '20px 20px 10px 10px', bgcolor: '#fff' }} />
            <Box sx={{ position: 'absolute', left: '50%', top: '12%', transform: 'translateX(-50%)', width: '45%', height: '20%', bgcolor: '#E3F2FD', borderRadius: '12px 12px 2px 2px', border: '1px solid #BDBDBD' }} />

            {seats.map((seat) => (
              <Box key={seat.id} sx={{
                position: 'absolute', left: seat.x, top: seat.y, transform: 'translate(-50%, -50%)',
                width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                bgcolor: seat.occupied ? (seat.beltOn ? '#E8F5E9' : '#FFF3E0') : '#F5F5F5',
                border: `2px solid ${seat.occupied ? (seat.beltOn ? '#4CAF50' : '#FF9800') : '#BDBDBD'}`,
              }}>
                {seat.occupied ? (
                  <>
                    <User size={14} color={seat.beltOn ? '#2E7D32' : '#E65100'} />
                    {seat.beltOn
                      ? <CheckCircle size={8} color="#2E7D32" />
                      : <AlertTriangle size={8} color="#E65100" />}
                  </>
                ) : (
                  <Box sx={{ width: 16, height: 2, bgcolor: '#BDBDBD', borderRadius: 1 }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
          {[{ color: '#4CAF50', label: 'Occupied + Belt' }, { color: '#FF9800', label: 'No Belt' }, { color: '#BDBDBD', label: 'Empty' }].map((l) => (
            <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: l.color }} />
              <Typography sx={{ fontSize: 10, color: '#78909C' }}>{l.label}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Card sx={{ borderRadius: 3, p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#37474F', mb: 1 }}>Occupancy Rate</Typography>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie data={occupancyPie} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" paddingAngle={2}>
                {occupancyPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card sx={{ borderRadius: 3, p: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#37474F', mb: 1 }}>Weekly Avg</Typography>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart id={`${uid}-bar`} data={historyData} barSize={8}>
              <Bar dataKey="passengers" fill="#7B1FA2" radius={[2, 2, 0, 0]} />
              <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Alert Card */}
      {beltViolations > 0 && (
        <Card sx={{ borderRadius: 3, p: 2, bgcolor: '#FFF3E0', border: '1px solid #FFE0B2' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <AlertTriangle size={20} color="#E65100" />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#E65100' }}>Seat Belt Alert</Typography>
              <Typography sx={{ fontSize: 12, color: '#BF360C' }}>Front passenger has not fastened their seat belt. Please ensure all passengers buckle up before moving.</Typography>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
}
