# Mental Health Tracker - AI-Powered Emotion Detection

A comprehensive web application for mental health tracking using deep learning emotion detection from PPG sensor data (heart rate and oxygen levels).

## Features

- 🧠 **AI Emotion Detection**: Detects emotions (Happy, Sad, Angry, Relaxed) from heart rate and O₂ level data
- 📊 **Analytics Dashboard**: Comprehensive charts and insights about your emotional patterns
- 💓 **PPG Sensor Integration**: Connect PPG sensors to get real-time heart rate and O₂ readings
- 📈 **Health Metrics Tracking**: Monitor trends over time
- 🎨 **Beautiful UI**: Modern, responsive design with dark theme
- 💾 **JSON Database**: Secure local data storage
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
mental-health-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Card.js
│   │   ├── EmotionCard.js
│   │   └── Button.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── DataInput.js
│   │   ├── Analytics.js
│   │   └── Settings.js
│   ├── App.js
│   └── index.js
├── server/
│   └── index.js
├── data/
│   └── healthRecords.json
└── package.json
```

## Installation

1. Navigate to the project directory:
```bash
cd mental-health-tracker
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

This will start both the React development server and the Express backend server.

### Client Only
```bash
npm run client
```

### Server Only
```bash
npm run server
```

### Production Build
```bash
npm run build
```

## API Endpoints

- `GET /api/dashboard` - Get dashboard statistics
- `POST /api/predict` - Submit sensor data and get emotion prediction
- `GET /api/analytics` - Get analytics data
- `GET /api/records` - Get all health records
- `DELETE /api/records/:id` - Delete a specific record
- `GET /api/health` - Health check

## How to Use

1. **Input Data**: Navigate to "Input Data" and enter your heart rate and O₂ levels from your PPG sensor
2. **View Results**: See the detected emotion with confidence percentage
3. **Track Progress**: Use the Dashboard to see your latest reading
4. **Analyze Trends**: Check the Analytics page for comprehensive insights
5. **Manage Settings**: Update your profile and preferences

## Supported Emotions

- **😊 Happy**: High heart rate, normal O₂ levels
- **😌 Relaxed**: Low heart rate, high O₂ levels
- **😢 Sad**: Moderate heart rate with variations, normal O₂
- **😠 Angry**: High heart rate, lower O₂ levels

## Technology Stack

- **Frontend**: React, React Router, Chart.js
- **Backend**: Node.js, Express
- **Database**: JSON (Local storage)
- **Styling**: CSS3 with CSS Variables
- **Icons**: Lucide React
- **Charts**: Chart.js with react-chartjs-2

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All data is stored locally in JSON format
- The deep learning model (pulse_of_emotion.h5) can be integrated for more accurate predictions
- The current emotion detection uses heuristic-based algorithms
- For production use, integrate with TensorFlow.js for client-side model inference

## Future Enhancements

- [ ] Real TensorFlow.js integration with the h5 model
- [ ] Real-time PPG sensor streaming
- [ ] Mobile app with React Native
- [ ] Cloud synchronization
- [ ] Advanced analytics with ML
- [ ] Push notifications
- [ ] Social features for support groups

## License

MIT

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
