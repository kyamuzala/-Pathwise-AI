import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  IconButton,
  useToast,
  Card,
  CardBody,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaComment } from 'react-icons/fa';
import { useStore } from '../store/useStore';

// Types
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Chat service integration
class ChatService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, provider: 'openai' | 'anthropic' = 'openai') {
    this.apiKey = apiKey;
    this.baseURL = provider === 'openai' 
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.anthropic.com/v1/messages';
  }

  async sendMessage(messages: Message[], userProfile: any): Promise<string> {
    // Create context-aware system prompt
    const systemPrompt = this.createSystemPrompt(userProfile);
    
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Chat service error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  private createSystemPrompt(userProfile: any): string {
    return `You are an AI academic and career advisor for Pathwise AI, helping students navigate their educational journey.

Student Profile:
- Name: ${userProfile?.name || 'Student'}
- Age: ${userProfile?.age || 'Unknown'}
- Interests: ${userProfile?.interests?.join(', ') || 'Not specified'}
- Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}

Guidelines:
- Provide personalized advice based on the student's profile
- Be encouraging and supportive
- Offer specific, actionable recommendations
- Suggest relevant courses, skills, or career paths
- Keep responses concise but helpful (under 200 words)
- Ask follow-up questions to better understand their needs`;
  }
}

// Main Chat Component
const Pathy: React.FC = () => {
  const user = useStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${user?.name || 'there'}! I'm Pathy, your AI mentor. I see you're interested in ${user?.interests?.slice(0, 2).join(' and ') || 'learning'}. How can I help guide your academic and career journey today?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  
  // Replace with your actual API key - you should use environment variables
  const chatService = new ChatService(import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        [...messages, userMessage], 
        user
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex={1000}
      >
        <IconButton
          aria-label="Open chat"
          icon={<FaComment />}
          onClick={() => setIsMinimized(false)}
          colorScheme="brand"
          size="lg"
          borderRadius="full"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.1)' }}
          transition="all 0.3s"
        />
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      width="400px"
      height="600px"
      zIndex={1000}
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Header */}
      <Box
        p={4}
        bg="brand.500"
        color="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={3}>
          <Avatar size="sm" bg="brand.600" icon={<FaRobot />} />
          <VStack spacing={0} align="start">
            <Text fontWeight="bold" fontSize="sm">Pathy</Text>
            <Text fontSize="xs" bg="green.400" px={2} py={1} borderRadius="full">
              Online
            </Text>
          </VStack>
        </HStack>
        <IconButton
          aria-label="Minimize chat"
          icon={<FaTimes />}
          onClick={() => setIsMinimized(true)}
          variant="ghost"
          color="white"
          size="sm"
          _hover={{ bg: 'whiteAlpha.200' }}
        />
      </Box>

      {/* Messages */}
      <Box
        flex={1}
        overflowY="auto"
        p={4}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        {messages.map((message) => (
          <Flex
            key={message.id}
            justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            <HStack
              spacing={2}
              maxW="80%"
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              direction={message.role === 'user' ? 'row-reverse' : 'row'}
            >
              <Avatar
                size="sm"
                bg={message.role === 'user' ? 'green.500' : 'brand.500'}
                icon={message.role === 'user' ? <FaUser /> : <FaRobot />}
              />
              <Box
                bg={message.role === 'user' ? 'brand.500' : 'gray.100'}
                color={message.role === 'user' ? 'white' : 'gray.800'}
                p={3}
                borderRadius="lg"
                maxW="100%"
              >
                <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.4">
                  {message.content}
                </Text>
                <Text fontSize="xs" opacity={0.7} mt={2}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </Box>
            </HStack>
          </Flex>
        ))}
        
        {isLoading && (
          <Flex justifyContent="flex-start">
            <HStack spacing={2}>
              <Avatar size="sm" bg="brand.500" icon={<FaRobot />} />
              <Box bg="gray.100" p={3} borderRadius="lg">
                <HStack spacing={2}>
                  <Spinner size="sm" />
                  <Text fontSize="sm">Thinking...</Text>
                </HStack>
              </Box>
            </HStack>
          </Flex>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <HStack spacing={2}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about courses, career paths, or any academic questions..."
            disabled={isLoading}
            size="sm"
          />
          <IconButton
            aria-label="Send message"
            icon={<FaPaperPlane />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            colorScheme="brand"
            size="sm"
            isLoading={isLoading}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default Pathy;