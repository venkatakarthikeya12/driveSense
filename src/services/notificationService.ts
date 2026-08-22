import { firestoreService } from './firestoreService';

export interface AlertTriggerOptions {
  type:
    | 'over_speed'
    | 'hard_brake'
    | 'rapid_accel'
    | 'sharp_turn'
    | 'idle_time'
    | 'fatigue'
    | 'seatbelt_warning'
    | 'engine_overheat'
    | 'low_fuel'
    | 'bluetooth_disconnect'
    | 'battery_low'
    | 'service_reminder';
  detail?: string;
}

class NotificationService {
  private alertListeners: ((alert: { title: string; message: string; severity: 'error' | 'warning' | 'info' }) => void)[] = [];

  public subscribeAlerts(callback: (alert: { title: string; message: string; severity: 'error' | 'warning' | 'info' }) => void): () => void {
    this.alertListeners.push(callback);
    return () => {
      this.alertListeners = this.alertListeners.filter((cb) => cb !== callback);
    };
  }

  public triggerAlert(options: AlertTriggerOptions) {
    let title = '';
    let message = '';
    let severity: 'error' | 'warning' | 'info' = 'warning';

    switch (options.type) {
      case 'over_speed':
        title = 'Over Speed Warning';
        message = options.detail || 'Vehicle speed exceeded safety limit!';
        severity = 'error';
        break;
      case 'hard_brake':
        title = 'Hard Brake Event';
        message = options.detail || 'Sudden deceleration detected.';
        severity = 'warning';
        break;
      case 'rapid_accel':
        title = 'Rapid Acceleration';
        message = options.detail || 'Aggressive acceleration detected.';
        severity = 'warning';
        break;
      case 'sharp_turn':
        title = 'Sharp Cornering Event';
        message = options.detail || 'Sudden sharp turn detected.';
        severity = 'warning';
        break;
      case 'seatbelt_warning':
        title = 'Seat Belt Warning';
        message = options.detail || 'Occupant seat belt unfastened while moving!';
        severity = 'error';
        break;
      case 'engine_overheat':
        title = 'Engine Overheat Warning';
        message = options.detail || 'Coolant temperature exceeded 105°C.';
        severity = 'error';
        break;
      case 'low_fuel':
        title = 'Low Fuel Warning';
        message = options.detail || 'Fuel level below 15%. Please refuel soon.';
        severity = 'warning';
        break;
      case 'bluetooth_disconnect':
        title = 'OBD-II Disconnected';
        message = options.detail || 'Bluetooth dongle connection lost.';
        severity = 'error';
        break;
      case 'battery_low':
        title = 'Low Battery Voltage';
        message = options.detail || 'Vehicle battery voltage dropped below 11.8V.';
        severity = 'warning';
        break;
      case 'service_reminder':
        title = 'Service Reminder';
        message = options.detail || 'Scheduled vehicle maintenance due.';
        severity = 'info';
        break;
      default:
        title = 'Driver Telematics Alert';
        message = options.detail || 'Driving event detected.';
        severity = 'warning';
        break;
    }

    // Save to Firestore / local history
    firestoreService.addNotification({
      title,
      message,
      type: severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'info',
    });

    // Notify listeners for UI banner display
    this.alertListeners.forEach((cb) => cb({ title, message, severity }));
  }
}

export const notificationService = new NotificationService();
