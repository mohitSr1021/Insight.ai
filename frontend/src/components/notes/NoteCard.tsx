import { MoreHorizontal, ImageIcon, Play } from "lucide-react"
import { Card, Button, Typography } from "antd"
import { formatDistance } from "date-fns"

const { Text } = Typography

interface NoteCardProps {
  title: string
  content: string
  timestamp: Date
  duration?: string
  imageCount?: number
  type: "audio" | "text"
}

export default function NoteCard({ title, content, timestamp, duration, imageCount, type }: NoteCardProps) {
  return (
    <Card className="mb-4 min-h-80 hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <Text className="text-gray-500 text-sm">{formatDistance(timestamp, new Date(), { addSuffix: true })}</Text>
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
            <span className="text-sm">{imageCount} Image</span>
          </div>
        )}
        {type === "text" && <Text className="text-gray-500">Text</Text>}
        <Button type="text" icon={<MoreHorizontal size={16} />} className="ml-auto" />
      </div>
    </Card>
  )
}

