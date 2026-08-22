import { useId } from 'react';
import { Box, Card, Typography, Chip, Avatar, Divider } from '@mui/material';
import { Calendar, Clock, MapPin, Navigation, Gauge, AlertTriangle, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';

interface TripDetailProps {
  onBack?: () => void;
}

export default function TripDetail({ onBack }: TripDetailProps) {
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, '');
  const speedGradientId = `speedGradient-${uid}`;

  const { selectedTrip, trips, formatSpeed, speedUnitLabel } = useDriveSense();

  const activeTrip = selectedTrip || (trips.length > 0 ? trips[0] : null);

  const durationMin = activeTrip ? Math.round(activeTrip.durationSeconds / 60) : 25;
  const avgSpeed = activeTrip ? formatSpeed(activeTrip.avgSpeedKmh) : 48;
  const maxSpeed = activeTrip ? formatSpeed(activeTrip.maxSpeedKmh) : 78;
  const score = activeTrip ? activeTrip.drivingScore : 88;

  const harshBrakeCount = activeTrip ? activeTrip.events.filter((e) => e.type === 'harsh_brake').length : 1;
  const rapidAccelCount = activeTrip ? activeTrip.events.filter((e) => e.type === 'rapid_accel').length : 1;
  const overSpeedCount = activeTrip ? activeTrip.events.filter((e) => e.type === 'over_speed').length : 0;
  const sharpTurnCount = activeTrip ? activeTrip.events.filter((e) => e.type === 'sharp_turn').length : 0;
  const totalEvents = activeTrip ? activeTrip.eventsCount : 2;

  // Synthesize realistic charts from trip data
  const speedData = Array.from({ length: 7 }, (_, i) => ({
    time: `${Math.round((i / 6) * durationMin)}m`,
    speed: i === 0 || i === 6 ? 0 : Math.round(avgSpeed * (0.6 + Math.sin(i) * 0.4)),
  }));

  const scoreData = Array.from({ length: 6 }, (_, i) => ({
    time: `${Math.round((i / 5) * durationMin)}m`,
    score: Math.min(100, Math.max(50, Math.round(100 - (i * (100 - score) / 5)))),
  }));

  const getScoreColor = (val: number) => {
    if (val >= 80) return '#FFD700';
    if (val >= 60) return '#D4AF37';
    return '#E53935';
  };

  const scoreColor = getScoreColor(score);

  if (!activeTrip) {
    return (
      <Box sx={{ p: 4, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#888' }}>No Trip Record Selected</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {onBack && (
              <Chip
                icon={<ArrowLeft size={16} color="#FFD700" />}
                label="Back"
                onClick={onBack}
                sx={{ bgcolor: 'rgba(212,175,55,0.15)', color: '#FFD700', cursor: 'pointer', fontWeight: 700 }}
              />
            )}
            <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900 }}>
              {activeTrip.startLocation} → {activeTrip.endLocation}
            </Typography>
          </Box>
          <Chip
            label={`SCORE ${score}`}
            sx={{
              bgcolor: `${scoreColor}20`,
              color: scoreColor,
              border: `1px solid ${scoreColor}`,
              fontSize: '1.1rem',
              fontWeight: 900,
              height: 44,
              px: 2,
              borderRadius: 3,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 13 }}>
            <Calendar size={15} color="#D4AF37" /> {activeTrip.date}
          </Typography>
          <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 13 }}>
            <Clock size={15} color="#D4AF37" /> {activeTrip.startTime} - {activeTrip.endTime} ({durationMin} min)
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 13, fontWeight: 700 }}>
            <Navigation size={15} color="#FFD700" /> {activeTrip.distanceKm} km
          </Typography>
        </Box>
      </Box>

      {/* Route Details Card */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 2, textTransform: 'uppercase' }}>
          Trip Route Log
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'rgba(53,199,89,0.15)', width: 36, height: 36, border: '1px solid #35C759' }}>
              <MapPin size={18} style={{ color: '#35C759' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#777', fontWeight: 700, letterSpacing: 1 }}>
                ORIGIN LOCATION
              </Typography>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                {activeTrip.startLocation}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(212,175,55,0.15)', ml: 5 }} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'rgba(229,57,53,0.15)', width: 36, height: 36, border: '1px solid #E53935' }}>
              <MapPin size={18} style={{ color: '#E53935' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#777', fontWeight: 700, letterSpacing: 1 }}>
                DESTINATION LOCATION
              </Typography>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                {activeTrip.endLocation}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Speed Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 3, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Gauge size={20} style={{ color: '#D4AF37' }} />
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, letterSpacing: 1 }}>
              AVERAGE SPEED
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 900 }}>
            {avgSpeed}
            <Typography component="span" variant="body2" sx={{ color: '#777', ml: 1 }}>
              {speedUnitLabel}
            </Typography>
          </Typography>
        </Card>

        <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 3, p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp size={20} style={{ color: '#FFD700' }} />
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, letterSpacing: 1 }}>
              PEAK SPEED
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 900 }}>
            {maxSpeed}
            <Typography component="span" variant="body2" sx={{ color: '#777', ml: 1 }}>
              {speedUnitLabel}
            </Typography>
          </Typography>
        </Card>
      </Box>

      {/* Speed Chart */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 2, textTransform: 'uppercase' }}>
          Speed Profile Over Time
        </Typography>
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart id={`${uid}-area`} data={speedData}>
              <defs>
                <linearGradient id={speedGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
              <XAxis dataKey="time" stroke="#777" />
              <YAxis stroke="#777" />
              <Tooltip
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Area type="monotone" dataKey="speed" stroke="#FFD700" strokeWidth={2.5} fillOpacity={1} fill={`url(#${speedGradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Score Chart */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 2, textTransform: 'uppercase' }}>
          Driving Safety Score Progression
        </Typography>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart id={`${uid}-line`} data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
              <XAxis dataKey="time" stroke="#777" />
              <YAxis stroke="#777" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Line type="monotone" dataKey="score" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#FFD700', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Events Summary */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 2, textTransform: 'uppercase' }}>
          Detected Driving Events ({totalEvents})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Harsh Braking', count: harshBrakeCount, icon: AlertTriangle, color: harshBrakeCount > 0 ? '#E53935' : '#35C759' },
            { label: 'Rapid Acceleration', count: rapidAccelCount, icon: TrendingUp, color: rapidAccelCount > 0 ? '#FFD700' : '#35C759' },
            { label: 'Overspeed Events', count: overSpeedCount, icon: Gauge, color: overSpeedCount > 0 ? '#E53935' : '#35C759' },
            { label: 'Sharp Cornering', count: sharpTurnCount, icon: Navigation, color: sharpTurnCount > 0 ? '#FFD700' : '#35C759' },
          ].map((event, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: '#050505',
                borderRadius: 2,
                border: '1px solid rgba(212,175,55,0.15)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${event.color}15`, width: 36, height: 36, border: `1px solid ${event.color}40` }}>
                  <event.icon size={18} style={{ color: event.color }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  {event.label}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: event.color, fontWeight: 900 }}>
                {event.count}
              </Typography>
            </Box>
          ))}
        </Box>

        {totalEvents === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Award size={48} style={{ color: '#35C759', marginBottom: 8 }} />
            <Typography variant="body2" sx={{ color: '#35C759', fontWeight: 700 }}>
              Perfect Driving Log! Zero risk events detected during this trip.
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
