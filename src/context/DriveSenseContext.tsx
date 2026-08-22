import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  OBDTelemetry,
  GPSLocation,
  TripRecord,
  DrivingEvent,
  EmergencyContact,
  UserPreferences,
  NotificationItem,
} from '../models/types';
import { obd2Service, ConnectionState, BluetoothDeviceOption } from '../services/obd2Service';
import { gpsService } from '../services/gpsService';
import { firestoreService } from '../services/firestoreService';
import { aiAnalysisService } from '../services/aiAnalysisService';
import { notificationService } from '../services/notificationService';

interface DriveSenseContextType {
  // Telemetry & OBD Connection
  connectionStatus: ConnectionState;
  connectedDevice: BluetoothDeviceOption | null;
  telemetry: OBDTelemetry;
  scanDevices: () => Promise<BluetoothDeviceOption[]>;
  connectDevice: (device: BluetoothDeviceOption) => Promise<void>;
  disconnectDevice: () => void;
  toggleDriverSeatBelt: () => void;
  togglePassengerSeatBelt: () => void;

  // Location & GPS
  location: GPSLocation;

  // Active Trip State
  isTripActive: boolean;
  isTripPaused: boolean;
  tripDuration: number;
  tripDistance: number;
  currentTripScore: number;
  tripEvents: DrivingEvent[];
  startTrip: () => void;
  pauseTrip: () => void;
  resumeTrip: () => void;
  endTrip: () => Promise<TripRecord | null>;

  // Saved Trips & Selection
  trips: TripRecord[];
  selectedTripId: string | null;
  selectedTrip: TripRecord | null;
  setSelectedTripId: (id: string | null) => void;
  refreshTrips: () => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  // Settings & Preferences
  preferences: UserPreferences;
  updatePreferences: (newPrefs: UserPreferences) => Promise<void>;

  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  updateEmergencyContacts: (contacts: EmergencyContact[]) => Promise<void>;

  // Notifications & Alerts
  notifications: NotificationItem[];
  activeBanner: { title: string; message: string; severity: 'error' | 'warning' | 'info' } | null;
  clearBanner: () => void;
  markNotificationRead: (id: string) => Promise<void>;

  // Utility helpers
  formatSpeed: (kmh: number) => number;
  speedUnitLabel: string;
  canInstallPwa: boolean;
  installApp: () => void;
}

const DriveSenseContext = createContext<DriveSenseContextType | undefined>(undefined);

export const DriveSenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(obd2Service.getState());
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceOption | null>(obd2Service.getDevice());
  const [telemetry, setTelemetry] = useState<OBDTelemetry>(obd2Service.getTelemetry());
  const [location, setLocation] = useState<GPSLocation>(gpsService.getCurrentLocation());

  // Trip recording state
  const [isTripActive, setIsTripActive] = useState(false);
  const [isTripPaused, setIsTripPaused] = useState(false);
  const [tripDuration, setTripDuration] = useState(0);
  const [tripDistance, setTripDistance] = useState(0);
  const [currentTripScore, setCurrentTripScore] = useState(100);
  const [tripEvents, setTripEvents] = useState<DrivingEvent[]>([]);
  const [tripRoute, setTripRoute] = useState<[number, number][]>([]);

  // Persistent lists & Selection
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    language: 'English',
    speedUnit: 'kmh',
    notificationPreferences: {
      overspeed: true,
      hardBrake: true,
      overheat: true,
      lowFuel: true,
      bluetoothDisconnect: true,
      batteryLow: true,
      serviceReminder: true,
    },
    privacySettings: { shareLocation: true, anonymousAnalytics: true, dataRetentionDays: 90 },
  });
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeBanner, setActiveBanner] = useState<{ title: string; message: string; severity: 'error' | 'warning' | 'info' } | null>(null);
  const clearBanner = () => setActiveBanner(null);
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const installApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: { outcome: string }) => {
        if (choice.outcome === 'accepted') {
          setCanInstallPwa(false);
          setDeferredPrompt(null);
        }
      });
    } else {
      notificationService.triggerAlert({
        type: 'service_reminder',
        detail: 'To Install App: Tap browser menu (⋮ on Android or Share on iPhone) and select "Add to Home Screen" or "Install App".',
      });
    }
  };

  // Seatbelt alert throttle ref
  const lastSeatbeltAlertRef = useRef<number>(0);

  // Subscriptions & initial loading
  useEffect(() => {
    const unsubState = obd2Service.subscribeState((state, dev) => {
      setConnectionStatus(state);
      setConnectedDevice(dev);
    });

    let prevTel: OBDTelemetry | undefined;
    const unsubTel = obd2Service.subscribeTelemetry((data) => {
      setTelemetry(data);

      // STEP 5: Seat Belt Alert Logic
      // If vehicle speed > 10 km/h AND occupied AND seatbelt unfastened -> alert!
      const driverViolation = data.speed > 10 && data.driverOccupied && !data.driverSeatBelt;
      const passengerViolation = data.speed > 10 && data.passengerOccupied && !data.passengerSeatBelt;

      if ((driverViolation || passengerViolation) && Date.now() - lastSeatbeltAlertRef.current > 12000) {
        lastSeatbeltAlertRef.current = Date.now();
        const msg = driverViolation
          ? `Driver Seat Belt Unfastened! Vehicle speed is ${Math.round(data.speed)} km/h.`
          : `Passenger Seat Belt Unfastened! Vehicle speed is ${Math.round(data.speed)} km/h.`;

        notificationService.triggerAlert({
          type: 'over_speed',
          detail: msg,
        });

        const ev: DrivingEvent = {
          id: 'ev-sb-' + Date.now(),
          type: 'seatbelt_warning',
          severity: 'high',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          location: 'Live Location',
          details: msg,
        };
        if (isTripActive && !isTripPaused) {
          setTripEvents((prev) => [ev, ...prev]);
        }
      }

      // Evaluate AI driving events when trip is active
      if (isTripActive && !isTripPaused) {
        const ev = aiAnalysisService.evaluateTelemetry(data, prevTel);
        if (ev) {
          setTripEvents((prev) => [ev, ...prev]);
          if (ev.severity === 'high') {
            const alertType = ev.type === 'harsh_brake' ? 'hard_brake' : (ev.type as any);
            notificationService.triggerAlert({ type: alertType, detail: ev.details });
          }
        }
      }
      prevTel = data;
    });

    const unsubLoc = gpsService.subscribe((loc) => {
      setLocation(loc);
      if (isTripActive && !isTripPaused) {
        setTripRoute((prev) => [...prev, [loc.latitude, loc.longitude]]);
      }
    });

    const unsubAlert = notificationService.subscribeAlerts((alert) => {
      setActiveBanner(alert);
      setTimeout(() => setActiveBanner(null), 5000);
      refreshNotifications();
    });

    // Load persisted data
    refreshTrips();
    firestoreService.getPreferences().then(setPreferences);
    firestoreService.getEmergencyContacts().then(setEmergencyContacts);
    refreshNotifications();

    return () => {
      unsubState();
      unsubTel();
      unsubLoc();
      unsubAlert();
    };
  }, [isTripActive, isTripPaused]);

  // Active Trip Timer
  useEffect(() => {
    if (!isTripActive || isTripPaused) return;

    const timer = setInterval(() => {
      setTripDuration((prev) => prev + 1);
      const speedKmh = telemetry.speed || location.speed || 0;
      setTripDistance((prev) => prev + (speedKmh / 3600));

      const { score } = aiAnalysisService.calculateTripSummary(tripEvents, tripDistance, tripDuration);
      setCurrentTripScore(score);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTripActive, isTripPaused, telemetry.speed, location.speed, tripEvents, tripDistance, tripDuration]);

  const refreshTrips = async () => {
    const list = await firestoreService.getTrips();
    setTrips(list);
  };

  const refreshNotifications = async () => {
    const list = await firestoreService.getNotifications();
    setNotifications(list);
  };

  const scanDevices = () => obd2Service.scanForDevices();
  const connectDevice = (dev: BluetoothDeviceOption) => obd2Service.connectDevice(dev);
  const disconnectDevice = () => obd2Service.disconnect();
  const toggleDriverSeatBelt = () => obd2Service.toggleDriverSeatBelt();
  const togglePassengerSeatBelt = () => obd2Service.togglePassengerSeatBelt();

  const startTrip = () => {
    setIsTripActive(true);
    setIsTripPaused(false);
    setTripDuration(0);
    setTripDistance(0);
    setCurrentTripScore(100);
    setTripEvents([]);
    setTripRoute([[location.latitude, location.longitude]]);
  };

  const pauseTrip = () => setIsTripPaused(true);
  const resumeTrip = () => setIsTripPaused(false);

  const endTrip = async (): Promise<TripRecord | null> => {
    if (!isTripActive) return null;

    const { score, grade } = aiAnalysisService.calculateTripSummary(tripEvents, tripDistance, tripDuration);
    const now = new Date();
    const newTrip: TripRecord = {
      id: 'trip-' + Date.now(),
      userId: 'usr-987654321',
      date: now.toISOString().split('T')[0],
      startTime: new Date(now.getTime() - tripDuration * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: tripDuration,
      distanceKm: parseFloat(tripDistance.toFixed(1)),
      avgSpeedKmh: tripDuration > 0 ? Math.round((tripDistance / (tripDuration / 3600))) : 0,
      maxSpeedKmh: Math.max(70, Math.round(telemetry.speed || 65)),
      fuelUsedLiters: parseFloat((tripDistance * 0.08).toFixed(1)),
      drivingScore: score,
      drivingGrade: grade,
      startLocation: tripRoute.length > 0 ? `${tripRoute[0][0].toFixed(3)}, ${tripRoute[0][1].toFixed(3)}` : 'Start Point',
      endLocation: `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`,
      eventsCount: tripEvents.length,
      events: tripEvents,
      routeCoordinates: tripRoute,
    };

    await firestoreService.saveTrip(newTrip);
    await refreshTrips();

    setIsTripActive(false);
    setIsTripPaused(false);
    return newTrip;
  };

  const deleteTrip = async (id: string) => {
    await firestoreService.deleteTrip(id);
    await refreshTrips();
  };

  const updatePreferences = async (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    await firestoreService.savePreferences(newPrefs);
  };

  const updateEmergencyContacts = async (contacts: EmergencyContact[]) => {
    setEmergencyContacts(contacts);
    await firestoreService.saveEmergencyContacts(contacts);
  };

  const markNotificationRead = async (id: string) => {
    await firestoreService.markNotificationRead(id);
    await refreshNotifications();
  };

  const formatSpeed = (kmh: number): number => {
    return preferences.speedUnit === 'mph' ? Math.round(kmh * 0.621371) : Math.round(kmh);
  };

  const speedUnitLabel = preferences.speedUnit === 'mph' ? 'mph' : 'km/h';

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || (trips.length > 0 ? trips[0] : null);

  return (
    <DriveSenseContext.Provider
      value={{
        connectionStatus,
        connectedDevice,
        telemetry,
        scanDevices,
        connectDevice,
        disconnectDevice,
        toggleDriverSeatBelt,
        togglePassengerSeatBelt,
        location,
        isTripActive,
        isTripPaused,
        tripDuration,
        tripDistance,
        currentTripScore,
        tripEvents,
        startTrip,
        pauseTrip,
        resumeTrip,
        endTrip,
        trips,
        selectedTripId,
        selectedTrip,
        setSelectedTripId,
        refreshTrips,
        deleteTrip,
        preferences,
        updatePreferences,
        emergencyContacts,
        updateEmergencyContacts,
        notifications,
        activeBanner,
        clearBanner,
        markNotificationRead,
        formatSpeed,
        speedUnitLabel,
        canInstallPwa,
        installApp,
      }}
    >
      {children}
    </DriveSenseContext.Provider>
  );
};

export const useDriveSense = () => {
  const context = useContext(DriveSenseContext);
  if (!context) {
    throw new Error('useDriveSense must be used within a DriveSenseProvider');
  }
  return context;
};
