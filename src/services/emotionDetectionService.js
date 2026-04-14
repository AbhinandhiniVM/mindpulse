/**
 * Emotion Detection Service
 * Uses TensorFlow.js to load and run the trained emotion detection model (H5)
 * Integrates with sensor data (PPG, BPM, SpO2)
 */

import * as tf from '@tensorflow/tfjs';
import * as h5 from '@tensorflow/tfjs-io';

class EmotionDetectionService {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.modelPath = process.env.REACT_APP_MODEL_PATH || './models/pulse_of_emotion.h5';
  }

  /**
   * Load the trained emotion detection model
   * @param {string} modelPath - Path to the H5 model file
   * @returns {Promise<boolean>} - True if model loaded successfully
   */
  async loadModel(modelPath = null) {
    try {
      if (this.model) {
        console.log('✅ Model already loaded');
        return true;
      }

      const path = modelPath || this.modelPath;
      console.log(`📂 Loading emotion detection model from: ${path}`);

      // Load the H5 model using TensorFlow.js
      // For H5 files, you need to convert them or use a custom loader
      this.model = await tf.loadLayersModel(
        `file://${path}`
      );

      this.isLoaded = true;
      console.log('✅ Emotion detection model loaded successfully');
      console.log(`📊 Model summary:`, this.model.summary());

      return true;
    } catch (error) {
      console.error('❌ Failed to load model:', error.message);
      console.log('💡 Ensure the model is converted to TensorFlow.js format (.json + .bin)');
      return false;
    }
  }

  /**
   * Preprocess sensor data for model input
   * @param {number} ppg - PPG value (300-1000)
   * @param {number} bpm - Heart rate (beats per minute)
   * @param {number} spo2 - Oxygen saturation (%)
   * @returns {tf.Tensor} - Normalized input tensor
   */
  preprocessData(ppg, bpm, spo2) {
    try {
      // Normalize values to 0-1 range
      const normalizedPPG = (ppg - 300) / 700; // PPG range: 300-1000
      const normalizedBPM = bpm / 150; // BPM range: 0-150
      const normalizedSpO2 = (spo2 - 85) / 15; // SpO2 range: 85-100

      // Clamp values to [0, 1]
      const input = [
        Math.max(0, Math.min(1, normalizedPPG)),
        Math.max(0, Math.min(1, normalizedBPM)),
        Math.max(0, Math.min(1, normalizedSpO2))
      ];

      // Convert to tensor
      const inputTensor = tf.tensor2d([input], [1, 3]);
      return inputTensor;
    } catch (error) {
      console.error('Error preprocessing data:', error);
      return null;
    }
  }

  /**
   * Predict emotion from sensor data
   * @param {number} ppg - PPG value
   * @param {number} bpm - Heart rate
   * @param {number} spo2 - Oxygen saturation
   * @returns {Promise<Object>} - Emotion prediction with confidence scores
   */
  async predictEmotion(ppg, bpm, spo2) {
    try {
      if (!this.isLoaded) {
        console.warn('⚠️ Model not loaded. Loading now...');
        await this.loadModel();
      }

      // Preprocess input
      const inputTensor = this.preprocessData(ppg, bpm, spo2);
      if (!inputTensor) {
        throw new Error('Failed to preprocess data');
      }

      // Run prediction
      const prediction = this.model.predict(inputTensor);
      const predictedValues = await prediction.data();

      // Map predictions to emotions
      // Assuming model outputs 4 values: [happy, sad, angry, relaxed]
      const emotionLabels = ['Happy', 'Sad', 'Angry', 'Relaxed'];
      const emotions = {};

      for (let i = 0; i < emotionLabels.length; i++) {
        emotions[emotionLabels[i]] = parseFloat((predictedValues[i] * 100).toFixed(2));
      }

      // Find dominant emotion
      const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );

      // Cleanup tensors
      inputTensor.dispose();
      prediction.dispose();

      return {
        dominantEmotion,
        confidence: emotions[dominantEmotion],
        allEmotions: emotions,
        vitals: { ppg, bpm, spo2 },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error predicting emotion:', error);
      return null;
    }
  }

  /**
   * Batch predict emotions from multiple sensor readings
   * @param {Array} readings - Array of {ppg, bpm, spo2} objects
   * @returns {Promise<Object>} - Aggregated emotion prediction
   */
  async batchPredictEmotions(readings) {
    try {
      if (readings.length === 0) {
        throw new Error('No readings provided');
      }

      const predictions = [];

      for (const reading of readings) {
        const prediction = await this.predictEmotion(
          reading.ppg,
          reading.bpm,
          reading.spo2
        );
        if (prediction) {
          predictions.push(prediction);
        }
      }

      // Aggregate predictions
      if (predictions.length === 0) {
        throw new Error('No valid predictions generated');
      }

      // Calculate average emotion scores
      const aggregatedEmotions = {
        Happy: 0,
        Sad: 0,
        Angry: 0,
        Relaxed: 0
      };

      predictions.forEach(pred => {
        Object.keys(aggregatedEmotions).forEach(emotion => {
          aggregatedEmotions[emotion] += pred.allEmotions[emotion];
        });
      });

      Object.keys(aggregatedEmotions).forEach(emotion => {
        aggregatedEmotions[emotion] = parseFloat(
          (aggregatedEmotions[emotion] / predictions.length).toFixed(2)
        );
      });

      const dominantEmotion = Object.keys(aggregatedEmotions).reduce((a, b) =>
        aggregatedEmotions[a] > aggregatedEmotions[b] ? a : b
      );

      return {
        dominantEmotion,
        confidence: aggregatedEmotions[dominantEmotion],
        allEmotions: aggregatedEmotions,
        readingsCount: readings.length,
        predictions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in batch prediction:', error);
      return null;
    }
  }

  /**
   * Dispose model and free memory
   */
  disposeModel() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isLoaded = false;
      console.log('🗑️  Model disposed');
    }
  }

  /**
   * Get model information
   */
  getModelInfo() {
    if (!this.model) {
      return { status: 'Not loaded' };
    }

    return {
      status: 'Loaded',
      name: this.model.name,
      inputShape: this.model.inputShape,
      outputShape: this.model.outputShape,
      layers: this.model.layers.length
    };
  }
}

export default new EmotionDetectionService();
