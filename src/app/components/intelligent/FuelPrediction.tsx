import { useId } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { Fuel, TrendingUp, TrendingDown, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';

export default function FuelPrediction() {
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, '');
  const consumptionGradientId = `consumptionGradient-${uid}`;

  const { telemetry } = useDriveSense();

  const currentFuel = Math.round(telemetry.fuelLevel || 68);
  const avgConsumption = telemetry.fuelConsumption || 7.2;
  const predictedRange = Math.round((currentFuel / 100) * 520);

  const consumptionHistory = [
    { date: 'Jan', consumption: 9.2, cost: 520 },
    { date: 'Feb', consumption: 8.8, cost: 495 },
    { date: 'Mar', consumption: 9.5, cost: 540 },
    { date: 'Apr', consumption: 8.2, cost: 465 },
    { date: 'May', consumption: avgConsumption, cost: 485 },
  ];

  const dailyPrediction = [
    { day: 'Mon', actual: 8.3, predicted: 8.5 },
    { day: 'Tue', actual: 9.1, predicted: 8.8 },
    { day: 'Wed', actual: 7.8, predicted: 8.2 },
    { day: 'Thu', actual: 8.5, predicted: 8.4 },
    { day: 'Fri', actual: 8.9, predicted: 8.7 },
    { day: 'Sat', actual: 7.5, predicted: 7.8 },
    { day: 'Sun', actual: avgConsumption, predicted: 7.5 },
  ];

  const drivingPatterns = [
    { pattern: 'City Driving', consumption: 10.2, percentage: 45 },
    { pattern: 'Highway Cruising', consumption: 6.8, percentage: 35 },
    { pattern: 'Mixed Conditions', consumption: 8.5, percentage: 20 },
  ];

  const fuelOptimizationTips = [
    { tip: 'Maintain steady cruising speed on highways', savings: '15%', impact: 'high' },
    { tip: 'Avoid sudden aggressive acceleration', savings: '12%', impact: 'high' },
    { tip: 'Optimize AC usage when driving below 50 km/h', savings: '8%', impact: 'medium' },
    { tip: 'Maintain recommended 32 PSI tire pressure', savings: '10%', impact: 'medium' },
    { tip: 'Remove unnecessary cargo weight', savings: '5%', impact: 'low' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
            AI Fuel Consumption &amp; Range Prediction
          </Typography>
          <Chip label="ML ANALYTICS" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 10 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Machine Learning-Based Telemetry &amp; Fuel Optimization Model
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Current Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3, position: 'relative', overflow: 'hidden' }}>
            <Fuel size={28} color="#FFD700" />
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFD700', my: 1 }}>
              {currentFuel}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
              Current Tank Level
            </Typography>
            <LinearProgress
              variant="determinate"
              value={currentFuel}
              sx={{ mt: 2, height: 6, borderRadius: 3, bgcolor: '#050505', '& .MuiLinearProgress-bar': { bgcolor: '#FFD700', borderRadius: 3 } }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3 }}>
            <BarChart3 size={28} color="#D4AF37" />
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF', my: 1 }}>
              {avgConsumption} <Typography component="span" variant="caption" sx={{ color: '#777' }}>L/100km</Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
              Avg Consumption Rate
            </Typography>
            <Chip
              label="12% Optimal Efficiency"
              icon={<TrendingDown size={14} color="#35C759" />}
              size="small"
              sx={{ mt: 2, bgcolor: 'rgba(53,199,89,0.15)', color: '#35C759', fontWeight: 700 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3 }}>
            <Zap size={28} color="#FFD700" />
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFD700', my: 1 }}>
              {predictedRange} <Typography component="span" variant="caption" sx={{ color: '#777' }}>KM</Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
              Predicted Driving Range
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
              Based on real-time driving pattern
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 3, p: 3 }}>
            <DollarSign size={28} color="#D4AF37" />
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF', my: 1 }}>
              $485
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600 }}>
              Est. Monthly Fuel Cost
            </Typography>
            <Chip
              label="Save $60/month possible"
              icon={<TrendingUp size={14} color="#FFD700" />}
              size="small"
              sx={{ mt: 2, bgcolor: 'rgba(212,175,55,0.15)', color: '#FFD700', fontWeight: 700 }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* ML Prediction Chart */}
      <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
          ML-Based Consumption Model (Actual vs Predicted)
        </Typography>
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart id={`${uid}-line`} data={dailyPrediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.15)" />
              <XAxis dataKey="day" stroke="#777" />
              <YAxis stroke="#777" label={{ value: 'L/100km', angle: -90, position: 'insideLeft', fill: '#777' }} />
              <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #D4AF37', borderRadius: 8, color: '#FFF' }} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 5 }} />
              <Line type="monotone" dataKey="predicted" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Driving Patterns & Optimization Tips */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
              Driving Pattern Consumption Breakout
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {drivingPatterns.map((pattern, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: '#050505', borderRadius: 2, border: '1px solid rgba(212,175,55,0.15)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                      {pattern.pattern}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 900 }}>
                      {pattern.consumption} L/100km
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pattern.percentage}
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#121212', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37', borderRadius: 3 } }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
              AI Optimization Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {fuelOptimizationTips.map((tip, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#050505', borderRadius: 2, border: '1px solid rgba(212,175,55,0.12)' }}>
                  <Typography variant="body2" sx={{ color: '#B8B8B8', fontWeight: 500 }}>
                    {tip.tip}
                  </Typography>
                  <Chip label={`+${tip.savings} Save`} size="small" sx={{ bgcolor: 'rgba(53,199,89,0.15)', color: '#35C759', fontWeight: 800, fontSize: 10 }} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
