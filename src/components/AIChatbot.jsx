import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import { streamRAGAgent, getGreetingMessage } from '../utils/ragAgent';

// Request throttling - minimum time between requests (in ms)
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds

function AIChatbot({ setCursorVariant }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        text: getGreetingMessage(),
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, streamingMessageId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Check throttle
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⏱️ Please wait ${waitTime} seconds before sending another message to avoid rate limits.`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      return;
    }
    
    setLastRequestTime(now);

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Create placeholder for streaming response
    const aiMessageId = Date.now() + 1;
    setStreamingMessageId(aiMessageId);
    setMessages(prev => [...prev, {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date()
    }]);

    try {
      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10);
      
      // Stream the response with timeout protection
      let fullResponse = '';
      let hasReceivedData = false;
      const streamTimeout = setTimeout(() => {
        if (!hasReceivedData) {
          throw new Error('Connection timeout. Please try again.');
        }
      }, 60000); // 60 second timeout

      try {
        for await (const chunk of streamRAGAgent(userMessage.text, conversationHistory)) {
          hasReceivedData = true;
          clearTimeout(streamTimeout);
          if (chunk) {
            fullResponse += chunk;
            // Use a function to avoid referencing fullResponse directly in loop
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: msg.text + chunk }
                : msg
            ));
          }
        }
        clearTimeout(streamTimeout);
      } catch (streamError) {
        clearTimeout(streamTimeout);
        throw streamError;
      }

      setStreamingMessageId(null);
    } catch (error) {
      let errorText = error.message || 'An unexpected error occurred.';
      
      // Format error messages with markdown if they contain newlines
      if (error.message && error.message.includes('\n')) {
        errorText = error.message;
      } else if (error.message && error.message.includes('timeout')) {
        errorText = `⏱️ **Connection Timeout**\n\nThe request took too long to respond. This could be due to:\n- Network connectivity issues\n- API service temporarily slow\n- Large response being generated\n\n**Please try again in a moment.**`;
      } else if (error.message && error.message.includes('Rate limit')) {
        errorText = `⚠️ **Rate Limit Exceeded**\n\nToo many requests. Please wait a few seconds before trying again.`;
      } else if (error.message && error.message.includes('API key')) {
        errorText = "⚠️ **API Configuration Issue**\n\nAPI key not configured or invalid. Please check your environment variables.";
      } else if (error.message && (error.message.includes('data policy') || error.message.includes('Free model publication'))) {
        errorText = error.message; // Already formatted with newlines
      } else if (error.message && error.message.includes('Service temporarily unavailable')) {
        errorText = `⚠️ **Service Temporarily Unavailable**\n\nThe AI service is experiencing issues. Please try again in a few moments.`;
      } else {
        errorText = `⚠️ **Error Occurred**\n\n${error.message || 'An unexpected error occurred.'}\n\n**Please try again.** If the problem persists, the service may be temporarily unavailable.`;
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: errorText }
          : msg
      ));
      setStreamingMessageId(null);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCursorVariant('hover');
    } else {
      setCursorVariant('default');
    }
  };

  return (
    <>
      {/* Floating Chat Button - Only show when closed */}
      {!isOpen && (
        <motion.button
          onClick={handleToggle}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setCursorVariant("hover")}
          onMouseLeave={() => setCursorVariant("default")}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all flex items-center justify-center"
          aria-label="Open AI Chatbot"
        >
          <FaRobot className="w-7 h-7 text-white" />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 hover:opacity-100 transition-opacity"
          />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-40 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-800/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 p-4 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center">
                  <FaRobot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AI Assistant</h3>
                  <p className="text-xs text-gray-400">Powered by Groq • Lightning Fast</p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <FaTimes className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <FaRobot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 break-words ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-zinc-800/80 text-gray-100 border border-zinc-700/50'
                    }`}
                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    {message.sender === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-emerald-300">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="ml-2">{children}</li>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-zinc-700/50 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">
                                  {children}
                                </code>
                              ) : (
                                <code className="block bg-zinc-900 p-3 rounded-lg overflow-x-auto text-xs font-mono border border-zinc-700">
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => <pre className="mb-2">{children}</pre>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-emerald-400 pl-3 italic my-2">
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 underline break-all break-words"
                                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                              >
                                {children}
                              </a>
                            ),
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-white">{children}</h3>,
                          }}
                        >
                          {message.text || (message.id === streamingMessageId ? '...' : '')}
                        </ReactMarkdown>
                        {message.id === streamingMessageId && message.text && (
                          <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.text}
                      </p>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <FaUser className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && !streamingMessageId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-zinc-800/80 rounded-2xl px-4 py-3 border border-zinc-700/50">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about skills, projects, experience..."
                  className="flex-1 bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/50 transition-colors"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send message"
                >
                  <FaPaperPlane className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Groq (Llama 3.1 8B) • Streaming responses
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
