import React from 'react';

const EMOTION_META = {
    Happy: { icon: 'thumbs', pill: 'bg-amber-100 text-amber-600', iconBg: 'bg-amber-50 border-amber-200', iconColor: '#d97706' },
    Interested: { icon: 'thumbs', pill: 'bg-amber-100 text-amber-600', iconBg: 'bg-amber-50 border-amber-200', iconColor: '#d97706' },
    Excited: { icon: 'thumbs', pill: 'bg-amber-100 text-amber-600', iconBg: 'bg-amber-50 border-amber-200', iconColor: '#d97706' },
    Angry: { icon: 'shield', pill: 'bg-red-100 text-red-600', iconBg: 'bg-red-50 border-red-200', iconColor: '#dc2626' },
    Frustrated: { icon: 'shield', pill: 'bg-red-100 text-red-600', iconBg: 'bg-red-50 border-red-200', iconColor: '#dc2626' },
    NotInterested: { icon: 'shield', pill: 'bg-red-100 text-red-600', iconBg: 'bg-red-50 border-red-200', iconColor: '#dc2626' },
    Confused: { icon: 'headset', pill: 'bg-violet-100 text-violet-600', iconBg: 'bg-violet-50 border-violet-200', iconColor: '#7c3aed' },
    Sad: { icon: 'headset', pill: 'bg-blue-100 text-blue-600', iconBg: 'bg-blue-50 border-blue-200', iconColor: '#2563eb' },
    Stressed: { icon: 'headset', pill: 'bg-orange-100 text-orange-600', iconBg: 'bg-orange-50 border-orange-200', iconColor: '#ea580c' },
    Neutral: { icon: 'arrow', pill: 'bg-indigo-100 text-indigo-600', iconBg: 'bg-indigo-50 border-indigo-200', iconColor: '#4f46e5' },
};

/* ── Inline SVG icons ── */
const ThumbsUpIcon = ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </svg>
);

const ShieldIcon = ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r="0.5" fill={color} />
    </svg>
);

const HeadsetIcon = ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z" />
        <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
);

const ArrowIcon = ({ color }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 8 16 12 12 16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const ICONS = {
    thumbs: ThumbsUpIcon,
    shield: ShieldIcon,
    headset: HeadsetIcon,
    arrow: ArrowIcon,
};

const RecommendationPanel = ({ recommendation, emotion }) => {
    const emotionKey = emotion?.replace(/\s+/g, '') || '';
    const isAwaiting = emotionKey === '';

    // Fallback to neutral for icon/color if awaiting, but no 'strategy' pill
    const meta = EMOTION_META[isAwaiting ? 'Neutral' : emotionKey] || EMOTION_META.Neutral;
    const Icon = ICONS[meta.icon];

    return (
        <div className="flex flex-row items-center gap-6 w-full">

            {/* Icon badge */}
            <div className={`shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center shadow-sm transition-all duration-300 ${meta.iconBg}`}>
                <Icon color={meta.iconColor} />
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strategy</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isAwaiting ? 'bg-slate-100 text-slate-500' : meta.pill}`}>
                        {isAwaiting ? 'Standby' : emotion}
                    </span>
                </div>
                <p className="text-slate-800 font-semibold text-lg leading-snug truncate">
                    {recommendation}
                </p>
            </div>

            {/* Decorative right chevron */}
            <div className="shrink-0 text-slate-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>

        </div>
    );
};

export default RecommendationPanel;