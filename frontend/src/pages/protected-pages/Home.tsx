import type React from "react"
import { useRef, useState } from "react"
import NoteComposer from "../../components/composer/NoteComposer"
import NoteCard from "../../components/notes/NoteCard"
import Header from "../../layout/Header"
import Sidebar from "../../layout/Sidebar"
import useLayoutStatus from "../../Hooks/useLayoutStatus"
import useIntersectionAnimation from "../../Hooks/userIntersectionAnimation"

export type NoteType = "audio" | "text"

interface Note {
  id: string
  title: string
  content: string
  timestamp: Date
  duration?: string
  imageCount?: number
  type: NoteType
}

const Home: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement[]>([])
  const breakpoint = useLayoutStatus()
  useIntersectionAnimation(cardsRef)
  const notes: Note[] = [
    {
      id: "1",
      title: "Engineering Assignment Audio",
      content: "I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.",
      timestamp: new Date("2025-01-30T17:26:00"),
      duration: "00:09",
      imageCount: 1,
      type: "audio",
    },
    {
      id: "2",
      title: "Random Sequence",
      content: "loream loream loream loream loream loream",
      timestamp: new Date("2025-01-30T17:21:00"),
      type: "text",
    },
    {
      id: "3",
      title: "Random Sequence",
      content: "loream loream loream loream loream loream",
      timestamp: new Date("2025-01-30T17:21:00"),
      type: "text",
    }, {
      id: "4",
      title: "Random Sequence",
      content: "loream loream loream loream loream loream",
      timestamp: new Date("2025-01-30T17:21:00"),
      type: "text",
    },
  ]
  // breakpoint
  const [filteredNotes, setFilteredNotes] = useState(notes)
  
  return (
    <div className="h-screen flex flex-col px-2">
      <Header notes={notes} setFilteredNotes={setFilteredNotes} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 h-[calc(100vh-140.2px)] p-4 ${breakpoint.xs || breakpoint.sm ? "ml-0" : ""}`}>
          <div
            className={`
            w-full 
            h-full 
            grid 
            ${ breakpoint.xs ? "grid-cols-1" :
              breakpoint.sm ? "grid-cols-2" :
              breakpoint.md ? "grid-cols-3" :
              breakpoint.lg ? "grid-cols-4" :
              "grid-cols-5"}
          gap-2
          px-1
          overflow-auto
          border
          border-[#fbfdf2]
          rounded-2xl
          scrollbar-custom
          `}
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el
                  }}
                  className="transform transition-all duration-500 opacity-0 translate-y-4"
                >
                  <NoteCard {...note} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center text-gray-500">No notes found</div>
            )}
          </div>
        </main>
      </div >
      <NoteComposer />
    </div >
  )
}

export default Home

