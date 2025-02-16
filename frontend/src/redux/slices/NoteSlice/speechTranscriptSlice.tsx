import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceNote {
    id: string;
    content: string;
    timestamp: number;
}

interface VoiceState {
    voiceNotes: VoiceNote[];
    isRecording: boolean;
    currentTranscript: string;
}

const loadVoiceNotesFromStorage = (): VoiceNote[] => {
    const stored = localStorage.getItem('voiceTranscripts');
    return stored ? JSON.parse(stored) : [];
};

const initialState: VoiceState = {
    voiceNotes: loadVoiceNotesFromStorage(),
    isRecording: false,
    currentTranscript: '',
};

const voiceSlice = createSlice({
    name: 'voice',
    initialState,
    reducers: {
        setRecordingStatus: (state, action: PayloadAction<boolean>) => {
            state.isRecording = action.payload;
        },
        updateTranscript: (state, action: PayloadAction<string>) => {
            state.currentTranscript = action.payload;
        },
        saveVoiceNote: (state, action: PayloadAction<VoiceNote>) => {
            state.voiceNotes.push(action.payload);
            localStorage.setItem('voiceNotes', JSON.stringify(state.voiceNotes));
        },
        clearCurrentTranscript: (state) => {
            state.currentTranscript = '';
        }
    }
});

export const {
    setRecordingStatus,
    updateTranscript,
    saveVoiceNote,
    clearCurrentTranscript
} = voiceSlice.actions;
export default voiceSlice.reducer;