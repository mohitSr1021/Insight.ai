import Header from '../../layout/Header';
import Sidebar from '../../layout/Sidebar';
// import NoteComposer from '../../components/composer/NoteComposer';
import { useEffect } from 'react';
import { fetchNotes } from '../../redux/api/noteAPI';
import { useAppDispatch, useAppSelector } from '../../redux/store/rootStore';
import NoteCard from '../../components/notes/NoteCard';
import { selectAllNotes, selectIsLoading } from '../../redux/slices/NotesSlice/notesSlice';
import useLayoutStatus from '../../Hooks/useLayoutStatus';
import Spinner from '../../components/Spinner/Spinner';

const Favourites = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectAllNotes);
  const isLoading = useAppSelector(selectIsLoading);
  const { current } = useLayoutStatus();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const storedDetails = localStorage.getItem('userDetails');
        if (!storedDetails) return;

        const { userId } = JSON.parse(storedDetails);
        if (userId) {
          await dispatch(fetchNotes(userId));
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchUserNotes();
  }, [dispatch]);

  // Filter favorite notes
  const favoriteNotes = notes?.filter(note => note?.isFavourite);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-100 text-gray-800 dark:text-slate-400">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`${current === 'lg' ? 'h-[calc(100vh-22vh)]' : 'h-[calc(100vh-22vh)]'} overflow-auto flex-1 p-8`}>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-400">⭐ Favourite Notes</h1>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="large" />
            </div>
          ) : favoriteNotes?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteNotes.map((note, index) => (
                <div
                  key={`${note._id}-${index}`}
                  className="p-2 bg-white dark:bg-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400">
              <svg
                className="w-20 h-20 mb-4 text-gray-500 dark:text-gray-300"
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
              <p className="text-xl font-semibold mb-2">No favourite notes yet!</p>
              <p className="text-sm text-center">Start adding notes to your favourites and they'll appear here. ✨</p>
            </div>
          )}
        </main>
      </div>
      {/* <NoteComposer /> */}
    </div>
  );
};

export default Favourites;
