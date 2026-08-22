import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, InputAdornment, Alert } from '@mui/material';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
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
      <Card sx={{ bgcolor: '#1a1f3a', color: '#fff', maxWidth: 480, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={onBack}
            sx={{ color: '#8b93a7', mb: 3, textTransform: 'none' }}
          >
            Back to Login
          </Button>

          {!submitted ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b93a7', mb: 4 }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: '#2a2f4a' },
                      '&:hover fieldset': { borderColor: '#64b5f6' },
                      '&.Mui-focused fieldset': { borderColor: '#64b5f6' },
                    },
                    '& .MuiInputLabel-root': { color: '#8b93a7' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} style={{ color: '#8b93a7' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%)',
                    fontWeight: 600,
                  }}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle size={64} style={{ color: '#4caf50', marginBottom: 16 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Check Your Email
              </Typography>
              <Typography variant="body2" sx={{ color: '#8b93a7', mb: 3 }}>
                We've sent password reset instructions to <strong>{email}</strong>
              </Typography>
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{
                  color: '#64b5f6',
                  borderColor: '#64b5f6',
                  '&:hover': { borderColor: '#5ca5e6', bgcolor: '#0a0e27' },
                }}
              >
                Return to Login
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
