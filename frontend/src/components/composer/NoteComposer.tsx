import { Mic, ImageIcon, Link2, X } from "lucide-react"
import { Button, Avatar, Tooltip, message, Input } from "antd"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import type { RootState } from "../../redux/store/rootStore"
import { useAppDispatch, useAppSelector } from "../../redux/store/rootStore"
import useLayoutStatus from "../../Hooks/useLayoutStatus"
import { INITIAL_STATE } from "./NoteComposer.types"
import { createNewNote } from "../../redux/api/noteAPI"
import { resetfilteredNotesState } from "../../redux/slices/NoteSlice/noteSlice"
import {
  startRecordingSession,
  stopRecordingSession,
  updateTranscript,
  incrementRecordingTime,
  clearCurrentTranscript,
  setError,
  clearError,
  clearAllVoiceData
} from "../../redux/slices/NoteSlice/speechTranscriptSlice"

const NoteComposer = () => {
  // Memoized selectors
  const selectAuth = (state: RootState) => state.auth
  const selectNotes = (state: RootState) => state.notes
  const selectVoice = (state: RootState) => state.voice
  const [state, setState] = useState(INITIAL_STATE)
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<number | undefined>(undefined)
  // Redux state and hooks with memoized selectors
  const dispatch = useAppDispatch()
  const { current } = useLayoutStatus()
  const authUser = useAppSelector(selectAuth)
  const { isLoading } = useAppSelector(selectNotes)
  const { isRecording, recordingTime, currentTranscript, error } = useAppSelector(selectVoice)
  // Memoized URL validation
  const validateUrl = useMemo(() => (url: string): boolean => {
    if (!url.trim()) return true
    return url.trim().startsWith("https://") || url.trim().startsWith("http://")
  }, [])

  // Memoized speech recognition setup
  const setupSpeechRecognition = useCallback(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(" ")
          .trim()

        dispatch(updateTranscript(transcript))

        if (transcript !== state.lastProcessedResult) {
          setState(prev => ({
            ...prev,
            noteContent: Array.from(new Set([...prev.noteContent.split(' '), ...transcript.split(' ')])).join(' ').trim(),
            lastProcessedResult: transcript
          }))
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        dispatch(setError("Speech recognition error. Please try again."))
        message.error("Speech recognition error. Please try again.")
        stopRecording()
      }

      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start()
          } catch (error) {
            console.error("Failed to restart recognition:", error)
            stopRecording()
          }
        }
      }

      recognitionRef.current = recognition
    }
  }, [dispatch, isRecording, state.lastProcessedResult])

  // Memoized class names
  const containerClassName = useMemo(() => {
    return `fixed bottom-0 left-0 right-0 p-4 ${current === "sm" || current === "xs" ? "backdrop-blur-md !p-0" : ""}`
  }, [current])

  const innerContainerClassName = useMemo(() => {
    return `flex items-center border border-gray-200 hover:border-gray-300 bg-white relative py-2 px-4 flex-col md:flex-row ${current === "sm" || current === "xs"
      ? "gap-2 w-full !min-h-[185px] max-w-full py-4 rounded-t-xl"
      : "gap-3 mx-auto max-w-fit rounded-lg"
      }`
  }, [current])

  // Effects
  useEffect(() => {
    setupSpeechRecognition()
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [setupSpeechRecognition])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        dispatch(incrementRecordingTime())
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [isRecording, dispatch])

  useEffect(() => {
    if (error) {
      message.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording()
      }
    }
  }, [])

  // Memoized handlers
  const startRecording = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      dispatch(clearCurrentTranscript())
      setState(prev => ({ ...prev, lastProcessedResult: "" }))
      recognitionRef.current?.start()
      dispatch(startRecordingSession())
      message.success("Voice recording started")
    } catch (error) {
      console.error("Recording failed:", error)
      dispatch(setError("Failed to start recording. Please check your microphone permissions."))
      message.error("Failed to start recording. Please check your microphone permissions.")
    }
  }, [dispatch])

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return

    try {
      recognitionRef.current.stop()

      if (currentTranscript) {
        setState(prev => ({
          ...prev,
          noteContent: Array.from(new Set([...prev.noteContent.split(' '), ...currentTranscript.split(' ')])).join(' ').trim()
        }))
      }

      dispatch(stopRecordingSession({ userId: authUser?.user?.id }))

      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = undefined
      }

      message.success("Voice recording completed and saved")
    } catch (error) {
      console.error("Error stopping recording:", error)
      dispatch(setError("Failed to stop recording properly"))
      message.error("Failed to stop recording properly")
    }
  }, [isRecording, currentTranscript, dispatch, authUser?.user?.id])

  const handleSave = useCallback(() => {
    if (state.noteContent.trim() || state.url.trim() || state.image) {
      if (!validateUrl(state.url)) {
        setState(prev => ({ ...prev, urlError: "Please enter a valid URL starting with http:// or https://" }))
        return
      }

      const noteData = {
        content: state.noteContent.trim(),
        ...(state.url.trim() && { link: state.url.trim() }),
      }

      dispatch(resetfilteredNotesState())
      dispatch(createNewNote(noteData))
        .then((response) => {
          // Clear component state
          setState({
            url: "",
            urlError: "",
            noteContent: "",
            image: null,
            showUrlInput: false,
            lastProcessedResult: ""
          })

          // Clear voice-related Redux state and localStorage
          dispatch(clearAllVoiceData())

          // Stop any ongoing recording
          if (isRecording) {
            stopRecording()
          }

          message.success(response.payload.message)
        })
        .catch((error) => {
          message.error(error?.message || "Failed to save note")
        })
    } else {
      message.warning("Please add some content before saving")
    }
  }, [state, dispatch, validateUrl, isRecording, stopRecording])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setState(prev => ({ ...prev, image: file }))
        message.success("Image attached successfully")
      } else {
        message.error("Please select an image file")
      }
    }
  }, [])

  // Render
  return (
    <div className={containerClassName}>
      <div className={innerContainerClassName}>
        {/* Recording Animation */}
        {isRecording && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm rounded-lg z-50">
            <div className="w-full flex fixed bottom-0 flex-col items-center gap-4">
              <div className="relative w-full">
                <div className="w-24 h-24 mb-0 rounded-full mx-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse delay-75">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center animate-pulse delay-150">
                      <Mic className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>
                <span className="absolute w-full whitespace-nowrap px-1 mb-2 py-1 flex items-center justify-center gap-2 rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2 text-sm font-semibold animate-pulse">
                  <svg className="w-3 h-3 animate-ping" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="5" />
                  </svg>
                  Recording... {recordingTime}s
                </span>
              </div>
              <Button type="primary" danger onClick={stopRecording} className="mt-8">
                Stop Recording
              </Button>
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="flex items-center gap-2 w-full">
          <Tooltip title={authUser?.user?.userName}>
            <Avatar className="cursor-pointer">{authUser?.user?.userName[0].toUpperCase()}</Avatar>
          </Tooltip>
          <Input.TextArea
            className="flex-1 w-full !min-w-72"
            placeholder="Write a note..."
            value={state.noteContent}
            onChange={(e) => setState(prev => ({ ...prev, noteContent: e.target.value }))}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isRecording || isLoading}
          />
        </div>

        {/* URL Input */}
        {state.showUrlInput && (
          <div className="flex flex-col w-full relative">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter URL..."
                value={state.url}
                onChange={(e) => {
                  const newUrl = e.target.value
                  setState(prev => ({
                    ...prev,
                    url: newUrl,
                    urlError: newUrl && !validateUrl(newUrl)
                      ? "Please enter a valid URL starting with http:// or https://"
                      : ""
                  }))
                }}
                status={state.urlError ? "error" : ""}
                disabled={isRecording || isLoading}
              />
              <Button
                type="text"
                icon={<X size={16} />}
                onClick={() => setState(prev => ({ ...prev, url: "", urlError: "", showUrlInput: false }))}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              />
            </div>
            {state.urlError && (
              <div title={state.urlError} className="text-red-500 absolute top-[-30px] left-0 !text-[11px] text-nowrap mt-1">
                {state.urlError}
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {state.image && (
          <div className="flex items-center gap-2 mb-2 w-full">
            <span className="text-sm text-gray-600">{state.image.name}</span>
            <Button
              type="text"
              icon={<X size={16} />}
              onClick={() => setState(prev => ({ ...prev, image: null }))}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Tooltip title="Add image">
              <Button
                type="text"
                icon={<ImageIcon className="text-gray-600" size={20} />}
                onClick={() => fileInputRef.current?.click()}
                disabled={true}
              />
            </Tooltip>

            <Tooltip title="Add URL">
              <Button
                type="text"
                className={`${isLoading ? "!cursor-not-allowed !bg-slate-100" : ""}`}
                icon={<Link2 className="text-gray-600" size={20} />}
                onClick={() => setState(prev => ({ ...prev, showUrlInput: true }))}
                disabled={isLoading || isRecording || state.showUrlInput}
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={
                isRecording ||
                isLoading ||
                Boolean(state.urlError) ||
                (!state.noteContent.trim() && !state.url.trim() && !state.image)
              }
            >
              Save
            </Button>

            <Tooltip
              title={!("webkitSpeechRecognition" in window) ? "Speech recognition not supported in your browser" : ""}
            >
              <Button
                type={`${isRecording ? "text" : "primary"}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!("webkitSpeechRecognition" in window)}
              >
                {isRecording ? "Recording" : "Record"}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteComposer