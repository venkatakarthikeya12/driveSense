import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Shadows } from '@mui/material/styles';
import {
  Box, Chip, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, AppBar, Toolbar, Typography, Collapse, Alert, Snackbar, Paper
} from '@mui/material';
import {
  Menu,
  Home,
  Activity,
  History,
  TrendingUp,
  Lightbulb,
  Trophy,
  Users,
  Target,
  Settings,
  User,
  FileText,
  Camera,
  Map,
  BarChart3,
  Award,
  Zap,
  ChevronDown,
  ChevronRight,
  LogOut,
  Bluetooth,
  MapPin,
  Gauge,
  Compass,
  Download,
  Bell,
} from 'lucide-react';
import Login from './components/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Onboarding from './components/auth/Onboarding';
import Dashboard from './components/Dashboard';
import LiveTrip from './components/monitoring/LiveTrip';
import CameraView from './components/monitoring/CameraView';
import LiveMonitoring from './components/monitoring/LiveMonitoring';
import LocationTracking from './components/monitoring/LocationTracking';
import TripHistory from './components/TripHistory';
import TripDetail from './components/trips/TripDetail';
import TripComparison from './components/trips/TripComparison';
import BrakingAnalysis from './components/analysis/BrakingAnalysis';
import CoachingTips from './components/CoachingTips';
import Achievements from './components/gamification/Achievements';
import Leaderboard from './components/gamification/Leaderboard';
import Challenges from './components/gamification/Challenges';
import UserProfile from './components/profile/UserProfile';
import WeeklyReport from './components/reports/WeeklyReport';
import SettingsPanel from './components/SettingsPanel';
import VehicleMonitoringDashboard from './components/intelligent/VehicleMonitoringDashboard';
import DrivingBehaviorAnalysis from './components/intelligent/DrivingBehaviorAnalysis';
import FuelPrediction from './components/intelligent/FuelPrediction';
import LoadTestDashboard from './components/monitoring/LoadTestDashboard';
import CarConnection from './components/CarConnection';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { DriveSenseProvider, useDriveSense } from '../context/DriveSenseContext';
import { BluetoothDeviceOption } from '../services/obd2Service';

// ─── Theme ────────────────────────────────────────────────────────────────────
const darkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0066FF',
      light: '#0088FF',
      dark: '#0044CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0088FF',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#030712',
      paper: '#0B0F19',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
      disabled: '#64748B',
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 4px 20px rgba(0,0,0,0.8)',
    '0 4px 20px rgba(0,0,0,0.9)',
    '0 8px 30px rgba(0,0,0,0.95)',
    '0 0 15px rgba(0,102,255,0.25)',
    ...Array(20).fill('0 0 20px rgba(0,102,255,0.2)'),
  ] as unknown as Shadows,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthView = 'login' | 'forgot-password';

type MainView =
  | 'dashboard'
  | 'car-connection'
  | 'live-monitoring'
  | 'location-tracking'
  | 'live-trip'
  | 'camera'
  | 'load-testing'
  | 'trip-history'
  | 'trip-detail'
  | 'trip-comparison'
  | 'braking-analysis'
  | 'coaching'
  | 'achievements'
  | 'leaderboard'
  | 'challenges'
  | 'profile'
  | 'weekly-report'
  | 'settings'
  | 'intelligent-monitoring'
  | 'behavior-analysis'
  | 'fuel-prediction';

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const particles = [
    { size: 6, top: '18%', left: '12%', delay: '0s', duration: '4.2s' },
    { size: 4, top: '72%', left: '8%', delay: '0.6s', duration: '3.8s' },
    { size: 8, top: '30%', left: '85%', delay: '1.1s', duration: '5s' },
    { size: 5, top: '80%', left: '78%', delay: '0.3s', duration: '4.5s' },
    { size: 3, top: '55%', left: '20%', delay: '1.8s', duration: '3.5s' },
    { size: 6, top: '10%', left: '60%', delay: '0.9s', duration: '4.8s' },
    { size: 4, top: '65%', left: '50%', delay: '2.1s', duration: '4s' },
    { size: 5, top: '40%', left: '92%', delay: '1.4s', duration: '3.9s' },
    { size: 3, top: '88%', left: '35%', delay: '0.5s', duration: '5.2s' },
    { size: 7, top: '22%', left: '42%', delay: '1.7s', duration: '4.3s' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: '#050505',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: 'ds-fadeIn 0.4s ease both',
      }}
    >
      {/* Radial background glow */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.12) 0%, rgba(5,5,5,0) 65%)',
        pointerEvents: 'none',
      }} />

      {/* Floating gold particles */}
      {particles.map((p, i) => (
        <Box
          key={i}
          className="ds-splash-particle"
          sx={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Logo container with ripple rings */}
      <Box
        className="ds-animate-scaleIn ds-delay-200"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}
      >
        {/* Ripple ring 1 */}
        <Box
          className="ds-ripple-1"
          sx={{
            position: 'absolute',
            width: 100, height: 100,
            borderRadius: '50%',
            border: '1.5px solid rgba(212,175,55,0.5)',
            pointerEvents: 'none',
          }}
        />
        {/* Ripple ring 2 */}
        <Box
          className="ds-ripple-2"
          sx={{
            position: 'absolute',
            width: 100, height: 100,
            borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.3)',
            pointerEvents: 'none',
          }}
        />
        {/* Logo circle */}
        <Box
          className="ds-pulse-ring"
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid #D4AF37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(5,5,5,1) 80%)',
          }}
        >
          <Compass size={54} color="#FFD700" />
        </Box>
      </Box>

      {/* Brand name */}
      <Typography
        variant="h3"
        className="ds-animate-fadeInUp ds-delay-300"
        sx={{
          fontWeight: 900,
          letterSpacing: 3,
          background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #E6C65C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        DriveSense
      </Typography>

      {/* Tagline */}
      <Typography
        variant="caption"
        className="ds-animate-fadeInUp ds-delay-400"
        sx={{
          color: '#888',
          letterSpacing: 4,
          fontWeight: 700,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          mb: 5,
        }}
      >
        INTELLIGENT DRIVING BEHAVIOR ANALYZER
      </Typography>

      {/* Animated load bar */}
      <Box
        className="ds-animate-fadeIn ds-delay-500"
        sx={{
          width: 160,
          height: 3,
          bgcolor: '#1a1a1a',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          className="ds-load-bar"
          sx={{
            height: '100%',
            background: 'linear-gradient(90deg, #8A6D1D 0%, #D4AF37 60%, #FFD700 100%)',
            borderRadius: 2,
            boxShadow: '0 0 12px rgba(255,215,0,0.6)',
            width: '0%',
          }}
        />
      </Box>

      {/* Status text */}
      <Typography
        variant="caption"
        className="ds-animate-fadeIn ds-delay-600"
        sx={{ color: '#555', mt: 2, letterSpacing: 1, fontSize: '0.68rem' }}
      >
        Initializing telemetry system…
      </Typography>
    </Box>
  );
}

// ─── Main App Content ─────────────────────────────────────────────────────────
function AppContent() {
  const { isLoggedIn, logout } = useAuth();
  const {
    connectionStatus,
    connectedDevice,
    isTripActive,
    endTrip,
    connectDevice,
    activeBanner,
    clearBanner,
    installApp,
  } = useDriveSense();

  const [authView, setAuthView] = useState<AuthView>('login');
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<MainView>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'car', 'monitoring', 'trips', 'analysis',
  ]);

  const isCarConnected = connectionStatus === 'connected';

  const handleOnboardingComplete = () => setShowOnboarding(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  // Menu structure
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      view: 'dashboard' as MainView,
    },
    {
      id: 'car',
      label: 'Car Connection',
      icon: Bluetooth,
      expandable: true,
      children: [
        { id: 'car-connection', label: 'Connect Vehicle', icon: Bluetooth, view: 'car-connection' as MainView },
        { id: 'live-monitoring', label: 'Live Monitoring', icon: Gauge, view: 'live-monitoring' as MainView },
        { id: 'location-tracking', label: 'Location Tracking', icon: MapPin, view: 'location-tracking' as MainView },
      ],
    },
    {
      id: 'intelligent',
      label: 'Intelligent Car Monitoring',
      icon: Zap,
      expandable: true,
      children: [
        { id: 'intelligent-monitoring', label: 'Vehicle Diagnostics', icon: Activity, view: 'intelligent-monitoring' as MainView },
        { id: 'behavior-analysis', label: 'Behavior Analysis', icon: TrendingUp, view: 'behavior-analysis' as MainView },
        { id: 'fuel-prediction', label: 'Fuel Prediction (ML)', icon: BarChart3, view: 'fuel-prediction' as MainView },
      ],
    },
    {
      id: 'monitoring',
      label: 'Live Monitoring',
      icon: Activity,
      expandable: true,
      children: [
        { id: 'live-trip', label: 'Active Trip', icon: Map, view: 'live-trip' as MainView },
        { id: 'camera', label: 'Drowsiness Detection', icon: Camera, view: 'camera' as MainView },
        { id: 'load-testing', label: 'Load Testing (100 VUs)', icon: Zap, view: 'load-testing' as MainView },
      ],
    },
    {
      id: 'trips',
      label: 'Trip Management',
      icon: History,
      expandable: true,
      children: [
        { id: 'trip-history', label: 'Trip History', icon: History, view: 'trip-history' as MainView },
        { id: 'trip-detail', label: 'Trip Details', icon: FileText, view: 'trip-detail' as MainView },
        { id: 'trip-comparison', label: 'Compare Trips', icon: BarChart3, view: 'trip-comparison' as MainView },
      ],
    },
    {
      id: 'analysis',
      label: 'Detailed Analysis',
      icon: TrendingUp,
      expandable: true,
      children: [
        { id: 'braking-analysis', label: 'Braking Analysis', icon: TrendingUp, view: 'braking-analysis' as MainView },
      ],
    },
    {
      id: 'coaching',
      label: 'AI Coaching',
      icon: Lightbulb,
      view: 'coaching' as MainView,
    },
    {
      id: 'gamification',
      label: 'Achievements & Rewards',
      icon: Trophy,
      expandable: true,
      children: [
        { id: 'achievements', label: 'Achievements', icon: Award, view: 'achievements' as MainView },
        { id: 'leaderboard', label: 'Leaderboard', icon: Users, view: 'leaderboard' as MainView },
        { id: 'challenges', label: 'Challenges', icon: Target, view: 'challenges' as MainView },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      expandable: true,
      children: [
        { id: 'weekly-report', label: 'Weekly Report', icon: FileText, view: 'weekly-report' as MainView },
      ],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      view: 'profile' as MainView,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      view: 'settings' as MainView,
    },
  ];

  // ── Early returns ────────────────────────────────────────────────────────────
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <>
        {authView === 'login' && (
          <Login
            onLogin={() => setShowOnboarding(true)}
            onNavigateForgotPassword={() => setAuthView('forgot-password')}
          />
        )}
        {authView === 'forgot-password' && (
          <ForgotPassword onBack={() => setAuthView('login')} />
        )}
      </>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // ── View renderer ────────────────────────────────────────────────────────────
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard isActive={isTripActive} onNavigate={setCurrentView} />;
      case 'car-connection':
        return (
          <CarConnection
            connectionStatus={connectionStatus}
            setConnectionStatus={() => { }}
            connectedDevice={connectedDevice}
            setConnectedDevice={() => { }}
            onConnected={(device: BluetoothDeviceOption) => connectDevice(device)}
          />
        );
      case 'live-monitoring':
        return <LiveMonitoring isConnected={isCarConnected} />;
      case 'location-tracking':
        return <LocationTracking isConnected={isCarConnected} />;
      case 'intelligent-monitoring':
        return <VehicleMonitoringDashboard />;
      case 'behavior-analysis':
        return <DrivingBehaviorAnalysis />;
      case 'fuel-prediction':
        return <FuelPrediction />;
      case 'live-trip':
        return <LiveTrip onEndTrip={async () => { await endTrip(); }} />;
      case 'camera':
        return <CameraView />;
      case 'load-testing':
        return <LoadTestDashboard />;
      case 'trip-history':
        return <TripHistory onSelectTrip={() => setCurrentView('trip-detail')} />;
      case 'trip-detail':
        return <TripDetail onBack={() => setCurrentView('trip-history')} />;
      case 'trip-comparison':
        return <TripComparison />;
      case 'braking-analysis':
        return <BrakingAnalysis />;
      case 'coaching':
        return <CoachingTips />;
      case 'achievements':
        return <Achievements />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'challenges':
        return <Challenges />;
      case 'profile':
        return <UserProfile />;
      case 'weekly-report':
        return <WeeklyReport />;
      case 'settings':
        return <SettingsPanel onTripToggle={() => { }} isTripActive={isTripActive} />;
      default:
        return <Dashboard isActive={isTripActive} onNavigate={setCurrentView} />;
    }
  };

  const navItemsMobile = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, view: 'dashboard' as MainView },
    { id: 'live-monitoring', label: 'Live Monitor', icon: Gauge, view: 'live-monitoring' as MainView },
    { id: 'trip-history', label: 'Trips', icon: MapPin, view: 'trip-history' as MainView },
    { id: 'coaching', label: 'Alerts', icon: Bell, view: 'coaching' as MainView, badge: true },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' as MainView },
  ];

  // ── Main Layout ──────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505', color: '#FFFFFF' }}>

      {/* ── App Bar ── */}
      <AppBar
        position="fixed"
        className="ds-appbar-frosted"
        sx={{
          color: '#FFFFFF',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{
              mr: 2,
              color: '#0088FF',
              transition: 'all 0.2s ease',
              '&:hover': { color: '#0066FF', bgcolor: 'rgba(0,102,255,0.1)', transform: 'scale(1.12)' },
            }}
          >
            <Menu />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 1.2 }}
          >
            <span style={{ color: '#FFFFFF' }}>Drive</span>
            <span style={{ color: '#0066FF' }}>Sense</span>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Install App chip matching image */}
            <Chip
              icon={<Download size={13} color="#0066FF" />}
              label="Install App"
              size="small"
              variant="outlined"
              onClick={installApp}
              sx={{
                cursor: 'pointer',
                bgcolor: 'rgba(0, 102, 255, 0.08)',
                borderColor: '#0066FF',
                color: '#0066FF',
                fontWeight: 700,
                fontSize: 11,
                borderRadius: 4,
                px: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'rgba(0, 102, 255, 0.2)', boxShadow: '0 0 12px rgba(0, 102, 255, 0.4)' },
                '& .MuiChip-icon': { ml: '6px' },
              }}
            />

            {/* OBD-II Disconnected status chip matching image */}
            <Chip
              icon={
                <Box
                  className={isCarConnected ? 'ds-live-dot' : ''}
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: isCarConnected ? '#10B981' : '#EF4444',
                    boxShadow: isCarConnected ? '0 0 8px #10B981' : '0 0 8px #EF4444',
                  }}
                />
              }
              label={
                isCarConnected
                  ? 'Connected'
                  : connectionStatus === 'scanning'
                    ? 'Scanning…'
                    : connectionStatus === 'pairing'
                      ? 'Pairing…'
                      : 'Disconnected'
              }
              size="small"
              onClick={() => setCurrentView('car-connection')}
              sx={{
                cursor: 'pointer',
                bgcolor: 'rgba(3, 7, 18, 0.9)',
                backdropFilter: 'blur(8px)',
                color: isCarConnected ? '#10B981' : '#EF4444',
                border: `1px solid ${isCarConnected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                fontWeight: 600,
                fontSize: 11,
                borderRadius: 4,
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#EF4444', color: '#EF4444' },
                '& .MuiChip-icon': { ml: '6px' },
              }}
            />

            {/* Live trip indicator */}
            {isTripActive && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'rgba(212,175,55,0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 2,
                  border: '1px solid rgba(212,175,55,0.4)',
                  animation: 'ds-borderGlow 2.5s ease-in-out infinite',
                }}
              >
                <Box
                  className="ds-live-dot"
                  sx={{
                    width: 7, height: 7,
                    borderRadius: '50%',
                    bgcolor: '#FFD700',
                    boxShadow: '0 0 10px #FFD700',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 700, fontSize: 11, letterSpacing: 0.8 }}>
                  LIVE TRIP
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Global Alert Snackbar ── */}
      <Snackbar
        open={Boolean(activeBanner)}
        autoHideDuration={5000}
        onClose={clearBanner}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {activeBanner ? (
          <Alert
            onClose={clearBanner}
            severity={activeBanner.severity}
            sx={{
              width: '100%',
              bgcolor: '#121212',
              color: '#FFFFFF',
              border: `1px solid ${activeBanner.severity === 'error' ? '#E53935' : '#D4AF37'}`,
              fontWeight: 600,
            }}
          >
            <strong>{activeBanner.title}:</strong> {activeBanner.message}
          </Alert>
        ) : undefined}
      </Snackbar>

      {/* ── Side Drawer ── */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            color: '#FFFFFF',
            borderRight: '1px solid rgba(212,175,55,0.2)',
            boxShadow: '4px 0 40px rgba(0,0,0,0.8)',
          },
        }}
      >
        <Toolbar />
        {/* Drawer accent line */}
        <Box sx={{ height: 2, background: 'linear-gradient(90deg, #D4AF37 0%, rgba(212,175,55,0) 100%)', mx: 2, mb: 1, borderRadius: 1 }} />

        <List sx={{ pt: 1, pb: 10 }}>
          {menuItems.map((item, idx) => (
            <Box key={item.id} className="ds-drawer-item" style={{ animationDelay: `${idx * 0.04}s` }}>
              <ListItem
                onClick={() => {
                  if (item.expandable) {
                    toggleSection(item.id);
                  } else if (item.view) {
                    setCurrentView(item.view);
                    setDrawerOpen(false);
                  }
                }}
                sx={{
                  color: currentView === item.view ? '#FFD700' : '#B8B8B8',
                  bgcolor: currentView === item.view ? 'rgba(212,175,55,0.13)' : 'transparent',
                  borderLeft: currentView === item.view ? '3px solid #D4AF37' : '3px solid transparent',
                  borderRadius: '0 10px 10px 0',
                  mx: 1,
                  mb: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: currentView === item.view ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.06)',
                    color: '#FFD700',
                    transform: 'translateX(3px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: currentView === item.view ? '#D4AF37' : '#777', minWidth: 40, transition: 'color 0.2s' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: currentView === item.view ? 700 : 500 }}
                />
                {item.expandable && (
                  expandedSections.includes(item.id)
                    ? <ChevronDown size={15} color="#D4AF37" />
                    : <ChevronRight size={15} color="#555" />
                )}
              </ListItem>

              {item.expandable && (
                <Collapse in={expandedSections.includes(item.id)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children?.map((child, cidx) => (
                      <ListItem
                        key={child.id}
                        className="ds-drawer-item"
                        style={{ animationDelay: `${(idx + cidx + 1) * 0.04}s` }}
                        onClick={() => {
                          setCurrentView(child.view);
                          setDrawerOpen(false);
                        }}
                        sx={{
                          pl: 4,
                          color: currentView === child.view ? '#FFD700' : '#999',
                          bgcolor: currentView === child.view ? 'rgba(212,175,55,0.1)' : 'transparent',
                          borderRadius: '0 10px 10px 0',
                          mx: 1,
                          mb: 0.5,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': { bgcolor: 'rgba(212,175,55,0.07)', color: '#FFD700', transform: 'translateX(3px)' },
                        }}
                      >
                        <ListItemIcon sx={{ color: currentView === child.view ? '#D4AF37' : '#666', minWidth: 40 }}>
                          <child.icon size={17} />
                        </ListItemIcon>
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: currentView === child.view ? 700 : 400 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}

          {/* Divider */}
          <Box sx={{ mx: 2, my: 1.5, height: 1, bgcolor: 'rgba(212,175,55,0.1)', borderRadius: 1 }} />

          {/* Logout */}
          <ListItem
            onClick={() => logout()}
            sx={{
              mt: 0.5,
              mx: 1,
              borderRadius: '0 10px 10px 0',
              color: '#E53935',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'rgba(229,57,53,0.12)', transform: 'translateX(3px)' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        </List>
      </Drawer>

      {/* ── Main Content ── */}
      <Box
        component="main"
        sx={{ flexGrow: 1, mt: 8, mb: { xs: 8, md: 2 }, p: { xs: 2, md: 3 }, bgcolor: '#050505' }}
      >
        <Box key={currentView} className="ds-page-wrapper">
          {renderView()}
        </Box>
      </Box>

      {/* ── Bottom Navigation (mobile) ── */}
      <Paper
        elevation={10}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'rgba(3, 7, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0, 102, 255, 0.3)',
          py: 1,
          px: 0.5,
          zIndex: 1200,
          boxShadow: '0 -4px 30px rgba(0,0,0,0.95)',
        }}
      >
        {navItemsMobile.map((item) => {
          const isSelected = currentView === item.view;
          return (
            <Box
              key={item.id}
              onClick={() => setCurrentView(item.view)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                py: 0.5,
                cursor: 'pointer',
                color: isSelected ? '#0088FF' : '#64748B',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                position: 'relative',
              }}
            >
              {/* Icon with glow wave ring */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0.85,
                  borderRadius: '50%',
                  bgcolor: isSelected ? 'rgba(0, 102, 255, 0.18)' : 'transparent',
                  boxShadow: isSelected ? '0 0 16px rgba(0, 102, 255, 0.5), 0 0 4px rgba(0, 102, 255, 0.3)' : 'none',
                  mb: 0.3,
                  transition: 'all 0.25s ease',
                  '&::after': isSelected
                    ? {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(0, 102, 255, 0.3)',
                      animation: 'ds-navActiveWave 1.4s ease-out infinite',
                    }
                    : {},
                }}
              >
                <item.icon size={22} color={isSelected ? '#0088FF' : '#94A3B8'} />
                {item.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: '#EF4444',
                      boxShadow: '0 0 6px #EF4444',
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.67rem',
                  fontWeight: isSelected ? 800 : 500,
                  color: isSelected ? '#0088FF' : '#94A3B8',
                  letterSpacing: isSelected ? 0.5 : 0.2,
                  transition: 'all 0.25s ease',
                }}
              >
                {item.label}
              </Typography>

              {/* Active top line bar indicator */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    bgcolor: '#0088FF',
                    boxShadow: '0 0 10px #0088FF',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider theme={darkBlueTheme}>
      <AuthProvider>
        <DriveSenseProvider>
          <AppContent />
        </DriveSenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
