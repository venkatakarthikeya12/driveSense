import { useState, useEffect } from 'react';
import { Box, Card, Typography, IconButton, Chip, LinearProgress, Avatar, Button } from '@mui/material';
import { Pause, Play, Square, AlertTriangle, Eye, Gauge, Navigation, Timer, TrendingUp, PlayCircle } from 'lucide-react';
import { useDriveSense } from '../../../context/DriveSenseContext';

interface LiveTripProps {
  onEndTrip: () => void;
}

export default function LiveTrip({ onEndTrip }: LiveTripProps) {
  const {
    isTripActive,
    isTripPaused,
    tripDuration,
    tripDistance,
    currentTripScore,
    tripEvents,
    telemetry,
    location,
    startTrip,
    pauseTrip,
    resumeTrip,
    endTrip,
    formatSpeed,
    speedUnitLabel,
  } = useDriveSense();

  const currentSpeed = formatSpeed(telemetry.speed || location.speed || 65);
  const distance = tripDistance;
  const events = tripEvents.length;

  const handleTogglePause = () => {
    if (isTripPaused) {
      resumeTrip();
    } else {
      pauseTrip();
    }
  };

  const handleFinish = async () => {
    await endTrip();
    onEndTrip();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0e27',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status Bar */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#1a1f3a',
          borderBottom: `2px solid ${isTripActive ? (isTripPaused ? '#ff9800' : '#4caf50') : '#2196f3'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: isTripActive ? (isTripPaused ? '#ff9800' : '#4caf50') : '#2196f3',
              animation: isTripActive && !isTripPaused ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            {isTripActive ? (isTripPaused ? 'TRIP PAUSED' : 'TRIP IN PROGRESS') : 'READY FOR TRIP'}
          </Typography>
        </Box>
        {isTripActive ? (
          <Chip
            icon={<Timer size={16} />}
            label={formatTime(tripDuration)}
            sx={{
              bgcolor: '#4caf5033',
              color: '#4caf50',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          />
        ) : (
          <Button
            variant="contained"
            onClick={startTrip}
            startIcon={<PlayCircle size={18} />}
            sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700 }}
          >
            START TRIP
          </Button>
        )}
      </Box>

      {/* Main Speed Display */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          background: 'radial-gradient(circle at center, rgba(100, 181, 246, 0.1) 0%, transparent 70%)',
        }}
      >
        <Typography variant="caption" sx={{ color: '#8b93a7', mb: 1 }}>
          Current Speed
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            fontWeight: 700,
            color: '#64b5f6',
            lineHeight: 1,
            mb: 1,
          }}
        >
          {Math.round(currentSpeed)}
        </Typography>
        <Typography variant="h5" sx={{ color: '#8b93a7' }}>
          {speedUnitLabel}
        </Typography>

        {/* Speed Indicator */}
        <Box sx={{ width: '80%', maxWidth: 400, mt: 4 }}>
          <LinearProgress
            variant="determinate"
            value={(currentSpeed / 120) * 100}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: '#1a1f3a',
              '& .MuiLinearProgress-bar': {
                bgcolor:
                  currentSpeed > 80
                    ? '#f44336'
                    : currentSpeed > 60
                    ? '#ff9800'
                    : '#4caf50',
                borderRadius: 6,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              0
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              120 {speedUnitLabel}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Stats Grid */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            mb: 2,
          }}
        >
          <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUp size={20} style={{ color: '#4caf50' }} />
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Current Score
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700 }}>
              {currentTripScore}
            </Typography>
          </Card>

          <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Navigation size={20} style={{ color: '#64b5f6' }} />
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Distance
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: '#64b5f6', fontWeight: 700 }}>
              {distance.toFixed(1)}
              <Typography component="span" variant="h6" sx={{ color: '#8b93a7', ml: 1 }}>
                km
              </Typography>
            </Typography>
          </Card>

          <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Eye size={20} style={{ color: '#9c27b0' }} />
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Attention
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: '#9c27b0', fontWeight: 700 }}>
              95%
            </Typography>
          </Card>

          <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AlertTriangle size={20} style={{ color: '#ff9800' }} />
              <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                Events
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 700 }}>
              {events}
            </Typography>
          </Card>
        </Box>

        {/* Recent Alerts */}
        <Card sx={{ bgcolor: '#1a1f3a', p: 2, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
            Recent Alerts
          </Typography>
          {tripEvents.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {tripEvents.slice(0, 3).map((ev) => (
                <Box
                  key={ev.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    bgcolor: '#0a0e27',
                    borderRadius: 1,
                    borderLeft: `3px solid ${ev.severity === 'high' ? '#f44336' : '#ff9800'}`,
                  }}
                >
                  <Avatar sx={{ bgcolor: ev.severity === 'high' ? '#f4433633' : '#ff980033', width: 32, height: 32 }}>
                    <AlertTriangle size={16} style={{ color: ev.severity === 'high' ? '#f44336' : '#ff9800' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                      {ev.type.replace('_', ' ')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                      {ev.time} • {ev.location}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#8b93a7', textAlign: 'center', py: 2 }}>
              No alerts yet. Keep driving safely!
            </Typography>
          )}
        </Card>

        {/* Control Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isTripActive ? (
            <>
              <IconButton
                onClick={handleTogglePause}
                sx={{
                  flex: 1,
                  bgcolor: '#1a1f3a',
                  color: isTripPaused ? '#4caf50' : '#ff9800',
                  borderRadius: 2,
                  py: 2,
                  '&:hover': { bgcolor: '#2a2f4a' },
                }}
              >
                {isTripPaused ? <Play size={32} /> : <Pause size={32} />}
              </IconButton>
              <IconButton
                onClick={handleFinish}
                sx={{
                  flex: 3,
                  bgcolor: '#f44336',
                  color: '#fff',
                  borderRadius: 2,
                  py: 2,
                  '&:hover': { bgcolor: '#d32f2f' },
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Square size={24} />
                <Typography variant="button" sx={{ fontWeight: 700 }}>
                  END TRIP
                </Typography>
              </IconButton>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={startTrip}
              size="large"
              sx={{ bgcolor: '#4caf50', py: 2, borderRadius: 2, fontWeight: 700 }}
            >
              START TRIP RECORDING
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

