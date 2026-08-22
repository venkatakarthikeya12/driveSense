import { Box, Card, Typography, LinearProgress, Chip, Button, Avatar } from '@mui/material';
import { Target, Calendar, Trophy, Clock, Award, Zap, TrendingUp, CheckCircle } from 'lucide-react';

export default function Challenges() {
  const dailyChallenges = [
    {
      id: 1,
      title: 'Morning Commute Master',
      description: 'Complete a trip with a score of 85+ before 9 AM',
      reward: '50 XP',
      progress: 0,
      total: 1,
      timeLeft: '3h 45m',
      icon: Calendar,
      color: '#64b5f6',
      completed: false,
    },
    {
      id: 2,
      title: 'Smooth Sailing',
      description: 'Drive without harsh braking for 10 km',
      reward: '30 XP',
      progress: 6.8,
      total: 10,
      timeLeft: '8h 22m',
      icon: Zap,
      color: '#4caf50',
      completed: false,
    },
    {
      id: 3,
      title: 'Speed Limit Respect',
      description: 'Complete 3 trips today without exceeding speed limit',
      reward: '40 XP',
      progress: 2,
      total: 3,
      timeLeft: '5h 15m',
      icon: TrendingUp,
      color: '#ff9800',
      completed: false,
    },
  ];

  const weeklyChallenges = [
    {
      id: 4,
      title: 'Consistency Champion',
      description: 'Maintain an average score above 80 for the entire week',
      reward: '200 XP + Badge',
      progress: 5,
      total: 7,
      timeLeft: '2 days',
      icon: Trophy,
      color: '#9c27b0',
      completed: false,
    },
    {
      id: 5,
      title: 'Distance Warrior',
      description: 'Drive a total of 150 km this week',
      reward: '150 XP',
      progress: 87.4,
      total: 150,
      timeLeft: '3 days',
      icon: Target,
      color: '#f44336',
      completed: false,
    },
  ];

  const completedChallenges = [
    {
      id: 6,
      title: 'Perfect Start',
      description: 'Complete first trip of the day with score 90+',
      reward: '40 XP',
      completedDate: 'Today, 8:45 AM',
      icon: Award,
      color: '#4caf50',
    },
    {
      id: 7,
      title: 'Attention Master',
      description: 'Maintain attention score above 95% for entire trip',
      reward: '35 XP',
      completedDate: 'Yesterday, 6:30 PM',
      icon: CheckCircle,
      color: '#64b5f6',
    },
  ];

  const totalXP = 1450;
  const levelXP = 2000;
  const currentLevel = 7;

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
        Challenges
      </Typography>
      <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
        Complete challenges to earn XP and unlock rewards
      </Typography>

      {/* Level Progress */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%)',
                width: 56,
                height: 56,
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {currentLevel}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                Level {currentLevel}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Advanced Driver
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ color: '#64b5f6', fontWeight: 700 }}>
              {totalXP} XP
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              {levelXP - totalXP} to next level
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(totalXP / levelXP) * 100}
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: '#0a0e27',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #64b5f6 0%, #9c27b0 100%)',
              borderRadius: 6,
            },
          }}
        />
      </Card>

      {/* Daily Challenges */}
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Clock size={24} style={{ color: '#64b5f6' }} />
        Daily Challenges
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {dailyChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            sx={{
              bgcolor: '#1a1f3a',
              p: 3,
              borderLeft: `4px solid ${challenge.color}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: `${challenge.color}33`, width: 48, height: 48 }}>
                <challenge.icon size={24} style={{ color: challenge.color }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {challenge.title}
                  </Typography>
                  <Chip
                    icon={<Clock size={12} />}
                    label={challenge.timeLeft}
                    size="small"
                    sx={{
                      bgcolor: '#0a0e27',
                      color: '#8b93a7',
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#8b93a7', mb: 1 }}>
                  {challenge.description}
                </Typography>
                <Chip
                  label={challenge.reward}
                  size="small"
                  sx={{
                    bgcolor: `${challenge.color}33`,
                    color: challenge.color,
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                {challenge.progress} / {challenge.total} {challenge.total > 10 ? 'km' : ''}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(challenge.progress / challenge.total) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#0a0e27',
                '& .MuiLinearProgress-bar': {
                  bgcolor: challenge.color,
                  borderRadius: 4,
                },
              }}
            />
          </Card>
        ))}
      </Box>

      {/* Weekly Challenges */}
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Trophy size={24} style={{ color: '#ffd700' }} />
        Weekly Challenges
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {weeklyChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            sx={{
              bgcolor: '#1a1f3a',
              p: 3,
              borderLeft: `4px solid ${challenge.color}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: `${challenge.color}33`, width: 48, height: 48 }}>
                <challenge.icon size={24} style={{ color: challenge.color }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {challenge.title}
                  </Typography>
                  <Chip
                    icon={<Calendar size={12} />}
                    label={challenge.timeLeft}
                    size="small"
                    sx={{
                      bgcolor: '#0a0e27',
                      color: '#8b93a7',
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#8b93a7', mb: 1 }}>
                  {challenge.description}
                </Typography>
                <Chip
                  label={challenge.reward}
                  size="small"
                  sx={{
                    bgcolor: `${challenge.color}33`,
                    color: challenge.color,
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                {challenge.progress} / {challenge.total} {challenge.total > 10 ? 'km' : 'days'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(challenge.progress / challenge.total) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#0a0e27',
                '& .MuiLinearProgress-bar': {
                  bgcolor: challenge.color,
                  borderRadius: 4,
                },
              }}
            />
          </Card>
        ))}
      </Box>

      {/* Completed Today */}
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle size={24} style={{ color: '#4caf50' }} />
        Completed
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {completedChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            sx={{
              bgcolor: '#1a1f3a',
              p: 2,
              border: '2px solid #4caf50',
              opacity: 0.8,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: `${challenge.color}33`, width: 40, height: 40 }}>
                <challenge.icon size={20} style={{ color: challenge.color }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                  {challenge.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                  {challenge.completedDate}
                </Typography>
              </Box>
              <Chip
                label={challenge.reward}
                size="small"
                sx={{
                  bgcolor: '#4caf5033',
                  color: '#4caf50',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
