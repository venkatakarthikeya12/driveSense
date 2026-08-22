import { useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Stepper, Step, StepLabel, TextField, Select, MenuItem, FormControl, InputLabel, Avatar } from '@mui/material';
import { Car, Smartphone, Camera, Target, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');

  const steps = ['Welcome', 'Vehicle Info', 'Permissions', 'Goals', 'Complete'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              sx={{
                bgcolor: '#64b5f6',
                width: 80,
                height: 80,
                margin: '0 auto 24px',
              }}
            >
              <Car size={40} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Welcome to DriveSense!
            </Typography>
            <Typography variant="body1" sx={{ color: '#8b93a7', mb: 3, maxWidth: 500, mx: 'auto' }}>
              Let's get you set up in just a few steps. We'll configure your vehicle, set up permissions, and establish your driving goals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
              {[
                { icon: Smartphone, text: 'No Hardware' },
                { icon: Camera, text: 'AI Monitoring' },
                { icon: Target, text: 'Personal Goals' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: '#0a0e27',
                    borderRadius: 2,
                    minWidth: 120,
                  }}
                >
                  <feature.icon size={32} style={{ color: '#64b5f6', marginBottom: 8 }} />
                  <Typography variant="caption" sx={{ color: '#8b93a7' }}>
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Tell us about your vehicle
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
              This helps us provide more accurate analysis
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#8b93a7' }}>Vehicle Type</InputLabel>
                <Select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  label="Vehicle Type"
                  sx={{
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#2a2f4a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64b5f6' },
                  }}
                >
                  <MenuItem value="sedan">Sedan</MenuItem>
                  <MenuItem value="suv">SUV</MenuItem>
                  <MenuItem value="truck">Truck</MenuItem>
                  <MenuItem value="motorcycle">Motorcycle</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Make (e.g., Toyota)"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#2a2f4a' },
                    '&:hover fieldset': { borderColor: '#64b5f6' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b93a7' },
                }}
              />

              <TextField
                fullWidth
                label="Model (e.g., Camry)"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#2a2f4a' },
                    '&:hover fieldset': { borderColor: '#64b5f6' },
                  },
                  '& .MuiInputLabel-root': { color: '#8b93a7' },
                }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#8b93a7' }}>Driving Experience</InputLabel>
                <Select
                  value={drivingExperience}
                  onChange={(e) => setDrivingExperience(e.target.value)}
                  label="Driving Experience"
                  sx={{
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#2a2f4a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64b5f6' },
                  }}
                >
                  <MenuItem value="beginner">Beginner (0-2 years)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (2-5 years)</MenuItem>
                  <MenuItem value="experienced">Experienced (5+ years)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Grant Permissions
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
              DriveSense needs these permissions to analyze your driving
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {
                  icon: Smartphone,
                  title: 'Motion Sensors',
                  desc: 'Accelerometer and gyroscope for detecting braking, acceleration, and cornering',
                  required: true,
                },
                {
                  icon: Target,
                  title: 'Location Services',
                  desc: 'GPS for speed tracking, route recording, and location-based insights',
                  required: true,
                },
                {
                  icon: Camera,
                  title: 'Camera Access',
                  desc: 'Front camera for drowsiness detection (optional but recommended)',
                  required: false,
                },
              ].map((permission, index) => (
                <Card
                  key={index}
                  sx={{
                    bgcolor: '#0a0e27',
                    p: 2,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Avatar sx={{ bgcolor: '#64b5f633' }}>
                    <permission.icon size={24} style={{ color: '#64b5f6' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {permission.title}
                      {permission.required && (
                        <Typography component="span" sx={{ color: '#f44336', ml: 1, fontSize: '0.75rem' }}>
                          Required
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b93a7', fontSize: '0.875rem' }}>
                      {permission.desc}
                    </Typography>
                  </Box>
                  <CheckCircle size={24} style={{ color: '#4caf50' }} />
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Set Your Goals
            </Typography>
            <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
              What would you like to achieve with DriveSense?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { title: 'Improve Safety Score', desc: 'Achieve a safety score of 90+' },
                { title: 'Reduce Harsh Events', desc: 'Minimize harsh braking and acceleration' },
                { title: 'Better Fuel Efficiency', desc: 'Drive smoother to save fuel' },
                { title: 'Stay Alert', desc: 'Monitor drowsiness on long drives' },
              ].map((goal, index) => (
                <Card
                  key={index}
                  sx={{
                    bgcolor: '#0a0e27',
                    p: 2,
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    '&:hover': {
                      borderColor: '#64b5f6',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {goal.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#8b93a7' }}>
                    {goal.desc}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle size={80} style={{ color: '#4caf50', marginBottom: 24 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              You're All Set!
            </Typography>
            <Typography variant="body1" sx={{ color: '#8b93a7', mb: 3 }}>
              DriveSense is ready to help you become a safer, smarter driver.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0e27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ bgcolor: '#1a1f3a', color: '#fff', maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': { color: '#8b93a7' },
              '& .MuiStepLabel-label.Mui-active': { color: '#64b5f6' },
              '& .MuiStepLabel-label.Mui-completed': { color: '#4caf50' },
              '& .MuiStepIcon-root': { color: '#2a2f4a' },
              '& .MuiStepIcon-root.Mui-active': { color: '#64b5f6' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {activeStep > 0 && activeStep < steps.length - 1 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  color: '#8b93a7',
                  borderColor: '#2a2f4a',
                  '&:hover': { borderColor: '#64b5f6' },
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              fullWidth
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%)',
                fontWeight: 600,
              }}
            >
              {activeStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
