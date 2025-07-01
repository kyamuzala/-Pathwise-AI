import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X, Loader } from 'lucide-react';

// Types
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface StudentProfile {
  interests: string[];
  academicLevel: string;
  careerGoals: string[];
  strengths: string[];
}

// Mock student profile - replace with your actual data
const mockStudentProfile: StudentProfile = {
  interests: ['Computer Science', 'Machine Learning', 'Web Development'],
  academicLevel: 'Undergraduate',
  careerGoals: ['Software Engineer', 'Data Scientist'],
  strengths: ['Problem Solving', 'Mathematics', 'Creative Thinking']
};

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

  async sendMessage(messages: Message[], studentProfile: StudentProfile): Promise<string> {
    // Create context-aware system prompt
    const systemPrompt = this.createSystemPrompt(studentProfile);
    
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or 'gpt-4' for better results
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

  private createSystemPrompt(profile: StudentProfile): string {
    return `You are an AI academic and career advisor for Pathwise AI, helping students navigate their educational journey.

Student Profile:
- Interests: ${profile.interests.join(', ')}
- Academic Level: ${profile.academicLevel}
- Career Goals: ${profile.careerGoals.join(', ')}
- Strengths: ${profile.strengths.join(', ')}

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
const PathwiseChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your AI mentor. I see you're interested in ${mockStudentProfile.interests.slice(0, 2).join(' and ')}. How can I help guide your academic and career journey today?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Replace with your actual API key
  const chatService = new ChatService('your-api-key-here');

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
        mockStudentProfile
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
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      zIndex: 1000,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>AI Mentor</div>
            <div style={{
              fontSize: '12px',
              backgroundColor: '#10b981',
              padding: '2px 8px',
              borderRadius: '12px',
              marginTop: '2px'
            }}>
              Online
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              maxWidth: '80%',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: message.role === 'user' ? '#10b981' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={{
                backgroundColor: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
                color: message.role === 'user' ? 'white' : '#374151',
                padding: '12px',
                borderRadius: '12px',
                maxWidth: '100%'
              }}>
                <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {message.content}
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.7,
                  marginTop: '6px'
                }}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Bot size={16} />
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Loader size={16} className="animate-spin" />
                <span style={{ fontSize: '14px' }}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px'
      }}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about courses, career paths, or any academic questions..."
          disabled={isLoading}
          style={{
            flex: 1,
            minHeight: '40px',
            maxHeight: '100px',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            resize: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          style={{
            backgroundColor: inputValue.trim() && !isLoading ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
        >
          {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};

// Example integration with your app
const App: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb', 
      padding: '32px' 
    }}>
      {/* Your existing Pathwise AI content goes here */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          margin: 0,
          color: '#1f2937'
        }}>
          Pathwise AI Dashboard
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#6b7280',
          margin: 0
        }}>
          Your existing components and content...
        </p>
        
        {/* Quick start cards */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { title: 'Interest Assessment', desc: 'Discover your passions' },
            { title: 'Career Explorer', desc: 'Explore career paths' },
            { title: 'Course Recommendations', desc: 'Find relevant courses' }
          ].map((card, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              minWidth: '200px'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '16px',
                margin: '0 0 8px 0',
                color: '#1f2937'
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Assistant - appears as floating widget */}
      <PathwiseChatAssistant />
    </div>
  );
};

export default App;
