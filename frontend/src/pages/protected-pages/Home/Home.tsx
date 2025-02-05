import type React from "react"
import { useRef } from "react"
import { useSelector } from "react-redux"
import { Row, Col, Spin, Empty } from "antd"
import useFetchUserNotes from "../../../Hooks/useFetchUserNotes"
import useLayoutStatus from "../../../Hooks/useLayoutStatus"
import useIntersectionAnimation from "../../../Hooks/userIntersectionAnimation"
import type { RootState } from "../../../redux/store/rootStore"
import Header from "../../../layout/Header"
import Sidebar from "../../../layout/Sidebar"
import NoteCard from "../../../components/notes/NoteCard"
import NoteComposer from "../../../components/composer/NoteComposer"

const Home: React.FC = () => {
  useFetchUserNotes()
  const { current } = useLayoutStatus()
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  useIntersectionAnimation({
    current: cardsRef.current.filter((el): el is HTMLDivElement => el !== null),
  })

  const { notes, isLoading, error } = useSelector((state: RootState) => state.notes)

  if (error && error !== "No notes found for this user.") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500 text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Error Loading Notes</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const handleNoteUpdate = (updatedNote: any) => {
    // Handle note update through Redux or other state management
    console.log("Note updated:", updatedNote)
  }

  const getColSpan = (current: string) => {
    switch (current) {
      case "xs":
        return 24
      case "sm":
        return 12
      case "md":
        return 8
      case "lg":
      case "xl":
      case "2xl":
        return 6
      default:
        return 24
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : notes && notes.length > 0 ? (
            <Row gutter={[16, 16]}>
              {notes.map((note, index) => (
                <Col key={`${note._id}-${index}`} span={getColSpan(current)}>
                  <div
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="transform transition-all duration-500 opacity-0 translate-y-4"
                  >
                    <NoteCard note={note} onUpdate={handleNoteUpdate} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="No notes found. Create a new note to get started!"
              className="h-full flex flex-col justify-center"
            />
          )}
        </main>
      </div>
      <NoteComposer />
    </div>
  )
}

export default Home

