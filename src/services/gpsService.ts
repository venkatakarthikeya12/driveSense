import { GPSLocation, NearbyPlace } from '../models/types';

class GPSService {
  private currentLocation: GPSLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 15,
    speed: 0,
    heading: 90,
    accuracy: 10,
    timestamp: Date.now(),
    address: 'Market St, San Francisco, CA',
  };

  private watchId: number | null = null;
  private listeners: ((loc: GPSLocation) => void)[] = [];

  constructor() {
    this.initGPSWatcher();
  }

  private initGPSWatcher() {
    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.currentLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed ? pos.coords.speed * 3.6 : 0, // m/s to km/h
            heading: pos.coords.heading,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
            address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          };
          this.notify();
        },
        () => {
          // Fallback location simulation if user denies permission or browser doesn't have GPS fix
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }
  }

  public getCurrentLocation(): GPSLocation {
    return { ...this.currentLocation };
  }

  public subscribe(callback: (loc: GPSLocation) => void): () => void {
    this.listeners.push(callback);
    callback({ ...this.currentLocation });
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.currentLocation }));
  }

  public getNearbyPlaces(type: 'gas_station' | 'service_center' | 'hospital' | 'police'): NearbyPlace[] {
    const lat = this.currentLocation.latitude;
    const lng = this.currentLocation.longitude;

    switch (type) {
      case 'gas_station':
        return [
          { id: 'gas-1', name: 'Shell Station & EV Charge', type: 'gas_station', distance: '0.8 km', address: '123 Market St', phone: '+1 555-0192', openNow: true, latitude: lat + 0.005, longitude: lng + 0.003 },
          { id: 'gas-2', name: 'Chevron Express', type: 'gas_station', distance: '1.4 km', address: '456 Mission St', phone: '+1 555-0193', openNow: true, latitude: lat - 0.004, longitude: lng + 0.006 },
          { id: 'gas-3', name: 'BP Super Charge', type: 'gas_station', distance: '2.1 km', address: '789 Howard St', phone: '+1 555-0194', openNow: true, latitude: lat + 0.008, longitude: lng - 0.005 },
        ];
      case 'service_center':
        return [
          { id: 'srv-1', name: 'DriveSense Certified Auto Care', type: 'service_center', distance: '1.2 km', address: '888 Folsom St', phone: '+1 555-0288', openNow: true, latitude: lat + 0.003, longitude: lng - 0.004 },
          { id: 'srv-2', name: 'Speedy Tire & Oil Service', type: 'service_center', distance: '2.5 km', address: '321 8th St', phone: '+1 555-0289', openNow: true, latitude: lat - 0.007, longitude: lng - 0.002 },
        ];
      case 'hospital':
        return [
          { id: 'hosp-1', name: 'General Medical Center ER', type: 'hospital', distance: '1.5 km', address: '1001 Potrero Ave', phone: '+1 911 / +1 555-0911', openNow: true, latitude: lat + 0.009, longitude: lng + 0.002 },
          { id: 'hosp-2', name: 'St. Jude Emergency Hospital', type: 'hospital', distance: '3.2 km', address: '500 Parnassus Ave', phone: '+1 911 / +1 555-0912', openNow: true, latitude: lat - 0.012, longitude: lng - 0.010 },
        ];
      case 'police':
        return [
          { id: 'pol-1', name: 'Central Police Precinct', type: 'police', distance: '1.1 km', address: '766 Vallejo St', phone: '+1 911 / +1 555-0999', openNow: true, latitude: lat + 0.006, longitude: lng - 0.001 },
        ];
    }
  }

  public stop() {
    if (this.watchId !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}

export const gpsService = new GPSService();
