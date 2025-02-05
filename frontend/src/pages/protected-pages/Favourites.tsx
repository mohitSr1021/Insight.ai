import Header from '../../layout/Header'
import Sidebar from '../../layout/Sidebar'
import NoteComposer from '../../components/composer/NoteComposer'

const Favourites = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
        </main>
      </div>
      <NoteComposer/>
    </div>
  )
}

export default Favourites