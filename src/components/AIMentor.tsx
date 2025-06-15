import React, { useState } from 'react'
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  useToast,
  Avatar,
  HStack,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { FaRobot } from 'react-icons/fa'

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

const AIMentor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm Pathy, your AI mentor. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        text: getAIResponse(input),
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    // This is a simple response system. In a real app, this would call an AI API
    const responses = [
      "That's interesting! Have you considered exploring that further?",
      "I can help you learn more about that. What specific aspects interest you?",
      "Based on your interests, you might enjoy learning about related topics.",
      "That's a great question! Let me help you explore that path.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={4} align="stretch" height="400px">
          <HStack>
            <Avatar icon={<FaRobot />} bg="brand.500" />
            <Text fontWeight="bold">Pathy</Text>
          </HStack>

          <Box
            flex={1}
            overflowY="auto"
            p={4}
            bg="gray.50"
            borderRadius="md"
          >
            <VStack spacing={4} align="stretch">
              {messages.map((message, index) => (
                <Box
                  key={index}
                  alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
                  maxW="80%"
                >
                  <Text
                    p={3}
                    bg={message.isUser ? 'brand.500' : 'white'}
                    color={message.isUser ? 'white' : 'black'}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    {message.text}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>

          <HStack>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pathy anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              colorScheme="brand"
              onClick={handleSend}
              isLoading={isLoading}
            >
              Send
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default AIMentor 