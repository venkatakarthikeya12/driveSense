import { useState } from 'react';
import { Box, Card, Typography, Tabs, Tab, Avatar, Chip, LinearProgress } from '@mui/material';
import { Trophy, TrendingUp, Users, Globe, Medal } from 'lucide-react';

export default function Leaderboard() {
  const [tab, setTab] = useState(0);

  const globalLeaders = [
    { rank: 1, name: 'Sarah Johnson', score: 96, trips: 145, badge: 'legend', avatar: 'SJ', change: 0 },
    { rank: 2, name: 'Mike Chen', score: 94, trips: 132, badge: 'master', avatar: 'MC', change: 1 },
    { rank: 3, name: 'Emma Wilson', score: 93, trips: 128, badge: 'master', avatar: 'EW', change: -1 },
    { rank: 4, name: 'James Brown', score: 91, trips: 156, badge: 'expert', avatar: 'JB', change: 2 },
    { rank: 5, name: 'Lisa Davis', score: 90, trips: 143, badge: 'expert', avatar: 'LD', change: 0 },
    { rank: 12, name: 'You', score: 78, trips: 23, badge: 'intermediate', avatar: 'ME', change: 3, isUser: true },
  ];

  const friendsLeaders = [
    { rank: 1, name: 'Alex Kumar', score: 88, trips: 67, badge: 'expert', avatar: 'AK', change: 0 },
    { rank: 2, name: 'Rachel Green', score: 85, trips: 54, badge: 'advanced', avatar: 'RG', change: 1 },
    { rank: 3, name: 'You', score: 78, trips: 23, badge: 'intermediate', avatar: 'ME', change: 1, isUser: true },
    { rank: 4, name: 'Tom Wilson', score: 72, trips: 45, badge: 'intermediate', avatar: 'TW', change: -2 },
    { rank: 5, name: 'Nina Patel', score: 68, trips: 32, badge: 'novice', avatar: 'NP', change: 0 },
  ];

  const localLeaders = [
    { rank: 1, name: 'David Lee', score: 92, trips: 98, badge: 'master', avatar: 'DL', change: 0 },
    { rank: 2, name: 'Sophie Martinez', score: 89, trips: 87, badge: 'expert', avatar: 'SM', change: 1 },
    { rank: 3, name: 'You', score: 78, trips: 23, badge: 'intermediate', avatar: 'ME', change: 2, isUser: true },
  ];

  const leaders = tab === 0 ? globalLeaders : tab === 1 ? friendsLeaders : localLeaders;

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'legend':
        return '#ffd700';
      case 'master':
        return '#9c27b0';
      case 'expert':
        return '#64b5f6';
      case 'advanced':
        return '#4caf50';
      case 'intermediate':
        return '#ff9800';
      case 'novice':
        return '#8b93a7';
      default:
        return '#8b93a7';
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} style={{ color: '#ffd700' }} />;
    if (rank === 2) return <Medal size={24} style={{ color: '#c0c0c0' }} />;
    if (rank === 3) return <Medal size={24} style={{ color: '#cd7f32' }} />;
    return null;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
        Leaderboard
      </Typography>
      <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
        Compete with drivers around the world
      </Typography>

      {/* User Rank Card */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3, border: '2px solid #64b5f6' }}>
        <Typography variant="subtitle2" sx={{ color: '#8b93a7', mb: 2 }}>
          Your Current Rank
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2" sx={{ color: '#64b5f6', fontWeight: 700 }}>
              #{leaders.find((l) => l.isUser)?.rank}
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                Score: {leaders.find((l) => l.isUser)?.score}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                {leaders.find((l) => l.isUser)?.trips} trips completed
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<TrendingUp size={16} />}
            label={`+${leaders.find((l) => l.isUser)?.change} this week`}
            sx={{
              bgcolor: '#4caf5033',
              color: '#4caf50',
              fontWeight: 600,
            }}
          />
        </Box>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#2a2f4a', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          sx={{
            '& .MuiTab-root': {
              color: '#8b93a7',
              textTransform: 'none',
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#64b5f6',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#64b5f6',
            },
          }}
        >
          <Tab icon={<Globe size={16} />} iconPosition="start" label="Global" />
          <Tab icon={<Users size={16} />} iconPosition="start" label="Friends" />
          <Tab icon={<Users size={16} />} iconPosition="start" label="Local" />
        </Tabs>
      </Box>

      {/* Leaderboard List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {leaders.map((leader, index) => (
          <Card
            key={index}
            sx={{
              bgcolor: leader.isUser ? '#64b5f633' : '#1a1f3a',
              p: 2,
              border: leader.isUser ? '2px solid #64b5f6' : 'none',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Rank */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getMedalIcon(leader.rank) || (
                  <Typography variant="h6" sx={{ color: '#8b93a7', fontWeight: 700 }}>
                    #{leader.rank}
                  </Typography>
                )}
              </Box>

              {/* Avatar */}
              <Avatar
                sx={{
                  bgcolor: getBadgeColor(leader.badge),
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                {leader.avatar}
              </Avatar>

              {/* Info */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                    {leader.name}
                  </Typography>
                  {leader.isUser && (
                    <Chip label="YOU" size="small" sx={{ bgcolor: '#64b5f6', color: '#fff', height: 20, fontSize: '0.7rem' }} />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                  {leader.trips} trips • {leader.badge}
                </Typography>
              </Box>

              {/* Score */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ color: '#64b5f6', fontWeight: 700 }}>
                  {leader.score}
                </Typography>
                {leader.change !== 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                    <TrendingUp
                      size={12}
                      style={{
                        color: leader.change > 0 ? '#4caf50' : '#f44336',
                        transform: leader.change < 0 ? 'rotate(180deg)' : 'none',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: leader.change > 0 ? '#4caf50' : '#f44336',
                        fontWeight: 600,
                      }}
                    >
                      {Math.abs(leader.change)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Next Rank Progress */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
          Next Rank: Advanced Driver
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#8b93a7' }}>
            Current: 78
          </Typography>
          <Typography variant="caption" sx={{ color: '#8b93a7' }}>
            Required: 85
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(78 / 85) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#0a0e27',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#4caf50',
              borderRadius: 4,
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mt: 1 }}>
          7 more points needed
        </Typography>
      </Card>
    </Box>
  );
}
