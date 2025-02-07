import type React from "react"
import { useEffect, } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/store/rootStore"
import { closeEditModal, selectAllNotes, selectIsEditModalOpen, selectIsLoading, selectSelectedNote, } from "../../../redux/slices/NoteSlice/noteSlice"
import { fetchNotes } from "../../../redux/api/noteAPI"
import Header from "../../../layout/Header"
import Sidebar from "../../../layout/Sidebar"
import NoteCard from "../../../components/notes/NoteCard"
import EditNoteModal from "../../../components/Modal/EditNoteModal"
import NoteComposer from "../../../components/composer/NoteComposer"
import Spinner from "../../../components/Spinner/Spinner"
import useLayoutStatus from "../../../Hooks/useLayoutStatus"

const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const notes = useAppSelector(selectAllNotes)
  const isLoading = useAppSelector(selectIsLoading)
  const selectedNote = useAppSelector(selectSelectedNote)
  const isEditModalOpen = useAppSelector(selectIsEditModalOpen)
  const { current } = useLayoutStatus()
  const processingMessage = useAppSelector((state)=>state.notes.pMsg)

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const storedDetails = localStorage.getItem("userDetails")
        if (!storedDetails) return

        const { userId } = JSON.parse(storedDetails)
        if (userId) {
          await dispatch(fetchNotes(userId))
        }
      } catch (err) {
        console.error("Error fetching notes:", err)
      }
    }

    fetchUserNotes()
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`${current === "lg" ? "h-[calc(100vh-22vh)]":"h-[calc(100vh-45vh)]"} overflow-auto flex-1 p-6`}>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <Spinner size="large" />
              <p className="my-2 animate-pulse">{processingMessage}</p>
            </div>
          ) : notes && notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {notes.map((note, index) => (
                <div
                  key={`${note._id}-${index}`}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-semibold mb-2">No notes found</p>
              <p>Create a new note to get started!</p>
            </div>
          )}
        </main>
        {selectedNote && (
          <EditNoteModal isOpen={isEditModalOpen} onClose={() => dispatch(closeEditModal())} note={selectedNote} />
        )}
      </div>
      <NoteComposer />
    </div>
  )
}

export default Home



