# Customer Mood Detection System

A full-stack application that analyzes customer mood using both **Speech-to-Text (STT)** and **Vocals/Tone Analysis**. This project combines natural language processing with audio feature extraction to provide a more accurate sentiment assessment than text alone.

## 🚀 Key Features

- **Audio Recording**: Capture real-time audio through the web interface.
- **Tone Analysis**: Extracts RMS Energy, Pitch (F0), and Spectral Centroid using `librosa`.
- **Text Analysis**: Transcribes audio to text and performs VADER sentiment analysis.
- **Hybrid Emotion Detection**: Combines vocal features (loudness, pitch variability) with text sentiment to detect emotions like Excited, Angry, Frustrated, Sad, and Neutral.
- **Agentic Recommendations**: Provides specific communication strategies based on the detected emotion.

## 🏗️ Architecture

- **Backend**: Django REST Framework
  - Sentiment Analysis: `vaderSentiment`
  - Audio Processing: `librosa`, `soundfile`
  - Speech Recognition: `speech_recognition` (Google STT)
- **Frontend**: React + Vite
  - Styling: Tailwind CSS
  - Icons: Lucide React
  - Audio Recording: `RecordRTC`

## 🛠️ Quick Start

### Backend Setup
1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt` (or ensure `librosa`, `vaderSentiment`, `django-rest-framework`, `speech_recognition` are installed).
4. Run migrations: `python manage.py migrate`.
5. Start the server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## 📂 Project Structure

- `backend/`: Django application containing the API and emotion logic.
- `frontend/`: React components and audio recording logic.

---

For more detailed information, see:
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
