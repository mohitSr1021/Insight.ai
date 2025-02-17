import React, { useEffect, useRef } from 'react';
import { Card, Typography, Tooltip } from "antd";
import { Mic, } from "lucide-react";
import { useAppSelector } from '../redux/store/rootStore';

const { Paragraph } = Typography;

const LiveTranscription: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isRecording, recordingTime, currentTranscript } = useAppSelector((state) => state.voice);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [currentTranscript]);

  if (!isRecording) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <Card
        className="shadow-lg border-2 border-blue-100 bg-white/95 backdrop-blur-sm"
        style={{ padding: "1.25rem" }}
      >
        {/* Recording Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Mic className="w-5 h-5 text-red-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          <Tooltip title="Recording Duration">
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {formatTime(recordingTime)}
            </span>
          </Tooltip>
        </div>

        {/* Waveform Animation */}
        {/* <div className="h-8 flex items-center justify-center gap-1 mb-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div> */}

        {/* Live Transcription Content */}
        <div
          ref={contentRef}
          className="relative min-h-[100px] max-h-[300px] overflow-y-auto rounded-lg bg-gray-50 p-4"
        >
          {currentTranscript ? (
            <Paragraph className="text-lg leading-relaxed m-0">
              {currentTranscript}
              <span className="inline-block w-1 h-5 bg-black ml-1 animate-pulse" />
            </Paragraph>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Listening...
            </div>
          )}
        </div>

        {/* Hint Text */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          Speak clearly into your microphone. The text will appear as you speak.
        </p>
      </Card>
    </div>
  );
};

export default LiveTranscription;