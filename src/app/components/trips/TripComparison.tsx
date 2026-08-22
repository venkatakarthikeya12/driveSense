import { useState, useId } from 'react';
import { Box, Card, Typography, Select, MenuItem, FormControl, InputLabel, Chip, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';

export default function TripComparison() {
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, '');

  const { trips, formatSpeed, speedUnitLabel } = useDriveSense();

  const [trip1Id, setTrip1Id] = useState<string>(trips.length > 0 ? trips[0].id : 'trip-101');
  const [trip2Id, setTrip2Id] = useState<string>(trips.length > 1 ? trips[1].id : (trips.length > 0 ? trips[0].id : 'trip-102'));

  const t1 = trips.find((t) => t.id === trip1Id) || (trips.length > 0 ? trips[0] : null);
  const t2 = trips.find((t) => t.id === trip2Id) || (trips.length > 1 ? trips[1] : (trips.length > 0 ? trips[0] : null));

  const comparisonData = [
    { metric: 'Overall Score', trip1: t1 ? t1.drivingScore : 88, trip2: t2 ? t2.drivingScore : 76 },
    { metric: 'Braking Control', trip1: 85, trip2: 72 },
    { metric: 'Speed Control', trip1: 92, trip2: 80 },
    { metric: 'Acceleration', trip1: 88, trip2: 84 },
    { metric: 'Cornering', trip1: 90, trip2: 78 },
  ];

  const statsComparison = [
    { label: 'Driving Score', trip1: `${t1?.drivingScore || 88} / 100`, trip2: `${t2?.drivingScore || 76} / 100` },
    { label: 'Distance', trip1: `${t1?.distanceKm || 18.5} km`, trip2: `${t2?.distanceKm || 24.2} km` },
    { label: 'Duration', trip1: `${Math.round((t1?.durationSeconds || 2100) / 60)} min`, trip2: `${Math.round((t2?.durationSeconds || 2700) / 60)} min` },
    { label: 'Avg Speed', trip1: `${formatSpeed(t1?.avgSpeedKmh || 42)} ${speedUnitLabel}`, trip2: `${formatSpeed(t2?.avgSpeedKmh || 51)} ${speedUnitLabel}` },
    { label: 'Max Speed', trip1: `${formatSpeed(t1?.maxSpeedKmh || 75)} ${speedUnitLabel}`, trip2: `${formatSpeed(t2?.maxSpeedKmh || 88)} ${speedUnitLabel}` },
    { label: 'Events Logged', trip1: `${t1?.eventsCount || 1} events`, trip2: `${t2?.eventsCount || 3} events` },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
            Side-by-Side Trip Comparison
          </Typography>
          <Chip label="TELEMATICS COMPARATOR" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 10 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Compare Driving Score, Speed Profiles &amp; Telemetry Events Across Completed Trips
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Trip Selectors */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#D4AF37' }}>Trip 1 (Primary)</InputLabel>
            <Select
              value={trip1Id}
              onChange={(e) => setTrip1Id(e.target.value)}
              label="Trip 1 (Primary)"
              sx={{
                color: '#FFFFFF',
                bgcolor: '#0e0e0e',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212,175,55,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              }}
            >
              {trips.map((trip) => (
                <MenuItem key={trip.id} value={trip.id}>
                  {trip.date} — {trip.startLocation} (Score {trip.drivingScore})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#FFD700' }}>Trip 2 (Comparison)</InputLabel>
            <Select
              value={trip2Id}
              onChange={(e) => setTrip2Id(e.target.value)}
              label="Trip 2 (Comparison)"
              sx={{
                color: '#FFFFFF',
                bgcolor: '#0e0e0e',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,215,0,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              }}
            >
              {trips.map((trip) => (
                <MenuItem key={trip.id} value={trip.id}>
                  {trip.date} — {trip.startLocation} (Score {trip.drivingScore})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Radar & Bar Comparison Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
              Behavior Metrics Radar Comparison
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comparisonData}>
                  <PolarGrid stroke="rgba(212,175,55,0.15)" />
                  <PolarAngleAxis dataKey="metric" stroke="#B8B8B8" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#B8B8B8" fontSize={9} />
                  <Radar name="Trip 1" dataKey="trip1" stroke="#FFD700" fill="#FFD700" fillOpacity={0.4} />
                  <Radar name="Trip 2" dataKey="trip2" stroke="#35C759" fill="#35C759" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
              Score Breakdown Bar Comparison
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart id={`${uid}-barchart`} data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
                  <XAxis dataKey="metric" stroke="#B8B8B8" fontSize={10} />
                  <YAxis stroke="#B8B8B8" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }} />
                  <Legend />
                  <Bar dataKey="trip1" fill="#FFD700" name="Trip 1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trip2" fill="#35C759" name="Trip 2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Metrics Table Comparison */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
          Detailed Telematics Comparison Table
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {statsComparison.map((stat, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: '#050505',
                borderRadius: 2,
                border: '1px solid rgba(212,175,55,0.12)',
              }}
            >
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700, width: '30%' }}>
                {stat.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '65%', justifyContent: 'space-between' }}>
                <Chip label={`Trip 1: ${stat.trip1}`} sx={{ bgcolor: 'rgba(255,215,0,0.15)', color: '#FFD700', fontWeight: 800 }} />
                <ArrowRight size={16} color="#777" />
                <Chip label={`Trip 2: ${stat.trip2}`} sx={{ bgcolor: 'rgba(53,199,89,0.15)', color: '#35C759', fontWeight: 800 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
