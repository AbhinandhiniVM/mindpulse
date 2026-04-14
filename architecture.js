#!/usr/bin/env node

/**
 * System Architecture Visualization
 * ASCII diagrams showing the complete system flow
 */

console.log(`

╔════════════════════════════════════════════════════════════════════════════════╗
║                  🔴 ESP32 Mental Health Dashboard - Architecture               ║
║                       Complete System Data Flow Diagram                        ║
╚════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════════

                         HARDWARE LAYER (Physical)

                        ┌─────────────────────┐
                        │   ESP32 DevBoard    │
                        │  + MAX30105 Sensor  │
                        │                     │
                        │ Outputs:            │
                        │ • PPG: 300-1000     │
                        │ • BPM: 60-150       │
                        │ • SpO2: 85-100%     │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │   Serial Connection        │
                    │   COM11 @ 115200 baud      │
                    └──────────────┬──────────────┘
                                   │
                    Data Format: "PPG: 792 | BPM: 125 | SpO2: 72"
                                   │
                                   ▼


═══════════════════════════════════════════════════════════════════════════════════

                         SERIAL COMMUNICATION LAYER

        ┌───────────────────────────────────────────────────────────┐
        │            ✅ serial-syncer.js (Node.js)                  │
        ├───────────────────────────────────────────────────────────┤
        │                                                            │
        │  Function: Read & Buffer ESP32 Serial Data               │
        │                                                            │
        │  ┌─────────────────────────────────────────────────┐      │
        │  │ SerialPort (COM11 @ 115200 baud)               │      │
        │  │ ├─ Reads: "PPG: 792 | BPM: 125 | SpO2: 72"     │      │
        │  │ ├─ Parses: { ppg: 792, bpm: 125, spo2: 72 }   │      │
        │  │ └─ Buffers: 10 readings                        │      │
        │  └──────────────┬──────────────────────────────────┘      │
        │                 │                                          │
        │  ┌──────────────▼──────────────────────────────────┐      │
        │  │ Data Buffer (10 readings)                      │      │
        │  │ ├─ Reading 1: ppg:792, bpm:125, spo2:72       │      │
        │  │ ├─ Reading 2: ppg:801, bpm:124, spo2:73       │      │
        │  │ ├─ ...                                         │      │
        │  │ └─ Reading 10: ppg:810, bpm:123, spo2:72      │      │
        │  └──────────────┬──────────────────────────────────┘      │
        │                 │                                          │
        │  ┌──────────────▼──────────────────────────────────┐      │
        │  │ HTTP POST Request                              │      │
        │  │ POST /api/sensor-data                          │      │
        │  │ Content-Type: application/json                 │      │
        │  │                                                │      │
        │  │ {                                              │      │
        │  │   "readings": [10 readings],                   │      │
        │  │   "userId": "optional",                        │      │
        │  │   "timestamp": "2024-12-05T10:30:00Z"         │      │
        │  │ }                                              │      │
        │  └──────────────┬──────────────────────────────────┘      │
        │                 │                                          │
        │  ┌──────────────▼──────────────────────────────────┐      │
        │  │ Retry Logic & Error Handling                   │      │
        │  │ ├─ Success: Clear buffer & repeat              │      │
        │  │ ├─ Failure: Retry after 30 seconds             │      │
        │  │ └─ Periodic sync: Every 30 seconds             │      │
        │  └──────────────────────────────────────────────────┘      │
        │                                                            │
        └──────────────────────┬─────────────────────────────────────┘
                               │
                               │ HTTP POST
                               │ Data: 10 readings
                               │
                               ▼


═══════════════════════════════════════════════════════════════════════════════════

                           BACKEND API LAYER

        ┌──────────────────────────────────────────────────────────┐
        │        ✅ Express.js Backend (Port 3001)                 │
        ├──────────────────────────────────────────────────────────┤
        │                                                           │
        │  ┌────────────────────────────────────────────────────┐  │
        │  │ 📥 POST /api/sensor-data                           │  │
        │  │ ├─ Receive 10 readings                             │  │
        │  │ ├─ Store in database                               │  │
        │  │ └─ Return: { message, received, data }             │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 📦 Database Operations                           │  │
        │  │ ├─ Read: data/healthRecords.json                 │  │
        │  │ ├─ Store: Add to sensorReadings array            │  │
        │  │ └─ Write: Update JSON file                       │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 🔢 Statistics Calculation                        │  │
        │  │ ├─ Average BPM                                   │  │
        │  │ ├─ Average SpO2                                  │  │
        │  │ ├─ Average PPG                                   │  │
        │  │ └─ Total readings count                          │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 🧠 Emotion Prediction                            │  │
        │  │ ├─ Input: Average BPM & SpO2                     │  │
        │  │ ├─ Algorithm: Pattern-based heuristic            │  │
        │  │ ├─ Output: Emotion + Confidence                  │  │
        │  │ └─ Range: Happy, Sad, Angry, Relaxed            │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 💡 Recommendations Generation                    │  │
        │  │ ├─ Input: Emotion type                           │  │
        │  │ ├─ Check: Vital signs for alerts                │  │
        │  │ ├─ Output: Suggestions + Resources               │  │
        │  │ └─ Return: { alerts, suggestions, resources }   │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 📤 API Endpoints (GET)                           │  │
        │  │ ├─ GET /api/sensor-data/latest (50 readings)    │  │
        │  │ ├─ GET /api/sensor-data/stats (averages)        │  │
        │  │ ├─ POST /api/sensor-data/predict (emotion)      │  │
        │  │ └─ GET /api/health (health check)               │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        └───────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP Response (JSON)
                            │
                            ▼


═══════════════════════════════════════════════════════════════════════════════════

                         FRONTEND LAYER (React)

        ┌──────────────────────────────────────────────────────────┐
        │        ✅ React Frontend (Port 3000)                     │
        ├──────────────────────────────────────────────────────────┤
        │                                                           │
        │  ┌────────────────────────────────────────────────────┐  │
        │  │ 🔄 Data Fetching (Every 5 seconds)               │  │
        │  │ ├─ GET /api/sensor-data/latest                   │  │
        │  │ ├─ GET /api/sensor-data/stats                    │  │
        │  │ └─ POST /api/sensor-data/predict                 │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 📊 SensorDashboard Component                     │  │
        │  │ ├─ State management (React hooks)                │  │
        │  │ ├─ Auto-refresh toggle                           │  │
        │  │ └─ Responsive layout                             │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 📈 Visualization Components                      │  │
        │  │ ├─ Vital Statistics Cards                        │  │
        │  │ │  ├─ ❤️  Average BPM                            │  │
        │  │ │  ├─ 🫁  Average SpO2                           │  │
        │  │ │  ├─ 📊  Average PPG                            │  │
        │  │ │  └─ 📈  Total Readings                         │  │
        │  │ │                                                │  │
        │  │ ├─ Line Charts (Chart.js)                        │  │
        │  │ │  ├─ BPM Trend (Red line)                       │  │
        │  │ │  ├─ SpO2 Trend (Blue line)                     │  │
        │  │ │  └─ PPG Trend (Purple line)                    │  │
        │  │ │                                                │  │
        │  │ ├─ Emotion Display                               │  │
        │  │ │  ├─ Emoji (😊 😢 😠 😌)                       │  │
        │  │ │  ├─ Emotion name                               │  │
        │  │ │  ├─ Confidence %                               │  │
        │  │ │  └─ Pie chart (all emotions)                   │  │
        │  │ │                                                │  │
        │  │ ├─ Recommendations Box                           │  │
        │  │ │  ├─ Health alerts (if any)                     │  │
        │  │ │  ├─ Personalized suggestions                   │  │
        │  │ │  └─ Mental health resource links               │  │
        │  │ │                                                │  │
        │  │ └─ Data Table                                    │  │
        │  │    ├─ Recent 10 readings                         │  │
        │  │    ├─ Timestamp | PPG | BPM | SpO2              │  │
        │  │    └─ Sortable columns                           │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ 🎨 CSS Styling (Responsive)                     │  │
        │  │ ├─ Desktop: Multi-column layout                  │  │
        │  │ ├─ Tablet: 2-column layout                       │  │
        │  │ ├─ Mobile: 1-column layout                       │  │
        │  │ └─ Dark mode support (optional)                  │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        │  ┌────────────────▼─────────────────────────────────┐  │
        │  │ ⚡ User Interactions                             │  │
        │  │ ├─ Toggle auto-refresh                           │  │
        │  │ ├─ Manual refresh button                         │  │
        │  │ ├─ Change time ranges (future)                   │  │
        │  │ └─ Export data (future)                          │  │
        │  └────────────────┬─────────────────────────────────┘  │
        │                   │                                      │
        └───────────────────┼──────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────────────────────────────┐
        │         🎨 Beautiful Web Interface                       │
        │                                                           │
        │  ┌────────────────────────────────────────────────────┐  │
        │  │  MindPulse Dashboard - Sensor Live Tab            │  │
        │  │                                                     │  │
        │  │  Current Vital Statistics                         │  │
        │  │  ┌──────────────┬──────────────┬──────────────┐   │  │
        │  │  │ ❤️  125 BPM  │ 🫁  98% SpO2 │ 📊  792 PPG │   │  │
        │  │  │ beats/min    │ oxygen      │ avg pulse │   │  │
        │  │  └──────────────┴──────────────┴──────────────┘   │  │
        │  │                                                     │  │
        │  │  AI Emotion Detection            Real-Time Charts │  │
        │  │  ┌──────────────────┐  ┌────────────────────────┐ │  │
        │  │  │      😊           │  │       BPM Trend        │ │  │
        │  │  │    HAPPY          │  │      ╱╲      ╱╲       │ │  │
        │  │  │  Confidence: 85%  │  │     ╱  ╲    ╱  ╲      │ │  │
        │  │  │                   │  │    ╱    ╲  ╱    ╲     │ │  │
        │  │  │  [Pie Chart]      │  │  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │  │  │
        │  │  │  Happy  🟡 85%    │  │  📈 SpO2: 95-100%   │ │  │
        │  │  │  Sad    🔵 10%    │  │  📈 PPG: 300-1000   │ │  │
        │  │  │  Angry  🔴 3%     │  │                      │ │  │
        │  │  │  Relax  🟢 2%     │  │  ⏱️  Auto-refresh ✓  │ │  │
        │  │  └──────────────────┘  └────────────────────────┘ │  │
        │  │                                                     │  │
        │  │  💡 Personalized Wellness Recommendations          │  │
        │  │  ┌──────────────────────────────────────────────┐  │  │
        │  │  │ Suggestions for You                          │  │  │
        │  │  │ ✨ Share your joy with others               │  │  │
        │  │  │ 📞 Call a friend or family member           │  │  │
        │  │  │ 🎵 Listen to your favorite music            │  │  │
        │  │  │ 🌟 Do something creative or fun             │  │  │
        │  │  │                                              │  │  │
        │  │  │ 📚 Helpful Resources                         │  │  │
        │  │  │ 🔗 Gratitude Practice                        │  │  │
        │  │  │ 🔗 Positive Psychology                       │  │  │
        │  │  └──────────────────────────────────────────────┘  │  │
        │  │                                                     │  │
        │  │  📋 Recent Readings                                │  │
        │  │  ┌─────────────────────────────────────────────┐   │  │
        │  │  │ Time    | PPG | BPM | SpO2  |              │   │  │
        │  │  ├─────────────────────────────────────────────┤   │  │
        │  │  │ 10:35   | 792 | 125 |  72% |              │   │  │
        │  │  │ 10:34   | 801 | 124 |  73% |              │   │  │
        │  │  │ 10:33   | 810 | 123 |  72% |              │   │  │
        │  │  └─────────────────────────────────────────────┘   │  │
        │  └────────────────────────────────────────────────┘  │
        │                                                        │
        │  Powered by React + Chart.js + Tailwind CSS           │
        │  Data refreshed every 5 seconds                       │
        └────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════

                         DATABASE LAYER (Persistence)

        ┌──────────────────────────────────────────────────────────┐
        │  ✅ data/healthRecords.json (Local Storage)              │
        ├──────────────────────────────────────────────────────────┤
        │                                                           │
        │  Structure:                                              │
        │  {                                                       │
        │    "sensorReadings": [                                  │
        │      {                                                   │
        │        "id": 1733391000123,                             │
        │        "ppg": 792,                                      │
        │        "bpm": 125,                                      │
        │        "spo2": 72,                                      │
        │        "timestamp": "2024-12-05T10:30:00Z",            │
        │        "userId": "anonymous",                          │
        │        "processed": false                               │
        │      },                                                  │
        │      { ... more readings ... }                          │
        │    ]                                                     │
        │  }                                                       │
        │                                                           │
        │  Features:                                               │
        │  ✅ Persistent storage across restarts                  │
        │  ✅ Human-readable JSON format                          │
        │  ✅ Easy to backup and export                           │
        │  ✅ No database setup required                          │
        │                                                           │
        └──────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════

                         COMPLETE DATA FLOW

    ESP32           Serial           Buffer           HTTP             Database
    ┌───┐           ┌────┐          ┌────┐           ┌───┐           ┌───────┐
    │   │──────────▶│    │─────────▶│    │──────────▶│   │──────────▶│       │
    │PPG│           │Sync│          │  10│           │API│           │ JSON  │
    │BPM│           │    │          │    │           │   │           │ DB    │
    │SpO2           │    │          │    │           │   │           │       │
    └───┘           └────┘          └────┘           └───┘           └───┘───┘
      │                                                                  │
      │                                                                  │
      │            HTTP Response + Statistics + Emotion                │
      │◀──────────────────────────────────────────────────────────────◀─│
      │
      ▼
    Frontend Fetches (5s poll)
      │
      ▼
    React Component State Update
      │
      ▼
    Chart.js Re-render
      │
      ▼
    User sees live update! 🎉


═══════════════════════════════════════════════════════════════════════════════════

                      COMPONENT INTERACTION MAP

    ┌─────────────────────────────────────────────────────┐
    │                 App.js (Router)                     │
    └─────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
      Dashboard       SensorDashboard  Analytics
      ├─ Stats         ├─ Vitals       ├─ Charts
      ├─ Card          ├─ Charts       └─ Trends
      └─ Emotion       ├─ Emotion
                        ├─ Recommend
                        └─ Table
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
      axiosInstance  emotionService   Chart.js
      ├─ GET /latest  ├─ Model load   ├─ Line
      ├─ GET /stats   ├─ Predict      ├─ Pie
      └─ POST /predict └─ Batch        └─ Bar


═══════════════════════════════════════════════════════════════════════════════════

                      DEPLOYMENT ARCHITECTURE

    DEVELOPMENT                         PRODUCTION
    ───────────                        ────────────
    localhost:3000                     example.com
         │                                  │
         ├─ Frontend                        ├─ Frontend (Vercel)
         │  (React Dev)                     │
         │                                  │
    localhost:3001                    api.example.com
         │                                  │
         ├─ Backend                         ├─ Backend (Heroku)
         │  (Express Dev)                   │  (Express Prod)
         │                                  │
    COM11 (Serial)                    Raspberry Pi
         │                                  │
         └─ Serial Syncer              └─ Serial Syncer
            (Local PC)                    (On Cloud)


═══════════════════════════════════════════════════════════════════════════════════

                      KEY TECHNOLOGIES USED

    Hardware         Communication       Backend         Frontend       Storage
    ────────         ─────────────       ───────         ────────       ───────
    • ESP32          • Serial Port       • Express       • React        • JSON
    • MAX30105       • HTTP REST         • Node.js       • JavaScript   • Local FS
    • Micro USB      • JSON              • Nodemon       • JSX           • Backup
                     • Axios             • CORS          • Chart.js


═══════════════════════════════════════════════════════════════════════════════════

                         SCALING CONSIDERATIONS

    Current (Single User)                Future (Multi-User)
    ─────────────────────                ──────────────────
    • JSON file storage         ➜         • Database (PostgreSQL)
    • Single serial port        ➜         • Multiple ESP32s per user
    • Browser-only UI           ➜         • Mobile app (React Native)
    • Local network only        ➜         • Cloud deployment
    • No authentication         ➜         • JWT tokens
    • Single device             ➜         • Multi-device sync


═══════════════════════════════════════════════════════════════════════════════════

                      FILES & THEIR RELATIONSHIPS

    serial-syncer.js
        │
        ├─ Connects to ESP32 (COM port)
        ├─ Sends data to Backend
        └─ Uses: serialport, axios
            │
            ▼
    server/index.js
        │
        ├─ Receives sensor data
        ├─ Stores in database
        ├─ Calculates statistics
        ├─ Predicts emotion
        ├─ Generates recommendations
        └─ Uses: express, fs, cors
            │
            ▼
    SensorDashboard.js
        │
        ├─ Fetches from backend
        ├─ Displays charts
        ├─ Shows emotion
        ├─ Renders recommendations
        └─ Uses: react, chart.js, axios
            │
            ▼
    data/healthRecords.json
        │
        └─ Persists all data


═══════════════════════════════════════════════════════════════════════════════════

                      NEXT STEPS & ENHANCEMENTS

    Phase 1 (Now)          Phase 2 (Soon)       Phase 3 (Future)
    ─────────────          ──────────────       ────────────────
    ✅ Serial sync         □ Database           □ Cloud deployment
    ✅ Real-time charts    □ Multi-user         □ Mobile app
    ✅ Emotion detection   □ Advanced ML        □ Wearable sync
    ✅ Recommendations     □ Export to CSV      □ Social features
    ✅ Responsive UI       □ Dark mode          □ Notifications


═══════════════════════════════════════════════════════════════════════════════════

                            🎉 YOU'RE ALL SET! 🎉

    Your complete mental health tracking system is ready to use!

    ✅ All components created
    ✅ All files documented
    ✅ Test system included
    ✅ Setup helpers provided
    ✅ Beautiful UI ready
    ✅ Data persistence working

    Next: Run 'npm run test-system' to verify everything!

═══════════════════════════════════════════════════════════════════════════════════

`);
