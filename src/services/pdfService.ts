import { TripRecord } from '../models/types';

class PDFService {
  public exportTripPDF(trip: TripRecord): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DriveSense Trip Report - ${trip.id}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1a1a1a; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2196f3; padding-bottom: 15px; }
          .logo { font-size: 26px; font-weight: 800; color: #2196f3; }
          .score-badge { font-size: 32px; font-weight: 800; color: #4caf50; background: #e8f5e9; padding: 10px 20px; border-radius: 8px; text-align: center; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
          .label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
          .value { font-size: 20px; font-weight: 700; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 25px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f1f5f9; font-weight: 700; color: #334155; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">DriveSense</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Intelligent Driving Behavior Report</div>
          </div>
          <div class="score-badge">
            ${trip.drivingScore} <span style="font-size: 14px; font-weight: 600; color: #334155;">/ 100 (${trip.drivingGrade})</span>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 14px;">
          <strong>Date:</strong> ${trip.date} &nbsp;|&nbsp; <strong>Time:</strong> ${trip.startTime} - ${trip.endTime}
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">Total Distance</div>
            <div class="value">${trip.distanceKm} km</div>
          </div>
          <div class="card">
            <div class="label">Average Speed</div>
            <div class="value">${trip.avgSpeedKmh} km/h</div>
          </div>
          <div class="card">
            <div class="label">Maximum Speed</div>
            <div class="value">${trip.maxSpeedKmh} km/h</div>
          </div>
          <div class="card">
            <div class="label">Fuel Used</div>
            <div class="value">${trip.fuelUsedLiters} L</div>
          </div>
        </div>

        <h3 style="margin-top: 30px; color: #0f172a;">Driving Events Summary</h3>
        ${
          trip.events.length === 0
            ? '<p style="color: #4caf50; font-weight: 600;">No safety events detected during this trip. Perfect driving!</p>'
            : `
            <table>
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Severity</th>
                  <th>Time</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                ${trip.events
                  .map(
                    (e) => `
                  <tr>
                    <td style="text-transform: capitalize;">${e.type.replace('_', ' ')}</td>
                    <td><span style="color: ${e.severity === 'high' ? '#dc2626' : '#d97706'}; font-weight: 700;">${e.severity.toUpperCase()}</span></td>
                    <td>${e.time}</td>
                    <td>${e.location}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
        }

        <div class="footer">
          DriveSense Inc. • Confidential Driver Analytics Report • ${new Date().toLocaleDateString()}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

export const pdfService = new PDFService();
