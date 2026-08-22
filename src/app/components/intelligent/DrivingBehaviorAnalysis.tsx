import { useState, useEffect, useId } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, AlertTriangle, Activity, Gauge, Shield, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';

export default function DrivingBehaviorAnalysis() {
  const uid = useId().replace(/:/g, '');
  const { trips, currentTripScore, isTripActive, tripEvents } = useDriveSense();

  const behaviorScore = isTripActive ? currentTripScore : (trips.length > 0 ? trips[0].drivingScore : 92);
  const [drivingClassification, setDrivingClassification] = useState<'Safe' | 'Normal' | 'Aggressive' | 'Dangerous'>('Safe');

  const harshBrakes = isTripActive ? tripEvents.filter(e => e.type === 'harsh_brake').length : 1;
  const rapidAccels = isTripActive ? tripEvents.filter(e => e.type === 'rapid_accel').length : 2;
  const overSpeeds = isTripActive ? tripEvents.filter(e => e.type === 'over_speed').length : 0;
  const sharpTurns = isTripActive ? tripEvents.filter(e => e.type === 'sharp_turn').length : 1;
  const idleTimes = isTripActive ? tripEvents.filter(e => e.type === 'idle_time').length : 0;

  const behaviorMetrics = [
    { category: 'Hard Braking', eventsCount: harshBrakes, score: Math.max(50, 100 - harshBrakes * 10) },
    { category: 'Sudden Acceleration', eventsCount: rapidAccels, score: Math.max(50, 100 - rapidAccels * 8) },
    { category: 'Overspeeding', eventsCount: overSpeeds, score: Math.max(50, 100 - overSpeeds * 12) },
    { category: 'Sharp Turns', eventsCount: sharpTurns, score: Math.max(50, 100 - sharpTurns * 7) },
    { category: 'Excessive Idling', eventsCount: idleTimes, score: Math.max(50, 100 - idleTimes * 5) },
  ];

  const behaviorDistribution = [
    { name: 'Safe Driving', value: 85, color: '#FFD700' },
    { name: 'Normal Driving', value: 12, color: '#D4AF37' },
    { name: 'Aggressive Events', value: 3, color: '#E53935' },
  ];

  const weeklyTrend = [
    { day: 'Mon', score: 88 },
    { day: 'Tue', score: 90 },
    { day: 'Wed', score: 86 },
    { day: 'Thu', score: 94 },
    { day: 'Fri', score: 92 },
    { day: 'Sat', score: 95 },
    { day: 'Sun', score: behaviorScore },
  ];

  useEffect(() => {
    if (behaviorScore >= 90) setDrivingClassification('Safe');
    else if (behaviorScore >= 75) setDrivingClassification('Normal');
    else if (behaviorScore >= 60) setDrivingClassification('Aggressive');
    else setDrivingClassification('Dangerous');
  }, [behaviorScore]);

  const getStatusColor = (classification: string) => {
    switch (classification) {
      case 'Safe': return '#35C759';
      case 'Normal': return '#FFD700';
      case 'Aggressive': return '#D4AF37';
      case 'Dangerous': return '#E53935';
      default: return '#D4AF37';
    }
  };

  const statusColor = getStatusColor(drivingClassification);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
            Driving Behavior &amp; Score Classification
          </Typography>
          <Chip label="STAGE 1 AI MODEL" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 10 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Real-Time Driver Performance Classification &amp; Telemetry Event Risk Metrics
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Main Score Hero Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              bgcolor: '#0e0e0e',
              border: `1px solid ${statusColor}`,
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              boxShadow: `0 0 24px ${statusColor}22`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', mb: 1 }}>
              Current Driving Classification
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, color: statusColor, my: 1 }}>
              {behaviorScore}
            </Typography>
            <Chip
              label={drivingClassification.toUpperCase()}
              sx={{
                bgcolor: `${statusColor}25`,
                color: statusColor,
                fontWeight: 900,
                fontSize: '1.1rem',
                py: 2,
                px: 2,
                borderRadius: 2,
                border: `1px solid ${statusColor}`,
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography variant="caption" sx={{ color: '#B8B8B8', lineHeight: 1.4 }}>
              Driver status classified as <strong>{drivingClassification}</strong> based on acceleration, braking consistency &amp; speed regulation.
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
                Behavioral Style Distribution
              </Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={behaviorDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {behaviorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Behavioral Metrics Cards */}
      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2 }}>
        Behavioral Risk Metrics &amp; Events
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {behaviorMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              sx={{
                bgcolor: '#0e0e0e',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 3,
                p: 2,
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#D4AF37' },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                {metric.category}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFD700' }}>
                  {metric.score}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B8B8B8', fontWeight: 700 }}>
                  {metric.eventsCount} events
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.score}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#050505',
                  '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37', borderRadius: 3 },
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Weekly Score Trend Chart */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
            Weekly Driving Score Trend
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart id={`${uid}-line`} data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.15)" />
                <XAxis dataKey="day" stroke="#B8B8B8" />
                <YAxis stroke="#B8B8B8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }} />
                <Line type="monotone" dataKey="score" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
