from django.urls import path
from .views import AnalyzeEmotionView

urlpatterns = [
    path('analyze-emotion/', AnalyzeEmotionView.as_view(), name='analyze_emotion'),
]
