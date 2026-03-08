import sys
import os

# Add the project directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import io
from api.services import AudioProcessor, EmotionAnalyzer

def generate_test_wav(path, freq=440, duration=1.0, rate=22050):
    import numpy as np
    from scipy.io import wavfile
    t = np.linspace(0, duration, int(rate * duration), endpoint=False)
    # Generate a sine wave
    data = (0.5 * np.sin(2 * np.pi * freq * t) * 32767).astype(np.int16)
    wavfile.write(path, rate, data)
    print(f"Generated synthetic WAV at {path}")

def test_tone_analysis():
    processor = AudioProcessor()
    analyzer = EmotionAnalyzer()
    
    test_wav_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'test_synth.wav'))
    
    # Generate a "Happy" tone (Medium pitch, moderate energy)
    generate_test_wav(test_wav_path, freq=300) 
    
    print(f"Testing with: {test_wav_path}")
    
    with open(test_wav_path, 'rb') as f:
        audio_bytes = f.read()
    
    # Mocking file-like object for process_audio
    class MockFile:
        def __init__(self, content):
            self.content = content
        def read(self):
            return self.content

    text, features = processor.process_audio(MockFile(audio_bytes))
    
    print(f"Transcribed Text: '{text}'")
    print(f"Extracted Features: {features}")
    
    result = analyzer.analyze_emotion(text, features)
    print(f"Detected Emotion: {result['emotion']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Recommendation: {result['recommendation']}")

    # Clean up
    if os.path.exists(test_wav_path):
        os.remove(test_wav_path)

if __name__ == "__main__":
    test_tone_analysis()
