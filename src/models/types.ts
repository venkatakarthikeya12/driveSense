export interface UserProfileData {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  photoURL?: string;
  joinDate: string;
  level: number;
  xp: number;
  totalTrips: number;
  totalDistance: number;
  averageScore: number;
  rank: string;
  badges: string[];
}

export interface UserPreferences {
  darkMode: boolean;
  language: string;
  speedUnit: 'kmh' | 'mph';
  notificationPreferences: {
    overspeed: boolean;
    hardBrake: boolean;
    overheat: boolean;
    lowFuel: boolean;
    bluetoothDisconnect: boolean;
    batteryLow: boolean;
    serviceReminder: boolean;
  };
  privacySettings: {
    shareLocation: boolean;
    anonymousAnalytics: boolean;
    dataRetentionDays: number;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

export interface OBDTelemetry {
  speed: number;          // km/h
  rpm: number;            // RPM
  throttlePosition: number;// %
  fuelLevel: number;      // %
  engineLoad: number;     // %
  coolantTemp: number;    // °C
  batteryVoltage: number; // V
  intakeAirTemp: number;  // °C
  distanceTravelled: number; // km
  fuelConsumption: number; // L/100km
  currentGear?: string;
  // Stage 1 Simulated Sensors & Diagnostics
  driverOccupied?: boolean;
  driverSeatBelt?: boolean;
  passengerOccupied?: boolean;
  passengerSeatBelt?: boolean;
  brakeCondition?: number;      // %
  tirePressure?: number;        // PSI
  oilStatus?: number;           // %
  vehicleHealthScore?: number;  // 0 - 100
  vehicleHealthStatus?: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  accuracy?: number;
  timestamp: number;
  address?: string;
}

export interface DrivingEvent {
  id: string;
  type: 'harsh_brake' | 'hard_brake' | 'rapid_accel' | 'sharp_turn' | 'over_speed' | 'idle_time' | 'fatigue' | 'seatbelt_warning' | 'engine_overheat' | 'low_fuel' | 'low_battery' | 'bluetooth_disconnect' | 'battery_low' | 'service_reminder';
  severity: 'low' | 'medium' | 'high';
  time: string;
  timestamp: number;
  location: string;
  latitude?: number;
  longitude?: number;
  details?: string;
}

export interface TripRecord {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  distanceKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  fuelUsedLiters: number;
  drivingScore: number;
  drivingGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  startLocation: string;
  endLocation: string;
  eventsCount: number;
  events: DrivingEvent[];
  routeCoordinates?: [number, number][];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  timestamp: number;
  read: boolean;
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: 'gas_station' | 'service_center' | 'hospital' | 'police';
  distance: string;
  address: string;
  phone?: string;
  openNow: boolean;
  latitude: number;
  longitude: number;
}
