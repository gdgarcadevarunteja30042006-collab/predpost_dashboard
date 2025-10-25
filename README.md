# Predictive Maintenance Dashboard

An interactive web dashboard for monitoring machine health, submitting sensor data for predictions, and visualizing historical trends using React, Tailwind CSS, and Chart.js.

## Features

- **Dashboard**: Real-time machine health monitoring with status cards and pie charts
- **Prediction Form**: Submit sensor data to predict machine health status
- **Data Visualization**: Interactive time-series charts for temperature, vibration, RPM deviation, and current delta
- **Historical Data**: Paginated table with sorting, filtering, and CSV export
- **Alerts & Notifications**: Real-time fault detection with severity levels
- **Dark/Light Theme**: User preference toggle with persistent storage
- **Responsive Design**: Mobile-friendly layout that works across all devices

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js + react-chartjs-2** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running (default: http://localhost:5000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## API Endpoints

The dashboard expects the following API endpoints:

- `GET /` - Health check
- `POST /predict` - Submit sensor data for prediction
  - Body: `{ temperature, vibration, rpm_dev, current_delta }`
- `GET /sensor-data?page=X&limit=Y` - Fetch paginated historical data

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.jsx
│   ├── StatusCard.jsx
│   └── LoadingSpinner.jsx
├── contexts/         # React contexts
│   └── ThemeContext.jsx
├── pages/            # Route pages
│   ├── Dashboard.jsx
│   ├── Predict.jsx
│   ├── Visualize.jsx
│   ├── History.jsx
│   └── Alerts.jsx
├── services/         # API integration
│   └── api.js
├── App.jsx           # Main app component
└── main.jsx          # App entry point
```

## Usage

### Dashboard Page
View real-time machine health overview with status metrics and recent predictions.

### Predict Page
Enter sensor readings to get instant machine health predictions:
- Temperature (°C)
- Vibration (mm/s)
- RPM Deviation
- Current Delta (A)

### Visualize Page
View time-series charts of sensor data with machine filtering and auto-refresh capability.

### History Page
Browse all sensor data records with sorting, filtering by status, and CSV export functionality.

### Alerts Page
Monitor fault predictions categorized by severity (Critical, High, Medium, Low) with detailed sensor readings and recommended actions.

## Theme Toggle

Click the sun/moon icon in the navigation bar to switch between light and dark modes. Your preference is saved locally.

## Auto-Refresh

The dashboard and alerts pages automatically refresh data every 30 seconds to ensure you have the latest information.

## License

MIT
