
import { FC } from "react"
import { MoreHorizontal, ImageIcon, Play } from "lucide-react"
// import { formatDistance } from "date-fns"
import { Note } from "../../pages/protected-pages/Home"

type NoteCardProps = Note

const NoteCard: FC<NoteCardProps> = ({ 
  title, 
  content, 
  // timestamp, 
  duration, 
  imageCount, 
  type 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 min-h-80">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-500 text-sm">
          {/* {formatDistance(new Date(timestamp), new Date(), { addSuffix: true })} */}
        </span>
        {duration && (
          <div className="flex items-center gap-1 text-gray-500">
            <Play size={14} />
            <span className="text-sm">{duration}</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{content}</p>

      <div className="flex justify-between items-center">
        {imageCount && (
          <div className="flex items-center gap-1 text-gray-500">
            <ImageIcon size={16} />
            <span className="text-sm">{imageCount} Image{imageCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {type === "text" && <span className="text-gray-500">Text</span>}
        <button 
          type="button"
          className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}

export default NoteCard