import { useId } from 'react';
import { Box, Card, Typography, Chip, Avatar, LinearProgress, Grid } from '@mui/material';
import { AlertCircle, TrendingDown, TrendingUp, MapPin, Clock, Activity, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';
import { DrivingEvent } from '../../../models/types';

export default function BrakingAnalysis() {
  const uid = useId().replace(/:/g, '');
  const { trips, currentTripScore, isTripActive, tripEvents } = useDriveSense();

  const harshCount = isTripActive ? tripEvents.filter((e: DrivingEvent) => e.type === 'harsh_brake' || (e.type as string) === 'hard_brake').length : 2;
  const brakingScore = Math.max(50, 100 - harshCount * 12);

  const weeklyData = [
    { day: 'Mon', harsh: 1, moderate: 4, gentle: 12 },
    { day: 'Tue', harsh: 2, moderate: 6, gentle: 15 },
    { day: 'Wed', harsh: 0, moderate: 4, gentle: 10 },
    { day: 'Thu', harsh: 1, moderate: 7, gentle: 14 },
    { day: 'Fri', harsh: 2, moderate: 5, gentle: 13 },
    { day: 'Sat', harsh: 0, moderate: 3, gentle: 8 },
    { day: 'Sun', harsh: harshCount, moderate: 4, gentle: 11 },
  ];

  const trendData = [
    { week: 'W1', score: 65 },
    { week: 'W2', score: 72 },
    { week: 'W3', score: 78 },
    { week: 'W4', score: brakingScore },
  ];

  const harshEvents = [
    { time: '10:42 AM', location: 'Market St & 4th Ave', speedDrop: '45 → 0 km/h in 1.8s', gForce: '0.62g' },
    { time: '02:15 PM', location: 'Broadway & 12th St', speedDrop: '60 → 15 km/h in 2.1s', gForce: '0.58g' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#35C759';
    if (score >= 60) return '#FFD700';
    return '#E53935';
  };

  const scoreColor = getScoreColor(brakingScore);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
            Braking &amp; Deceleration Analysis
          </Typography>
          <Chip label="TELEMATICS MODEL" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 10 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Detailed Telemetry Insights on Sudden Braking Events &amp; Deceleration G-Forces
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Score Hero Card */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
            Overall Braking Safety Score
          </Typography>
          <Chip
            icon={<TrendingUp size={16} color="#35C759" />}
            label="+5 from last week"
            size="small"
            sx={{ bgcolor: 'rgba(53,199,89,0.15)', color: '#35C759', fontWeight: 700 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: '4.2rem',
              fontWeight: 900,
              color: scoreColor,
              lineHeight: 1,
            }}
          >
            {brakingScore}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <LinearProgress
              variant="determinate"
              value={brakingScore}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#050505',
                '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 5 },
              }}
            />
            <Typography variant="body2" sx={{ color: '#888', mt: 1, fontWeight: 500 }}>
              {brakingScore >= 80 ? 'Excellent deceleration control. Minimal harsh braking detected.' : 'Moderate braking style. Maintain safer trailing distance.'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Weekly Breakdown Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
              Daily Braking Intensity Breakdown
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart id={`${uid}-bar`} data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
                  <XAxis dataKey="day" stroke="#777" />
                  <YAxis stroke="#777" />
                  <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }} />
                  <Bar dataKey="gentle" fill="#35C759" name="Gentle" stackId="a" />
                  <Bar dataKey="moderate" fill="#FFD700" name="Moderate" stackId="a" />
                  <Bar dataKey="harsh" fill="#E53935" name="Harsh" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
              Monthly Braking Score Trend
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart id={`${uid}-trend`} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
                  <XAxis dataKey="week" stroke="#777" />
                  <YAxis stroke="#777" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }} />
                  <Line type="monotone" dataKey="score" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Harsh Braking Event Log */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)', borderRadius: 3, p: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
          Recent Harsh Braking Events ({harshEvents.length})
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {harshEvents.map((ev, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: '#050505',
                borderRadius: 2,
                border: '1px solid rgba(229, 57, 53, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(229, 57, 53, 0.15)', border: '1px solid #E53935' }}>
                  <AlertCircle size={20} color="#E53935" />
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                    {ev.location}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    {ev.time} • {ev.speedDrop}
                  </Typography>
                </Box>
              </Box>
              <Chip label={ev.gForce} size="small" sx={{ bgcolor: 'rgba(229,57,53,0.2)', color: '#E53935', fontWeight: 800 }} />
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
