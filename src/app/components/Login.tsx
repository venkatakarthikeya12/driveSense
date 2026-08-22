import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Divider, IconButton, InputAdornment, Checkbox, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import { Mail, Lock, Eye, EyeOff, Car, Shield, Smartphone, Zap, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onLogin?: () => void;
  onNavigateForgotPassword?: () => void;
}

export default function Login({ onLogin, onNavigateForgotPassword }: LoginProps) {
  const { login, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(name, email, password);
      } else {
        await login(email, password, rememberMe);
      }
      if (onLogin) onLogin();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await login('driver.demo@google.com', 'password123', true);
      if (onLogin) onLogin();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  // Floating particles for the login background
  const loginParticles = [
    { size: 5, top: '8%', left: '5%', delay: '0s', dur: '5s' },
    { size: 3, top: '25%', left: '92%', delay: '1s', dur: '4.5s' },
    { size: 6, top: '70%', left: '3%', delay: '0.5s', dur: '4s' },
    { size: 4, top: '85%', left: '88%', delay: '1.5s', dur: '5.5s' },
    { size: 3, top: '50%', left: '95%', delay: '2s', dur: '3.8s' },
    { size: 5, top: '15%', left: '50%', delay: '0.8s', dur: '4.8s' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050505',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated radial background */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 25%, rgba(212,175,55,0.13) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(212,175,55,0.07) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      {loginParticles.map((p, i) => (
        <Box
          key={i}
          className="ds-splash-particle"
          sx={{ width: p.size, height: p.size, top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
        />
      ))}

      <Box sx={{ maxWidth: 1100, width: '100%', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>

          {/* Left Side – Branding (staggered entrance) */}
          <Box className="ds-animate-slideLeft" sx={{ flex: 1, color: '#FFFFFF', textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {/* Logo with ripple */}
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box className="ds-ripple-1" sx={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '1.5px solid rgba(212,175,55,0.4)', pointerEvents: 'none' }} />
                <Box
                  className="ds-pulse-ring"
                  sx={{
                    bgcolor: '#050505',
                    border: '2px solid #D4AF37',
                    borderRadius: '50%',
                    width: 60, height: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Compass size={32} color="#FFD700" />
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  className="ds-gold-text"
                  sx={{ fontWeight: 900, letterSpacing: 1 }}
                >
                  DriveSense
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', letterSpacing: 2.5, fontWeight: 700, textTransform: 'uppercase' }}>
                  INTELLIGENT DRIVING BEHAVIOR ANALYZER
                </Typography>
              </Box>
            </Box>

            <Typography variant="h4" className="ds-animate-fadeInUp ds-delay-200" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
              Precision Driving &amp; Vehicle Intelligence
            </Typography>

            <Typography variant="body1" className="ds-animate-fadeInUp ds-delay-300" sx={{ color: '#999', mb: 4, maxWidth: 500, lineHeight: 1.75 }}>
              Experience luxury automotive telemetry analysis. Access real-time CAN bus monitoring, AI driver drowsiness protection, fuel analytics, and safety scores.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: Smartphone, text: 'Real-Time OBD-II CAN Bus Telematics', color: '#FFD700', delay: 'ds-delay-300' },
                { icon: Zap, text: 'Real-Time Driver Behavior Alerts', color: '#D4AF37', delay: 'ds-delay-400' },
                { icon: Eye, text: 'AI Drowsiness Detection System', color: '#E6C65C', delay: 'ds-delay-500' },
                { icon: Shield, text: 'Privately Encrypted Telemetry Logs', color: '#35C759', delay: 'ds-delay-600' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  className={`ds-animate-fadeInUp ds-card-glow ${feature.delay}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'rgba(18,18,18,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.18)',
                    p: 1.75,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: '#050505',
                      border: '1px solid #D4AF37',
                      borderRadius: '50%',
                      width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <feature.icon size={17} style={{ color: feature.color }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Side – Login Card (glassmorphism) */}
          <Box className="ds-animate-slideRight" sx={{ flex: 1, maxWidth: 460, width: '100%' }}>
            <Card
              className="ds-border-animated"
              sx={{
                background: 'rgba(14,14,14,0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.95), 0 0 24px rgba(212,175,55,0.1)',
                borderRadius: 4,
                border: '1px solid rgba(212,175,55,0.3)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent 0%, #D4AF37 40%, #FFD700 60%, transparent 100%)',
                  opacity: 0.8,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: '#FFFFFF' }}>
                  {isSignUp ? 'Create Account' : 'Driver Portal Sign In'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#777', mb: 3, textAlign: 'center' }}>
                  {isSignUp ? 'Enter your credentials to register vehicle' : 'Access your DriveSense telemetry dashboard'}
                </Typography>

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 3, bgcolor: '#050505', color: '#E53935', border: '1px solid #E53935' }}>
                    {errorMessage}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {isSignUp && (
                      <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={{
                          '& .MuiInputBase-root': { bgcolor: 'rgba(5,5,5,0.8)', color: '#FFFFFF' },
                          '& .MuiInputLabel-root': { color: '#777' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                            '&:hover fieldset': { borderColor: '#D4AF37' },
                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Car size={18} style={{ color: '#D4AF37' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{
                        '& .MuiInputBase-root': { bgcolor: 'rgba(5,5,5,0.8)', color: '#FFFFFF' },
                        '& .MuiInputLabel-root': { color: '#777' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                          '&:hover fieldset': { borderColor: '#D4AF37' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} style={{ color: '#D4AF37' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      sx={{
                        '& .MuiInputBase-root': { bgcolor: 'rgba(5,5,5,0.8)', color: '#FFFFFF' },
                        '& .MuiInputLabel-root': { color: '#777' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                          '&:hover fieldset': { borderColor: '#D4AF37' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={18} style={{ color: '#D4AF37' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#777', '&:hover': { color: '#D4AF37' } }}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {!isSignUp && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#FFD700' } }} />}
                          label={
                            <Typography variant="body2" sx={{ color: '#888' }}>
                              Remember me
                            </Typography>
                          }
                        />
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => { if (onNavigateForgotPassword) onNavigateForgotPassword(); }}
                          sx={{ color: '#D4AF37', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#FFD700' } }}
                        >
                          Forgot Password?
                        </Button>
                      </Box>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: loading ? '#555' : 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                        color: '#050505',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        letterSpacing: 0.8,
                        boxShadow: '0 0 20px rgba(212,175,55,0.35)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFD700 0%, #E6C65C 100%)',
                          boxShadow: '0 0 32px rgba(255,215,0,0.55)',
                          transform: 'translateY(-1px)',
                        },
                        '&:active': { transform: 'translateY(1px)' },
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : isSignUp ? 'CREATE DRIVER ACCOUNT' : 'SIGN IN TO DASHBOARD'}
                    </Button>

                    <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.18)', my: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#555' }}>OR</Typography>
                    </Divider>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      sx={{
                        py: 1.2,
                        color: '#FFFFFF',
                        bgcolor: 'rgba(5,5,5,0.6)',
                        backdropFilter: 'blur(8px)',
                        borderColor: 'rgba(212, 175, 55, 0.28)',
                        textTransform: 'none',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#D4AF37',
                          bgcolor: 'rgba(212,175,55,0.08)',
                          color: '#FFD700',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Continue with Google
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#777' }}>
                        {isSignUp ? 'Already registered?' : 'New driver?'}{' '}
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setIsSignUp(!isSignUp)}
                          sx={{ color: '#FFD700', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                        >
                          {isSignUp ? 'Sign In' : 'Create Account'}
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

