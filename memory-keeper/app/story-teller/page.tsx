'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Story {
  id: number;
  date: string;
  questions: string[];
  answers: string[];
  blogPost?: string;
  generatedAt?: string;
}

export default function StoryTellerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help preserve your family memories. Share a story, ask about traditions, or tell me about someone special in your family. I'm here to listen and help you capture these precious moments."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load all stories from localStorage on mount
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('memoryKeeperStories') || '[]');
    setStories(savedStories);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          stories: stories
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
          <Link href="/" className="text-2xl font-bold text-amber-700 hover:text-amber-800 transition-colors">
            Memory Keeper
          </Link>
          <div className="flex gap-4">
            <Link href="/interview" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              New Interview
            </Link>
            <Link href="/stories" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              View Stories
            </Link>
            <Link href="/story-teller" className="text-amber-700 font-medium transition-colors">
              Story Teller
            </Link>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Story Teller</h1>
          <p className="text-gray-600">Share your family memories in conversation</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-full shadow-xl p-2 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share a memory or ask a question..."
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
