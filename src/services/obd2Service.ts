import { OBDTelemetry } from '../models/types';

export interface BluetoothDeviceOption {
  id: string;
  name: string;
  type: 'obd2' | 'bluetooth' | 'wifi';
  signal: number;
  paired?: boolean;
}

export type ConnectionState = 'disconnected' | 'scanning' | 'pairing' | 'connected';

class OBD2Service {
  private currentState: ConnectionState = 'connected';
  private currentDevice: BluetoothDeviceOption | null = {
    id: 'simulated-obd-01',
    name: 'DriveSense Demo Telemetry System',
    type: 'obd2',
    signal: 100,
    paired: true,
  };
  private timerId: ReturnType<typeof setInterval> | null = null;
  private telemetryListeners: ((data: OBDTelemetry) => void)[] = [];
  private stateListeners: ((state: ConnectionState, device: BluetoothDeviceOption | null) => void)[] = [];

  private telemetry: OBDTelemetry = {
    speed: 0,
    rpm: 850,
    throttlePosition: 12,
    fuelLevel: 72,
    engineLoad: 18,
    coolantTemp: 88,
    batteryVoltage: 13.8,
    intakeAirTemp: 24,
    distanceTravelled: 12.4,
    fuelConsumption: 7.2,
    currentGear: 'P',
    driverOccupied: true,
    driverSeatBelt: false,
    passengerOccupied: true,
    passengerSeatBelt: false,
    brakeCondition: 92,
    tirePressure: 32,
    oilStatus: 88,
    vehicleHealthScore: 94,
    vehicleHealthStatus: 'Excellent',
  };

  constructor() {
    this.startDataStream();
  }

  public getState(): ConnectionState {
    return this.currentState;
  }

  public getDevice(): BluetoothDeviceOption | null {
    return this.currentDevice;
  }

  public getTelemetry(): OBDTelemetry {
    return { ...this.telemetry };
  }

  public subscribeTelemetry(callback: (data: OBDTelemetry) => void): () => void {
    this.telemetryListeners.push(callback);
    callback({ ...this.telemetry });
    return () => {
      this.telemetryListeners = this.telemetryListeners.filter((cb) => cb !== callback);
    };
  }

  public subscribeState(callback: (state: ConnectionState, device: BluetoothDeviceOption | null) => void): () => void {
    this.stateListeners.push(callback);
    callback(this.currentState, this.currentDevice);
    return () => {
      this.stateListeners = this.stateListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyTelemetry() {
    this.telemetryListeners.forEach((cb) => cb({ ...this.telemetry }));
  }

  private notifyState() {
    this.stateListeners.forEach((cb) => cb(this.currentState, this.currentDevice));
  }

  // Interactive controls for Stage 1 testing
  public toggleDriverSeatBelt(): void {
    this.telemetry.driverSeatBelt = !this.telemetry.driverSeatBelt;
    this.notifyTelemetry();
  }

  public togglePassengerSeatBelt(): void {
    this.telemetry.passengerSeatBelt = !this.telemetry.passengerSeatBelt;
    this.notifyTelemetry();
  }

  public togglePassengerOccupancy(): void {
    this.telemetry.passengerOccupied = !this.telemetry.passengerOccupied;
    this.notifyTelemetry();
  }

  public setDriverSeatBelt(fastened: boolean): void {
    this.telemetry.driverSeatBelt = fastened;
    this.notifyTelemetry();
  }

  public setPassengerSeatBelt(fastened: boolean): void {
    this.telemetry.passengerSeatBelt = fastened;
    this.notifyTelemetry();
  }

  public calculateHealthScore(): { score: number; status: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical' } {
    let penalty = 0;

    // Coolant temp check
    if (this.telemetry.coolantTemp > 105) penalty += 40;
    else if (this.telemetry.coolantTemp > 98) penalty += 15;

    // Battery voltage check
    if (this.telemetry.batteryVoltage < 11.8) penalty += 35;
    else if (this.telemetry.batteryVoltage < 12.4) penalty += 15;

    // Fuel level check
    if (this.telemetry.fuelLevel < 10) penalty += 30;
    else if (this.telemetry.fuelLevel < 20) penalty += 10;

    // Brakes check
    if ((this.telemetry.brakeCondition || 92) < 50) penalty += 30;
    else if ((this.telemetry.brakeCondition || 92) < 75) penalty += 10;

    const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    let status: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical' = 'Excellent';
    if (score >= 90) status = 'Excellent';
    else if (score >= 75) status = 'Good';
    else if (score >= 50) status = 'Needs Attention';
    else status = 'Critical';

    return { score, status };
  }

  // Web Bluetooth API Integration with Fallback (for Stage 2 preparation)
  public async scanForDevices(): Promise<BluetoothDeviceOption[]> {
    this.currentState = 'scanning';
    this.notifyState();

    if ('bluetooth' in navigator && (navigator as any).bluetooth) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['00001101-0000-1000-8000-00805f9b34fb', '0000fff0-0000-1000-8000-00805f9b34fb']
        });
        const found: BluetoothDeviceOption = {
          id: device.id || 'bt-hw-1',
          name: device.name || 'ELM327 OBDII Adapter',
          type: 'bluetooth',
          signal: 95,
        };
        this.currentState = 'connected';
        this.notifyState();
        return [found];
      } catch (err) {
        // User cancelled Web Bluetooth dialog
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));
    this.currentState = 'connected';
    this.notifyState();
    return [
      { id: 'obd-001', name: 'DriveSense Demo Telemetry System', type: 'obd2', signal: 98 },
      { id: 'elm-327', name: 'ELM327 Bluetooth (Simulated)', type: 'bluetooth', signal: 85 },
      { id: 'wifi-obd', name: 'WiFi OBD Scanner (Simulated)', type: 'wifi', signal: 90 },
    ];
  }

  public async connectDevice(device: BluetoothDeviceOption): Promise<void> {
    this.currentState = 'pairing';
    this.currentDevice = device;
    this.notifyState();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.currentState = 'connected';
    this.currentDevice = { ...device, paired: true };
    this.notifyState();
    this.startDataStream();
  }

  public disconnect(): void {
    this.currentState = 'disconnected';
    this.currentDevice = null;
    this.notifyState();
  }

  private startDataStream(): void {
    if (this.timerId) clearInterval(this.timerId);

    let tick = 0;
    this.timerId = setInterval(async () => {
      tick++;

      // 1. Attempt live sync from backend server /api/telemetry endpoint if available
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.telemetry) {
            this.telemetry = {
              ...this.telemetry,
              ...data.telemetry,
              vehicleHealthScore: data.telemetry.safetyScore || this.telemetry.vehicleHealthScore,
            };
            this.notifyTelemetry();
            return;
          }
        }
      } catch {
        // Fall back gracefully to local physics simulation engine if server is offline
      }

      // Create realistic driving cycles: idle -> acceleration -> cruise -> deceleration -> highway
      const cycleTime = tick % 60;
      let targetSpeed = 0;

      if (cycleTime < 5) {
        // Stop / Idling
        targetSpeed = 0;
      } else if (cycleTime < 20) {
        // Smooth city driving acceleration (up to 48 km/h)
        targetSpeed = (cycleTime - 5) * 3.2;
      } else if (cycleTime < 35) {
        // Cruising with gentle fluctuations
        targetSpeed = 48 + Math.sin(tick / 2) * 5;
      } else if (cycleTime < 45) {
        // Highway boost (up to 95 km/h)
        targetSpeed = 48 + (cycleTime - 35) * 4.7;
      } else if (cycleTime < 55) {
        // Deceleration / Braking
        targetSpeed = 95 - (cycleTime - 45) * 9.5;
      } else {
        // Stop at light
        targetSpeed = 0;
      }

      // Add minor random noise
      const currentSpeed = Math.max(0, Math.round(targetSpeed + (Math.random() - 0.5) * 2));
      this.telemetry.speed = currentSpeed;

      // Realistic relationship: RPM scales with speed and current gear
      if (currentSpeed === 0) {
        this.telemetry.rpm = 850 + Math.round((Math.random() - 0.5) * 30);
        this.telemetry.currentGear = 'P';
        this.telemetry.engineLoad = 14;
        this.telemetry.throttlePosition = 5;
      } else if (currentSpeed < 18) {
        this.telemetry.currentGear = '1st';
        this.telemetry.rpm = Math.min(3200, Math.max(1200, Math.round(currentSpeed * 110 + 900)));
        this.telemetry.engineLoad = 35;
        this.telemetry.throttlePosition = 25;
      } else if (currentSpeed < 38) {
        this.telemetry.currentGear = '2nd';
        this.telemetry.rpm = Math.min(3400, Math.max(1300, Math.round((currentSpeed - 18) * 80 + 1300)));
        this.telemetry.engineLoad = 42;
        this.telemetry.throttlePosition = 38;
      } else if (currentSpeed < 65) {
        this.telemetry.currentGear = '3rd';
        this.telemetry.rpm = Math.min(3500, Math.max(1500, Math.round((currentSpeed - 38) * 60 + 1400)));
        this.telemetry.engineLoad = 48;
        this.telemetry.throttlePosition = 45;
      } else if (currentSpeed < 88) {
        this.telemetry.currentGear = '4th';
        this.telemetry.rpm = Math.min(3600, Math.max(1700, Math.round((currentSpeed - 65) * 55 + 1700)));
        this.telemetry.engineLoad = 55;
        this.telemetry.throttlePosition = 55;
      } else {
        this.telemetry.currentGear = '5th';
        this.telemetry.rpm = Math.min(4200, Math.max(2000, Math.round((currentSpeed - 88) * 45 + 2000)));
        this.telemetry.engineLoad = 68;
        this.telemetry.throttlePosition = 70;
      }

      // Coolant temp & battery voltage
      this.telemetry.coolantTemp = Math.min(102, Math.max(84, 88 + Math.floor(Math.sin(tick / 10) * 4)));
      this.telemetry.batteryVoltage = parseFloat((13.8 + Math.sin(tick / 6) * 0.3).toFixed(1));
      this.telemetry.intakeAirTemp = 24 + Math.floor(Math.sin(tick / 15) * 3);

      // Fuel consumption & distance
      if (currentSpeed > 0) {
        this.telemetry.fuelLevel = Math.max(5, parseFloat((this.telemetry.fuelLevel - 0.002).toFixed(2)));
        this.telemetry.distanceTravelled = parseFloat((this.telemetry.distanceTravelled + (currentSpeed / 3600)).toFixed(2));
      }
      this.telemetry.fuelConsumption = parseFloat((6.8 + (currentSpeed > 80 ? 2.1 : 0.6)).toFixed(1));

      // Auto update health score
      const { score: healthScore, status: healthStatus } = this.calculateHealthScore();
      this.telemetry.vehicleHealthScore = healthScore;
      this.telemetry.vehicleHealthStatus = healthStatus;

      this.notifyTelemetry();
    }, 1000);
  }

  // PID Decoder parsing logic for OBD-II ASCII frames
  public parsePID(hexString: string): { pid: string; value: number } | null {
    try {
      const clean = hexString.replace(/\s+/g, '').toUpperCase();
      if (clean.startsWith('410D')) {
        const speed = parseInt(clean.substring(4, 6), 16);
        return { pid: '010D', value: speed };
      }
      if (clean.startsWith('410C')) {
        const a = parseInt(clean.substring(4, 6), 16);
        const b = parseInt(clean.substring(6, 8), 16);
        const rpm = Math.round(((a * 256) + b) / 4);
        return { pid: '010C', value: rpm };
      }
      if (clean.startsWith('4105')) {
        const temp = parseInt(clean.substring(4, 6), 16) - 40;
        return { pid: '0105', value: temp };
      }
      if (clean.startsWith('412F')) {
        const fuel = Math.round((parseInt(clean.substring(4, 6), 16) * 100) / 255);
        return { pid: '012F', value: fuel };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const obd2Service = new OBD2Service();
