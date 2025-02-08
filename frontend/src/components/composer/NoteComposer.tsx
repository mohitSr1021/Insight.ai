import { Mic, ImageIcon, Link2, X } from "lucide-react"
import { Button, Avatar, Tooltip, message, Input } from "antd"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store/rootStore"
import useLayoutStatus from "../../Hooks/useLayoutStatus"
import { NoteComposerProps } from "./NoteComposer.types"
import { createNewNote } from "../../redux/api/noteAPI"
import { resetfilteredNotesState } from "../../redux/slices/NoteSlice/noteSlice"

export default function NoteComposer({ onSave }: NoteComposerProps) {
  const [url, setUrl] = useState("")
  const [urlError, setUrlError] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [image, setImage] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const authUser = useAppSelector((state: RootState) => state.auth)
  const { current } = useLayoutStatus()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.notes)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true
    return url.trim().startsWith('https://') || url.trim().startsWith('http://')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        onSave?.({ content: URL.createObjectURL(audioBlob), type: "recording" })
        message.success("Recording saved successfully")
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      message.error("Failed to start recording. Please check your microphone permissions.")
      console.error(error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
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
          setNoteContent('')
          setUrl('')
          setUrlError('')
          setImage(null)
          setShowUrlInput(false)
          message.success(noteData.payload.message)
        })
        .catch((error) => {
          message.error(error?.message || 'Failed to save note')
        })
    } else {
      message.warning('Please add some content before saving')
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
    <div className={`fixed bottom-0 left-0 right-0 p-4 ${(current === "sm" || current === "xs") ? "backdrop-blur-md !p-0" : ""}`}>
      <div className={`flex items-center border border-gray-200 hover:border-gray-300 bg-white relative py-2 px-4 flex-col md:flex-row ${(current === "sm" || current === "xs") ? "gap-2 w-full max-w-full py-4 rounded-t-xl" : "gap-3 mx-auto max-w-fit rounded-lg"}`}>
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
                disabled={isRecording}
              />
              <Button
                type="text"
                icon={<X size={16} />}
                onClick={handleClearUrl}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
            {urlError && (
              <div
                title={urlError}
                className="text-red-500 absolute top-[-30px] left-0 !text-[11px] text-nowrap mt-1"
              >
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
            />
          </div>
        )}

        <div className="w-full flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <Tooltip className="!bg-amber-200" title="Add image - comming soon">
              <Button
                type="text"
                icon={<ImageIcon className="text-gray-600" size={20} />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording}
              />
            </Tooltip>

            <Tooltip title="Add URL">
              <Button
                type="text"
                icon={<Link2 className="text-gray-600" size={20} />}
                onClick={() => setShowUrlInput(true)}
                disabled={isRecording || showUrlInput}
              />
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={isRecording || isLoading || Boolean(urlError) || (!noteContent.trim() && !url.trim() && !image)}>
              Save
            </Button>

            <Tooltip title="comming soon">
              <Button
                type="primary"
                icon={<Mic size={20} />}
                onClick={isRecording ? stopRecording : startRecording}
                className={`${isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-500 hover:bg-red-600"
                  } transition-all duration-200`}
                disabled={true}
              >
                {isRecording ? `Recording ${recordingTime}s` : "Record"}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}