import type React from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/store/rootStore"
import { openEditModal, } from "../../redux/slices/NoteSlice/noteSlice"
import {
  Edit2,
  MoreVertical,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  CopyIcon,
  Star,
  Loader2
} from "lucide-react"
import { formatDate, NoteCardProps } from "./NoteCard.types"
import { deleteExistingNote, toggleNoteFavorite } from "../../redux/api/noteAPI"
import { message } from "antd"
import { useLocation } from "react-router-dom"

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [IsLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(note.isFavourite)
  const userId = useAppSelector((state) => state.auth?.user?.userId)

  useEffect(() => {
    setIsFavorite(note.isFavourite)
  }, [note.isFavourite])

  // delete note 
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await dispatch(deleteExistingNote(noteId)).unwrap();
      message.success(response.message);
    } catch (error) {
      console.error("Error while deleting note :[", error);
      if (error instanceof Error) {
        message.error(error.message || "Failed to delete note");
      } else {
        message.error("Failed to delete note");
      }
    }
  };
  // mark fav or not
  const handleFavoriteToggle = async (noteId: string, userId: string) => {
    setIsLoading(true);
    try {
      const result = await dispatch(toggleNoteFavorite({ noteId, userId })).unwrap();
      setIsFavorite(result.isFavorite);
      message.success(result.message);
    } catch (error) {
      message.error((error as any)?.message || "An unexpected error occurred while toggling favorites");
      console.error("Favorite toggle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative hover:opacity-60 bg-white min-h-[280px] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-6 flex flex-col h-full relative">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-gray-900 tracking-tight line-clamp-2 flex-grow pr-8 select-text">
            {note.title}
          </h3>
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => handleFavoriteToggle(note?._id, userId)}
              disabled={IsLoading}
              className={`p-2 rounded-full transition-colors ${IsLoading ? "opacity-50" : "hover:bg-gray-100"
                }`}
            >
              {IsLoading ? (
                <Loader2 size={18} className="animate-spin text-gray-500" />
              ) : (
                <Star
                  size={18}
                  className={`${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                />
              )}
            </button>

            <button
              onClick={() => {
                if (note?.content) {
                  navigator.clipboard.writeText(note.content);
                  message.success("Note copied to clipboard!");
                } else {
                  message.error("No content to copy!");
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CopyIcon size={18} className="text-gray-500" />
            </button>

            {
              location.pathname === "/favourites" ? null : (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-500" />
                </button>
              )
            }

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
                <button
                  onClick={() => {
                    dispatch(openEditModal(note._id));
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={15} className="mr-2.5" /> Edit Note
                </button>

                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} className="mr-2.5" /> Delete Note
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 flex-grow line-clamp-3 select-text">{note.content}</p>

        {note.link && (
          <a
            href={`${note.link.startsWith("http://") || note.link.startsWith("https://")
                ? note.link
                : `https://${note.link}`
              }`}

            target="_Blank"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 py-2 group/link z-10"
          >
            <LinkIcon size={14} className="mr-1.5" />
            <span className="truncate flex-grow">{note.link}</span>
            <ExternalLink size={12} className="ml-1 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Created: {formatDate(note.createdAt)}</span>
          <span className="text-gray-400">#...{note._id?.slice(-4)}</span>
        </div>
      </div>
    </div>
  )
}

export default NoteCard