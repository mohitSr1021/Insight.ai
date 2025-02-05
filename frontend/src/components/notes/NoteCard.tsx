import type React from "react"
import { useState } from "react"
import { Card, Dropdown, message, Typography, Space, Tag } from "antd"
import { MoreHorizontal, Copy, Edit, LinkIcon, Clock } from "lucide-react"
import type { MenuProps } from "antd"
import EditNoteModal from "../Modal/EditNoteModal"

const { Text, Paragraph } = Typography

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  link?: string
  tags?: string[]
}

interface NoteCardProps {
  note: Note
  onUpdate: (note: Note) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content)
    message.success("Copied to clipboard!")
  }

  const handleSave = async (updatedNote: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      })

      if (!response.ok) {
        throw new Error("Failed to update note")
      }

      const data = await response.json()
      onUpdate(data)
      message.success("Note updated successfully!")
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating note:", error)
      message.error("Failed to update note")
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "copy",
      icon: <Copy size={16} />,
      label: "Copy",
      onClick: handleCopy,
    },
    {
      key: "edit",
      icon: <Edit size={16} />,
      label: "Edit",
      onClick: () => setIsEditModalOpen(true),
    },
  ]

  const cardTitle = (
    <div className="flex justify-between items-center">
      <Text strong ellipsis style={{ maxWidth: 210 }} title={note.title}>
        {note.title}
      </Text>
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700" size={20} />
      </Dropdown>
    </div>
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }
  }

  return (
    <Card
      title={cardTitle}
      className="w-full !h-[calc(100% - 46px)] min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-300 !p-0"
    >
      <div className="flex flex-col h-full">
        <Paragraph ellipsis={{ rows: 3 }} className="flex-grow mb-2">
          {note.content}
        </Paragraph>
        <div className="mt-auto">
          {note.link && (
            <div className="mb-2">
              <a
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <LinkIcon size={14} className="mr-1" />
                <Text ellipsis style={{ maxWidth: "100%" }}>
                  {note.link}
                </Text>
              </a>
            </div>
          )}
          <Space size={[0, 4]} wrap className="mb-2">
            {note.tags?.map((tag, index) => (
              <Tag key={`${tag}-${index}`} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={14} className="mr-1" />
            <span>Created {formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt !== note.createdAt && (
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <Clock size={14} className="mr-1" />
              <span>Updated {formatDate(note.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && (
        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          note={note}
          onSave={handleSave}
        />
      )}
    </Card>
  )
}

export default NoteCard

