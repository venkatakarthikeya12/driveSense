import { useState, useEffect, useId } from 'react';
import { Box, Typography, Card, Chip, Switch } from '@mui/material';
import { Shield, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const seatConfig = [
  { id: 'driver', label: 'Driver', row: 0, col: 1 },
  { id: 'front-pass', label: 'Front Passenger', row: 0, col: 2 },
  { id: 'rear-left', label: 'Rear Left', row: 1, col: 0 },
  { id: 'rear-center', label: 'Rear Center', row: 1, col: 1 },
  { id: 'rear-right', label: 'Rear Right', row: 1, col: 2 },
];

const complianceData = [
  { day: 'Mon', compliance: 100 }, { day: 'Tue', compliance: 80 },
  { day: 'Wed', compliance: 100 }, { day: 'Thu', compliance: 60 },
  { day: 'Fri', compliance: 100 }, { day: 'Sat', compliance: 100 }, { day: 'Sun', compliance: 80 },
];

export default function SeatBeltAlert() {
  const uid = useId().replace(/:/g, '');
  const [beltStatus, setBeltStatus] = useState<Record<string, boolean>>({
    driver: true, 'front-pass': false, 'rear-left': false, 'rear-center': true, 'rear-right': false,
  });
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [alertCount, setAlertCount] = useState(0);

  const occupiedSeats = ['driver', 'front-pass', 'rear-center'];
  const violations = occupiedSeats.filter((s) => !beltStatus[s]).length;

  useEffect(() => {
    if (violations > 0 && alertEnabled) {
      const timer = setInterval(() => setAlertCount((c) => c + 1), 5000);
      return () => clearInterval(timer);
    }
  }, [violations, alertEnabled]);

  const toggleBelt = (id: string) => {
    if (occupiedSeats.includes(id)) {
      setBeltStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <Box sx={{ p: 2, pb: 2 }}>
      <Card sx={{ background: violations > 0 ? 'linear-gradient(135deg, #C62828 0%, #E53935 100%)' : 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)', borderRadius: 4, p: 2.5, mb: 2, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Shield size={28} />
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>Seat Belt Monitor</Typography>
            <Typography sx={{ fontSize: 12, opacity: 0.85 }}>
              {violations === 0 ? 'All occupied seats belted' : `${violations} belt violation${violations > 1 ? 's' : ''} detected`}
            </Typography>
          </Box>
          {violations > 0 && (
            <Box sx={{ ml: 'auto', animation: 'pulse 1s infinite' }}>
              <Bell size={24} />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[
            { v: `${occupiedSeats.length - violations}/${occupiedSeats.length}`, l: 'Belted' },
            { v: violations, l: 'Violations' },
            { v: `${alertCount}`, l: 'Alerts Sent' },
          ].map((s) => (
            <Box key={s.l} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{s.v}</Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.8 }}>{s.l}</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Interactive Seat Grid */}
      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1.5 }}>Seat Status (tap to toggle)</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          {seatConfig.map((seat) => {
            const isOccupied = occupiedSeats.includes(seat.id);
            const isBelted = beltStatus[seat.id];
            return (
              <Box key={seat.id} onClick={() => toggleBelt(seat.id)}
                sx={{
                  p: 1.5, borderRadius: 2, textAlign: 'center', cursor: isOccupied ? 'pointer' : 'default',
                  bgcolor: !isOccupied ? '#F5F5F5' : isBelted ? '#E8F5E9' : '#FFEBEE',
                  border: `2px solid ${!isOccupied ? '#E0E0E0' : isBelted ? '#4CAF50' : '#EF5350'}`,
                  transition: 'all 0.2s',
                }}>
                <Box sx={{ fontSize: 22, mb: 0.5 }}>{!isOccupied ? '💺' : isBelted ? '✅' : '⚠️'}</Box>
                <Typography sx={{ fontSize: 10, fontWeight: 600, color: !isOccupied ? '#BDBDBD' : isBelted ? '#2E7D32' : '#C62828' }}>
                  {seat.label}
                </Typography>
                <Typography sx={{ fontSize: 9, color: '#90A4AE' }}>{!isOccupied ? 'Empty' : isBelted ? 'Belted' : 'Unbelted'}</Typography>
              </Box>
            );
          })}
        </Box>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F' }}>Alert Sound</Typography>
          <Switch checked={alertEnabled} onChange={() => setAlertEnabled((a) => !a)} size="small" color="success" />
        </Box>
        <Typography sx={{ fontSize: 11, color: '#78909C' }}>Audible warning when passengers are unbelted</Typography>
      </Card>

      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#37474F', mb: 1 }}>7-Day Compliance Rate</Typography>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart id={`${uid}-bar`} data={complianceData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }} formatter={(v) => [`${v}%`, 'Compliance']} />
            <Bar dataKey="compliance" fill="#2E7D32" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
