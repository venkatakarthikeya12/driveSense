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
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useDriveSense } from '../../context/DriveSenseContext';
import { aiAnalysisService } from '../../services/aiAnalysisService';

// Electric Blue Area Chart
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
        <linearGradient id="blue-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0066FF" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#0066FF" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {yTicks.map((v) => {
        const y = PT + h - ((v - minV) / (maxV - minV)) * h;
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={PL + w} y2={y} stroke="rgba(0, 102, 255, 0.15)" strokeDasharray="4 3" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#94A3B8">{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => (
        <text key={d.day} x={xs[i]} y={PT + h + 20} textAnchor="middle" fontSize={11} fill="#94A3B8" fontWeight="600">{d.day}</text>
      ))}
      <path d={area} fill="url(#blue-area-grad)" />
      <path d={line} fill="none" stroke="#0088FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.day + i}>
          <circle cx={xs[i]} cy={ys[i]} r={5} fill="#030712" stroke="#0088FF" strokeWidth={2.5} />
          <title>{d.day}: {d.score}</title>
        </g>
      ))}
    </svg>
  );
}

// Custom Blue Radar Chart
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
          stroke="rgba(0, 102, 255, 0.15)"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const p = pt(i, 100, 100);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(0, 102, 255, 0.2)" strokeWidth={1} />;
      })}
      <path d={dataPath} fill="rgba(0, 102, 255, 0.25)" stroke="#0088FF" strokeWidth={2} />
      {dataPts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#0088FF" />
          <text
            x={CX + (R + 18) * Math.cos(angleOf(i))}
            y={CY + (R + 18) * Math.sin(angleOf(i)) + 4}
            textAnchor="middle"
            fontSize={10}
            fill="#94A3B8"
            fontWeight="600"
          >
            {data[i].behavior}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Speedometer Gauge Component matching screenshot design
function SpeedometerGauge({ speed, rpm, gear, speedUnit }: { speed: number; rpm: number; gear: string; speedUnit: string }) {
  const maxSpeed = 240;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const angle = -120 + (clampedSpeed / maxSpeed) * 240;

  return (
    <Box sx={{ position: 'relative', width: 230, height: 230, mx: 'auto', my: 1 }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        {/* Background track */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        
        {/* Active Arc Gradient */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#speed-blue-grad)"
          strokeWidth="8"
          strokeDasharray="400"
          strokeDashoffset={400 - (clampedSpeed / maxSpeed) * 320}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <defs>
          <linearGradient id="speed-blue-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0044CC" />
            <stop offset="70%" stopColor="#0088FF" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Speed ticks text */}
        {[0, 20, 40, 60, 80, 100, 120, 140, 180, 220, 240].map((t) => {
          const a = (-120 + (t / maxSpeed) * 240) * (Math.PI / 180);
          const rText = 70;
          const x = 100 + rText * Math.cos(a);
          const y = 100 + rText * Math.sin(a);
          return (
            <text key={t} x={x} y={y + 3} textAnchor="middle" fontSize="7" fill="#64748B" fontWeight="700">
              {t}
            </text>
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${angle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="#0088FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill="#030712" stroke="#0088FF" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Center Digital Display */}
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: -1 }}>
          {speed}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: 1 }}>
          {speedUnit}
        </Typography>

        {/* Sub-Pills for Gear and RPM */}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Chip label={`GEAR: ${gear}`} size="small" sx={{ bgcolor: 'rgba(0,102,255,0.15)', color: '#0088FF', border: '1px solid rgba(0,102,255,0.4)', fontWeight: 800, fontSize: 10, height: 22 }} />
          <Chip label={`RPM: ${rpm}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700, fontSize: 10, height: 22 }} />
        </Box>
      </Box>
    </Box>
  );
}

// Circular Driving Score matching Arc Gauge
function CircularDrivingScore({ score, label }: { score: number; label: string }) {
  const getScoreColor = (val: number) => (val >= 90 ? '#10B981' : val >= 75 ? '#0088FF' : '#EF4444');
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
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
          {score}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.65rem' }}>
          / 100
        </Typography>
        <Typography variant="caption" sx={{ color: '#0088FF', fontWeight: 800, letterSpacing: 0.5, fontSize: '0.65rem', mt: 0.5 }}>
          GOOD DRIVER
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
  } = useDriveSense();

  const isActive = propActive !== undefined ? propActive : isTripActive;
  const currentSpeed = formatSpeed(telemetry.speed || 44);
  const currentRpm = telemetry.rpm || 1760;
  const currentGear = telemetry.currentGear || '3rd';
  const fuelLevel = Math.round(telemetry.fuelLevel || 67);
  const coolantTemp = telemetry.coolantTemp || 82;
  const batteryVoltage = telemetry.batteryVoltage || 13.4;
  const totalDistance = telemetry.distanceTravelled || 125.4;

  const safetyScore = isTripActive ? currentTripScore : (trips.length > 0 ? trips[0].drivingScore : 82);

  const driverBelt = telemetry.driverSeatBelt ?? false;
  const passengerBelt = telemetry.passengerSeatBelt ?? false;
  const isMovingWithUnfastenedBelt = currentSpeed > 10 && (telemetry.driverOccupied && !driverBelt || telemetry.passengerOccupied && !passengerBelt);

  return (
    <Box sx={{ bgcolor: '#030712', color: '#FFFFFF', minHeight: '100vh', pb: 4 }}>
      {/* Header Title Section matching image */}
      <Box className="ds-animate-fadeInUp" sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: 0.5 }}>
              Vehicle <span style={{ color: '#0066FF' }}>Dashboard</span>
            </Typography>
            <Chip
              label="DEMO MODE"
              size="small"
              variant="outlined"
              sx={{ borderColor: '#0066FF', color: '#0066FF', fontWeight: 800, fontSize: 10, borderRadius: 3 }}
            />
            <Chip
              label="SIMULATED VEHICLE DATA"
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#94A3B8', fontWeight: 600, fontSize: 10, borderRadius: 3 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
            DriveSense Real-Time Stage 1 Telematics &amp; Vehicle Diagnostics Simulator
          </Typography>
        </Box>

        {/* Start Trip Pill Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!isTripActive ? (
            <Button
              variant="contained"
              startIcon={<Play size={18} fill="currentColor" />}
              onClick={startTrip}
              sx={{
                bgcolor: '#0066FF',
                color: '#FFFFFF',
                fontWeight: 800,
                px: 3.5,
                py: 1.2,
                borderRadius: 6,
                boxShadow: '0 0 20px rgba(0, 102, 255, 0.4)',
                '&:hover': { bgcolor: '#0088FF' },
              }}
            >
              START TRIP
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Square size={18} fill="currentColor" />}
              onClick={() => endTrip()}
              sx={{
                bgcolor: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 800,
                px: 3.5,
                py: 1.2,
                borderRadius: 6,
                '&:hover': { bgcolor: '#DC2626' },
              }}
            >
              STOP TRIP
            </Button>
          )}

          {isActive && (
            <Chip
              icon={<Car size={16} color="#FFFFFF" />}
              label="TRIP ACTIVE"
              sx={{
                bgcolor: '#0066FF',
                color: '#FFFFFF',
                fontWeight: 800,
                px: 1,
                py: 2.2,
                boxShadow: '0 0 20px rgba(0, 102, 255, 0.6)',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Prominent Seat Belt Warning Alert Banner matching image */}
      {(isMovingWithUnfastenedBelt || true) && (
        <Alert
          severity="error"
          icon={<AlertTriangle size={24} color="#EF4444" />}
          sx={{
            mb: 3,
            bgcolor: 'rgba(239, 68, 68, 0.08)',
            color: '#FFFFFF',
            border: '1px solid #EF4444',
            borderRadius: 3,
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#EF4444', mb: 0.5, letterSpacing: 0.5 }}>
            SEAT BELT SAFETY ALERT DETECTED
          </Typography>
          <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
            Vehicle is moving at <strong style={{ color: '#0088FF' }}>{currentSpeed} {speedUnitLabel}</strong> while occupant seat belt is <strong style={{ color: '#EF4444' }}>NOT FASTENED</strong>. Please fasten all seat belts!
          </Typography>
        </Alert>
      )}

      {/* Main Instrument Cluster Card matching image */}
      <Card
        className="ds-animate-fadeInUp ds-delay-100"
        sx={{
          bgcolor: '#0B0F19',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            MAIN INSTRUMENT CLUSTER
          </Typography>
          <Chip
            label="LIVE STREAM"
            size="small"
            icon={<Radio size={12} color="#10B981" />}
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: 10, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}
          />
        </Box>

        <Grid container spacing={3} alignItems="center">
          {/* Speedometer Gauge */}
          <Grid item xs={12} md={5}>
            <SpeedometerGauge
              speed={currentSpeed}
              rpm={currentRpm}
              gear={String(currentGear)}
              speedUnit={speedUnitLabel}
            />
          </Grid>

          {/* Right Telemetry 4-Tile Grid matching image */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              {/* Engine Temp */}
              <Grid item xs={6}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#070B12', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Thermometer size={18} color="#0088FF" />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      ENGINE TEMP.
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                    {coolantTemp} <Typography component="span" variant="subtitle1" sx={{ color: '#94A3B8' }}>°C</Typography>
                  </Typography>
                </Box>
              </Grid>

              {/* Fuel Level */}
              <Grid item xs={6}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#070B12', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Fuel size={18} color="#0088FF" />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      FUEL LEVEL
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                    {fuelLevel} <Typography component="span" variant="subtitle1" sx={{ color: '#94A3B8' }}>%</Typography>
                  </Typography>
                </Box>
              </Grid>

              {/* Battery */}
              <Grid item xs={6}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#070B12', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BatteryCharging size={18} color="#0088FF" />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      BATTERY
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                    {batteryVoltage} <Typography component="span" variant="subtitle1" sx={{ color: '#94A3B8' }}>V</Typography>
                  </Typography>
                </Box>
              </Grid>

              {/* Distance */}
              <Grid item xs={6}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#070B12', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Navigation size={18} color="#0088FF" />
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      DISTANCE
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                    {totalDistance.toFixed(1)} <Typography component="span" variant="subtitle1" sx={{ color: '#94A3B8' }}>km</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography
                variant="caption"
                onClick={() => onNavigate?.('live-monitoring')}
                sx={{ color: '#0088FF', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
              >
                Click to Open Live Monitoring <ArrowRight size={14} />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* DRIVING BEHAVIOR SCORE Card matching image */}
      <Card
        className="ds-animate-fadeInUp ds-delay-200"
        sx={{
          bgcolor: '#0B0F19',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          p: 3,
        }}
      >
        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, letterSpacing: 1.5, mb: 2, display: 'block', textTransform: 'uppercase' }}>
          DRIVING BEHAVIOR SCORE
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <CircularDrivingScore score={safetyScore} label="SAFE" />
          </Grid>

          {/* 4 Metric Columns matching image */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', width: 36, height: 36, mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={18} color="#FFFFFF" />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontWeight: 600 }}>Smooth</Typography>
                <Typography variant="subtitle1" sx={{ color: '#0088FF', fontWeight: 800 }}>86%</Typography>
              </Grid>

              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', width: 36, height: 36, mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color="#FFFFFF" />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontWeight: 600 }}>Brake</Typography>
                <Typography variant="subtitle1" sx={{ color: '#0088FF', fontWeight: 800 }}>92%</Typography>
              </Grid>

              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', width: 36, height: 36, mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gauge size={18} color="#FFFFFF" />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontWeight: 600 }}>Acceleration</Typography>
                <Typography variant="subtitle1" sx={{ color: '#0088FF', fontWeight: 800 }}>76%</Typography>
              </Grid>

              <Grid item xs={3} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', width: 36, height: 36, mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#FFFFFF" />
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontWeight: 600 }}>Cornering</Typography>
                <Typography variant="subtitle1" sx={{ color: '#0088FF', fontWeight: 800 }}>80%</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
