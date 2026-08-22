import { useState, useId } from 'react';
import { Card, CardContent, Box, Typography, Grid, Chip, TextField, InputAdornment, MenuItem, Select, IconButton, Button } from '@mui/material';
import { Calendar, Clock, MapPin, TrendingUp, Search, Download, Trash2, Filter, Gauge, Zap, ChevronRight, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDriveSense } from '../../context/DriveSenseContext';
import { pdfService } from '../../services/pdfService';
import { aiAnalysisService } from '../../services/aiAnalysisService';

interface TripHistoryProps {
  onSelectTrip?: (tripId: string) => void;
}

export default function TripHistory({ onSelectTrip }: TripHistoryProps) {
  const uid = useId().replace(/:/g, '');
  const { trips, deleteTrip, setSelectedTripId, formatSpeed, speedUnitLabel } = useDriveSense();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState('all');

  const report = aiAnalysisService.generateFullReport(trips);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#FFD700';
    if (score >= 60) return '#D4AF37';
    return '#E53935';
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.endLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.date.includes(searchQuery);

    if (filterScore === 'high') return matchesSearch && t.drivingScore >= 80;
    if (filterScore === 'medium') return matchesSearch && t.drivingScore >= 60 && t.drivingScore < 80;
    if (filterScore === 'low') return matchesSearch && t.drivingScore < 60;
    return matchesSearch;
  });

  const averageScore = trips.length > 0
    ? Math.round(trips.reduce((acc, trip) => acc + trip.drivingScore, 0) / trips.length)
    : 92;
  const totalDistance = trips.reduce((acc, trip) => acc + trip.distanceKm, 0).toFixed(1);
  const totalTrips = trips.length;

  const handleTripClick = (tripId: string) => {
    setSelectedTripId(tripId);
    if (onSelectTrip) {
      onSelectTrip(tripId);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      <Box className="ds-animate-fadeInUp" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, letterSpacing: 0.5 }}>
              Trip History Log
            </Typography>
            <Chip label="LOCAL STORAGE" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 10 }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#888' }}>
            DriveSense Historical Stage 1 Telemetry &amp; Performance Logs
          </Typography>
          <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: 'AVERAGE DRIVING SCORE', value: `${averageScore}`, unit: '/ 100', color: '#FFD700', icon: TrendingUp, delay: '0.1s' },
          { label: 'TOTAL DISTANCE LOGGED', value: `${totalDistance}`, unit: 'KM', color: '#FFFFFF', icon: MapPin, delay: '0.2s' },
          { label: 'COMPLETED TRIPS', value: `${totalTrips}`, unit: '', color: '#FFFFFF', icon: Calendar, delay: '0.3s' },
        ].map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Card
              className="ds-card-glow ds-animate-fadeInUp"
              style={{ animationDelay: stat.delay }}
              sx={{
                bgcolor: '#0e0e0e',
                border: '1px solid rgba(212, 175, 55, 0.28)',
                color: '#FFFFFF',
                boxShadow: '0 4px 24px rgba(0,0,0,0.8)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#888', fontWeight: 600, mb: 0.5, fontSize: '0.72rem', letterSpacing: 1 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color }}>
                      {stat.value}{' '}
                      {stat.unit && <Typography component="span" variant="caption" sx={{ color: '#777' }}>{stat.unit}</Typography>}
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.7 }}>
                    <stat.icon size={44} color="#D4AF37" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter and Search controls */}
      <Card
        sx={{
          background: 'rgba(14,14,14,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          mb: 3, borderRadius: 3, p: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <TextField
            placeholder="Search trips by location or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            sx={{
              '& .MuiInputBase-root': { bgcolor: 'rgba(5,5,5,0.8)', color: '#FFFFFF' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                '&:hover fieldset': { borderColor: '#D4AF37' },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#D4AF37" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
            <Filter size={18} color="#D4AF37" />
            <Select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              size="small"
              fullWidth
              sx={{
                bgcolor: 'rgba(5,5,5,0.8)',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.25)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
              }}
            >
              <MenuItem value="all">All Scores</MenuItem>
              <MenuItem value="high">Score 80+ (Safe)</MenuItem>
              <MenuItem value="medium">Score 60 - 79</MenuItem>
              <MenuItem value="low">Score &lt; 60 (Risk)</MenuItem>
            </Select>
          </Box>
        </Box>
      </Card>

      {/* Trip List Cards */}
      <Card
        sx={{
          bgcolor: '#0e0e0e',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#FFFFFF' }}>
            Trip Records ({filteredTrips.length})
          </Typography>

          {filteredTrips.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" sx={{ color: '#555' }}>
                No trips match your search criteria.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredTrips.map((trip, idx) => {
                const avgSpeedFormatted = formatSpeed(trip.avgSpeedKmh || 46);
                const maxSpeedFormatted = formatSpeed(trip.maxSpeedKmh || 82);
                const durationMins = Math.round(trip.durationSeconds / 60) || 24;
                const scoreColor = getScoreColor(trip.drivingScore);

                return (
                  <Box
                    key={trip.id}
                    className="ds-animate-fadeInUp"
                    onClick={() => handleTripClick(trip.id)}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                    sx={{
                      p: 3,
                      bgcolor: '#050505',
                      borderRadius: 3,
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      borderLeft: `4px solid ${scoreColor}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                      '&:hover': {
                        borderColor: 'rgba(212,175,55,0.5)',
                        transform: 'translateX(6px)',
                        boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 12px ${scoreColor}22`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 260 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                            {trip.startLocation} → {trip.endLocation}
                          </Typography>
                          <Chip label="View Details" size="small" icon={<Eye size={12} color="#D4AF37" />} sx={{ bgcolor: 'rgba(212,175,55,0.1)', color: '#FFD700', fontSize: 10, fontWeight: 700 }} />
                        </Box>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', letterSpacing: 0.5 }}>Date</Typography>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>{trip.date}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', letterSpacing: 0.5 }}>Duration</Typography>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>{durationMins} min</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', letterSpacing: 0.5 }}>Distance</Typography>
                            <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 700 }}>{trip.distanceKm} km</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', letterSpacing: 0.5 }}>Avg / Max Speed</Typography>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                              {avgSpeedFormatted} / <span style={{ color: '#FFD700' }}>{maxSpeedFormatted} {speedUnitLabel}</span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Driving Score & Actions */}
                      <Box sx={{ textAlign: 'right', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            px: 2, py: 1,
                            borderRadius: 2,
                            bgcolor: `${scoreColor}15`,
                            border: `1px solid ${scoreColor}40`,
                            boxShadow: `0 0 12px ${scoreColor}20`,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: '#777', fontWeight: 700, display: 'block', letterSpacing: 1, fontSize: '0.65rem' }}>
                            SCORE
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: scoreColor, lineHeight: 1.2 }}>
                            {trip.drivingScore}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <IconButton
                            size="small"
                            title="Export PDF Report"
                            onClick={(e) => {
                              e.stopPropagation();
                              pdfService.exportTripPDF(trip);
                            }}
                            sx={{
                              color: '#050505', bgcolor: '#D4AF37',
                              transition: 'all 0.2s ease',
                              '&:hover': { bgcolor: '#FFD700', transform: 'scale(1.1)', boxShadow: '0 0 12px rgba(255,215,0,0.4)' },
                            }}
                          >
                            <Download size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Delete Trip"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTrip(trip.id);
                            }}
                            sx={{
                              color: '#E53935', bgcolor: 'rgba(229,57,53,0.1)',
                              '&:hover': { bgcolor: 'rgba(229,57,53,0.2)', transform: 'scale(1.1)' },
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
