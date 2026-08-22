import { useId } from 'react';
import { Box, Card, Typography, Chip, Button, Divider } from '@mui/material';
import { Calendar, Download, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function WeeklyReport() {
  const uid = useId().replace(/:/g, '');
  const weekData = {
    period: 'May 4 - May 11, 2026',
    totalTrips: 12,
    totalDistance: 142.5,
    totalDuration: '6h 45m',
    averageScore: 81,
    scoreChange: +5,
    bestTrip: { date: 'May 10', score: 92 },
    worstTrip: { date: 'May 6', score: 68 },
  };

  const dailyScores = [
    { day: 'Mon', score: 78 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 88 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 79 },
    { day: 'Sun', score: 81 },
  ];

  const eventDistribution = [
    { name: 'Harsh Braking', value: 8, color: '#f44336' },
    { name: 'Sharp Turns', value: 5, color: '#ff9800' },
    { name: 'Rapid Acceleration', value: 3, color: '#ffd700' },
    { name: 'Speeding', value: 1, color: '#9c27b0' },
  ];

  const achievements = [
    '5-day driving streak',
    'Completed Week Warrior challenge',
    'Improved braking score by 12%',
  ];

  const improvements = [
    'Reduce harsh braking events',
    'Practice smoother acceleration',
    'Maintain consistent speed on highways',
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
            Weekly Driving Report
          </Typography>
          <Typography variant="body2" sx={{ color: '#8b93a7', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} /> {weekData.period}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          sx={{
            color: '#64b5f6',
            borderColor: '#64b5f6',
            textTransform: 'none',
            '&:hover': { borderColor: '#5ca5e6', bgcolor: '#0a0e27' },
          }}
        >
          Export PDF
        </Button>
      </Box>

      {/* Overall Score Card */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Weekly Performance
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box>
            <Typography variant="h1" sx={{ color: '#4caf50', fontWeight: 700, fontSize: '4rem' }}>
              {weekData.averageScore}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              Average Score
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#2a2f4a' }} />
          <Box sx={{ flex: 1 }}>
            <Chip
              icon={weekData.scoreChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              label={`${weekData.scoreChange > 0 ? '+' : ''}${weekData.scoreChange} from last week`}
              sx={{
                bgcolor: weekData.scoreChange > 0 ? '#4caf5033' : '#f4433633',
                color: weekData.scoreChange > 0 ? '#4caf50' : '#f44336',
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography variant="body2" sx={{ color: '#8b93a7' }}>
              {weekData.scoreChange > 0
                ? 'Great improvement! Keep up the good work.'
                : 'Focus on the areas below to improve next week.'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Key Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
          <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 1 }}>
            Total Trips
          </Typography>
          <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>
            {weekData.totalTrips}
          </Typography>
        </Card>
        <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
          <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 1 }}>
            Distance
          </Typography>
          <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>
            {weekData.totalDistance}
            <Typography component="span" variant="body2" sx={{ color: '#8b93a7', ml: 1 }}>
              km
            </Typography>
          </Typography>
        </Card>
        <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
          <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 1 }}>
            Duration
          </Typography>
          <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
            {weekData.totalDuration}
          </Typography>
        </Card>
      </Box>

      {/* Daily Scores */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Daily Average Scores
        </Typography>
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart id={`${uid}-bar`} data={dailyScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4a" />
              <XAxis dataKey="day" stroke="#8b93a7" />
              <YAxis stroke="#8b93a7" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #2a2f4a', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="score" fill="#64b5f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Event Distribution */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Events Breakdown
        </Typography>
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Highlights & Areas to Improve */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Award size={24} style={{ color: '#4caf50' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Achievements
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {achievements.map((achievement, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TrendingUp size={16} style={{ color: '#4caf50', marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  {achievement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AlertTriangle size={24} style={{ color: '#ff9800' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Areas to Improve
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {improvements.map((improvement, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <AlertTriangle size={16} style={{ color: '#ff9800', marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  {improvement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* Best & Worst Trips */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <Card sx={{ bgcolor: '#1a1f3a', p: 3, border: '2px solid #4caf50' }}>
          <Typography variant="subtitle2" sx={{ color: '#8b93a7', mb: 1 }}>
            Best Trip
          </Typography>
          <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700 }}>
            {weekData.bestTrip.score}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8b93a7' }}>
            {weekData.bestTrip.date}
          </Typography>
        </Card>

        <Card sx={{ bgcolor: '#1a1f3a', p: 3, border: '2px solid #f44336' }}>
          <Typography variant="subtitle2" sx={{ color: '#8b93a7', mb: 1 }}>
            Needs Review
          </Typography>
          <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 700 }}>
            {weekData.worstTrip.score}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8b93a7' }}>
            {weekData.worstTrip.date}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
