import { useState } from 'react';
import { Card, CardContent, Box, Typography, Chip, Grid, Button, Alert } from '@mui/material';
import {
  AlertTriangle,
  TrendingUp,
  Car,
  Gauge,
  Navigation,
  Shield,
  Zap,
  Thermometer,
  BatteryCharging,
  Fuel,
  Activity,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useDriveSense } from '../../context/DriveSenseContext';
import { aiAnalysisService } from '../../services/aiAnalysisService';

// Custom Gold-Themed Area Chart
function WeeklyAreaChart({ data }: { data: { day: string; score: number }[] }) {
  const W = 500, H = 240, PL = 40, PR = 20, PT = 16, PB = 36;
  const w = W - PL - PR, h = H - PT - PB;
  const minV = 0, maxV = 100;
  const xs = data.map((_, i) => PL + (i / (data.length - 1)) * w);
  const ys = data.map((d) => PT + h - ((d.score - minV) / (maxV - minV)) * h);
  const area = [
    `M ${xs[0]} ${ys[0]}`,
    ...xs.slice(1).map((x, i) => {
      const cpx = (xs[i] + x) / 2;
      return `C ${cpx} ${ys[i]}, ${cpx} ${ys[i + 1]}, ${x} ${ys[i + 1]}`;
    }),
    `L ${xs[xs.length - 1]} ${PT + h} L ${xs[0]} ${PT + h} Z`,
  ].join(' ');
  const line = [
    `M ${xs[0]} ${ys[0]}`,
    ...xs.slice(1).map((x, i) => {
      const cpx = (xs[i] + x) / 2;
      return `C ${cpx} ${ys[i]}, ${cpx} ${ys[i + 1]}, ${x} ${ys[i + 1]}`;
    }),
  ].join(' ');
  const yTicks = [0, 25, 50, 75, 100];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }}>
      <defs>
        <linearGradient id="gold-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {yTicks.map((v) => {
        const y = PT + h - ((v - minV) / (maxV - minV)) * h;
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={PL + w} y2={y} stroke="rgba(212, 175, 55, 0.15)" strokeDasharray="4 3" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#B8B8B8">{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => (
        <text key={d.day} x={xs[i]} y={PT + h + 20} textAnchor="middle" fontSize={11} fill="#B8B8B8" fontWeight="600">{d.day}</text>
      ))}
      <path d={area} fill="url(#gold-area-grad)" />
      <path d={line} fill="none" stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.day + i}>
          <circle cx={xs[i]} cy={ys[i]} r={5} fill="#050505" stroke="#FFD700" strokeWidth={2.5} />
          <title>{d.day}: {d.score}</title>
        </g>
      ))}
    </svg>
  );
}

// Custom Gold Radar Chart
function BehaviorRadarChart({ data }: { data: { behavior: string; score: number; fullMark: number }[] }) {
  const CX = 150, CY = 130, R = 90;
  const N = data.length;
  const levels = [25, 50, 75, 100];
  const angleOf = (i: number) => (i / N) * 2 * Math.PI - Math.PI / 2;
  const pt = (i: number, val: number, max: number) => {
    const r = (val / max) * R;
    const a = angleOf(i);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  };
  const dataPts = data.map((d, i) => pt(i, d.score, d.fullMark));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <svg viewBox="0 0 300 260" style={{ width: '100%', height: 260 }}>
      {levels.map((lv) => (
        <polygon
          key={lv}
          points={Array.from({ length: N }, (_, i) => pt(i, lv, 100)).map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(212, 175, 55, 0.15)"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const p = pt(i, 100, 100);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(212, 175, 55, 0.2)" strokeWidth={1} />;
      })}
      <path d={dataPath} fill="rgba(212, 175, 55, 0.25)" stroke="#FFD700" strokeWidth={2} />
      {dataPts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#FFD700" />
          <text
            x={CX + (R + 18) * Math.cos(angleOf(i))}
            y={CY + (R + 18) * Math.sin(angleOf(i)) + 4}
            textAnchor="middle"
            fontSize={10}
            fill="#B8B8B8"
            fontWeight="600"
          >
            {data[i].behavior}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Speedometer Gauge Component
function SpeedometerGauge({ speed, rpm, gear, speedUnit }: { speed: number; rpm: number; gear: string; speedUnit: string }) {
  const maxSpeed = 160;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const angle = -120 + (clampedSpeed / maxSpeed) * 240;

  return (
    <Box sx={{ position: 'relative', width: 220, height: 220, mx: 'auto', my: 2 }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="8" />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#speed-grad)"
          strokeWidth="8"
          strokeDasharray="400"
          strokeDashoffset={400 - (clampedSpeed / maxSpeed) * 320}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <defs>
          <linearGradient id="speed-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8A6D1D" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${angle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="35" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="7" fill="#050505" stroke="#FFD700" strokeWidth="3" />
        </g>
      </svg>
      <Box sx={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFD700', lineHeight: 1 }}>
          {speed}
        </Typography>
        <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, letterSpacing: 1.5 }}>
          {speedUnit}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Chip label={`GEAR ${gear}`} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.2)', color: '#FFD700', fontWeight: 800, fontSize: 10 }} />
          <Chip label={`${rpm} RPM`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', fontWeight: 700, fontSize: 10 }} />
        </Box>
      </Box>
    </Box>
  );
}

function CircularDrivingScore({ score, label }: { score: number; label: string }) {
  const getScoreColor = (val: number) => (val >= 90 ? '#35C759' : val >= 75 ? '#FFD700' : '#E53935');
  const color = getScoreColor(score);
  return (
    <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', my: 1 }}>
      <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray="314"
          strokeDashoffset={314 - (score / 100) * 314}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
          {score}
        </Typography>
        <Typography variant="caption" sx={{ color, fontWeight: 800, letterSpacing: 1, fontSize: '0.65rem' }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

interface DashboardProps {
  isActive?: boolean;
  onNavigate?: (view: any) => void;
}

export default function Dashboard({ isActive: propActive, onNavigate }: DashboardProps) {
  const {
    telemetry,
    isTripActive,
    currentTripScore,
    trips,
    formatSpeed,
    speedUnitLabel,
    startTrip,
    endTrip,
    toggleDriverSeatBelt,
    togglePassengerSeatBelt,
  } = useDriveSense();

  const isActive = propActive !== undefined ? propActive : isTripActive;
  const currentSpeed = formatSpeed(telemetry.speed || 0);
  const currentRpm = telemetry.rpm || 850;
  const currentGear = telemetry.currentGear || 'P';
  const fuelLevel = Math.round(telemetry.fuelLevel || 72);
  const coolantTemp = telemetry.coolantTemp || 88;
  const batteryVoltage = telemetry.batteryVoltage || 13.8;
  const totalDistance = telemetry.distanceTravelled || 12.4;

  const healthScore = telemetry.vehicleHealthScore || 94;
  const healthStatus = telemetry.vehicleHealthStatus || 'Excellent';

  const safetyScore = isTripActive ? currentTripScore : (trips.length > 0 ? trips[0].drivingScore : 92);
  const scoreLabel = safetyScore >= 90 ? 'SAFE' : safetyScore >= 75 ? 'NORMAL' : safetyScore >= 60 ? 'AGGRESSIVE' : 'DANGEROUS';

  const report = aiAnalysisService.generateFullReport(trips);

  const behaviorData = [
    { behavior: 'Braking', score: report.brakingScore, fullMark: 100 },
    { behavior: 'Acceleration', score: report.accelerationScore, fullMark: 100 },
    { behavior: 'Cornering', score: report.corneringScore, fullMark: 100 },
    { behavior: 'Speed Control', score: report.speedControlScore, fullMark: 100 },
    { behavior: 'Attention', score: report.attentionScore, fullMark: 100 },
  ];

  const weeklyData = report.trends;

  const driverBelt = telemetry.driverSeatBelt ?? false;
  const passengerBelt = telemetry.passengerSeatBelt ?? false;
  const isMovingWithUnfastenedBelt = currentSpeed > 10 && (telemetry.driverOccupied && !driverBelt || telemetry.passengerOccupied && !passengerBelt);

  const vehicleStats = [
    { label: 'Speed', value: `${currentSpeed} ${speedUnitLabel}`, icon: Gauge, targetView: 'live-monitoring' },
    { label: 'RPM', value: `${currentRpm}`, icon: Activity, targetView: 'live-monitoring' },
    { label: 'Gear', value: `GEAR ${currentGear}`, icon: Zap, targetView: 'live-monitoring' },
    { label: 'Fuel', value: `${fuelLevel}%`, icon: Fuel, targetView: 'fuel-prediction' },
    { label: 'Engine Temp', value: `${coolantTemp} °C`, icon: Thermometer, targetView: 'intelligent-monitoring' },
    { label: 'Battery', value: `${batteryVoltage} V`, icon: BatteryCharging, targetView: 'intelligent-monitoring' },
    { label: 'Distance', value: `${totalDistance.toFixed(1)} km`, icon: Navigation, targetView: 'location-tracking' },
  ];

  return (
    <Box sx={{ bgcolor: '#050505', color: '#FFFFFF', minHeight: '100vh', pb: 4 }}>
      {/* Header Banner with Stage 1 Demo Badges */}
      <Box className="ds-animate-fadeInUp" sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: 0.5 }}>
              Vehicle Dashboard
            </Typography>
            <Chip label="DEMO MODE" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 11 }} />
            <Chip label="SIMULATED VEHICLE DATA" size="small" sx={{ bgcolor: 'rgba(212,175,55,0.18)', color: '#FFD700', border: '1px solid rgba(212,175,55,0.4)', fontWeight: 700, fontSize: 10 }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
            DriveSense Real-Time Stage 1 Telematics &amp; Vehicle Diagnostics Simulator
          </Typography>
          <Box sx={{ mt: 1, width: 60, height: 2, background: 'linear-gradient(90deg, #D4AF37, transparent)', borderRadius: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!isTripActive ? (
            <Button
              variant="contained"
              startIcon={<Play size={18} />}
              onClick={startTrip}
              sx={{
                bgcolor: '#FFD700',
                color: '#050505',
                fontWeight: 800,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                '&:hover': { bgcolor: '#D4AF37' },
              }}
            >
              START TRIP
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Square size={18} />}
              onClick={() => endTrip()}
              sx={{
                bgcolor: '#E53935',
                color: '#FFFFFF',
                fontWeight: 800,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                '&:hover': { bgcolor: '#C62828' },
              }}
            >
              STOP TRIP
            </Button>
          )}

          {isActive && (
            <Chip
              icon={<Car size={16} color="#050505" />}
              label="TRIP ACTIVE"
              sx={{
                bgcolor: '#D4AF37',
                color: '#050505',
                fontWeight: 800,
                px: 1,
                py: 2.2,
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
                animation: 'ds-borderGlow 2s ease-in-out infinite',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Prominent Seat Belt Warning Banner if moving and unfastened */}
      {isMovingWithUnfastenedBelt && (
        <Alert
          severity="error"
          icon={<AlertTriangle size={24} color="#E53935" />}
          sx={{
            mb: 4,
            bgcolor: '#121212',
            color: '#FFFFFF',
            border: '2px solid #E53935',
            borderRadius: 3,
            boxShadow: '0 0 20px rgba(229, 57, 53, 0.35)',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#E53935', mb: 0.5 }}>
            ⚠ SEAT BELT SAFETY ALERT DETECTED
          </Typography>
          <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
            Vehicle is moving at <strong>{currentSpeed} {speedUnitLabel}</strong> while occupant seat belt is NOT FASTENED. Please fasten all seat belts!
          </Typography>
        </Alert>
      )}

      {/* Main Dashboard Hero Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Speedometer Instrument Gauge */}
        <Grid item xs={12} md={6} lg={5}>
          <Card
            className="ds-card-glow ds-animate-fadeInUp ds-delay-100"
            onClick={() => onNavigate?.('live-monitoring')}
            sx={{
              bgcolor: '#0e0e0e',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 3,
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              '&:hover': { transform: 'translateY(-3px)', borderColor: '#FFD700' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                Main Instrument Cluster
              </Typography>
              <Chip label="LIVE STREAM" size="small" icon={<Radio size={12} color="#35C759" />} sx={{ bgcolor: 'rgba(53,199,89,0.1)', color: '#35C759', fontSize: 10, fontWeight: 700 }} />
            </Box>
            <SpeedometerGauge
              speed={currentSpeed}
              rpm={currentRpm}
              gear={String(currentGear)}
              speedUnit={speedUnitLabel}
            />
            <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              Click to Open Live Monitoring <ArrowRight size={14} />
            </Typography>
          </Card>
        </Grid>

        {/* Driving Score & Vehicle Health */}
        <Grid item xs={12} md={6} lg={7}>
          <Grid container spacing={3}>
            {/* Driving Score Component */}
            <Grid item xs={12} sm={6}>
              <Card
                className="ds-card-glow ds-animate-fadeInUp ds-delay-200"
                onClick={() => onNavigate?.('behavior-analysis')}
                sx={{
                  bgcolor: '#0e0e0e',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': { transform: 'translateY(-3px)', borderColor: '#FFD700' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 1, textTransform: 'uppercase' }}>
                  Driving Behavior Score
                </Typography>
                <CircularDrivingScore score={safetyScore} label={scoreLabel} />
                <Typography variant="caption" sx={{ display: 'block', color: '#777', mt: 1, lineHeight: 1.4 }}>
                  Driver Classification: <strong style={{ color: '#FFD700' }}>{scoreLabel}</strong>
                </Typography>
              </Card>
            </Grid>

            {/* Vehicle Health Card */}
            <Grid item xs={12} sm={6}>
              <Card
                className="ds-card-glow ds-animate-fadeInUp ds-delay-300"
                onClick={() => onNavigate?.('intelligent-monitoring')}
                sx={{
                  bgcolor: '#0e0e0e',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: 3,
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': { transform: 'translateY(-3px)', borderColor: '#FFD700' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #D4AF37 40%, #FFD700 60%, transparent)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, mb: 1, textTransform: 'uppercase' }}>
                  Vehicle Health Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#D4AF37' }}>
                    {healthScore} / 100
                  </Typography>
                  <Typography variant="caption" sx={{ color: healthScore >= 90 ? '#35C759' : healthScore >= 75 ? '#2196f3' : '#FFD700', fontWeight: 800, letterSpacing: 1 }}>
                    {healthStatus.toUpperCase()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { label: 'Engine', status: coolantTemp <= 98 ? 'GOOD' : 'WARM', color: coolantTemp <= 98 ? '#35C759' : '#FFD700' },
                    { label: 'Battery', status: batteryVoltage >= 13.0 ? 'GOOD' : 'LOW', color: batteryVoltage >= 13.0 ? '#35C759' : '#FFD700' },
                    { label: 'Fuel Level', status: fuelLevel > 20 ? 'GOOD' : 'LOW', color: fuelLevel > 20 ? '#35C759' : '#E53935' },
                    { label: 'Brakes', status: 'GOOD (92%)', color: '#35C759' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#B8B8B8', fontSize: 12 }}>{item.label}</Typography>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: item.color, fontWeight: 800, fontSize: 10, border: `1px solid ${item.color}33` }}
                      />
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Interactive Seat Belt Safety Card */}
            <Grid item xs={12}>
              <Card
                className="ds-animate-fadeInUp ds-delay-400"
                sx={{
                  bgcolor: '#0e0e0e',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    Seat Belt Safety (Interactive Demo Toggle)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#777' }}>Click to toggle belt state</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      onClick={toggleDriverSeatBelt}
                      sx={{
                        p: 2,
                        bgcolor: '#050505',
                        border: `1px solid ${driverBelt ? 'rgba(53, 199, 89, 0.35)' : 'rgba(229, 57, 53, 0.45)'}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: driverBelt ? '#35C759' : '#E53935' },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ color: '#B8B8B8', fontWeight: 600 }}>Driver Seat</Typography>
                        <Typography variant="subtitle2" sx={{ color: driverBelt ? '#35C759' : '#E53935', fontWeight: 800 }}>
                          {driverBelt ? '● FASTENED' : '● UNFASTENED'}
                        </Typography>
                      </Box>
                      {driverBelt ? <CheckCircle2 size={24} color="#35C759" /> : <XCircle size={24} color="#E53935" />}
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box
                      onClick={togglePassengerSeatBelt}
                      sx={{
                        p: 2,
                        bgcolor: '#050505',
                        border: `1px solid ${passengerBelt ? 'rgba(53, 199, 89, 0.35)' : 'rgba(229, 57, 53, 0.45)'}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: passengerBelt ? '#35C759' : '#E53935' },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ color: '#B8B8B8', fontWeight: 600 }}>Passenger Seat</Typography>
                        <Typography variant="subtitle2" sx={{ color: passengerBelt ? '#35C759' : '#E53935', fontWeight: 800 }}>
                          {passengerBelt ? '● FASTENED' : '● UNFASTENED'}
                        </Typography>
                      </Box>
                      {passengerBelt ? <CheckCircle2 size={24} color="#35C759" /> : <XCircle size={24} color="#E53935" />}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Vehicle Statistics Grid */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
          Vehicle Live Statistics
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(212,175,55,0.2)', borderRadius: 1 }} />
      </Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {vehicleStats.map((stat, i) => (
          <Grid item xs={6} sm={4} md={3} lg={1.71} key={i}>
            <Card
              className="ds-animate-fadeInUp"
              style={{ animationDelay: `${0.05 * i}s` }}
              onClick={() => onNavigate?.(stat.targetView)}
              sx={{
                bgcolor: '#0e0e0e',
                border: '1px solid rgba(212, 175, 55, 0.18)',
                borderRadius: 3,
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: 'rgba(212,175,55,0.55)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8), 0 0 16px rgba(212,175,55,0.15)',
                },
              }}
            >
              <stat.icon size={22} color="#D4AF37" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', mt: 1, mb: 0.2, fontSize: '1.05rem' }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#777', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Performance Analytics Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
          Performance Analytics
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(212,175,55,0.2)', borderRadius: 1 }} />
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Card
            className="ds-card-glow"
            onClick={() => onNavigate?.('trip-history')}
            sx={{
              bgcolor: '#0e0e0e',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: 3,
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: '#FFD700' },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
              Weekly Performance Trend
            </Typography>
            <WeeklyAreaChart data={weeklyData} />
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card
            className="ds-card-glow"
            onClick={() => onNavigate?.('behavior-analysis')}
            sx={{
              bgcolor: '#0e0e0e',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: 3,
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: '#FFD700' },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 2 }}>
              Driving Behavior Radar Analysis
            </Typography>
            <BehaviorRadarChart data={behaviorData} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
