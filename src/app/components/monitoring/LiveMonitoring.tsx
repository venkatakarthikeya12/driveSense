import React, { useState, useEffect, useRef, useId } from 'react';
import { Box, Typography, Card, Chip, LinearProgress, Button } from '@mui/material';
import { Gauge, Thermometer, Zap, Fuel, Activity, Navigation, Wind, Shield, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useDriveSense } from '../../../context/DriveSenseContext';

interface LiveMonitoringProps {
  isConnected?: boolean;
}

type HistPoint = { t: number; v: number };

function useHistory(value: number, len = 30): HistPoint[] {
  const ref = useRef<HistPoint[]>([]);
  const tick = useRef(0);
  useEffect(() => {
    tick.current++;
    ref.current = [...ref.current.slice(-(len - 1)), { t: tick.current, v: value }];
  }, [value, len]);
  return ref.current;
}

function SpeedometerSVG({ speed, max = 160 }: { speed: number; max?: number }) {
  const r = 90, cx = 110, cy = 110;
  const startAngle = 220, endAngle = -40;
  const frac = Math.min(speed / max, 1);
  const deg = startAngle + frac * (endAngle - startAngle + 360);
  const toRad = (d: number) => (d * Math.PI) / 180;

  const arcPath = (from: number, to: number, radius: number) => {
    const s = { x: cx + radius * Math.cos(toRad(from)), y: cy - radius * Math.sin(toRad(from)) };
    const e = { x: cx + radius * Math.cos(toRad(to)), y: cy - radius * Math.sin(toRad(to)) };
    const large = Math.abs(to - from) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 0 ${e.x} ${e.y}`;
  };

  const needleX = cx + (r - 20) * Math.cos(toRad(deg));
  const needleY = cy - (r - 20) * Math.sin(toRad(deg));

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = startAngle - i * ((startAngle - endAngle + 360) / 10);
    const inner = r - 10, outer = r + 2;
    return {
      x1: cx + inner * Math.cos(toRad(angle)), y1: cy - inner * Math.sin(toRad(angle)),
      x2: cx + outer * Math.cos(toRad(angle)), y2: cy - outer * Math.sin(toRad(angle)),
      label: Math.round((i / 10) * max),
      lx: cx + (r - 22) * Math.cos(toRad(angle)), ly: cy - (r - 22) * Math.sin(toRad(angle)),
    };
  });

  const speedColor = '#FFD700';

  return (
    <svg viewBox="0 0 220 180" style={{ width: '100%', maxWidth: 260 }}>
      <path d={arcPath(220, -40, r)} fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth={14} strokeLinecap="round" />
      <path d={arcPath(220, deg, r)} fill="none" stroke={speedColor} strokeWidth={14} strokeLinecap="round"
        style={{ transition: 'all 0.3s' }} />
      {ticks.map((tk, i) => (
        <g key={i}>
          <line x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2} stroke="#D4AF37" strokeWidth={2} />
          <text x={tk.lx} y={tk.ly} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#B8B8B8">
            {tk.label}
          </text>
        </g>
      ))}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={speedColor} strokeWidth={3} strokeLinecap="round"
        style={{ transition: 'all 0.3s', transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={6} fill={speedColor} />
      <text x={cx} y={cy + 32} textAnchor="middle" fontSize={32} fontWeight="bold" fill="#FFFFFF">
        {Math.round(speed)}
      </text>
      <text x={cx} y={cy + 50} textAnchor="middle" fontSize={11} fill="#B8B8B8">KM/H</text>
    </svg>
  );
}

function GaugeMini({ value, max, label, unit, color, icon }: {
  value: number; max: number; label: string; unit: string; color: string; icon: React.ReactNode;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: 3, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color }}>
        {icon}
        <Typography sx={{ fontSize: 11, color: '#B8B8B8', flex: 1 }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1, mb: 1 }}>
        {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(1)) : value}
        <Typography component="span" sx={{ fontSize: 11, color: '#B8B8B8', ml: 0.5 }}>{unit}</Typography>
      </Typography>
      <LinearProgress variant="determinate" value={pct}
        sx={{ height: 5, borderRadius: 3, bgcolor: '#050505', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
    </Card>
  );
}

function MiniSparkline({ data, color }: { data: HistPoint[]; color: string }) {
  const uid = useId().replace(/:/g, '');
  if (data.length < 2) return null;
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart id={`${uid}-spark`} data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Tooltip contentStyle={{ fontSize: 10, background: '#121212', border: '1px solid #D4AF37', borderRadius: 6, color: '#FFF' }}
          formatter={(v: number) => [v.toFixed(0), '']} labelFormatter={() => ''} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function LiveMonitoring({ isConnected: propIsConnected }: LiveMonitoringProps) {
  const {
    telemetry,
    formatSpeed,
    speedUnitLabel,
    toggleDriverSeatBelt,
    togglePassengerSeatBelt,
  } = useDriveSense();

  const speed = formatSpeed(telemetry.speed || 0);
  const rpm = telemetry.rpm || 850;
  const temp = telemetry.coolantTemp || 88;
  const battery = telemetry.batteryVoltage || 13.8;
  const fuel = Math.round(telemetry.fuelLevel || 72);
  const throttle = telemetry.throttlePosition || 12;
  const distance = telemetry.distanceTravelled || 12.4;
  const gear = telemetry.currentGear || 'P';

  const driverBelt = telemetry.driverSeatBelt ?? false;
  const passengerBelt = telemetry.passengerSeatBelt ?? false;

  const speedHist = useHistory(speed);
  const rpmHist = useHistory(rpm);

  return (
    <Box sx={{ bgcolor: '#050505', minHeight: '100vh', p: { xs: 2, md: 3 }, color: '#FFFFFF' }}>
      {/* Live Header Badges */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#35C759', boxShadow: '0 0 8px #35C759' }} />
        <Typography sx={{ color: '#FFD700', fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>
          LIVE MONITORING DASHBOARD
        </Typography>
        <Chip label="DEMO MODE" size="small" sx={{ bgcolor: '#D4AF37', color: '#050505', fontWeight: 900, fontSize: 11 }} />
        <Chip label="SIMULATED VEHICLE DATA" size="small" sx={{ bgcolor: 'rgba(212,175,55,0.18)', color: '#FFD700', border: '1px solid rgba(212,175,55,0.4)', fontWeight: 700, fontSize: 10 }} />
      </Box>

      {/* Speedometer Hero */}
      <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 3, p: 3, mb: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
        <SpeedometerSVG speed={speed} />
        <Box sx={{ display: 'flex', gap: 4, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#B8B8B8', fontSize: 10, mb: 0.25, fontWeight: 700 }}>RPM</Typography>
            <Typography sx={{ color: '#FFD700', fontSize: 20, fontWeight: 900 }}>{Math.round(rpm).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#B8B8B8', fontSize: 10, mb: 0.25, fontWeight: 700 }}>THROTTLE</Typography>
            <Typography sx={{ color: '#FFD700', fontSize: 20, fontWeight: 900 }}>{throttle}%</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#B8B8B8', fontSize: 10, mb: 0.25, fontWeight: 700 }}>GEAR</Typography>
            <Typography sx={{ color: '#FFD700', fontSize: 20, fontWeight: 900 }}>GEAR {gear}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#B8B8B8', fontSize: 10, mb: 0.25, fontWeight: 700 }}>DISTANCE</Typography>
            <Typography sx={{ color: '#FFD700', fontSize: 20, fontWeight: 900 }}>{distance.toFixed(1)} km</Typography>
          </Box>
        </Box>
      </Card>

      {/* Seat Belt Live Status & Toggle */}
      <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={20} color="#FFD700" />
            <Typography sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: 14 }}>
              Seat Belt Safety Monitor (Live Interactive Controls)
            </Typography>
          </Box>
          <Typography sx={{ color: '#777', fontSize: 11 }}>Tap to toggle status</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Button
            onClick={toggleDriverSeatBelt}
            variant="outlined"
            sx={{
              p: 1.5,
              borderColor: driverBelt ? '#35C759' : '#E53935',
              bgcolor: driverBelt ? 'rgba(53,199,89,0.08)' : 'rgba(229,57,53,0.1)',
              color: '#FFFFFF',
              justifyContent: 'space-between',
              textTransform: 'none',
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: 12, color: '#B8B8B8', fontWeight: 600 }}>Driver Seat</Typography>
              <Typography sx={{ fontSize: 13, color: driverBelt ? '#35C759' : '#E53935', fontWeight: 800 }}>
                {driverBelt ? 'FASTENED' : 'UNFASTENED'}
              </Typography>
            </Box>
            {driverBelt ? <CheckCircle2 size={22} color="#35C759" /> : <XCircle size={22} color="#E53935" />}
          </Button>

          <Button
            onClick={togglePassengerSeatBelt}
            variant="outlined"
            sx={{
              p: 1.5,
              borderColor: passengerBelt ? '#35C759' : '#E53935',
              bgcolor: passengerBelt ? 'rgba(53,199,89,0.08)' : 'rgba(229,57,53,0.1)',
              color: '#FFFFFF',
              justifyContent: 'space-between',
              textTransform: 'none',
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: 12, color: '#B8B8B8', fontWeight: 600 }}>Passenger Seat</Typography>
              <Typography sx={{ fontSize: 13, color: passengerBelt ? '#35C759' : '#E53935', fontWeight: 800 }}>
                {passengerBelt ? 'FASTENED' : 'UNFASTENED'}
              </Typography>
            </Box>
            {passengerBelt ? <CheckCircle2 size={22} color="#35C759" /> : <XCircle size={22} color="#E53935" />}
          </Button>
        </Box>
      </Card>

      {/* Mini gauges grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <GaugeMini value={temp} max={120} label="Engine Temp" unit="°C" color={temp > 98 ? '#E53935' : '#FFD700'} icon={<Thermometer size={16} />} />
        <GaugeMini value={battery} max={15} label="Battery Voltage" unit="V" color={battery < 12.0 ? '#E53935' : '#D4AF37'} icon={<Zap size={16} />} />
        <GaugeMini value={fuel} max={100} label="Fuel Level" unit="%" color={fuel < 20 ? '#E53935' : '#35C759'} icon={<Fuel size={16} />} />
        <GaugeMini value={throttle} max={100} label="Throttle Position" unit="%" color="#FFD700" icon={<Wind size={16} />} />
      </Box>

      {/* Speed sparkline */}
      <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Navigation size={16} color="#FFD700" />
          <Typography sx={{ color: '#B8B8B8', fontSize: 12, fontWeight: 600 }}>Real-Time Speed Telemetry (last 30s)</Typography>
        </Box>
        <MiniSparkline data={speedHist} color="#FFD700" />
      </Card>

      {/* RPM sparkline */}
      <Card sx={{ bgcolor: '#121212', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Gauge size={16} color="#D4AF37" />
          <Typography sx={{ color: '#B8B8B8', fontSize: 12, fontWeight: 600 }}>Real-Time RPM Telemetry (last 30s)</Typography>
        </Box>
        <MiniSparkline data={rpmHist} color="#D4AF37" />
      </Card>
    </Box>
  );
}
