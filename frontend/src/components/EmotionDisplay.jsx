import React from 'react';

const EMOTION_CONFIG = {
    Happy: { bg: 'bg-amber-50', border: 'border-amber-300', ring: 'ring-amber-100', text: 'text-amber-500', badge: 'bg-amber-100 text-amber-600', barFill: 'bg-amber-300', glow: 'shadow-amber-100', emoji: '😊' },
    Sad: { bg: 'bg-blue-50', border: 'border-blue-300', ring: 'ring-blue-100', text: 'text-blue-500', badge: 'bg-blue-100 text-blue-600', barFill: 'bg-blue-300', glow: 'shadow-blue-100', emoji: '😔' },
    Angry: { bg: 'bg-red-50', border: 'border-red-300', ring: 'ring-red-100', text: 'text-red-500', badge: 'bg-red-100 text-red-600', barFill: 'bg-red-300', glow: 'shadow-red-100', emoji: '😠' },
    Surprised: { bg: 'bg-violet-50', border: 'border-violet-300', ring: 'ring-violet-100', text: 'text-violet-500', badge: 'bg-violet-100 text-violet-600', barFill: 'bg-violet-300', glow: 'shadow-violet-100', emoji: '😲' },
    Fearful: { bg: 'bg-orange-50', border: 'border-orange-300', ring: 'ring-orange-100', text: 'text-orange-500', badge: 'bg-orange-100 text-orange-600', barFill: 'bg-orange-300', glow: 'shadow-orange-100', emoji: '😨' },
    Disgusted: { bg: 'bg-green-50', border: 'border-green-300', ring: 'ring-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700', barFill: 'bg-green-300', glow: 'shadow-green-100', emoji: '🤢' },
    NotInterested: { bg: 'bg-slate-50', border: 'border-slate-300', ring: 'ring-slate-100', text: 'text-slate-500', badge: 'bg-slate-100 text-slate-600', barFill: 'bg-slate-300', glow: 'shadow-slate-100', emoji: '😑' },
    Neutral: { bg: 'bg-indigo-50', border: 'border-indigo-200', ring: 'ring-indigo-100', text: 'text-indigo-500', badge: 'bg-indigo-100 text-indigo-600', barFill: 'bg-indigo-300', glow: 'shadow-indigo-100', emoji: '😐' },
};

const CONFIDENCE_BARS = { Low: 1, Medium: 2, High: 3 };

const EmotionDisplay = ({ emotion, confidence }) => {
    const emotionClass = emotion.replace(/\s+/g, '');
    const config = EMOTION_CONFIG[emotionClass] || EMOTION_CONFIG.Neutral;
    const bars = CONFIDENCE_BARS[confidence] ?? 1;

    return (
        <div className="flex flex-col items-center gap-5">
            {emotion === '' ? (
                <div className="flex flex-col items-center justify-center h-36 w-full text-center opacity-50">
                    <span className="text-4xl leading-none mb-3 grayscale">😶</span>
                    <span className="text-sm font-semibold text-slate-400">Awaiting Analysis</span>
                </div>
            ) : (
                <>
                    {/* Emotion circle */}
                    <div className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center
                border-2 ${config.border} ${config.bg}
                ring-8 ${config.ring}
                shadow-xl ${config.glow}
                transition-all duration-500`}
                    >
                        {/* Dashed outer ring */}
                        <div className={`absolute -inset-3 rounded-full border-2 border-dashed ${config.border} opacity-40 animate-spin`}
                            style={{ animationDuration: '8s' }}
                        />

                        {/* Emoji */}
                        <span className="text-4xl leading-none mb-1 select-none">{config.emoji}</span>

                        {/* Emotion label */}
                        <span className={`text-sm font-bold ${config.text} tracking-wide`}>{emotion}</span>
                    </div>

                    {/* Confidence indicator */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className="flex items-center justify-between w-full px-1">
                            <span className="text-xs text-slate-400 font-medium">Confidence</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
                                {confidence}
                            </span>
                        </div>

                        {/* Bar meter */}
                        <div className="flex gap-1.5 w-full">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= bars ? config.barFill : 'bg-slate-100'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmotionDisplay;