import React from 'react';

const MicrophoneController = ({ isRecording, onStart, onStop }) => {
    return (
        <div className="flex flex-col items-center gap-6">

            {/* Ripple wrapper */}
            <div className="relative flex items-center justify-center">

                {/* Ripple rings — only visible while recording */}
                {isRecording && (
                    <>
                        <span className="absolute w-36 h-36 rounded-full bg-red-100 opacity-60 animate-ping" style={{ animationDuration: '1.2s' }} />
                        <span className="absolute w-44 h-44 rounded-full bg-red-50 opacity-40 animate-ping" style={{ animationDuration: '1.6s' }} />
                    </>
                )}

                {/* Main button */}
                <button
                    onClick={isRecording ? onStop : onStart}
                    className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center
            shadow-lg transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-4
            ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200 focus-visible:ring-red-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus-visible:ring-indigo-200'
                        }`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                    {isRecording ? (
                        /* Stop icon — inline SVG square */
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <rect x="5" y="5" width="14" height="14" rx="2" />
                        </svg>
                    ) : (
                        /* Mic icon — inline SVG */
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="2" width="6" height="12" rx="3" />
                            <path d="M5 10a7 7 0 0014 0" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                            <line x1="9" y1="22" x2="15" y2="22" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Status label */}
            <div className="flex items-center gap-2 text-sm font-medium">
                {isRecording ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-500">Live Analysis Running</span>
                    </>
                ) : (
                    <span className="text-slate-400">Tap to Start Call</span>
                )}
            </div>

            {/* Helper hint */}
            <p className="text-xs text-slate-300 text-center leading-relaxed max-w-[160px]">
                {isRecording
                    ? 'Analyzing every 5 seconds automatically'
                    : 'Microphone access required'}
            </p>

        </div>
    );
};

export default MicrophoneController;