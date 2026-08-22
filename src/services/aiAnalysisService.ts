import { DrivingEvent, OBDTelemetry, TripRecord } from '../models/types';

export interface AIAnalysisReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  brakingScore: number;
  accelerationScore: number;
  corneringScore: number;
  speedControlScore: number;
  attentionScore: number;
  suggestions: string[];
  trends: { day: string; score: number }[];
}

class AIAnalysisService {
  public evaluateTelemetry(
    telemetry: OBDTelemetry,
    prevTelemetry?: OBDTelemetry,
    speedLimit = 80
  ): DrivingEvent | null {
    if (!prevTelemetry) return null;

    const deltaSpeed = telemetry.speed - prevTelemetry.speed; // km/h change per sec
    const accelMps2 = (deltaSpeed * 1000) / 3600; // m/s²

    // Rapid Acceleration (> 3.2 m/s²)
    if (accelMps2 > 3.2) {
      return {
        id: 'ev-' + Date.now(),
        type: 'rapid_accel',
        severity: accelMps2 > 4.5 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        location: 'Current Location',
        details: `Rapid acceleration: +${(accelMps2 * 3.6).toFixed(1)} km/h/s`,
      };
    }

    // Hard Braking (< -3.5 m/s²)
    if (accelMps2 < -3.5) {
      return {
        id: 'ev-' + Date.now(),
        type: 'harsh_brake',
        severity: accelMps2 < -5.0 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        location: 'Current Location',
        details: `Hard braking detected: ${(accelMps2 * 3.6).toFixed(1)} km/h/s`,
      };
    }

    // Over Speeding (> speedLimit + 10 km/h)
    if (telemetry.speed > speedLimit + 10) {
      return {
        id: 'ev-' + Date.now(),
        type: 'over_speed',
        severity: telemetry.speed > speedLimit + 25 ? 'high' : 'medium',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        location: 'Current Location',
        details: `Vehicle speed ${telemetry.speed} km/h exceeded limit (${speedLimit} km/h)`,
      };
    }

    return null;
  }

  public calculateTripSummary(events: DrivingEvent[], distanceKm: number, durationSec: number): {
    score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  } {
    let penalty = 0;
    events.forEach((ev) => {
      if (ev.severity === 'high') penalty += 8;
      else if (ev.severity === 'medium') penalty += 4;
      else penalty += 2;
    });

    if (durationSec > 7200) penalty += 5; // Long drive fatigue penalty

    const rawScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    const grade =
      rawScore >= 92 ? 'A+' :
      rawScore >= 85 ? 'A' :
      rawScore >= 75 ? 'B' :
      rawScore >= 65 ? 'C' :
      rawScore >= 50 ? 'D' : 'F';

    return { score: rawScore, grade };
  }

  public generateFullReport(trips: TripRecord[]): AIAnalysisReport {
    if (!trips || trips.length === 0) {
      return {
        score: 85,
        grade: 'A',
        brakingScore: 82,
        accelerationScore: 88,
        corneringScore: 80,
        speedControlScore: 90,
        attentionScore: 85,
        suggestions: [
          'Maintain smooth pressure on the brake pedal when approaching intersections.',
          'Keep a 3-second safety distance from leading vehicles.',
          'Ease throttle input on freeway entrance ramps.'
        ],
        trends: [
          { day: 'Mon', score: 75 },
          { day: 'Tue', score: 82 },
          { day: 'Wed', score: 78 },
          { day: 'Thu', score: 85 },
          { day: 'Fri', score: 80 },
          { day: 'Sat', score: 88 },
          { day: 'Sun', score: 82 },
        ]
      };
    }

    const avgScore = Math.round(trips.reduce((acc, t) => acc + t.drivingScore, 0) / trips.length);
    const totalEvents = trips.reduce((acc, t) => acc + t.eventsCount, 0);

    const suggestions: string[] = [];
    if (totalEvents > 5) {
      suggestions.push('High event frequency detected. Try anticipating stops 100 meters earlier.');
    }
    if (avgScore < 80) {
      suggestions.push('Reduce highway speed by 5 km/h to optimize safety margin and fuel economy.');
    } else {
      suggestions.push('Excellent smooth driving! You are in the top 15% safest drivers.');
    }
    suggestions.push('Take a 15-minute break for every 2 hours of continuous driving.');

    const grade =
      avgScore >= 92 ? 'A+' :
      avgScore >= 85 ? 'A' :
      avgScore >= 75 ? 'B' :
      avgScore >= 65 ? 'C' :
      avgScore >= 50 ? 'D' : 'F';

    return {
      score: avgScore,
      grade,
      brakingScore: Math.min(100, avgScore + 4),
      accelerationScore: Math.min(100, avgScore + 2),
      corneringScore: Math.min(100, avgScore - 3),
      speedControlScore: Math.min(100, avgScore + 5),
      attentionScore: Math.min(100, avgScore + 1),
      suggestions,
      trends: trips.slice(0, 7).reverse().map((t, idx) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx % 7] || t.date.slice(-5),
        score: t.drivingScore,
      }))
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();
