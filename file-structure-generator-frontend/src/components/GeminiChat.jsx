import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles, Zap, Brain } from 'lucide-react';

const GeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI assistant specialized in file structures and project organization. I can help you:\n\n• Design optimal file hierarchies\n• Suggest best practices for project structure\n• Convert between different format types\n• Debug structure definitions\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Simulate typing effect for AI responses
  const typeMessage = (message) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual Gemini API integration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock AI responses based on input content
      let aiResponse = generateMockResponse(currentInput);
      
      typeMessage(aiResponse);
      
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to ask about file structure patterns and I'll do my best to help offline!",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock response generator - replace with actual AI integration
  const generateMockResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('react') || lowerInput.includes('component')) {
      return `Great choice! For React projects, I recommend this structure:

\`\`\`
src/
  components/
    common/          # Reusable components
    layout/          # Layout components
    ui/             # Basic UI elements
  pages/            # Page components
  hooks/            # Custom hooks
  utils/            # Helper functions
  styles/           # CSS/styling files
  assets/           # Images, fonts, etc.
  api/             # API related code
  context/         # React context providers
public/
  index.html
  favicon.ico
\`\`\`

This structure separates concerns cleanly and scales well as your project grows!`;
    }
    
    if (lowerInput.includes('node') || lowerInput.includes('express') || lowerInput.includes('backend')) {
      return `Perfect for Node.js/Express! Here's a robust backend structure:

\`\`\`
src/
  controllers/     # Route handlers
  models/         # Data models
  middleware/     # Custom middleware
  routes/         # Route definitions
  services/       # Business logic
  utils/          # Helper functions
  config/         # Configuration files
  validations/    # Input validation
tests/
  unit/
  integration/
package.json
.env.example
\`\`\`

This follows MVC patterns and keeps your code organized and maintainable!`;
    }
    
    if (lowerInput.includes('json') || lowerInput.includes('format')) {
      return `JSON format is excellent for precise control! Here's the syntax:

\`\`\`json
{
  "folderName": {
    "subFolder": ["file1.js", "file2.js"],
    "anotherFolder": {
      "deepFile.txt": null
    }
  },
  "rootFile.md": null
}
\`\`\`

**Key points:**
• Objects = folders
• Arrays = list of files in that folder
• null = empty file
• String values = file content (optional)

Need help converting your text structure to JSON?`;
    }
    
    if (lowerInput.includes('best practice') || lowerInput.includes('organize')) {
      return `Here are my top file organization best practices:

**📁 Folder Structure:**
• Group by feature, not by file type
• Keep nesting levels under 4-5 deep
• Use consistent naming conventions

**📝 Naming:**
• kebab-case for folders
• camelCase for JS files
• PascalCase for components

**🎯 Key Principles:**
• Separate concerns clearly
• Make it easy to find things
• Plan for growth
• Include proper documentation

Want me to suggest a structure for a specific type of project?`;
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return `I'm here to help with all things file structure! I can assist with:

**🏗️ Structure Design:**
• Project scaffolding
• Best practices
• Framework-specific layouts

**🔄 Format Conversion:**
• Text to JSON
• JSON validation
• Structure optimization

**🐛 Troubleshooting:**
• Syntax errors
• Structure validation
• Performance optimization

**💡 Suggestions:**
• Modern patterns
• Scalability tips
• Team collaboration

What specific challenge are you facing?`;
    }

    // Default response
    return `That's an interesting question about "${input}"! 

While I specialize in file structure organization, I'd be happy to help you think through how to organize files and folders for your project. 

Here are some ways I can assist:
• Suggest folder structures for different project types
• Help convert between text and JSON formats
• Recommend best practices for file organization
• Debug structure syntax issues

Could you tell me more about the type of project you're working on? (React, Node.js, Python, etc.)`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (content) => {
    // Simple markdown-like rendering for code blocks
    const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);
    
    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // This is code content
        return (
          <pre 
            key={index}
            className="bg-gray-800 text-gray-100 p-3 rounded-lg mt-2 overflow-x-auto text-sm"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <code>{part}</code>
          </pre>
        );
      } else if (index % 3 === 1) {
        // This is the language identifier, skip it
        return null;
      } else {
        // Regular text content
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Need help with file structures?"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse animation when closed */}
          {!isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            AI Structure Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)'
            }}
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))'
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
              
              <div className="flex items-center space-x-3 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="h-6 w-6" />
                </motion.div>
                <div>
                  <h3 className="font-semibold">AI Structure Assistant</h3>
                  <p className="text-xs opacity-90">Powered by advanced AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors relative z-10 p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ background: 'var(--bg)' }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <motion.div 
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'text-white' 
                          : 'text-white'
                      }`}
                      style={{
                        background: message.type === 'user' 
                          ? 'linear-gradient(135deg, var(--secondary), #f97316)'
                          : 'linear-gradient(135deg, var(--primary), var(--accent))'
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </motion.div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'text-white'
                        : message.isError
                        ? 'border-red-200 dark:border-red-800'
                        : ''
                    }`}
                    style={{
                      background: message.type === 'user'
                        ? 'linear-gradient(135deg, var(--secondary), #f97316)'
                        : message.isError
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'var(--surface)',
                      border: message.type === 'user' ? 'none' : '1px solid var(--border)',
                      color: message.type === 'user' ? 'white' : (message.isError ? '#dc2626' : 'var(--text)')
                    }}>
                      <div className="text-sm">
                        {renderMessageContent(message.content)}
                      </div>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' 
                          ? 'text-white/70' 
                          : message.isError
                          ? 'text-red-500/70'
                          : 'opacity-60'
                      }`}
                      style={{
                        color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'
                      }}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))'
                      }}
                    >
                      <Bot className="h-4 w-4" />
                    </div>
                    <div 
                      className="px-4 py-3 rounded-2xl"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ background: 'var(--primary)' }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="p-4 border-t"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about file structures..."
                    className="w-full resize-none border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      background: 'var(--bg)',
                      border: '2px solid var(--border)',
                      color: 'var(--text)',
                      focusRingColor: 'var(--primary)',
                      minHeight: '44px',
                      maxHeight: '120px'
                    }}
                    rows="1"
                  />
                  <div className="absolute bottom-2 right-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {inputValue.length}/500
                  </div>
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 rounded-xl transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: inputValue.trim() && !isLoading 
                      ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                      : 'var(--border)',
                    color: inputValue.trim() && !isLoading ? 'white' : 'var(--text-muted)'
                  }}
                  whileHover={{ scale: inputValue.trim() && !isLoading ? 1.05 : 1 }}
                  whileTap={{ scale: inputValue.trim() && !isLoading ? 0.95 : 1 }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
              
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              
              {/* Quick suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "React structure",
                  "Node.js backend",
                  "Convert to JSON",
                  "Best practices"
                ].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)'
                    }}
                    whileHover={{
                      background: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiChat; 