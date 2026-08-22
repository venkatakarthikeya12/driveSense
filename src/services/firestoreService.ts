import { TripRecord, EmergencyContact, UserPreferences, NotificationItem } from '../models/types';
import {
  LOCAL_STORAGE_TRIPS_KEY,
  LOCAL_STORAGE_SETTINGS_KEY,
  LOCAL_STORAGE_CONTACTS_KEY,
  LOCAL_STORAGE_NOTIFS_KEY,
} from '../config/firebase';

const INITIAL_TRIPS: TripRecord[] = [
  {
    id: 'trip-101',
    userId: 'usr-987654321',
    date: '2026-07-28',
    startTime: '08:30 AM',
    endTime: '09:05 AM',
    durationSeconds: 2100,
    distanceKm: 18.5,
    avgSpeedKmh: 42,
    maxSpeedKmh: 75,
    fuelUsedLiters: 1.4,
    drivingScore: 88,
    drivingGrade: 'A',
    startLocation: 'Downtown Office',
    endLocation: 'Home Station',
    eventsCount: 1,
    events: [
      { id: 'ev-1', type: 'harsh_brake', severity: 'medium', time: '8:42 AM', timestamp: Date.now() - 86400000 + 720, location: 'Market St & 4th' }
    ],
    routeCoordinates: [
      [37.7749, -122.4194],
      [37.7780, -122.4140],
      [37.7830, -122.4080],
      [37.7890, -122.4010]
    ]
  },
  {
    id: 'trip-102',
    userId: 'usr-987654321',
    date: '2026-07-27',
    startTime: '05:15 PM',
    endTime: '06:00 PM',
    durationSeconds: 2700,
    distanceKm: 24.2,
    avgSpeedKmh: 51,
    maxSpeedKmh: 88,
    fuelUsedLiters: 1.9,
    drivingScore: 76,
    drivingGrade: 'B',
    startLocation: 'Tech Park',
    endLocation: 'Sunset Blvd',
    eventsCount: 3,
    events: [
      { id: 'ev-2', type: 'over_speed', severity: 'high', time: '5:32 PM', timestamp: Date.now() - 172800000 + 1000, location: 'Hwy 101 N' },
      { id: 'ev-3', type: 'sharp_turn', severity: 'low', time: '5:45 PM', timestamp: Date.now() - 172800000 + 1800, location: 'Oak Ave' }
    ],
    routeCoordinates: [
      [37.7890, -122.4010],
      [37.7950, -122.3950],
      [37.8010, -122.3900]
    ]
  },
  {
    id: 'trip-103',
    userId: 'usr-987654321',
    date: '2026-07-26',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    durationSeconds: 1800,
    distanceKm: 14.0,
    avgSpeedKmh: 38,
    maxSpeedKmh: 62,
    fuelUsedLiters: 1.1,
    drivingScore: 94,
    drivingGrade: 'A+',
    startLocation: 'Green Valley',
    endLocation: 'Central Mall',
    eventsCount: 0,
    events: [],
    routeCoordinates: [
      [37.7600, -122.4300],
      [37.7650, -122.4250]
    ]
  }
];

const DEFAULT_PREFERENCES: UserPreferences = {
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
  privacySettings: {
    shareLocation: true,
    anonymousAnalytics: true,
    dataRetentionDays: 90,
  },
};

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: 'c-1', name: 'Sarah Doe', phone: '+1 (555) 987-6543', relation: 'Spouse', isPrimary: true },
  { id: 'c-2', name: 'Robert Doe', phone: '+1 (555) 456-7890', relation: 'Brother', isPrimary: false },
];

const DEFAULT_NOTIFS: NotificationItem[] = [
  { id: 'n-1', title: 'Service Reminder', message: 'Engine oil check recommended in 250 km.', type: 'info', timestamp: Date.now() - 3600000, read: false },
  { id: 'n-2', title: 'High Safety Score!', message: 'Great job! Your trip score was 94/100.', type: 'success', timestamp: Date.now() - 86400000, read: true },
];

class FirestoreService {
  // Trips Collection
  public async getTrips(): Promise<TripRecord[]> {
    const data = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TRIPS;
    }
  }

  public async saveTrip(trip: TripRecord): Promise<TripRecord> {
    const trips = await this.getTrips();
    const updated = [trip, ...trips.filter((t) => t.id !== trip.id)];
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(updated));
    return trip;
  }

  public async deleteTrip(id: string): Promise<void> {
    const trips = await this.getTrips();
    const filtered = trips.filter((t) => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(filtered));
  }

  // Preferences / Settings Collection
  public async getPreferences(): Promise<UserPreferences> {
    const data = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  public async savePreferences(prefs: UserPreferences): Promise<UserPreferences> {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(prefs));
    return prefs;
  }

  // Emergency Contacts Collection
  public async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const data = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CONTACTS;
    }
  }

  public async saveEmergencyContacts(contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(contacts));
    return contacts;
  }

  // Notifications Collection
  public async getNotifications(): Promise<NotificationItem[]> {
    const data = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(DEFAULT_NOTIFS));
      return DEFAULT_NOTIFS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_NOTIFS;
    }
  }

  public async addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    const items = await this.getNotifications();
    const newItem: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      read: false,
    };
    const updated = [newItem, ...items];
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(updated));
    return newItem;
  }

  public async markNotificationRead(id: string): Promise<void> {
    const items = await this.getNotifications();
    const updated = items.map((item) => (item.id === id ? { ...item, read: true } : item));
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(updated));
  }
}

export const firestoreService = new FirestoreService();
