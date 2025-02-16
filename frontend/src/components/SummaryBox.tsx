import type React from "react"
import { Card, Typography, Divider, Tag, Tooltip } from "antd"
import { BookOpen, Clock, FileText, MessageSquare } from "lucide-react"

const { Title, Paragraph, Text } = Typography

interface SummaryBoxProps {
  title: string
  summary: string
  wordCount: number
  readingTime: number
  keyPoints: string[]
  sentiment: "positive" | "neutral" | "negative"
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ title, summary, wordCount, readingTime, keyPoints, sentiment }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "green"
      case "negative":
        return "red"
      default:
        return "blue"
    }
  }

  return (
    <Card
      className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
      bodyStyle={{ padding: "1.5rem" }}
    >
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="m-0">
          {title}
        </Title>
        <Tooltip title={`Sentiment: ${sentiment}`}>
          <Tag color={getSentimentColor(sentiment)} className="capitalize">
            {sentiment}
          </Tag>
        </Tooltip>
      </div>

      <Divider className="my-3" />

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <FileText size={16} className="mr-1" />
          <Text>{wordCount} words</Text>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-1" />
          <Text>{readingTime} min read</Text>
        </div>
      </div>

      <Paragraph className="text-base mb-4">{summary}</Paragraph>

      <Divider className="my-3" />

      <div>
        <Title level={5} className="mb-2 flex items-center">
          <BookOpen size={18} className="mr-2" />
          Key Points
        </Title>
        <ul className="list-disc list-inside space-y-1">
          {keyPoints?.map((point, index) => (
            <li key={index} className="text-sm">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Tooltip title="AI Generated Summary">
          <div className="flex items-center text-sm text-gray-500">
            <MessageSquare size={16} className="mr-2" />
            <Text>AI Generated Summary</Text>
          </div>
        </Tooltip>
      </div>
    </Card>
  )
}

export default SummaryBox

