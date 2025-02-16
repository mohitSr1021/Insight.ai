"use client"

import { Mic, ImageIcon, Link2, X } from "lucide-react"
import { Button, Avatar, Tooltip, message, Input } from "antd"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { type RootState, useAppDispatch, useAppSelector } from "../../redux/store/rootStore"
import useLayoutStatus from "../../Hooks/useLayoutStatus"
import type { NoteComposerProps } from "./NoteComposer.types"
import { createNewNote } from "../../redux/api/noteAPI"
import { resetfilteredNotesState } from "../../redux/slices/NoteSlice/noteSlice"
import {
  clearCurrentTranscript,
  setRecordingStatus,
  updateTranscript,
} from "../../redux/slices/NoteSlice/speechTranscriptSlice"

const NoteComposer = ({ onSave }: NoteComposerProps) => {
  const [url, setUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [image, setImage] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const timerRef = useRef<number | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const authUser = useAppSelector((state: RootState) => state.auth)
  const { current } = useLayoutStatus()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.notes)

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true
    return url.trim().startsWith("https://") || url.trim().startsWith("http://")
  }

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        const results = Array.from(event.results)
        const transcript = results.map((result) => result[0].transcript).join(" ")

        // Update both Redux state and local state
        dispatch(updateTranscript(transcript))
        setNoteContent((prevContent) => {
          const newContent = prevContent.includes(transcript) ? prevContent : `${prevContent} ${transcript}`.trim()

          // Save to localStorage
          saveTranscriptToStorage(newContent)
          return newContent
        })
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [dispatch, isRecording])

  // Function to save transcript to localStorage
  const saveTranscriptToStorage = (transcript: string) => {
    try {
      const storedTranscripts = JSON.parse(localStorage.getItem("voiceTranscripts") || "[]")
      const newTranscript = {
        id: Date.now(),
        content: transcript,
        timestamp: new Date().toISOString(),
        userId: authUser?.user?.id, // If you want to associate with user
      }

      storedTranscripts.push(newTranscript)
      localStorage.setItem("voiceTranscripts", JSON.stringify(storedTranscripts))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  // Load transcripts from localStorage on component mount
  useEffect(() => {
    try {
      const storedTranscripts = localStorage.getItem("voiceTranscripts")
      if (storedTranscripts) {
        const parsedTranscripts = JSON.parse(storedTranscripts)
        // You can set these to state or Redux if needed
        console.log("Loaded transcripts:", parsedTranscripts)
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }, [])

  // Timer effect for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })

      setRecordingTime(0)
      dispatch(clearCurrentTranscript())

      recognitionRef.current?.start()

      dispatch(setRecordingStatus(true))
      setIsRecording(true)

      message.success("Voice recording started")
    } catch (error) {
      console.error("Recording failed:", error)
      message.error("Failed to start recording. Please check your microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (!recognitionRef.current || !isRecording) return

    try {
      recognitionRef.current.stop()

      dispatch(setRecordingStatus(false))
      setIsRecording(false)

      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = undefined
      }

      // Save final transcript to localStorage
      if (noteContent.trim()) {
        saveTranscriptToStorage(noteContent.trim())
      }

      message.success("Voice recording completed and saved")
    } catch (error) {
      console.error("Error stopping recording:", error)
      message.error("Failed to stop recording properly")
    }
  }

  // Optional: Function to get saved transcripts
  const getSavedTranscripts = () => {
    try {
      const storedTranscripts = localStorage.getItem("voiceTranscripts")
      return storedTranscripts ? JSON.parse(storedTranscripts) : []
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return []
    }
  }

  // Optional: Function to clear transcripts
  const clearSavedTranscripts = () => {
    try {
      localStorage.removeItem("voiceTranscripts")
      message.success("Cleared all saved transcripts")
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      message.error("Failed to clear saved transcripts")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file)
        message.success("Image attached successfully")
      } else {
        message.error("Please select an image file")
      }
    }
  }

  const handleSave = () => {
    if (noteContent.trim() || url.trim() || image) {
      if (!validateUrl(url)) {
        setUrlError("Please enter a valid URL starting with http:// or https://")
        return
      }

      const noteData = {
        content: noteContent.trim(),
        ...(url.trim() && { link: url.trim() }),
      }

      dispatch(resetfilteredNotesState())
      dispatch(createNewNote(noteData))
        .then((noteData) => {
          setNoteContent("")
          setUrl("")
          setUrlError("")
          setImage(null)
          setShowUrlInput(false)
          message.success(noteData.payload.message)
        })
        .catch((error) => {
          message.error(error?.message || "Failed to save note")
        })
    } else {
      message.warning("Please add some content before saving")
    }
  }

  const handleClearUrl = () => {
    setUrl("")
    setUrlError("")
    setShowUrlInput(false)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    if (newUrl && !validateUrl(newUrl)) {
      setUrlError("Please enter a valid URL starting with http:// or https://")
    } else {
      setUrlError("")
    }
  }

  const handleClearImage = () => {
    setImage(null)
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 ${current === "sm" || current === "xs" ? "backdrop-blur-md !p-0" : ""}`}
    >
      <div
        className={`flex items-center border border-gray-200 hover:border-gray-300 bg-white relative py-2 px-4 flex-col md:flex-row ${current === "sm" || current === "xs" ? "gap-2 w-full !min-h-[185px] max-w-full py-4 rounded-t-xl" : "gap-3 mx-auto max-w-fit rounded-lg"}`}
      >
        {/* Voice Recording Animation */}
        {isRecording && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm rounded-lg z-50">
            <div className="w-full flex fixed bottom-0 flex-col items-center gap-4">
              <div className="relative w-full">
                <div
                  className={`w-24 h-24 mb-0 rounded-full mx-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center animate-pulse`}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse delay-75`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center animate-pulse delay-150`}
                    >
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
        <div className="flex items-center gap-2 w-full">
          <Tooltip title="user">
            <Avatar className="cursor-pointer">{authUser?.user?.userName[0].toUpperCase()}</Avatar>
          </Tooltip>
          <Input.TextArea
            className="flex-1 w-full !min-w-72"
            placeholder="Write a note..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isRecording || isLoading}
          />
        </div>

        {showUrlInput && (
          <div className="flex flex-col w-full relative">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter URL..."
                value={url}
                onChange={handleUrlChange}
                status={urlError ? "error" : ""}
                disabled={isRecording || isLoading}
              />
              <Button
                type="text"
                icon={<X size={16} />}
                onClick={handleClearUrl}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              />
            </div>
            {urlError && (
              <div title={urlError} className="text-red-500 absolute top-[-30px] left-0 !text-[11px] text-nowrap mt-1">
                {urlError}
              </div>
            )}
          </div>
        )}

        {image && (
          <div className="flex items-center gap-2 mb-2 w-full">
            <span className="text-sm text-gray-600">{image.name}</span>
            <Button
              type="text"
              icon={<X size={16} />}
              onClick={handleClearImage}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="w-full flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
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
                onClick={() => setShowUrlInput(true)}
                disabled={isLoading || isRecording || showUrlInput}
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={isRecording || isLoading || Boolean(urlError) || (!noteContent.trim() && !url.trim() && !image)}
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

