# 📚 Complete Documentation Index

## 🚀 START HERE

1. **QUICK_REFERENCE.md** ⭐ (5 min read)
   - Commands at a glance
   - Quick troubleshooting
   - Essential file locations

2. **ESP32_INTEGRATION.md** ⭐ (10 min read)
   - Complete overview
   - System architecture
   - Quick start steps

3. **SENSOR_SETUP.md** (25+ page guide)
   - Detailed configuration
   - API reference
   - Advanced setup

---

## 📖 Documentation Files

### Quick Reference
```
QUICK_REFERENCE.md          Main reference card (START HERE)
SOLUTION_SUMMARY.md         Complete solution overview
ESP32_INTEGRATION.md        Integration guide with diagrams
SENSOR_SETUP.md            Comprehensive setup guide (25 pages)
README.md                   Project overview
```

### Setup & Configuration
```
setup-helper.js            Configuration helper script
test-system.js             System test runner
start-system.bat           Windows quick-start menu
architecture.js            ASCII architecture diagrams
```

### Documentation
```
AUTHENTICATION_COMPLETE.md  Auth setup info
COMPLETION_REPORT.txt       Project completion status
PROJECT_COMPLETE.md         Project completion details
INSTALLATION.md            Installation steps
FILES.md                    File listing
```

---

## 🛠️ Executable Scripts

### npm Commands (in package.json)
```bash
npm start               # Start React frontend (http://localhost:3000)
npm run dev             # Start backend + frontend together
npm run server          # Start backend only (http://localhost:3001)
npm run syncer          # Start serial syncer (reads ESP32 data)
npm run build           # Build for production
npm run test            # Run tests
npm run test-system     # Run comprehensive system test
npm run setup           # Run configuration helper
npm run verify          # Verify setup
```

### Direct Scripts
```bash
node setup-helper.js    # Configuration helper
node test-system.js     # System test runner
node serial-syncer.js   # Serial data syncer
node architecture.js    # View architecture diagram
start-system.bat        # Windows quick-start menu
```

---

## 🧩 Core Components

### Backend (`server/index.js`)
```
New Endpoints Added:
✅ POST   /api/sensor-data              # Receive sensor data
✅ GET    /api/sensor-data/latest       # Get latest readings
✅ GET    /api/sensor-data/stats        # Get statistics
✅ POST   /api/sensor-data/predict      # Predict emotion + recommendations
```

### Frontend (`src/pages/SensorDashboard.js`)
```
New Page Features:
✅ Real-time vital statistics (BPM, SpO2, PPG, count)
✅ Live charts (BPM trend, SpO2 trend, PPG trend)
✅ Emotion detection with confidence
✅ Pie chart showing emotion distribution
✅ Mental health recommendations
✅ Health alerts for abnormal vitals
✅ Recent data table
✅ Auto-refresh controls
```

### Services (`src/services/emotionDetectionService.js`)
```
Emotion Detection:
✅ Model loading (TensorFlow.js support)
✅ Single prediction
✅ Batch prediction (multiple readings)
✅ Data normalization
✅ Memory management
```

### Serial Communication (`serial-syncer.js`)
```
Serial Data Sync:
✅ Serial port connection (configurable)
✅ Data parsing and buffering
✅ HTTP API integration
✅ Error handling & retry
✅ Auto-reconnect
```

---

## 📊 Data Flow

### Complete Data Path
```
ESP32 Sensor
    ↓ Serial (115200 baud)
serial-syncer.js (Buffer 10 readings)
    ↓ HTTP POST
backend /api/sensor-data
    ↓ Store in DB
data/healthRecords.json
    ↓ HTTP GET (5s poll)
React Frontend
    ↓ Update Charts
User Browser Display
```

---

## 🎯 Feature Summary

### Live Monitoring ✅
- Real-time PPG/BPM/SpO2 from ESP32
- Updates every 5 seconds
- Automatic buffering and syncing

### Data Visualization ✅
- Line charts (trends over time)
- Pie chart (emotion distribution)
- Statistics cards (vital averages)
- Data table (recent readings)

### AI Intelligence ✅
- Emotion detection (Happy, Sad, Angry, Relaxed)
- Confidence scoring
- Heuristic-based or ML-based

### Mental Health ✅
- Emotion-specific recommendations
- Health alerts for abnormal vitals
- Curated mental health resources
- Personalized wellness suggestions

### Data Persistence ✅
- JSON database (local storage)
- Easy backup and export
- Historical data tracking

---

## 🔌 API Reference

### Endpoints Summary

| Method | Path | Purpose | Response |
|--------|------|---------|----------|
| POST | /api/sensor-data | Send sensor readings | { message, received, data } |
| GET | /api/sensor-data/latest?limit=50 | Get recent readings | Array of readings |
| GET | /api/sensor-data/stats | Get averages | { averageBPM, averageSpO2, ... } |
| POST | /api/sensor-data/predict | Predict emotion | { emotion, confidence, recommendations } |

### Request/Response Examples

**POST /api/sensor-data**
```json
Request:
{
  "readings": [
    {"ppg": 792, "bpm": 125, "spo2": 72, "timestamp": "..."}
  ]
}

Response:
{
  "message": "Received 1 sensor readings",
  "received": 1,
  "data": [...]
}
```

**POST /api/sensor-data/predict**
```json
Request:
{
  "readings": [
    {"ppg": 792, "bpm": 65, "spo2": 98}
  ]
}

Response:
{
  "emotion": "Relaxed",
  "confidence": 89,
  "recommendations": {
    "emotion": "Relaxed",
    "alerts": [],
    "suggestions": [...],
    "resources": [...]
  }
}
```

---

## 📱 Browser Routes

| Path | Page | Features |
|------|------|----------|
| / | Dashboard | Main overview |
| /sensor-dashboard | 🔴 Sensor Live | Real-time monitoring |
| /input | Input Data | Manual data entry |
| /analytics | Analytics | Historical trends |
| /settings | Settings | Configuration |

---

## 🔐 Configuration

### .env File
```env
# Serial Port
SERIAL_PORT=COM11
BAUD_RATE=115200

# Backend
API_BASE_URL=http://localhost:3001
PORT=3001
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MODEL_PATH=./models/pulse_of_emotion.h5
```

### Find Your COM Port
```powershell
Get-COMPort        # Windows
ls /dev/tty.*      # Mac/Linux
```

---

## 🧠 Emotion Detection

### Algorithm

Pattern-based heuristic:
- **Relaxed**: BPM < 70 & SpO2 ≥ 97% (confidence: 85-95%)
- **Happy**: BPM < 75 & SpO2 ≥ 95% (confidence: 80-95%)
- **Neutral**: BPM 70-85 & SpO2 ≥ 95% (confidence: 50-80%)
- **Sad**: BPM 75-85 & SpO2 93-97% (confidence: 70-90%)
- **Angry**: BPM ≥ 85 & SpO2 < 97% (confidence: 75-90%)

### Optional ML Model

Convert H5 model to TensorFlow.js:
```bash
pip install tensorflowjs
tensorflowjs_converter \
  --input_format=keras \
  pulse_of_emotion.h5 \
  ./model
```

---

## 💾 Database

### Location
```
data/healthRecords.json
```

### Structure
```json
{
  "sensorReadings": [
    {
      "id": 1733391000123,
      "ppg": 792,
      "bpm": 125,
      "spo2": 72,
      "timestamp": "2024-12-05T10:30:00Z",
      "userId": "anonymous",
      "processed": false
    }
  ]
}
```

### Backup
```bash
# Windows
copy data\healthRecords.json data\healthRecords.backup.json

# Mac/Linux
cp data/healthRecords.json data/healthRecords.backup.json
```

### Export to CSV
```javascript
// Quick export script
const db = require('./data/healthRecords.json');
const csv = db.sensorReadings
  .map(r => `${r.timestamp},${r.ppg},${r.bpm},${r.spo2}`)
  .join('\n');
console.log(csv);
```

---

## 🚀 Deployment

### Local Development
```bash
npm run dev    # Frontend + Backend (separate terminals for syncer)
```

### Production Build
```bash
npm run build  # Creates build/ folder
```

### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001 3000
CMD ["npm", "run", "dev"]
```

---

## 📋 Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| COM port not found | Run `node setup-helper.js` to detect ports |
| Backend not running | Check `npm run server` is active on port 3001 |
| No data in dashboard | Verify serial syncer is running and receiving data |
| Charts not updating | Check browser console (F12) for errors |
| API connection refused | Ensure API_BASE_URL in .env is correct |
| Model not loading | Use heuristic mode or convert H5 to TensorFlow.js |

---

## 📚 Further Resources

### Setup Documentation
- `QUICK_REFERENCE.md` - Commands and quick answers
- `ESP32_INTEGRATION.md` - Complete integration guide
- `SENSOR_SETUP.md` - Advanced setup (25 pages)

### Code Files
- `server/index.js` - Backend with commented API endpoints
- `src/pages/SensorDashboard.js` - Frontend component
- `serial-syncer.js` - Serial data synchronization
- `src/services/emotionDetectionService.js` - ML emotion detection

### Utilities
- `setup-helper.js` - Interactive configuration
- `test-system.js` - Comprehensive system test
- `architecture.js` - ASCII architecture diagrams

---

## ✨ Quick Commands Cheat Sheet

```bash
# Setup
npm install                    # Install dependencies
node setup-helper.js          # Configure system

# Testing
npm run test-system           # Run all tests

# Development
npm run server                # Backend only
npm start                     # Frontend only
npm run dev                   # Frontend + Backend
npm run syncer                # Serial syncer only

# Production
npm run build                 # Build for production

# View
node architecture.js          # See architecture diagrams
```

---

## 🎯 Next Steps

1. **First Time?** → Read `QUICK_REFERENCE.md`
2. **Setup?** → Run `npm run setup`
3. **Verify?** → Run `npm run test-system`
4. **Start?** → Run `npm run server` + `npm start` + `npm run syncer`
5. **View?** → Open http://localhost:3000 → "🔴 Sensor Live"

---

## 📞 Emergency Support

⚠️ **Mental Health Crisis:**
- 🆘 US Crisis Line: 988
- 🆘 International: findahelpline.com
- 👨‍⚕️ Always consult healthcare professionals

---

## ✅ Verification Checklist

- [ ] Node.js installed (node -v)
- [ ] ESP32 connected to COM port
- [ ] .env file configured with correct COM port
- [ ] Dependencies installed (npm install)
- [ ] Backend starts (npm run server)
- [ ] Frontend starts (npm start)
- [ ] Serial syncer connects (npm run syncer)
- [ ] Dashboard accessible (http://localhost:3000)
- [ ] Data appears in charts
- [ ] Emotion predictions working
- [ ] Recommendations displaying

---

## 🏆 Success!

You now have:
✅ Real-time biometric tracking system
✅ AI emotion detection
✅ Beautiful data visualization
✅ Mental health recommendations
✅ Complete documentation
✅ Testing & verification tools
✅ Production-ready code

**Ready to track your mental health! 🔴❤️**

---

**Last Updated:** December 5, 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  

---

## 📖 Document Navigation

```
START HERE ──┬─→ QUICK_REFERENCE.md (5 min overview)
             ├─→ ESP32_INTEGRATION.md (10 min integration guide)
             ├─→ SOLUTION_SUMMARY.md (complete walkthrough)
             ├─→ SENSOR_SETUP.md (25+ page detailed guide)
             └─→ This file (documentation index)

CODE ────────┬─→ serial-syncer.js (read ESP32 data)
             ├─→ server/index.js (backend endpoints)
             ├─→ src/pages/SensorDashboard.js (frontend component)
             └─→ src/services/emotionDetectionService.js (ML)

TOOLS ───────┬─→ setup-helper.js (configure system)
             ├─→ test-system.js (verify everything)
             ├─→ start-system.bat (Windows menu)
             └─→ architecture.js (system diagrams)
```

---

**Made with ❤️ for mental health tracking**
