import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceNote {
  id: string;
  content: string;
  timestamp: number;
  userId?: string;
}

interface VoiceTranscript {
  id: number;
  content: string;
  timestamp: string;
  userId?: string;
  duration: number;
  recordingSession: string;
}

interface VoiceState {
  voiceNotes: VoiceNote[];
  transcripts: VoiceTranscript[];
  isRecording: boolean;
  currentTranscript: string;
  recordingTime: number;
  error: string | null;
  isLoading: boolean;
  currentRecordingSession: string | null;
}

const loadVoiceNotesFromStorage = (): VoiceNote[] => {
  try {
    const stored = localStorage.getItem('voiceNotes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading voice notes from storage:', error);
    return [];
  }
};

const loadTranscriptsFromStorage = (): VoiceTranscript[] => {
  try {
    const stored = localStorage.getItem('voiceTranscripts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transcripts from storage:', error);
    return [];
  }
};

const initialState: VoiceState = {
  voiceNotes: loadVoiceNotesFromStorage(),
  transcripts: loadTranscriptsFromStorage(),
  isRecording: false,
  currentTranscript: '',
  recordingTime: 0,
  error: null,
  isLoading: false,
  currentRecordingSession: null
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    startRecordingSession: (state) => {
      state.isRecording = true;
      state.recordingTime = 0;
      state.currentTranscript = '';
      state.currentRecordingSession = `session_${Date.now()}`;
    },

    stopRecordingSession: (state, action: PayloadAction<{ userId?: string }>) => {
      if (state.currentTranscript.trim() && state.currentRecordingSession) {
        const newTranscript: VoiceTranscript = {
          id: Date.now(),
          content: state.currentTranscript.trim(),
          timestamp: new Date().toISOString(),
          userId: action.payload.userId,
          duration: state.recordingTime,
          recordingSession: state.currentRecordingSession
        };

        state.transcripts.push(newTranscript);
        try {
          localStorage.setItem('voiceTranscripts', JSON.stringify(state.transcripts));
        } catch (error) {
          console.error('Error saving transcript to storage:', error);
          state.error = 'Failed to save transcript';
        }
      }

      state.isRecording = false;
      state.recordingTime = 0;
      state.currentTranscript = '';
      state.currentRecordingSession = null;
    },

    updateTranscript: (state, action: PayloadAction<string>) => {
      state.currentTranscript = action.payload.trim();
    },

    incrementRecordingTime: (state) => {
      if (state.isRecording) {
        state.recordingTime += 1;
      }
    },

    clearCurrentTranscript: (state) => {
      state.currentTranscript = '';
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    deleteTranscript: (state, action: PayloadAction<number>) => {
      state.transcripts = state.transcripts.filter(transcript => transcript.id !== action.payload);
      try {
        localStorage.setItem('voiceTranscripts', JSON.stringify(state.transcripts));
      } catch (error) {
        console.error('Error deleting transcript from storage:', error);
        state.error = 'Failed to delete transcript';
      }
    },

    clearAllVoiceData: (state) => {
      state.transcripts = [];
      state.voiceNotes = [];
      state.currentTranscript = '';
      state.recordingTime = 0;
      state.isRecording = false;
      state.currentRecordingSession = null;
      state.error = null;
      
      try {
        localStorage.removeItem('voiceTranscripts');
        localStorage.removeItem('voiceNotes');
      } catch (error) {
        console.error('Error clearing voice data from storage:', error);
        state.error = 'Failed to clear voice data';
      }
    }
  }
});

export const {
  startRecordingSession,
  stopRecordingSession,
  updateTranscript,
  incrementRecordingTime,
  clearCurrentTranscript,
  setError,
  clearError,
  setLoading,
  deleteTranscript,
  clearAllVoiceData
} = voiceSlice.actions;

export default voiceSlice.reducer;
export type { VoiceNote, VoiceTranscript, VoiceState };