import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  CalendarIcon,
  BookmarkIcon,
  ShareIcon,
  ArrowLeftIcon,
  PencilIcon,
  BookOpenIcon,
  NewspaperIcon,
  ExternalLinkIcon,
  Loader2Icon,
  AlertTriangleIcon,
  LinkIcon,
  ClockIcon,
  PlayCircleIcon,
  GlobeIcon,
} from "lucide-react"
import { baseClasses, disabledClasses, type TabType } from "./NoteView.types"
import { fetchNote } from "../../../redux/api/noteAPI"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "../../../redux/store/rootStore"

const NoteView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { note, suggestions, loading, error } = useAppSelector((state) => state.note);
  const { noteId } = useParams<{ noteId: string }>()
  const [activeTab, setActiveTab] = useState<TabType>("articles")
  const isDisabled = !note || Object.keys(note).length === 0;

  useEffect(() => {
    if (noteId) {
      dispatch(fetchNote(noteId));
    }
  }, [noteId, dispatch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Error state - no navigation bar
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="bg-red-50 p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-red-100">
            <AlertTriangleIcon className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-red-800 text-center mb-3">Error Loading Note</h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <Link
            to="/home"
            className="block w-full text-center bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Back to Notes
          </Link>
        </div>
      </div>
    )
  }

  // Note successfully loaded - show navigation bar and content
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Navigation Bar - Only shown when note is loaded */}
      <div className="shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/home"
            className="flex items-center text-slate-700 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            <span>Back to Notes</span>
          </Link>
          <div className="flex space-x-3">
            <button
              className={`${baseClasses} ${isDisabled ? disabledClasses : ""}`}
              disabled={isDisabled}
              aria-label="Share note"
            >
              <ShareIcon size={18} />
            </button>

            <button
              className={`${baseClasses} ${isDisabled ? disabledClasses : ""}`}
              disabled={isDisabled}
              aria-label="Bookmark note"
            >
              <BookmarkIcon size={18} />
            </button>
            <button
              className={`${baseClasses} ${isDisabled ? disabledClasses : "flex items-center"}`}
              aria-label="Edit note"
            >
              <PencilIcon size={16} className="mr-1.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
      {
        loading ? (
          <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2Icon className="h-10 w-10 animate-spin text-primary" />
              <p className="text-slate-600 font-medium">Loading note...</p>
            </div>
          </div>
        ) :
          loading === false && note && Object.keys(note).length === 0 ?
            <div className="min-h-screen flex justify-center items-center bg-slate-50">
              <div className="text-lg text-slate-600">Note not found</div>
            </div>
            :
            (
              <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Main Note Content Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                  {/* Note Header */}
                  <div className="p-8 pb-4">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{note?.title}</h1>
                    <div className="flex flex-wrap items-center text-slate-500 text-sm mb-6 gap-y-2">
                      <div className="flex items-center mr-5">
                        <CalendarIcon size={16} className="mr-2 text-slate-400" />
                        <span>{note?.createdAt ? formatDate(note.createdAt) : "Unknown Date"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="px-8 py-4">
                    <div className="prose max-w-none">
                      {note?.content.split("\n").map((paragraph, index) =>
                        paragraph ? (
                          <p key={index} className="mb-5 text-slate-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ) : (
                          <br key={index} />
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Related Topics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden md:col-span-3">
                    <div className="bg-gradient-to-r from-primary to-primary/80 py-4 px-5">
                      <h2 className="text-black/75 font-semibold text-lg flex items-center">
                        <BookOpenIcon size={18} className="mr-2" />
                        Related Topics
                      </h2>
                    </div>
                    <div className="p-5">
                      {suggestions?.relatedTopics?.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {suggestions?.relatedTopics?.map((topic, index) => (
                            <div key={index} className="flex items-start p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                              <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="text-slate-700 font-medium">{topic}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic text-center py-3">No related topics available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Resources Section - Redesigned */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-500 py-5 px-6">
                    <h2 className="text-white font-semibold text-xl flex items-center">
                      <NewspaperIcon size={20} className="mr-3" />
                      Recommended Resources
                    </h2>
                  </div>

                  {/* Tabs - Redesigned */}
                  <div className="flex border-b border-slate-200 px-4">
                    <button
                      onClick={() => setActiveTab("articles")}
                      className={`flex items-center py-4 px-6 text-sm font-medium transition-colors relative ${
                        activeTab === "articles"
                          ? "text-primary"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <LinkIcon size={16} className="mr-2" />
                      Articles
                      {activeTab === "articles" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("websites")}
                      className={`flex items-center py-4 px-6 text-sm font-medium transition-colors relative ${
                        activeTab === "websites"
                          ? "text-primary"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <GlobeIcon size={16} className="mr-2" />
                      Websites
                      {activeTab === "websites" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("videos")}
                      className={`flex items-center py-4 px-6 text-sm font-medium transition-colors relative ${
                        activeTab === "videos"
                          ? "text-primary"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <PlayCircleIcon size={16} className="mr-2" />
                      Videos
                      {activeTab === "videos" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                      )}
                    </button>
                  </div>

                  {/* Tab Content - Redesigned */}
                  <div className="p-6">
                    {activeTab === "articles" && (
                      <>
                        {suggestions?.relatedArticles?.length ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.relatedArticles.map((article, index) => (
                              <a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-5 transition-colors border border-slate-200 hover:border-slate-300 h-full flex flex-col"
                              >
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                    <LinkIcon size={18} className="text-primary" />
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center">
                                    <ClockIcon size={12} className="mr-1" />
                                    <span>Article</span>
                                  </div>
                                </div>
                                <h3 className="text-primary group-hover:text-primary/80 font-medium mb-2 line-clamp-2 flex items-start text-lg">
                                  <span>{article.title}</span>
                                  <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1.5" />
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-grow">{article.analysis}</p>
                                <p className="text-xs text-slate-500 truncate pt-2 border-t border-slate-200">
                                  {article.url}
                                </p>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                              <LinkIcon size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 italic text-center">No related articles available</p>
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "websites" && (
                      <>
                        {suggestions?.relatedWebsites?.length ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.relatedWebsites.map((website, index) => (
                              <a
                                key={index}
                                href={website.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-5 transition-colors border border-slate-200 hover:border-slate-300 h-full flex flex-col"
                              >
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                                    <GlobeIcon size={18} className="text-indigo-500" />
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center">
                                    <ClockIcon size={12} className="mr-1" />
                                    <span>Website</span>
                                  </div>
                                </div>
                                <h3 className="text-indigo-500 group-hover:text-indigo-600 font-medium mb-2 line-clamp-2 flex items-start text-lg">
                                  <span>{website.title}</span>
                                  <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1.5" />
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-grow">{website.description}</p>
                                <p className="text-xs text-slate-500 truncate pt-2 border-t border-slate-200">
                                  {website.url}
                                </p>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                              <GlobeIcon size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 italic text-center">No related websites available</p>
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "videos" && (
                      <>
                        {suggestions?.relatedVideos?.length ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.relatedVideos.map((video, index) => (
                              <a
                                key={index}
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-slate-50 hover:bg-slate-100 rounded-xl p-5 transition-colors border border-slate-200 hover:border-slate-300 h-full flex flex-col"
                              >
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mr-3">
                                    <PlayCircleIcon size={18} className="text-rose-500" />
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center">
                                    <ClockIcon size={12} className="mr-1" />
                                    <span>Video</span>
                                  </div>
                                </div>
                                <h3 className="text-rose-500 group-hover:text-rose-600 font-medium mb-2 line-clamp-2 flex items-start text-lg">
                                  <span>{video.title}</span>
                                  <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1.5" />
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-grow">{video.description}</p>
                                <p className="text-xs text-slate-500 truncate pt-2 border-t border-slate-200">
                                  {video.url}
                                </p>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                              <PlayCircleIcon size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 italic text-center">No related videos available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
      }
    </div>
  )
}

export default NoteView