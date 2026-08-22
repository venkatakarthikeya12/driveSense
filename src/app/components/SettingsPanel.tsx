import { useState } from 'react';
import { Card, CardContent, Box, Typography, Switch, FormControlLabel, Button, Divider, Slider, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import { Bell, Camera, Volume2, MapPin, Database, Shield, Info, Play, Square, PhoneCall, Plus, Trash2, Sliders, AlertCircle, Compass, Download } from 'lucide-react';
import { useDriveSense } from '../../context/DriveSenseContext';

interface SettingsPanelProps {
  onTripToggle: () => void;
  isTripActive: boolean;
}

export default function SettingsPanel({ onTripToggle, isTripActive: propActive }: SettingsPanelProps) {
  const {
    isTripActive,
    startTrip,
    endTrip,
    preferences,
    updatePreferences,
    emergencyContacts,
    updateEmergencyContacts,
    installApp,
  } = useDriveSense();

  const activeTrip = isTripActive || propActive;

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  const [seatBeltAlertsEnabled, setSeatBeltAlertsEnabled] = useState(true);
  const [speedAlertsEnabled, setSpeedAlertsEnabled] = useState(true);
  const [safetyAlertsEnabled, setSafetyAlertsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleTripToggleAction = async () => {
    if (activeTrip) {
      await endTrip();
    } else {
      startTrip();
    }
    onTripToggle();
  };

  const handleSpeedUnitChange = (unit: 'kmh' | 'mph') => {
    updatePreferences({
      ...preferences,
      speedUnit: unit,
    });
  };

  const handleAddContact = async () => {
    if (!newContactName || !newContactPhone) return;
    const newContact = {
      id: 'c-' + Date.now(),
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation,
      isPrimary: emergencyContacts.length === 0,
    };
    await updateEmergencyContacts([...emergencyContacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setContactDialogOpen(false);
  };

  const handleDeleteContact = async (id: string) => {
    await updateEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <Box className="ds-animate-fadeInUp" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, mb: 0.5, letterSpacing: 0.5 }}>
          Settings &amp; Configuration
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          DriveSense Black &amp; Royal Gold Luxury Automotive Preferences
        </Typography>
        <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
      </Box>

      {/* Trip Monitoring Control Card */}
      <Card
        className="ds-card-glow ds-animate-fadeInUp ds-delay-100"
        sx={{
          bgcolor: '#0e0e0e',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          mb: 3, borderRadius: 3,
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#D4AF37' }}>
                Trip Telemetry Engine
              </Typography>
              <Typography variant="body2" sx={{ color: '#888' }}>
                {activeTrip ? 'Live vehicle telemetry is actively recording' : 'Start trip monitoring to record CAN bus telematics'}
              </Typography>
            </Box>
            {activeTrip ? <Square size={24} color="#E53935" /> : <Play size={24} color="#D4AF37" />}
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleTripToggleAction}
            sx={{
              py: 1.5,
              background: activeTrip
                ? 'linear-gradient(135deg, #c62828 0%, #E53935 100%)'
                : 'linear-gradient(135deg, #B8960C 0%, #D4AF37 100%)',
              color: activeTrip ? '#FFFFFF' : '#050505',
              fontWeight: 800,
              letterSpacing: 0.8,
              boxShadow: activeTrip ? '0 0 20px rgba(229, 57, 53, 0.35)' : '0 0 20px rgba(212, 175, 55, 0.35)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: activeTrip
                  ? 'linear-gradient(135deg, #E53935 0%, #ef5350 100%)'
                  : 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                transform: 'translateY(-1px)',
                boxShadow: activeTrip ? '0 0 32px rgba(229,57,53,0.5)' : '0 0 32px rgba(255,215,0,0.5)',
              },
              '&:active': { transform: 'translateY(1px)' },
            }}
          >
            {activeTrip ? 'STOP TRIP MONITORING' : 'START TRIP MONITORING'}
          </Button>
        </CardContent>
      </Card>

      {/* 0. App Download & Installation */}
      <Card
        className="ds-animate-fadeInUp ds-delay-100"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.3)',
          mb: 3, borderRadius: 3, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.95) 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(212,175,55,0.15)', borderRadius: 2, p: 1.2, display: 'flex', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Download size={24} color="#FFD700" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>Install DriveSense Application</Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Install as a standalone native app on Mobile (Android / iOS) &amp; PC (Windows / Mac)
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={installApp}
              startIcon={<Download size={18} />}
              sx={{
                bgcolor: '#D4AF37',
                color: '#050505',
                fontWeight: 800,
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: '0 0 16px rgba(212,175,55,0.35)',
                '&:hover': { bgcolor: '#FFD700', boxShadow: '0 0 24px rgba(255,215,0,0.5)' },
              }}
            >
              Install App Now
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 1. Theme Setting */}
      <Card
        className="ds-animate-fadeInUp ds-delay-200"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)',
          mb: 3, borderRadius: 3, position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <Compass size={20} color="#D4AF37" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>Theme Settings</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(5,5,5,0.8)', borderRadius: 2, border: '1px solid rgba(212, 175, 55, 0.15)' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#FFD700' }}>
                Black + Royal Gold Luxury Automotive
              </Typography>
              <Typography variant="caption" sx={{ color: '#777' }}>
                Active Default Theme (70% Black, 20% White/Gray, 10% Royal Gold)
              </Typography>
            </Box>
            <Chip label="ACTIVE" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 800, boxShadow: '0 0 10px rgba(212,175,55,0.4)' }} />
          </Box>
        </CardContent>
      </Card>

      {/* 2. Notifications & Safety Alerts Settings */}
      <Card
        className="ds-animate-fadeInUp ds-delay-300"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)',
          mb: 3, borderRadius: 3, position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <Bell size={20} color="#D4AF37" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>Notifications &amp; Safety Alerts</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[
              { label: 'Enable System Notifications', state: notificationsEnabled, setter: setNotificationsEnabled },
              { label: 'Driving Safety & Collision Risk Alerts', state: safetyAlertsEnabled, setter: setSafetyAlertsEnabled },
              { label: 'Seat Belt Safety Warnings (Driver & Passenger)', state: seatBeltAlertsEnabled, setter: setSeatBeltAlertsEnabled },
              { label: 'Overspeeding Limit Alerts', state: speedAlertsEnabled, setter: setSpeedAlertsEnabled },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  px: 2, py: 1,
                  borderRadius: 2,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: 'rgba(212,175,55,0.04)' },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#FFD700' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#D4AF37' },
                      }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>{item.label}</Typography>}
                />
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2.5, borderColor: 'rgba(212, 175, 55, 0.12)' }} />

          <Box>
            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>Alert Chime Volume</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Volume2 size={20} color="#D4AF37" />
              <Slider defaultValue={80} sx={{ color: '#D4AF37', '& .MuiSlider-thumb': { boxShadow: '0 0 8px rgba(212,175,55,0.5)' } }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 3. Account Settings */}
      <Card
        className="ds-animate-fadeInUp ds-delay-400"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)',
          mb: 3, borderRadius: 3, position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <Shield size={20} color="#D4AF37" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>Account &amp; Vehicle Profile</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#888', mb: 2.5 }}>
            Registered Driver: <strong style={{ color: '#FFFFFF' }}>Alex Morgan</strong> (alex.morgan@drivesense.io)
          </Typography>

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#777' }}>Speed Measurement Units</InputLabel>
            <Select
              value={preferences.speedUnit}
              onChange={(e) => handleSpeedUnitChange(e.target.value as 'kmh' | 'mph')}
              label="Speed Measurement Units"
              sx={{
                bgcolor: 'rgba(5,5,5,0.8)', color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              }}
            >
              <MenuItem value="kmh">Kilometers per hour (KM/H)</MenuItem>
              <MenuItem value="mph">Miles per hour (MPH)</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* 4. Emergency Contacts */}
      <Card
        className="ds-animate-fadeInUp ds-delay-500"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)',
          mb: 3, borderRadius: 3, position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #E53935 40%, #EF5350 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: 'rgba(229,57,53,0.12)', borderRadius: 2, p: 1, display: 'flex' }}>
                <PhoneCall size={20} color="#E53935" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>Emergency Contacts</Typography>
            </Box>
            <Button
              size="small"
              startIcon={<Plus size={16} />}
              onClick={() => setContactDialogOpen(true)}
              sx={{
                color: '#FFD700', fontWeight: 700,
                border: '1px solid rgba(212,175,55,0.3)',
                px: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'rgba(212,175,55,0.08)', borderColor: '#FFD700' },
              }}
            >
              Add Contact
            </Button>
          </Box>

          <List disablePadding>
            {emergencyContacts.map((contact) => (
              <ListItem
                key={contact.id}
                secondaryAction={
                  <IconButton size="small" onClick={() => handleDeleteContact(contact.id)}
                    sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(229,57,53,0.15)', transform: 'scale(1.1)' } }}
                  >
                    <Trash2 size={16} color="#E53935" />
                  </IconButton>
                }
                sx={{
                  px: 1.5, py: 1.2,
                  borderRadius: 2, mb: 0.5,
                  border: '1px solid rgba(212,175,55,0.1)',
                  bgcolor: 'rgba(5,5,5,0.6)',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.25)' },
                }}
              >
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF' }}>{contact.name} ({contact.relation})</Typography>}
                  secondary={<Typography variant="caption" sx={{ color: '#777' }}>{contact.phone}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* 5. About DriveSense */}
      <Card
        className="ds-card-glow"
        sx={{
          bgcolor: '#0e0e0e', border: '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: 3, position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 2, p: 1, mr: 1.5, display: 'flex' }}>
              <Info size={20} color="#D4AF37" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>About DriveSense</Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 800, mb: 0.5 }}>
            DriveSense – Intelligent Driving Behavior Analyzer v2.4 PRO
          </Typography>
          <Typography variant="body2" sx={{ color: '#777', lineHeight: 1.7 }}>
            Luxury automotive telematics &amp; driver safety platform. Powered by CAN bus OBD-II integration, real-time sensor processing, and machine learning fuel prediction engines.
          </Typography>
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#0B0B0B', color: '#FFD700', fontWeight: 800 }}>Add Emergency Contact</DialogTitle>
        <DialogContent sx={{ bgcolor: '#0B0B0B', pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 280 }}>
            <TextField
              label="Contact Name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              fullWidth
              required
              sx={{ '& .MuiInputBase-root': { color: '#FFF' }, '& .MuiInputLabel-root': { color: '#B8B8B8' } }}
            />
            <TextField
              label="Phone Number"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              fullWidth
              required
              sx={{ '& .MuiInputBase-root': { color: '#FFF' }, '& .MuiInputLabel-root': { color: '#B8B8B8' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0B0B0B', p: 2 }}>
          <Button onClick={() => setContactDialogOpen(false)} sx={{ color: '#B8B8B8' }}>
            Cancel
          </Button>
          <Button onClick={handleAddContact} variant="contained" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 800 }}>
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
