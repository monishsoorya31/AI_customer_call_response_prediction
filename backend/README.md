# Backend - Customer Mood Detection

The backend is built with **Django REST Framework** and handles the core intelligence of the system, including audio processing and emotion analysis.

## ⚙️ Core Components

- **`AudioProcessor`**: Uses `librosa` to extract RMS energy, pitch, and spectral centroid from WAV files. It also utilizes `speech_recognition` to transcribe audio via Google's STT engine.
- **`EmotionAnalyzer`**: A hybrid analysis engine that combines:
  - **Textual Sentiment**: VADER sentiment analysis of the transcribed text.
  - **Acoustic Features**: Heuristics based on loudness, pitch variability, and brightness.
  - **Keyword Mapping**: Custom keyword triggers for specific customer states (Confused, Frustrated, etc.).

## 📡 API Endpoints

### `POST /api/analyze-emotion/`
Analyzes an uploaded audio file and returns the detected emotion.

**Request:**
- `audio`: File (WAV format recommended)

**Response:**
```json
{
  "emotion": "Excited",
  "confidence": "High (Text + Tone)",
  "recommendation": "Match enthusiasm - Continue Proposal",
  "transcription": "This is amazing!"
}
```

## 🛠️ Setup

1. **Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers librosa soundfile vaderSentiment SpeechRecognition
   ```
3. **Database**:
   ```bash
   python manage.py migrate
   ```
4. **Environment Variables**:
   Ensure any necessary environment variables for your transcription services are set (if applicable).

## 🧪 Testing Tone Extraction
A utility script `scripts/verify_tone.py` is included to test the audio feature extraction logic independently.
