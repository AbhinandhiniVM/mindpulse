# 🔴 ESP32 Sensor Integration & Mental Health Dashboard - Setup Guide

## 📋 Overview

This system integrates real-time biometric data from an ESP32 with a MAX30105 PPG sensor into your mental health tracking platform. The data includes:
- **PPG** (Photoplethysmogram) - Raw pulse signal (300-1000)
- **BPM** (Heart Rate) - Beats per minute
- **SpO₂** (Oxygen Saturation) - Blood oxygen percentage

The system automatically:
1. Syncs sensor data from serial port → Backend API
2. Predicts emotion using ML model
3. Generates personalized mental health recommendations
4. Displays real-time visualizations (charts, statistics)

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd mental-health-tracker

# Install backend & serial port dependencies
npm install serialport axios

# Install frontend ML dependencies (optional, for advanced emotion detection)
npm install @tensorflow/tfjs @tensorflow/tfjs-io
```

### Step 2: Identify Your ESP32 Serial Port

**On Windows:**
```powershell
Get-COMPort  # or check Device Manager > Ports (COM & LPT)
```
Look for something like `COM3`, `COM11`, etc.

### Step 3: Start the Backend Server

```bash
npm run server
# Server runs on http://localhost:3001
```

### Step 4: Start the Serial Syncer

In a **new terminal**:
```bash
# Update COM port if needed (see Step 2)
SERIAL_PORT=COM11 node serial-syncer.js
```

You should see:
```
🚀 ESP32 Serial Data Syncer Started
   Port: COM11
   Baud: 115200
   Backend: http://localhost:3001
   Buffer Size: 10 readings

✅ Serial port opened: COM11 @ 115200 baud
📊 Received: { ppg: 792, bpm: 125, spo2: 72, timestamp: '2024-12-05T...' }
```

### Step 5: View Live Data in Dashboard

Start the React frontend:
```bash
npm start
# Opens http://localhost:3000
```

Then navigate to: **🔴 Sensor Live** → View real-time charts and AI emotion detection!

---

## 📊 File Structure

```
mental-health-tracker/
├── serial-syncer.js                 # ⭐ ESP32 serial data reader
├── server/
│   └── index.js                     # ⭐ Added /api/sensor-data endpoints
├── src/
│   ├── pages/
│   │   ├── SensorDashboard.js      # ⭐ Real-time dashboard with charts
│   │   └── SensorDashboard.css
│   ├── services/
│   │   └── emotionDetectionService.js  # ⭐ ML emotion prediction
│   ├── App.js                      # ⭐ Updated with sensor route
│   └── components/
│       └── Navbar.js               # ⭐ Updated with "Sensor Live" link
└── data/
    └── healthRecords.json          # Where sensor readings are stored
```

---

## 🛠️ Configuration

### Environment Variables

Create `.env` file in project root:
```env
SERIAL_PORT=COM11
BAUD_RATE=115200
API_BASE_URL=http://localhost:3001
REACT_APP_MODEL_PATH=./models/pulse_of_emotion.h5
```

### Customize Sensor Buffer Size

In `serial-syncer.js`, adjust:
```javascript
const BUFFER_SIZE = 10; // Change to sync every N readings
```

### Adjust Auto-Refresh Rate

In `SensorDashboard.js`:
```javascript
const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
```

---

## 📈 API Endpoints

### Receive Sensor Data (from ESP32)
```http
POST /api/sensor-data
Content-Type: application/json

{
  "readings": [
    { "ppg": 792, "bpm": 125, "spo2": 72, "timestamp": "2024-12-05T10:30:00Z" },
    { "ppg": 801, "bpm": 124, "spo2": 73, "timestamp": "2024-12-05T10:30:05Z" }
  ],
  "userId": "user123"  // Optional
}

Response:
{
  "message": "Received 2 sensor readings",
  "received": 2,
  "data": [...]
}
```

### Get Latest Readings
```http
GET /api/sensor-data/latest?limit=50

Response:
[
  { "id": 1733391000123, "ppg": 792, "bpm": 125, "spo2": 72, "timestamp": "..." },
  ...
]
```

### Get Sensor Statistics
```http
GET /api/sensor-data/stats

Response:
{
  "totalReadings": 150,
  "averageBPM": 125,
  "averageSpO2": 72,
  "averagePPG": 792
}
```

### Predict Emotion from Readings
```http
POST /api/sensor-data/predict
Content-Type: application/json

{
  "readings": [
    { "ppg": 792, "bpm": 125, "spo2": 72 },
    { "ppg": 801, "bpm": 124, "spo2": 73 }
  ]
}

Response:
{
  "emotion": "Happy",
  "confidence": 85,
  "vitals": { "bpm": 125, "spo2": 72 },
  "recommendations": {
    "emotion": "Happy",
    "alerts": [],
    "suggestions": ["✨ Share your joy with others", ...],
    "resources": [...]
  },
  "timestamp": "2024-12-05T10:35:00Z"
}
```

---

## 🧠 Emotion Detection Logic

### Heuristic-Based Prediction
The system uses vital signs to predict emotion:

| Emotion  | BPM Range | SpO₂ Range | Confidence |
|----------|-----------|-----------|-----------|
| Relaxed  | < 70      | ≥ 97%     | 85-95%    |
| Happy    | < 75      | ≥ 95%     | 80-95%    |
| Angry    | ≥ 85      | < 97%     | 75-90%    |
| Sad      | 75-85     | ≥ 95%     | 70-90%    |
| Neutral  | Other     | Other     | 50-80%    |

### Advanced ML Model (Optional)
To use your trained H5 model:

1. **Convert H5 to TensorFlow.js format:**
```bash
# Install tfjs-converter
pip install tensorflowjs

# Convert
tensorflowjs_converter --input_format=keras model.h5 ./web_model
```

2. **Update emotionDetectionService.js:**
```javascript
this.model = await tf.loadLayersModel(
  'file://path/to/model.json'
);
```

3. **Use in dashboard:**
```javascript
const prediction = await emotionDetectionService.predictEmotion(ppg, bpm, spo2);
```

---

## 💡 Mental Health Recommendations

The system provides personalized suggestions based on emotion and vital signs:

### Happy State
✅ Share your joy with others
✅ Listen to your favorite music
✅ Do something creative or fun
📚 [Gratitude Practice](https://www.mindful.org/gratitude/)

### Relaxed State
✅ Continue your relaxation routine
✅ Spend time in nature
✅ Get adequate sleep tonight
📚 [Meditation Guide](https://www.headspace.com/)

### Sad State
✅ Reach out to someone you trust
✅ Take a walk outside
✅ Write down your feelings
📚 [Depression Support](https://www.betterhelp.com/)

### Angry State
✅ Practice box breathing (4-4-4-4)
✅ Exercise or go for a run
✅ Listen to calming music
📚 [Anger Management](https://www.psychologytoday.com/us/basics/anger-management)

### Alerts
⚠️ BPM > 100 → "Elevated heart rate. Try deep breathing."
⚠️ BPM < 60 → "Low heart rate. Consider light activity."
⚠️ SpO₂ < 95 → "Low oxygen. Ensure proper ventilation."

---

## 🐛 Troubleshooting

### Serial Port Not Found
```
❌ Failed to open port: Port not found
```
**Solution:**
- Verify COM port: `Get-COMPort` (Windows) or `ls /dev/tty.*` (Mac/Linux)
- Check device drivers are installed
- Update `SERIAL_PORT` in `.env` or command line

### Connection Refused Error
```
❌ Failed to sync data: connect ECONNREFUSED
```
**Solution:**
- Ensure backend server is running: `npm run server`
- Check backend URL in `.env`: `API_BASE_URL=http://localhost:3001`
- Verify port 3001 is not in use: `netstat -ano | findstr :3001`

### No Data Appearing in Dashboard
**Solution:**
1. Check serial syncer is running and receiving data
2. Verify ESP32 is sending data: Open Arduino Serial Monitor at 115200 baud
3. Check database file exists: `data/healthRecords.json`
4. Clear browser cache: `Ctrl+Shift+Delete` → Cache

### Model Loading Failed
```
⚠️ Model not loaded. TensorFlow.js conversion needed.
```
**Solution:**
- Either use the heuristic-based emotion (default), or
- Follow ML Model setup above to convert H5 to TensorFlow.js format

---

## 📱 Features Overview

### Dashboard Views
- **🏠 Dashboard** - Overview of latest readings
- **🔴 Sensor Live** - Real-time PPG/BPM/SpO₂ charts
- **📊 Analytics** - Historical trends
- **⚙️ Settings** - Configuration options

### Real-Time Metrics
- ❤️ Average Heart Rate (BPM)
- 🫁 Average Oxygen Level (SpO₂%)
- 📊 PPG Signal Strength
- 📈 Total Readings Count

### Visualizations
- 📈 Line charts for BPM, SpO₂, PPG trends
- 🥧 Pie chart for emotion distribution
- 📋 Data table with recent readings

### AI Intelligence
- 🧠 Emotion classification (Happy, Sad, Angry, Relaxed)
- ⚠️ Health alerts for abnormal vitals
- 💡 Personalized wellness suggestions
- 📚 Mental health resources

---

## 🔄 Data Flow

```
┌─────────────┐
│   ESP32     │  Reads PPG, calculates BPM/SpO₂
└──────┬──────┘
       │ Serial (115200 baud)
       ▼
┌─────────────────────┐
│ serial-syncer.js    │  Buffers & syncs 10 readings
└──────┬──────────────┘
       │ HTTP POST
       ▼
┌──────────────────────┐
│ Backend /api/        │  Stores in JSON DB
│ sensor-data          │  Calculates stats
└──────┬───────────────┘
       │ HTTP GET
       ▼
┌─────────────────────────┐
│ SensorDashboard React   │  Displays charts
│ + Emotion Detection     │  Shows recommendations
└─────────────────────────┘
       │
       ▼
┌──────────────────┐
│  Browser Display │  🎨 Beautiful UI
└──────────────────┘
```

---

## 🚀 Advanced Usage

### Docker Deployment
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001 3000
CMD ["npm", "run", "dev"]
```

### WebSocket Real-Time Updates (Future Enhancement)
```javascript
// Live streaming without polling
io.on('sensor-reading', (data) => {
  // Update dashboard in real-time
});
```

### Database Migration
Export to CSV:
```bash
node -e "const fs=require('fs'); const d=JSON.parse(fs.readFileSync('data/healthRecords.json')); console.log(d.records.map(r=>\`\${r.timestamp},\${r.ppg},\${r.bpm},\${r.spo2}\`).join('\\n'))" > export.csv
```

---

## 📞 Support

**Issues?** Check these first:
1. Serial port configuration
2. Backend server running
3. Browser console (F12) for errors
4. Terminal output from serial-syncer.js

**For medical concerns:** This is NOT a medical device. Always consult healthcare professionals for health-related questions.

---

## 📜 License

MIT - Feel free to use and modify!

---

**Last Updated:** December 5, 2024
**Version:** 1.0.0
