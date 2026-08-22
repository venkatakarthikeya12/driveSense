import { Box, Card, Typography, LinearProgress, Grid, Chip } from '@mui/material';
import { Trophy, Award, Star, Target, Zap, Shield, TrendingUp, CheckCircle, Lock } from 'lucide-react';

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      title: 'First Trip',
      description: 'Complete your first trip with DriveSense',
      icon: Star,
      color: '#64b5f6',
      unlocked: true,
      unlockedDate: 'May 1, 2026',
      rarity: 'common',
    },
    {
      id: 2,
      title: 'Perfect Score',
      description: 'Achieve a safety score of 100 in a single trip',
      icon: Trophy,
      color: '#ffd700',
      unlocked: false,
      progress: 92,
      rarity: 'legendary',
    },
    {
      id: 3,
      title: 'Week Warrior',
      description: 'Drive safely for 7 consecutive days',
      icon: Award,
      color: '#9c27b0',
      unlocked: true,
      unlockedDate: 'May 8, 2026',
      rarity: 'rare',
    },
    {
      id: 4,
      title: 'Smooth Operator',
      description: 'Complete 10 trips without harsh braking',
      icon: Shield,
      color: '#4caf50',
      unlocked: false,
      progress: 6,
      total: 10,
      rarity: 'rare',
    },
    {
      id: 5,
      title: 'Speed Demon Tamed',
      description: 'Complete 20 trips without speeding',
      icon: Zap,
      color: '#ff9800',
      unlocked: false,
      progress: 14,
      total: 20,
      rarity: 'epic',
    },
    {
      id: 6,
      title: 'Marathon Driver',
      description: 'Drive a total of 1000 km',
      icon: Target,
      color: '#f44336',
      unlocked: false,
      progress: 184,
      total: 1000,
      rarity: 'epic',
    },
    {
      id: 7,
      title: 'Early Bird',
      description: 'Complete 5 trips before 7 AM',
      icon: TrendingUp,
      color: '#00bcd4',
      unlocked: true,
      unlockedDate: 'May 7, 2026',
      rarity: 'uncommon',
    },
    {
      id: 8,
      title: 'Night Owl',
      description: 'Complete 5 trips after 10 PM safely',
      icon: Star,
      color: '#3f51b5',
      unlocked: false,
      progress: 2,
      total: 5,
      rarity: 'uncommon',
    },
    {
      id: 9,
      title: 'Safety Champion',
      description: 'Maintain average score above 85 for 30 days',
      icon: Trophy,
      color: '#ffd700',
      unlocked: false,
      progress: 7,
      total: 30,
      rarity: 'legendary',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#8b93a7';
      case 'uncommon':
        return '#4caf50';
      case 'rare':
        return '#64b5f6';
      case 'epic':
        return '#9c27b0';
      case 'legendary':
        return '#ffd700';
      default:
        return '#8b93a7';
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
        Achievements
      </Typography>
      <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
        Unlock achievements by driving safely and reaching milestones
      </Typography>

      {/* Progress Overview */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            Overall Progress
          </Typography>
          <Typography variant="h6" sx={{ color: '#64b5f6', fontWeight: 700 }}>
            {unlockedCount} / {totalCount}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: '#0a0e27',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#64b5f6',
              borderRadius: 6,
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mt: 1 }}>
          {completionPercentage.toFixed(1)}% Complete
        </Typography>
      </Card>

      {/* Achievements Grid */}
      <Grid container spacing={2}>
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card
              sx={{
                bgcolor: achievement.unlocked ? '#1a1f3a' : '#0f1230',
                p: 3,
                height: '100%',
                border: achievement.unlocked ? `2px solid ${achievement.color}` : '2px solid #2a2f4a',
                opacity: achievement.unlocked ? 1 : 0.7,
                position: 'relative',
                overflow: 'visible',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Rarity Badge */}
              <Chip
                label={achievement.rarity.toUpperCase()}
                size="small"
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: 12,
                  bgcolor: getRarityColor(achievement.rarity),
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />

              {/* Icon */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: `${achievement.color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                }}
              >
                {achievement.unlocked ? (
                  <achievement.icon size={32} style={{ color: achievement.color }} />
                ) : (
                  <Lock size={32} style={{ color: '#8b93a7' }} />
                )}
                {achievement.unlocked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      bgcolor: '#4caf50',
                      borderRadius: '50%',
                      p: 0.5,
                      border: '2px solid #1a1f3a',
                    }}
                  >
                    <CheckCircle size={16} style={{ color: '#fff' }} />
                  </Box>
                )}
              </Box>

              {/* Title & Description */}
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                {achievement.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b93a7', mb: 2, minHeight: 40 }}>
                {achievement.description}
              </Typography>

              {/* Progress or Unlock Date */}
              {achievement.unlocked ? (
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: `${achievement.color}22`,
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: achievement.color, fontWeight: 600 }}>
                    Unlocked {achievement.unlockedDate}
                  </Typography>
                </Box>
              ) : (
                <>
                  {achievement.total && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                          {achievement.progress} / {achievement.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(achievement.progress! / achievement.total) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#0a0e27',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: achievement.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </>
                  )}
                  {achievement.progress && !achievement.total && (
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: '#0a0e27',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                        {achievement.progress}% Complete
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats Summary */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mt: 3 }}>
        {[
          { label: 'Common', count: achievements.filter((a) => a.rarity === 'common' && a.unlocked).length, color: '#8b93a7' },
          { label: 'Uncommon', count: achievements.filter((a) => a.rarity === 'uncommon' && a.unlocked).length, color: '#4caf50' },
          { label: 'Rare', count: achievements.filter((a) => a.rarity === 'rare' && a.unlocked).length, color: '#64b5f6' },
          { label: 'Epic', count: achievements.filter((a) => a.rarity === 'epic' && a.unlocked).length, color: '#9c27b0' },
        ].map((stat, index) => (
          <Card key={index} sx={{ bgcolor: '#1a1f3a', p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700, mb: 0.5 }}>
              {stat.count}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              {stat.label}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
