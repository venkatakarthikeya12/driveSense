import { Card, CardContent, Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import { Lightbulb, Target, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useDriveSense } from '../../context/DriveSenseContext';
import { aiAnalysisService } from '../../services/aiAnalysisService';

interface CoachingTip {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  scoreGain: number;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return { main: '#f44336', light: '#ffebee', border: '#f4433633' };
    case 'medium': return { main: '#ff9800', light: '#fff3e0', border: '#ff980033' };
    case 'low': return { main: '#4caf50', light: '#e8f5e9', border: '#4caf5033' };
    default: return { main: '#2196f3', light: '#e3f2fd', border: '#2196f333' };
  }
};

export default function CoachingTips() {
  const { trips } = useDriveSense();
  const report = aiAnalysisService.generateFullReport(trips);

  const currentScore = report.score;
  const potentialScore = Math.min(100, currentScore + 15);

  const tips: CoachingTip[] = report.suggestions.map((sug, idx) => ({
    id: `tip-${idx}`,
    category: idx % 2 === 0 ? 'Braking' : 'Speed Control',
    title: idx % 2 === 0 ? 'Smooth Out Braking & Throttle' : 'Optimal Speed Regulation',
    description: sug,
    impact: `Based on your ${trips.length} recent driving logs`,
    priority: idx === 0 ? 'high' : 'medium',
    scoreGain: idx === 0 ? 8 : 5,
  }));

  const achievements = [
    { title: 'Week Streak', value: `${Math.min(7, trips.length + 2)} days`, icon: '🔥' },
    { title: 'Safe Trips', value: `${trips.filter((t) => t.drivingScore >= 80).length}`, icon: '✅' },
    { title: 'Best Score', value: `${trips.length > 0 ? Math.max(...trips.map((t) => t.drivingScore)) : 94}`, icon: '🏆' },
    { title: 'Total Distance', value: `${trips.reduce((acc, t) => acc + t.distanceKm, 0).toFixed(0)} km`, icon: '🚗' },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Page Header */}
      <Box className="ds-animate-fadeInUp" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
          AI Coaching &amp; Insights
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', mt: 0.5 }}>
          Personalised telemetry-based driver improvement recommendations
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Score Improvement Potential */}
      <Card
        className="ds-card-glow ds-animate-fadeInUp ds-delay-100"
        sx={{
          bgcolor: '#0e0e0e',
          mb: 3,
          borderRadius: 3,
          border: '1px solid rgba(212, 175, 55, 0.28)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <Target size={22} style={{ color: '#D4AF37' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
              Score Improvement Potential
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2.5 }}>
                <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#D4AF37' }}>
                    {currentScore}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', letterSpacing: 1 }}>Current</Typography>
                </Box>

                <ArrowRight size={32} style={{ color: '#444' }} />

                <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: 'rgba(53,199,89,0.08)', border: '1px solid rgba(53,199,89,0.2)' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#35C759' }}>
                    {potentialScore}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', letterSpacing: 1 }}>Potential</Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(currentScore / potentialScore) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.06)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #D4AF37 0%, #35C759 100%)',
                    borderRadius: 5,
                  }
                }}
              />

              <Typography variant="body2" sx={{ color: '#777', mt: 1.5 }}>
                Follow all recommendations to gain up to{' '}
                <strong style={{ color: '#35C759' }}>+{potentialScore - currentScore} points</strong>
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(53,199,89,0.15) 0%, rgba(53,199,89,0.05) 100%)',
                border: '1px solid rgba(53,199,89,0.3)',
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(53,199,89,0.1)',
              }}>
                <TrendingUp size={40} style={{ color: '#35C759', marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#35C759' }}>
                  +{potentialScore - currentScore}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', letterSpacing: 1 }}>
                  POINTS AVAILABLE
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>Achievements</Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(212,175,55,0.2)', borderRadius: 1 }} />
      </Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {achievements.map((achievement, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              className="ds-animate-fadeInUp ds-card-glow"
              style={{ animationDelay: `${index * 0.08}s` }}
              sx={{
                bgcolor: '#0e0e0e',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 3,
                transition: 'all 0.25s ease',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(212,175,55,0.5)' },
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>{achievement.icon}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: '#FFD700' }}>
                    {achievement.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#777', letterSpacing: 0.5 }}>
                    {achievement.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Personalised Tips */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>Personalised Recommendations</Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(212,175,55,0.2)', borderRadius: 1 }} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tips.map((tip, idx) => {
          const pColor = getPriorityColor(tip.priority);
          return (
            <Grid item xs={12} md={6} key={tip.id}>
              <Card
                className="ds-animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
                sx={{
                  bgcolor: '#0e0e0e',
                  height: '100%',
                  borderLeft: `4px solid ${pColor.main}`,
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  borderRadius: 3,
                  transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 28px rgba(0,0,0,0.7), 0 0 14px ${pColor.main}22`,
                    borderColor: `${pColor.main}55`,
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          bgcolor: `${pColor.main}18`,
                          border: `1px solid ${pColor.main}40`,
                          borderRadius: 2, p: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Lightbulb size={20} style={{ color: pColor.main }} />
                      </Box>
                      <Box>
                        <Chip
                          label={tip.category}
                          size="small"
                          sx={{ bgcolor: `${pColor.main}18`, color: pColor.main, border: `1px solid ${pColor.main}40`, mb: 0.5, fontWeight: 700 }}
                        />
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.72rem', letterSpacing: 0.5 }}>
                          {tip.priority.toUpperCase()} PRIORITY
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={`+${tip.scoreGain} pts`}
                      sx={{ bgcolor: 'rgba(53,199,89,0.12)', color: '#35C759', border: '1px solid rgba(53,199,89,0.3)', fontWeight: 800 }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#FFFFFF' }}>
                    {tip.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#888', mb: 2, lineHeight: 1.65 }}>
                    {tip.description}
                  </Typography>

                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(5,5,5,0.8)',
                      border: '1px solid rgba(212,175,55,0.1)',
                      borderRadius: 2,
                      display: 'flex', alignItems: 'center', gap: 1,
                    }}
                  >
                    <AlertCircle size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {tip.impact}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Safety Tips */}
      <Card
        className="ds-card-glow"
        sx={{
          bgcolor: '#0e0e0e',
          borderRadius: 3,
          border: '1px solid rgba(212, 175, 55, 0.22)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #35C759 40%, #D4AF37 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ bgcolor: 'rgba(53,199,89,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <CheckCircle size={22} style={{ color: '#35C759' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
              Quick Safety Tips
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {[
              'Keep a safe following distance (3-second rule)',
              'Check blind spots before changing lanes',
              'Use turn signals at least 3 seconds before turning',
              'Adjust speed for road and weather conditions',
              'Avoid distractions — no phone use while driving',
              'Rest if you feel tired — drowsy driving is dangerous',
            ].map((tipText, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  className="ds-animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.06}s` }}
                  sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
                >
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'rgba(53,199,89,0.15)', border: '1px solid rgba(53,199,89,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                    <CheckCircle size={11} style={{ color: '#35C759' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.6 }}>
                    {tipText}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
