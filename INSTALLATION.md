# 🎯 Installation & Deployment Guide

## ✅ Setup Complete!

Your Mental Health Tracker application has been successfully built and is ready to deploy.

## 📦 What Was Installed

### Frontend Dependencies
- React 18.x with React Router
- Chart.js for data visualization
- Axios for API calls
- Lucide React for icons
- CSS custom variables for theming

### Backend Dependencies
- Express.js for REST API
- CORS for cross-origin requests
- Nodemon for development auto-reload
- Body-parser for JSON handling

### Development Tools
- React Scripts for build tools
- Concurrently for running multiple processes
- ESLint for code quality

## 🚀 Running the Application

### Development Mode

**Method 1: Separate Terminals (Recommended)**

Terminal 1 - Start Backend:
```bash
cd c:\Users\manik\.vscode\app mhc\mental-health-tracker
npm run server
```

Terminal 2 - Start Frontend:
```bash
cd c:\Users\manik\.vscode\app mhc\mental-health-tracker
npm start
```

**Method 2: Single Terminal (Using Concurrently)**
```bash
cd c:\Users\manik\.vscode\app mhc\mental-health-tracker
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Backend Health Check: http://localhost:5000/api/health

## 📂 Project Structure

```
mental-health-tracker/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Navigation component
│   │   ├── Card.js             # Reusable card component
│   │   ├── EmotionCard.js       # Emotion display card
│   │   ├── Button.js            # Button component
│   │   └── *.css                # Component styles
│   ├── pages/
│   │   ├── Dashboard.js         # Main dashboard
│   │   ├── DataInput.js         # PPG data input
│   │   ├── Analytics.js         # Analytics & charts
│   │   ├── Settings.js          # User settings
│   │   └── *.css                # Page styles
│   ├── App.js                   # Main app component
│   ├── App.css                  # App styles
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── server/
│   └── index.js                 # Express server
├── data/
│   └── healthRecords.json       # JSON database
├── build/                       # Production build (generated)
├── node_modules/                # Dependencies
├── package.json                 # Project configuration
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── README.md                    # Full documentation
├── QUICKSTART.md               # Quick start guide
├── verify-setup.js             # Setup verification script
└── start.js                    # Startup script
```

## 🔧 Configuration

### Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

### Customize Colors (src/index.css)
```css
--primary: #6366f1              /* Main brand color */
--primary-dark: #4f46e5
--primary-light: #818cf8
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--bg-primary: #0f172a           /* Dark background */
--bg-secondary: #1e293b
--text-primary: #f1f5f9         /* Light text */
--text-secondary: #cbd5e1
```

## 📊 Database Schema

The JSON database stores records with this structure:

```json
{
  "records": [
    {
      "id": 1701623695000,
      "userId": 1,
      "heartRate": 75,
      "o2Level": 98,
      "emotion": "Happy",
      "confidence": 85,
      "notes": "Feeling great today",
      "timestamp": "2025-12-03T07:34:55.000Z"
    }
  ]
}
```

## 🔌 API Reference

### Dashboard
```
GET /api/dashboard

Response:
{
  "latestRecord": { ... },
  "stats": {
    "totalRecords": 12,
    "averageHeartRate": 72,
    "averageO2": 97.5,
    "lastEmotionDetected": "Happy"
  }
}
```

### Predict Emotion
```
POST /api/predict

Request Body:
{
  "heartRate": 75,
  "o2Level": 98,
  "notes": "Optional context",
  "userId": 1
}

Response:
{
  "success": true,
  "emotion": "Happy",
  "confidence": 85,
  "record": { ... }
}
```

### Analytics
```
GET /api/analytics?range=week|month|year

Response:
{
  "heartRateData": { ... },
  "o2Data": { ... },
  "emotionDistribution": { ... },
  "emotionTrend": { ... }
}
```

### Get All Records
```
GET /api/records

Response: Array of all records
```

### Delete Record
```
DELETE /api/records/:id

Response:
{
  "success": true
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "Server is running",
  "timestamp": "2025-12-03T07:34:55.000Z"
}
```

## 🛠️ Build for Production

### Create Optimized Build
```bash
npm run build
```

This generates a `build/` folder with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source map for debugging

### Deploy
```bash
npm install -g serve
serve -s build
```

Or use any static hosting service (Vercel, Netlify, AWS S3, etc.)

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Port 3000:**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Port 5000:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Dependencies Not Found
```bash
npm install --legacy-peer-deps
npm install --save-exact react@18.2.0
```

### Issue: CORS Errors
Check that backend API URL in frontend matches:
- Frontend proxy: http://localhost:5000
- Backend serving on port 5000

### Issue: Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Features Explained

### Dashboard
- Shows latest emotion detection with confidence
- Displays current health metrics
- Provides mental health tips
- Quick stats overview

### Data Input
- PPG sensor data entry form
- Real-time emotion prediction
- Optional context notes
- Calibration guidelines
- Emotion reference chart

### Analytics
- Heart rate trend charts
- O₂ level monitoring
- Emotion distribution pie chart
- Multi-emotion trend analysis
- Time range filtering (week/month/year)
- Key insights generation

### Settings
- Profile management
- Theme preferences
- Data export/import
- Data deletion options
- User preferences

## 🎨 Customization Tips

### Add New Emotion
1. Update `predictEmotion()` in `server/index.js`
2. Add emoji and color in components
3. Update emotion reference in `DataInput.js`

### Change Theme Colors
Edit `src/index.css` CSS variables

### Add New Chart
1. Import Chart.js component
2. Add data processing in `Analytics.js`
3. Create chart visualization

## 📊 Performance Notes

- Frontend bundle: ~141KB gzipped
- No database migrations needed
- Real-time emotion detection
- Efficient data storage in JSON
- Fast API response times

## 🔒 Security Notes

- All data stored locally (JSON file)
- No external API calls required
- CORS properly configured
- Input validation on backend

## 📈 Next Steps

1. **Run the app**: `npm start` + `npm run server`
2. **Input sample data**: Use the Data Input page
3. **View results**: Check emotion detection
4. **Analyze trends**: Use Analytics page
5. **Customize**: Edit colors, add features

## 🚀 Future Enhancements

- [ ] Real TensorFlow.js model integration
- [ ] Real-time PPG sensor streaming
- [ ] Cloud database sync
- [ ] Mobile app with React Native
- [ ] Advanced ML analytics
- [ ] Notification system
- [ ] Social features
- [ ] User authentication

## 📚 Resources

- React: https://react.dev
- Express: https://expressjs.com
- Chart.js: https://www.chartjs.org
- Lucide Icons: https://lucide.dev

## ✉️ Support

For issues or questions:
1. Check terminal console for errors
2. Open browser console (F12)
3. Review error messages
4. Check README.md and QUICKSTART.md

---

**Your app is ready! Happy tracking! 💚**
