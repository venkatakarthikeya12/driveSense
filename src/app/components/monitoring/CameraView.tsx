import { Box, Card, Typography, Chip, LinearProgress, Avatar } from '@mui/material';
import { Eye, AlertCircle, CheckCircle, Camera } from 'lucide-react';

export default function CameraView() {
  const eyeClosureLevel = 15;
  const headPoseAngle = 2;
  const attentionScore = 92;
  const isAlert = attentionScore > 80;

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
          Drowsiness Detection
        </Typography>
        <Chip
          icon={isAlert ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          label={isAlert ? 'ALERT' : 'DROWSY'}
          color={isAlert ? 'success' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Camera Feed Simulation */}
      <Card
        sx={{
          bgcolor: '#1a1f3a',
          mb: 3,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: `3px solid ${isAlert ? '#4caf50' : '#f44336'}`,
        }}
      >
        {/* Simulated Camera View */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1f3a 0%, #2a2f4a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Camera size={80} style={{ color: '#8b93a7', opacity: 0.3 }} />

          {/* Face Detection Overlay */}
          <Box
            sx={{
              position: 'absolute',
              border: `2px solid ${isAlert ? '#4caf50' : '#f44336'}`,
              borderRadius: 2,
              width: 200,
              height: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Eye indicators */}
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${isAlert ? '#4caf50' : '#f44336'}`,
                  bgcolor: isAlert ? '#4caf5033' : '#f4433633',
                }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${isAlert ? '#4caf50' : '#f44336'}`,
                  bgcolor: isAlert ? '#4caf5033' : '#f4433633',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: isAlert ? '#4caf50' : '#f44336', fontWeight: 600 }}>
              {isAlert ? 'Eyes Open' : 'Eyes Closing'}
            </Typography>
          </Box>

          {/* Status Indicator */}
          <Chip
            label="LIVE"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: '#f44336',
              color: '#fff',
              fontWeight: 700,
              animation: 'pulse 2s infinite',
            }}
          />
        </Box>
      </Card>

      {/* Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Eye size={20} style={{ color: '#64b5f6' }} />
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              Eye Closure Level
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            {eyeClosureLevel}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={eyeClosureLevel}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#0a0e27',
              '& .MuiLinearProgress-bar': {
                bgcolor: eyeClosureLevel > 30 ? '#f44336' : '#4caf50',
                borderRadius: 3,
              },
            }}
          />
        </Card>

        <Card sx={{ bgcolor: '#1a1f3a', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AlertCircle size={20} style={{ color: '#9c27b0' }} />
            <Typography variant="caption" sx={{ color: '#8b93a7' }}>
              Head Pose Angle
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            {headPoseAngle}°
          </Typography>
          <Typography variant="caption" sx={{ color: '#8b93a7' }}>
            {headPoseAngle < 10 ? 'Straight ahead' : 'Looking away'}
          </Typography>
        </Card>
      </Box>

      {/* Attention Score */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Attention Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              bgcolor: isAlert ? '#4caf5033' : '#f4433633',
              width: 60,
              height: 60,
            }}
          >
            <Typography variant="h5" sx={{ color: isAlert ? '#4caf50' : '#f44336', fontWeight: 700 }}>
              {attentionScore}
            </Typography>
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: '#8b93a7', mb: 1 }}>
              {isAlert
                ? 'You are alert and focused on driving'
                : 'Signs of drowsiness detected. Consider taking a break.'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={attentionScore}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#0a0e27',
                '& .MuiLinearProgress-bar': {
                  bgcolor: isAlert ? '#4caf50' : '#f44336',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>
      </Card>

      {/* Safety Tips */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Drowsiness Prevention Tips
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            'Take a 15-minute break every 2 hours',
            'Get adequate sleep before long drives',
            'Avoid driving during your usual sleep hours',
            'Stay hydrated and avoid heavy meals',
          ].map((tip, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <CheckCircle size={16} style={{ color: '#4caf50', marginTop: 2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                {tip}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
