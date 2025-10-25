# Dashboard Features

## Pages

### 1. Dashboard (/)
- Real-time status cards showing:
  - Total machines monitored
  - Healthy machines count
  - Faulty machines count
  - Active alerts count
- Pie chart visualization of machine health distribution
- Recent predictions list with timestamps and status
- Auto-refresh every 30 seconds

### 2. Predict (/predict)
- Form to submit sensor data:
  - Temperature (°C)
  - Vibration (mm/s)
  - RPM Deviation
  - Current Delta (A)
- Real-time form validation
- Instant prediction results with visual indicators
- Confidence score display with progress bar
- Reset functionality

### 3. Visualize (/visualize)
- Four interactive line charts:
  - Temperature over time
  - Vibration over time
  - RPM deviation over time
  - Current delta over time
- Machine filtering dropdown
- Manual refresh button
- Prediction timeline showing last 20 readings
- Visual indicators for fault predictions

### 4. History (/history)
- Paginated data table with 20 items per page
- Sortable columns:
  - Timestamp
  - Machine ID
  - Temperature
  - Vibration
  - RPM Deviation
  - Current Delta
  - Status
- Filter by status (All/Normal/Fault)
- Export to CSV functionality
- Color-coded status badges
- Previous/Next page navigation

### 5. Alerts (/alerts)
- Severity-based categorization:
  - Critical (red)
  - High (orange)
  - Medium (yellow)
  - Low (blue)
- Summary cards showing count per severity
- Expandable alert cards with:
  - Machine ID
  - Timestamp with "time ago" format
  - Full sensor readings
  - Visual indicators for above-normal values
  - Recommended actions
- Auto-refresh every 30 seconds
- Manual refresh button

## Global Features

### Theme Toggle
- Dark/Light mode switch
- Persistent storage using localStorage
- Smooth transitions between themes
- Icon changes based on current theme

### Navigation
- Fixed top navigation bar
- Active page highlighting
- Responsive design for mobile
- Clean, modern UI

### Error Handling
- User-friendly error messages
- Network error handling
- Form validation errors
- API error display

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interface
- Readable on all screen sizes

### Loading States
- Spinner indicators during data fetching
- Disabled buttons during form submission
- Prevents multiple simultaneous requests

### Data Visualization
- Chart.js integration
- Smooth animations
- Interactive tooltips
- Responsive charts
- Theme-aware colors
