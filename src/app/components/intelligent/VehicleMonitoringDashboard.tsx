import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress, Avatar, Alert } from '@mui/material';
import {
  Gauge,
  Users,
  Fuel,
  Navigation as NavigationIcon,
  AlertTriangle,
  Shield,
  Radio,
  MapPin,
  GitBranch,
  Volume2,
  Activity,
  Car,
  Eye,
} from 'lucide-react';

export default function VehicleMonitoringDashboard() {
  // Simulated sensor data with realistic variations
  const [speed, setSpeed] = useState(45);
  const [rpm, setRpm] = useState(2200);
  const [gear, setGear] = useState(3);
  const [passengers, setPassengers] = useState(2);
  const [fuelLevel, setFuelLevel] = useState(68);
  const [direction, setDirection] = useState('North');
  const [directionDegree, setDirectionDegree] = useState(0);
  const [inLane, setInLane] = useState(true);
  const [trafficDensity, setTrafficDensity] = useState<'Low' | 'Medium' | 'Heavy'>('Medium');
  const [seatBelts, setSeatBelts] = useState({ driver: true, passenger: true, rear: false });
  const [handbrakeOn, setHandbrakeOn] = useState(false);
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate speed changes — use functional updater to avoid stale closure
      setSpeed((prevSpeed) => {
        const newSpeed = Math.max(0, Math.min(120, prevSpeed + (Math.random() - 0.5) * 10));

        // RPM derived from the fresh speed value
        setRpm(Math.max(800, Math.min(6000, newSpeed * 50 + Math.random() * 500)));

        // Gear derived from fresh speed
        if (newSpeed === 0)       setGear(0);
        else if (newSpeed < 15)   setGear(1);
        else if (newSpeed < 30)   setGear(2);
        else if (newSpeed < 50)   setGear(3);
        else if (newSpeed < 70)   setGear(4);
        else                      setGear(5);

        // Fuel consumption
        if (newSpeed > 0) setFuelLevel((prev) => Math.max(0, prev - 0.01));

        return newSpeed;
      });

      // Direction derived from fresh directionDegree
      setDirectionDegree((prevDeg) => {
        const newDeg = (prevDeg + Math.random() * 5) % 360;
        if (newDeg < 45 || newDeg >= 315) setDirection('North');
        else if (newDeg < 135)            setDirection('East');
        else if (newDeg < 225)            setDirection('South');
        else                              setDirection('West');
        return newDeg;
      });

      // Lane detection
      setInLane(Math.random() > 0.1);

      // Traffic density
      const trafficRand = Math.random();
      if (trafficRand < 0.3)      setTrafficDensity('Low');
      else if (trafficRand < 0.7) setTrafficDensity('Medium');
      else                        setTrafficDensity('Heavy');
    }, 2000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGearDisplay = () => {
    if (gear === 0) return 'N';
    return `${gear}`;
  };

  const getTrafficColor = () => {
    switch (trafficDensity) {
      case 'Low': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Heavy': return '#f44336';
      default: return '#666';
    }
  };

  const alerts: { type: 'error' | 'warning' | 'info' | 'success'; message: string }[] = [
    ...(fuelLevel < 20 ? [{ type: 'warning' as const, message: `Low Fuel Alert! ${fuelLevel.toFixed(0)}% remaining` }] : []),
    ...(!inLane && speed > 30 ? [{ type: 'error' as const, message: 'Lane Departure Warning! Return to lane' }] : []),
    ...(!seatBelts.driver ? [{ type: 'error' as const, message: 'Driver Seat Belt Not Fastened!' }] : []),
    ...(!seatBelts.passenger && passengers > 1 ? [{ type: 'warning' as const, message: 'Passenger Seat Belt Warning' }] : []),
    ...(handbrakeOn && speed > 5 ? [{ type: 'error' as const, message: 'DANGER: Driving with Handbrake Engaged!' }] : []),
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Dashboard Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 1 }}>
          Intelligent Car Monitoring System
        </Typography>
        <Typography variant="body1" sx={{ color: '#888' }}>
          AI-Powered Real-Time Vehicle &amp; Driver Monitoring
        </Typography>
      </Box>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type}
              icon={<AlertTriangle size={24} />}
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: '1rem',
                animation: 'alertPulse 1s ease-in-out infinite',
                '@keyframes alertPulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.02)' },
                },
              }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Gear Detection System */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GitBranch size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Gear Detection
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 800, mb: 1 }}>
                  {getGearDisplay()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {gear === 0 ? 'Neutral' : `Gear ${gear}`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Speed: {speed.toFixed(0)} km/h</Typography>
                  <Typography variant="caption">RPM: {rpm.toFixed(0)}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(rpm / 6000) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: rpm > 4500 ? '#f44336' : '#fff',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Passenger Detection */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Users size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Passenger Detection
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 800, mb: 1 }}>
                  {passengers}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {passengers === 1 ? 'Person' : 'People'} Detected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip label="Driver" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: '#fff' }} />
                  {passengers > 1 && <Chip label="Front Pass." size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: '#fff' }} />}
                  {passengers > 2 && <Chip label="Rear" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: '#fff' }} />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Fuel Monitoring */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Fuel size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Fuel Level
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 800, mb: 1 }}>
                  {fuelLevel.toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {fuelLevel > 50 ? 'Good Level' : fuelLevel > 20 ? 'Moderate' : 'Low Fuel!'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={fuelLevel}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: fuelLevel < 20 ? '#f44336' : '#fff',
                      borderRadius: 6
                    }
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                  Estimated Range: {(fuelLevel * 5).toFixed(0)} km
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Direction & Movement */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(67, 233, 123, 0.3)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NavigationIcon size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Direction
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  position: 'relative',
                  border: '4px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  mb: 2
                }}>
                  <NavigationIcon
                    size={48}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${directionDegree}deg)`,
                      transition: 'transform 0.5s'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {direction}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {directionDegree.toFixed(0)}° from North
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lane Detection */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: `3px solid ${inLane ? '#4caf50' : '#f44336'}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Eye size={24} style={{ color: inLane ? '#4caf50' : '#f44336', marginRight: 8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Lane Detection (Computer Vision)
                  </Typography>
                </Box>
                <Chip
                  label={inLane ? 'IN LANE' : 'LANE DEPARTURE'}
                  sx={{
                    bgcolor: inLane ? '#e8f5e9' : '#ffebee',
                    color: inLane ? '#4caf50' : '#f44336',
                    border: `2px solid ${inLane ? '#4caf50' : '#f44336'}`,
                    fontWeight: 700,
                    fontSize: '1rem',
                    animation: !inLane ? 'alertPulse 1s ease-in-out infinite' : 'none',
                  }}
                />
              </Box>
              <Box sx={{ height: 150, bgcolor: '#f5f7fa', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                {/* Lane visualization */}
                <svg width="100%" height="100%" viewBox="0 0 400 150">
                  {/* Road */}
                  <rect x="0" y="0" width="400" height="150" fill="#666" />

                  {/* Lane lines */}
                  <line x1="100" y1="0" x2="100" y2="150" stroke="#fff" strokeWidth="3" strokeDasharray="10,10">
                    <animate attributeName="y1" values="0;20;0" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="150;170;150" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="300" y1="0" x2="300" y2="150" stroke="#fff" strokeWidth="3" strokeDasharray="10,10">
                    <animate attributeName="y1" values="0;20;0" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="150;170;150" dur="1s" repeatCount="indefinite" />
                  </line>

                  {/* Center dashed line */}
                  <line x1="200" y1="0" x2="200" y2="150" stroke="#ffd700" strokeWidth="2" strokeDasharray="15,10">
                    <animate attributeName="y1" values="0;25;0" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="150;175;150" dur="1s" repeatCount="indefinite" />
                  </line>

                  {/* Car */}
                  <rect x={inLane ? "175" : "320"} y="100" width="50" height="30" rx="5" fill={inLane ? "#2196f3" : "#f44336"}>
                    {!inLane && <animate attributeName="x" values="320;315;320" dur="0.5s" repeatCount="indefinite" />}
                  </rect>
                </svg>
              </Box>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                AI analyzing lane boundaries using computer vision algorithms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Detection */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: `3px solid ${getTrafficColor()}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Radio size={24} style={{ color: getTrafficColor(), marginRight: 8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Traffic Density Analysis
                  </Typography>
                </Box>
                <Chip
                  label={`${trafficDensity} Traffic`}
                  sx={{
                    bgcolor: `${getTrafficColor()}15`,
                    color: getTrafficColor(),
                    border: `2px solid ${getTrafficColor()}`,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                {['Low', 'Medium', 'Heavy'].map((level) => (
                  <Grid item xs={4} key={level}>
                    <Box sx={{
                      p: 2,
                      bgcolor: trafficDensity === level ? `${getTrafficColor()}15` : '#f5f7fa',
                      border: `2px solid ${trafficDensity === level ? getTrafficColor() : 'transparent'}`,
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: trafficDensity === level ? getTrafficColor() : '#666' }}>
                        {level}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                        {Array.from({ length: level === 'Low' ? 1 : level === 'Medium' ? 2 : 3 }).map((_, i) => (
                          <Car key={i} size={16} style={{ color: trafficDensity === level ? getTrafficColor() : '#666' }} />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 2 }}>
                AI Camera analyzing surrounding vehicles and traffic patterns
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Seat Belt System */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '3px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Shield size={24} style={{ color: '#ff9800', marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  Seat Belt Alert System
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{
                    p: 2,
                    bgcolor: seatBelts.driver ? '#e8f5e9' : '#ffebee',
                    border: `2px solid ${seatBelts.driver ? '#4caf50' : '#f44336'}`,
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Shield size={32} style={{ color: seatBelts.driver ? '#4caf50' : '#f44336', marginBottom: 8 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Driver
                    </Typography>
                    <Chip
                      label={seatBelts.driver ? 'Fastened' : 'NOT FASTENED'}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: seatBelts.driver ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{
                    p: 2,
                    bgcolor: seatBelts.passenger ? '#e8f5e9' : '#ffebee',
                    border: `2px solid ${seatBelts.passenger ? '#4caf50' : '#f44336'}`,
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Shield size={32} style={{ color: seatBelts.passenger ? '#4caf50' : '#f44336', marginBottom: 8 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Front Pass.
                    </Typography>
                    <Chip
                      label={seatBelts.passenger ? 'Fastened' : 'NOT FASTENED'}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: seatBelts.passenger ? '#4caf50' : '#f44336',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{
                    p: 2,
                    bgcolor: seatBelts.rear ? '#e8f5e9' : '#f5f7fa',
                    border: `2px solid ${seatBelts.rear ? '#4caf50' : '#e0e0e0'}`,
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Shield size={32} style={{ color: seatBelts.rear ? '#4caf50' : '#666', marginBottom: 8 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Rear Seats
                    </Typography>
                    <Chip
                      label={seatBelts.rear ? 'Fastened' : 'Not Used'}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: seatBelts.rear ? '#4caf50' : '#e0e0e0',
                        color: seatBelts.rear ? '#fff' : '#666',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Handbrake Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: `3px solid ${handbrakeOn ? '#f44336' : '#4caf50'}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Activity size={24} style={{ color: handbrakeOn ? '#f44336' : '#4caf50', marginRight: 8 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Handbrake Status
                  </Typography>
                </Box>
                <Chip
                  label={handbrakeOn ? 'ENGAGED' : 'RELEASED'}
                  sx={{
                    bgcolor: handbrakeOn ? '#ffebee' : '#e8f5e9',
                    color: handbrakeOn ? '#f44336' : '#4caf50',
                    border: `2px solid ${handbrakeOn ? '#f44336' : '#4caf50'}`,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    py: 2,
                    px: 3,
                  }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    margin: '0 auto',
                    borderRadius: '50%',
                    bgcolor: handbrakeOn ? '#ffebee' : '#e8f5e9',
                    border: `4px solid ${handbrakeOn ? '#f44336' : '#4caf50'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: handbrakeOn && speed > 5 ? 'alertPulse 1s ease-in-out infinite' : 'none',
                  }}
                >
                  <Activity size={48} style={{ color: handbrakeOn ? '#f44336' : '#4caf50' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, color: handbrakeOn ? '#f44336' : '#4caf50' }}>
                  Handbrake {handbrakeOn ? 'ON' : 'OFF'}
                </Typography>
                {handbrakeOn && speed > 5 && (
                  <Alert severity="error" sx={{ mt: 2, fontWeight: 600 }}>
                    WARNING: Release handbrake before driving!
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GPS Location */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '3px solid #2196f3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MapPin size={24} style={{ color: '#2196f3', marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  GPS Location Tracking
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                      Current Location
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                      📍 San Francisco, CA
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, flex: 1, textAlign: 'center' }}>
                      <Gauge size={24} style={{ color: '#2196f3', marginBottom: 4 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                        {speed.toFixed(0)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        km/h
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, flex: 1, textAlign: 'center' }}>
                      <NavigationIcon size={24} style={{ color: '#4caf50', marginBottom: 4 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {direction}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Heading
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ height: 200, bgcolor: '#e8f4f8', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  🗺️ Map Visualization - GPS Route Tracking Active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
