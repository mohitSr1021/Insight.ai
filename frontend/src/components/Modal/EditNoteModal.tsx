"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/store/rootStore"
import { X, Save } from "lucide-react"
import { updateExistingNote } from "../../redux/api/noteAPI"
import { message } from "antd"

interface Note {
  _id: string
  title: string
  content: string
  link?: string
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface EditNoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, note }) => {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [noteLink, setNoteLink] = useState(note.link || "N/A")
  const isLoading = useAppSelector((state) => state.notes.isLoading)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setNoteLink(note.link || "N/A")
  }, [note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const linkToUpdate = noteLink === "N/A" ? "" : noteLink
      const response = await dispatch(
        updateExistingNote({ noteId: note._id, title, content, link: linkToUpdate }),
      ).unwrap()

      if (response.success) {
        message.success(response.message || "Your note has been updated successfully!")
        onClose()
      } else {
        throw new Error(response.message || "Failed to update your note.")
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Failed to update your note. Please try again.")
      } else {
        message.error("Failed to update your note. Please try again.")
      }
      console.error("Error updating note:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200/70 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200/80 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Note</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all duration-300 rounded-full hover:bg-gray-100 p-2.5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* note Title  */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title *{" "}
              <span className="text-gray-500 text-xs">(Title will automatically generate based on your note)</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-2xl transition-all duration-200 bg-white/50 
                                ${isLoading ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-100" : "border-gray-300 focus:ring-2 focus:ring-transparent focus:border-transparent"}
                            `}
              disabled={isLoading}
              required
            />
          </div>
          {/* note - content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 border rounded-2xl transition-all duration-200 bg-white/50 
                                ${isLoading ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-100" : "border-gray-300 focus:ring-2 focus:ring-transparent focus:border-transparent"}
                            `}
              disabled={isLoading}
              required
            />
          </div>
          {/* note Links  */}
          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-2">
              Link
            </label>
            <input
              type="text"
              id="link"
              value={noteLink}
              onChange={(e) => setNoteLink(e.target.value)}
              className={`w-full px-4 py-3 border rounded-2xl transition-all duration-200 bg-white/50 
                                ${isLoading ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-100" : "border-gray-300 focus:ring-2 focus:ring-transparent focus:border-transparent"}
                            `}
              disabled={isLoading}
              placeholder="Enter link or leave as N/A if not available"
            />
          </div>
          <div className="flex justify-end items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditNoteModal

