import { useState } from 'react';
import { Box, Card, Typography, Avatar, Chip, Button, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Edit, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Star, Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDriveSense } from '../../../context/DriveSenseContext';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { trips } = useDriveSense();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'John Doe');
  const [editPhone, setEditPhone] = useState(user?.phone || '+1 (555) 123-4567');
  const [editLocation, setEditLocation] = useState(user?.location || 'San Francisco, CA');
  const [editPhotoURL, setEditPhotoURL] = useState(user?.photoURL || '');

  // Calculate live user stats from recorded trips
  const totalTripsCount = (user?.totalTrips || 0) + trips.length;
  const totalDistanceSum = parseFloat(((user?.totalDistance || 0) + trips.reduce((acc, t) => acc + t.distanceKm, 0)).toFixed(1));
  const avgScore = trips.length > 0
    ? Math.round(trips.reduce((acc, t) => acc + t.drivingScore, 0) / trips.length)
    : (user?.averageScore || 81);

  const displayUser = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'San Francisco, CA',
    joinDate: user?.joinDate || 'January 15, 2026',
    level: user?.level || 7,
    xp: user?.xp || 1450,
    totalTrips: totalTripsCount,
    totalDistance: totalDistanceSum,
    averageScore: avgScore,
    rank: user?.rank || '#142',
    badges: user?.badges || ['Week Warrior', 'Perfect Score', 'Safety Champion'],
    photoURL: user?.photoURL || '',
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      name: editName,
      phone: editPhone,
      location: editLocation,
      photoURL: editPhotoURL,
    });
    setEditOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = displayUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Box sx={{ p: 3, bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Profile Header */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={displayUser.photoURL || undefined}
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#64b5f6',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {!displayUser.photoURL && initials}
            </Avatar>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                  {displayUser.name}
                </Typography>
                <Chip
                  label={`Level ${displayUser.level} • Advanced Driver`}
                  sx={{
                    bgcolor: '#64b5f633',
                    color: '#64b5f6',
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={() => setEditOpen(true)}
                startIcon={<Edit size={18} />}
                sx={{
                  color: '#64b5f6',
                  borderColor: '#64b5f6',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#5ca5e6', bgcolor: '#0a0e27' },
                }}
              >
                Edit Profile
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={16} style={{ color: '#8b93a7' }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  {displayUser.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone size={16} style={{ color: '#8b93a7' }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  {displayUser.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={16} style={{ color: '#8b93a7' }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  {displayUser.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} style={{ color: '#8b93a7' }} />
                <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                  Joined {displayUser.joinDate}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {displayUser.badges.slice(0, 3).map((badge, index) => (
                <Chip
                  key={index}
                  icon={<Award size={14} />}
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: '#ffd70033',
                    color: '#ffd700',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TrendingUp size={24} style={{ color: '#4caf50' }} />
            <Typography variant="body2" sx={{ color: '#8b93a7' }}>
              Average Score
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700 }}>
            {displayUser.averageScore}
          </Typography>
        </Card>

        <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Star size={24} style={{ color: '#ffd700' }} />
            <Typography variant="body2" sx={{ color: '#8b93a7' }}>
              Global Rank
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#ffd700', fontWeight: 700 }}>
            {displayUser.rank}
          </Typography>
        </Card>
      </Box>

      {/* Driving Stats */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
          Driving Statistics
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 0.5 }}>
              Total Trips
            </Typography>
            <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>
              {displayUser.totalTrips}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 0.5 }}>
              Total Distance
            </Typography>
            <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>
              {displayUser.totalDistance.toLocaleString()}
              <Typography component="span" variant="body2" sx={{ color: '#8b93a7', ml: 1 }}>
                km
              </Typography>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 0.5 }}>
              Experience Points
            </Typography>
            <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
              {displayUser.xp} XP
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mb: 0.5 }}>
              Achievements
            </Typography>
            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
              {displayUser.badges.length}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Level Progress */}
      <Card sx={{ bgcolor: '#1a1f3a', p: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
          Level Progress
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#8b93a7' }}>
            Level {displayUser.level}
          </Typography>
          <Typography variant="body2" sx={{ color: '#8b93a7' }}>
            Level {displayUser.level + 1}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(displayUser.xp / 2000) * 100}
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
        <Typography variant="caption" sx={{ color: '#8b93a7', display: 'block', mt: 1 }}>
          {displayUser.xp} / 2000 XP • {2000 - displayUser.xp} XP to next level
        </Typography>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{ sx: { bgcolor: '#1a1f3a', color: '#fff', minWidth: 320 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={editPhotoURL || undefined} sx={{ width: 64, height: 64, bgcolor: '#64b5f6' }}>
                {!editPhotoURL && initials}
              </Avatar>
              <Button variant="outlined" component="label" startIcon={<Camera size={18} />} sx={{ color: '#64b5f6', borderColor: '#64b5f6' }}>
                Upload Photo
                <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
              </Button>
            </Box>

            <TextField
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              sx={{ input: { color: '#fff' }, label: { color: '#8b93a7' }, '& .MuiOutlinedInput-root': { fieldset: { borderColor: '#2a2f4a' } } }}
            />
            <TextField
              label="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              fullWidth
              sx={{ input: { color: '#fff' }, label: { color: '#8b93a7' }, '& .MuiOutlinedInput-root': { fieldset: { borderColor: '#2a2f4a' } } }}
            />
            <TextField
              label="Location"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              fullWidth
              sx={{ input: { color: '#fff' }, label: { color: '#8b93a7' }, '& .MuiOutlinedInput-root': { fieldset: { borderColor: '#2a2f4a' } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: '#8b93a7' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} variant="contained" sx={{ bgcolor: '#64b5f6' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

