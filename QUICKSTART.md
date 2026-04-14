# 🚀 MindPulse - Mental Health Tracker

## ✨ Quick Start Guide

Your AI-powered mental health tracking application is **READY** to run!

### 📦 What's Included

✅ **Frontend**: Modern React app with beautiful UI
✅ **Backend**: Express.js API server
✅ **Database**: JSON-based local storage
✅ **AI Detection**: Emotion detection from PPG sensor data
✅ **Analytics**: Charts and insights dashboard
✅ **Responsive Design**: Works on all devices

### 🎯 How to Run

#### Option 1: Run Both Client & Server (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd "c:\Users\manik\.vscode\app mhc\mental-health-tracker"
npm run server
```
Server will start on: **http://localhost:5000**

**Terminal 2 - Start Frontend:**
```bash
cd "c:\Users\manik\.vscode\app mhc\mental-health-tracker"
npm start
```
App will open on: **http://localhost:3000**

#### Option 2: Using Concurrently

```bash
npm run dev
```
This runs both frontend and backend together.

### 📱 Features

**Dashboard**
- View your latest emotion detection
- See current health metrics (heart rate, O₂ level)
- Quick mental health tips

**Input Data**
- Enter PPG sensor readings
- Automatic emotion detection
- Track your emotions over time
- Optional notes for context

**Analytics**
- Heart rate trends
- Oxygen level monitoring
- Emotion distribution charts
- Week/Month/Year views
- Personalized insights

**Settings**
- Manage your profile
- User preferences
- Data export/import
- Session management

### 🧠 Supported Emotions

- **😊 Happy** - Normal/high heart rate, optimal O₂
- **😌 Relaxed** - Low heart rate, high O₂
- **😢 Sad** - Moderate variations in metrics
- **😠 Angry** - Elevated heart rate, lower O₂

### 📊 API Endpoints

```
GET  /api/dashboard      - Dashboard statistics
POST /api/predict        - Emotion prediction
GET  /api/analytics      - Analytics data
GET  /api/records        - All health records
DELETE /api/records/:id  - Delete a record
GET  /api/health         - Server health check
```

### 💾 Data Storage

All your data is stored in:
```
c:\Users\manik\.vscode\app mhc\mental-health-tracker\data\healthRecords.json
```

### 🛠️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### 📝 Project Structure

```
mental-health-tracker/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # App pages (Dashboard, Input, etc.)
│   ├── utils/          # Utility functions
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── server/
│   └── index.js        # Express server
├── data/
│   └── healthRecords.json  # JSON database
└── package.json        # Dependencies
```

### 🎨 Customization

**Colors & Theme**
Edit `src/index.css` to change the color scheme:
```css
--primary: #6366f1
--success: #10b981
--danger: #ef4444
```

**Emotion Detection Logic**
Modify `server/index.js` `predictEmotion()` function to change detection algorithms.

### 🔗 Integrate with Real Model

To use the `pulse_of_emotion.h5` model:
1. Convert H5 to TensorFlow.js format
2. Load in frontend using `@tensorflow/tfjs`
3. Pass PPG data for inference

### 📚 Tech Stack

- **Frontend**: React 18, React Router, Chart.js
- **Backend**: Node.js, Express
- **Styling**: CSS3 with variables
- **Icons**: Lucide React
- **Charts**: Chart.js with react-chartjs-2
- **Database**: JSON file

### 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Port 5000 already in use?**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Dependency issues?**
```bash
npm install --legacy-peer-deps
```

**Clear node_modules:**
```bash
rmdir /s /q node_modules
npm install
```

### 📧 Support

For issues, check:
- Terminal console for errors
- Browser console (F12)
- README.md for more details

### 🎯 Next Steps

1. ✅ Run the app: `npm start` (frontend) + `npm run server` (backend)
2. 📊 Enter sample PPG data
3. 📈 View emotion detection results
4. 📉 Analyze trends on Analytics page
5. 🎨 Customize colors and settings

### 🚀 Future Enhancements

- Real TensorFlow.js integration
- Real-time PPG sensor streaming
- Cloud sync
- Mobile app
- Advanced ML analytics

---

**Happy tracking! 💚**

For more information, see README.md
