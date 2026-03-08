from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .services import AudioProcessor, EmotionAnalyzer
import logging

logger = logging.getLogger(__name__)

class AnalyzeEmotionView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.audio_processor = AudioProcessor()
        self.emotion_analyzer = EmotionAnalyzer()

    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get('audio')
        
        if not audio_file:
            return Response({"error": "No audio file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Process audio to text and extract features (energy, pitch, brightness, etc.)
        text, features = self.audio_processor.process_audio(audio_file)
        
        if not text:
            # If nothing was transcribed, still analyze based on tone/energy
            result = self.emotion_analyzer.analyze_emotion("", features)
            result["transcription"] = ""
            return Response(result, status=status.HTTP_200_OK)

        # Analyze emotion based on text AND voice tone features
        result = self.emotion_analyzer.analyze_emotion(text, features)
        
        # Combine transcription with result
        result["transcription"] = text
        
        return Response(result, status=status.HTTP_200_OK)
