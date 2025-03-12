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

  // // Note not found state - no navigation bar
  // if (!note) {
  //   return (

  //   )
  // }

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content - Note */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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

                      {/* Keywords Section */}
                      {/* <div className="px-8 py-6 border-t border-slate-100">
                        <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
                          <TagIcon size={18} className="mr-2 text-primary" />
                          Key Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.length > 0 ? (
                            keywords?.map((keyword, index) => (
                              <span
                                key={index}
                                className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                              >
                                {keyword}
                              </span>
                            ))
                          ) : (
                            <p className="text-slate-500 italic">No keywords extracted</p>
                          )}
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Sidebar - Suggestions */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Related Topics */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary/80 py-4 px-5">
                        <h2 className="text-black/75 font-semibold text-lg flex items-center">
                          <BookOpenIcon size={18} className="mr-2" />
                          Related Topics
                        </h2>
                      </div>
                      <div className="p-5">
                        {suggestions?.relatedTopics?.length ? (
                          <ul className="space-y-3">
                            {suggestions?.relatedTopics?.map((topic, index) => (
                              <li key={index} className="flex items-start">
                                <div className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-slate-700">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 italic text-center py-3">No related topics available</p>
                        )}
                      </div>
                    </div>

                    {/* Tabbed Recommendations */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-500 py-4 px-5">
                        <h2 className="text-white font-semibold text-lg flex items-center">
                          <NewspaperIcon size={18} className="mr-2" />
                          Recommended Resources
                        </h2>
                      </div>

                      {/* Tabs */}
                      <div className="flex border-b border-slate-200">
                        <button
                          onClick={() => setActiveTab("articles")}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === "articles"
                            ? "text-primary border-b-2 border-primary"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          Articles
                        </button>
                        <button
                          onClick={() => setActiveTab("websites")}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === "websites"
                            ? "text-primary border-b-2 border-primary"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          Websites
                        </button>
                        <button
                          onClick={() => setActiveTab("videos")}
                          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === "videos"
                            ? "text-primary border-b-2 border-primary"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          Videos
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="p-5">
                        {activeTab === "articles" && (
                          <>
                            {suggestions?.relatedArticles?.length ? (
                              <ul className="space-y-5 divide-y divide-slate-100">
                                {suggestions.relatedArticles.map((article, index) => (
                                  <li key={index} className={`${index > 0 ? "pt-5" : ""}`}>
                                    <a
                                      href={article.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block hover:bg-slate-50 rounded-lg p-3 -m-3 transition-colors"
                                    >
                                      <h3 className="text-primary group-hover:text-primary/80 font-medium mb-1.5 line-clamp-2 flex items-start">
                                        <span>{article.title}</span>
                                        <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1" />
                                      </h3>
                                      <p className="text-xs text-slate-500 truncate mb-1.5">{article.url}</p>
                                      <p className="text-sm text-slate-600 line-clamp-2">{article.analysis}</p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-500 italic text-center py-6">No related articles available</p>
                            )}
                          </>
                        )}

                        {activeTab === "websites" && (
                          <>
                            {suggestions?.relatedWebsites?.length ? (
                              <ul className="space-y-5 divide-y divide-slate-100">
                                {suggestions.relatedWebsites.map((website, index) => (
                                  <li key={index} className={`${index > 0 ? "pt-5" : ""}`}>
                                    <a
                                      href={website.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block hover:bg-slate-50 rounded-lg p-3 -m-3 transition-colors"
                                    >
                                      <h3 className="text-primary group-hover:text-primary/80 font-medium mb-1.5 flex items-start">
                                        <span>{website.title}</span>
                                        <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1" />
                                      </h3>
                                      <p className="text-xs text-slate-500 truncate mb-1.5">{website.url}</p>
                                      <p className="text-sm text-slate-600 line-clamp-2">{website.description}</p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-500 italic text-center py-6">No related websites available</p>
                            )}
                          </>
                        )}

                        {activeTab === "videos" && (
                          <>
                            {suggestions?.relatedVideos?.length ? (
                              <ul className="space-y-5 divide-y divide-slate-100">
                                {suggestions.relatedVideos.map((video, index) => (
                                  <li key={index} className={`${index > 0 ? "pt-5" : ""}`}>
                                    <a
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block hover:bg-slate-50 rounded-lg p-3 -m-3 transition-colors"
                                    >
                                      <h3 className="text-primary group-hover:text-primary/80 font-medium mb-1.5 flex items-start">
                                        <span>{video.title}</span>
                                        <ExternalLinkIcon size={14} className="ml-1.5 flex-shrink-0 mt-1" />
                                      </h3>
                                      <p className="text-xs text-slate-500 truncate mb-1.5">{video.url}</p>
                                      <p className="text-sm text-slate-600 line-clamp-2">{video.description}</p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-500 italic text-center py-6">No related videos available</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            )
      }
    </div>
  )
}

export default NoteView

