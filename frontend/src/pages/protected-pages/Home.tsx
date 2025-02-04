import { useRef, useEffect } from "react"
import type { FC } from "react"
import { useSelector } from "react-redux"
import NoteComposer from "../../components/composer/NoteComposer"
import NoteCard from "../../components/notes/NoteCard"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import { RootState, useAppDispatch } from "../../redux/store/rootStore"
import { fetchNotes } from "../../redux/api/noteAPI"
import useIntersectionAnimation from "../../Hooks/userIntersectionAnimation"
import useLayoutStatus from "../../Hooks/useLayoutStatus"

export interface Note {
  _id: string
  title: string
  content: string
  timestamp: Date
  duration?: string
  imageCount?: number
  type: "audio" | "text"
  userId: string
  link?: string
}

const Home: FC = () => {
  const dispatch = useAppDispatch()
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  useIntersectionAnimation({ current: cardsRef.current.filter((el): el is HTMLDivElement => el !== null) })
  const breakpoint = useLayoutStatus()
  const { notes, isLoading, error } = useSelector((state: RootState) => state.notes)

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const storedDetails = localStorage.getItem('userDetails')
        if (!storedDetails) return

        const { userId } = JSON.parse(storedDetails)
        if (userId) {
          await dispatch(fetchNotes(userId))
        }
      } catch (err) {
        console.error('Error fetching notes:', err)
      }
    }

    fetchUserNotes()
  }, [dispatch])

  const gridLayout = {
    xs: "grid-cols-1",
    sm: "grid-cols-2",
    md: "grid-cols-3",
    lg: "grid-cols-4",
    xl: "grid-cols-5"
  }[Object.keys(breakpoint).find(key => breakpoint[key as keyof typeof breakpoint]) || "xs"]

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Error Loading Notes</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col px-2">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={`
            flex-1 
            h-[calc(100vh-140.2px)] 
            p-4 
            ${breakpoint.xs || breakpoint.sm ? "ml-0" : ""}
          `}
        >
          <div
            className={`
              w-full 
              h-full 
              grid 
              ${gridLayout}
              gap-2
              px-1
              overflow-auto
              border
              border-[#fbfdf2]
              rounded-2xl
              scrollbar-custom
            `}
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : notes && notes.length > 0 ? (
              notes.map((note, index) => (
                <div
                  key={note._id}
                  ref={el => cardsRef.current[index] = el}
                  className="transform transition-all duration-500 opacity-0 translate-y-4"
                >
                  <NoteCard {...note} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center text-gray-500">
                No notes found
              </div>
            )}
          </div>
        </main>
      </div>
      <NoteComposer />
    </div>
  )
}

export default Home