import io
import logging
import time
import numpy as np
import soundfile as sf
import librosa
import speech_recognition as sr
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

class AudioProcessor:
    def __init__(self):
        self._recognizer = None

    @property
    def recognizer(self):
        if self._recognizer is None:
            self._recognizer = sr.Recognizer()
        return self._recognizer

    def extract_features(self, audio_bytes):
        """
        Extracts complex audio features: RMS Energy, Pitch (Hz), and Spectral Centroid.
        """
        try:
            # Load audio using librosa
            data, rate = sf.read(io.BytesIO(audio_bytes))
            if len(data.shape) > 1:
                data = data.mean(axis=1)
            
            # 1. RMS Energy (Volume)
            rms = librosa.feature.rms(y=data)
            energy = np.mean(rms)
            
            # 2. Pitch (Fundamental Frequency F0) using YIN
            # We use a masking approach to ignore silence
            f0 = librosa.yin(y=data, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
            # Filter out NaN/Infinity
            f0 = f0[np.isfinite(f0)]
            avg_pitch = np.mean(f0) if len(f0) > 0 else 0
            pitch_std = np.std(f0) if len(f0) > 0 else 0
            
            # 3. Spectral Centroid (Brightness/Presence)
            cent = librosa.feature.spectral_centroid(y=data, sr=rate)
            brightness = np.mean(cent)
            
            return {
                "energy": float(energy),
                "pitch": float(avg_pitch),
                "pitch_std": float(pitch_std),
                "brightness": float(brightness)
            }
        except Exception as e:
            logger.error(f"Error extracting audio features: {e}")
            return {
                "energy": 0.0,
                "pitch": 0.0,
                "pitch_std": 0.0,
                "brightness": 0.0
            }

    def process_audio(self, audio_file):
        """
        Converts uploaded standard WAV file into text using Google Speech Recognition
        and extracts complex audio features.
        """
        audio_bytes = audio_file.read()
        features = self.extract_features(audio_bytes)
        
        text = ""
        try:
            with sr.AudioFile(io.BytesIO(audio_bytes)) as source:
                audio_data = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            logger.info("Google STT could not understand audio")
        except Exception as e:
            logger.error(f"Error processing audio STT: {e}")
            
        return text, features

class EmotionAnalyzer:
    def __init__(self):
        self._analyzer = None
        self.keywords = {
            "Confused": ["confused", "understand", "mean", "lost", "what", "how", "why", "repeat"],
            "Frustrated": ["frustrating", "annoying", "stop", "tired", "ugh", "ridiculous", "long", "come on"],
            "Stressed": ["stress", "overwhelmed", "pressured", "busy", "hard", "difficult", "later"],
            "Excited": ["amazing", "wow", "incredible", "love", "perfect", "awesome", "great", "absolutely"],
            "Not Interested": ["not interested", "no thanks", "remove", "don't call", "busy", "hang up", "bye", "cancel"],
            "Interested": ["interested", "tell me more", "how much", "details", "sounds good", "yes", "buy"],
        }

    @property
    def analyzer(self):
        if self._analyzer is None:
            self._analyzer = SentimentIntensityAnalyzer()
        return self._analyzer

    def analyze_emotion(self, text, features):
        """
        Analyzes the text and audio features (energy, pitch, brightness) to return Emotion.
        """
        energy = features.get("energy", 0)
        pitch = features.get("pitch", 0)
        pitch_std = features.get("pitch_std", 0)
        brightness = features.get("brightness", 0)

        # Tone-based heuristics
        # 1. High Energy + High Pitch Variability -> Excited or Angry
        # 2. Low Energy + Low Pitch -> Sad or Neutral
        # 3. High Brightness (Spectral Centroid) -> Intense emotions (Angry/Excited)
        
        is_loud = energy > 0.05 # Lower threshold than before because RMS is normalized differently in librosa
        is_high_pitch = pitch > 200 # Higher than average human talking pitch
        is_variable_tone = pitch_std > 50 # Multi-tonal, indicating excitement or distress
        is_bright = brightness > 3000 # High spectral presence
        
        # Combine with Text Sentiment
        if text and text.strip() != "":
            text_lower = text.lower()
            
            # Keyword matching
            for emotion, words in self.keywords.items():
                if any(word in text_lower for word in words):
                    # Refine keyword match with tone
                    if emotion == "Excited" and not is_loud and not is_variable_tone:
                        emotion = "Interested" # Downgrade if tone doesn't match
                    if emotion == "Frustrated" and is_loud:
                        emotion = "Angry" # Upgrade if loud
                    
                    return {
                        "emotion": emotion,
                        "confidence": "High (Text + Tone)",
                        "recommendation": self.get_recommendation(emotion)
                    }

            sentiment = self.analyzer.polarity_scores(text)
            compound = sentiment['compound']
            
            if compound >= 0.5:
                emotion = "Excited" if (is_loud or is_variable_tone) else "Happy"
            elif compound <= -0.5:
                emotion = "Angry" if is_loud else "Sad"
            elif is_loud and is_bright and abs(compound) < 0.2:
                emotion = "Frustrated"
            elif compound <= -0.2:
                 emotion = "Sad" if not is_loud else "Frustrated"
            elif compound >= 0.2:
                emotion = "Interested"
            else:
                emotion = "Neutral"
        else:
            # Tone-only analysis if no text
            if is_loud and is_variable_tone:
                emotion = "Excited"
            elif is_loud and is_bright:
                emotion = "Angry"
            elif is_loud:
                emotion = "Frustrated"
            elif energy > 0.01 and pitch < 150 and not is_bright:
                emotion = "Sad"
            else:
                emotion = "Neutral"

        return {
            "emotion": emotion,
            "confidence": "Medium (Tone-Weighted)",
            "recommendation": self.get_recommendation(emotion)
        }

    def get_recommendation(self, emotion):
        mapping = {
            "Happy": "Continue Call",
            "Neutral": "Proceed Normally",
            "Sad": "Empathetic Tone",
            "Angry": "Calm Tone - Do not argue / Politely End Call",
            "Frustrated": "Calm Tone - Offer solutions or escalate",
            "Confused": "Provide Clarification",
            "Not Interested": "Be Polite and End Call",
            "Interested": "Continue Call - Shift to Pitch/Close",
            "Stressed": "Be brief and accommodating",
            "Excited": "Match enthusiasm - Continue Proposal"
        }
        return mapping.get(emotion, "Proceed Normally")
