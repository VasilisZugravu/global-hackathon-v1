'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface Story {
  id: number;
  date: string;
  questions: string[];
  answers: string[];
  blogPost?: string;
  generatedAt?: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('memoryKeeperStories') || '[]');
    setStories(savedStories.reverse()); // Show newest first
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const deleteStory = (id: number) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const allStories = JSON.parse(localStorage.getItem('memoryKeeperStories') || '[]');
      const filtered = allStories.filter((s: Story) => s.id !== id);
      localStorage.setItem('memoryKeeperStories', JSON.stringify(filtered));
      setStories(filtered.reverse());
      if (selectedStory?.id === id) {
        setSelectedStory(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
            <Link href="/story-teller" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              Story Teller
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-6xl p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Memory Collection</h1>
          <p className="text-gray-600">All your preserved stories in one place</p>
        </div>

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Stories Yet
            </h2>
                        <p className="text-lg text-gray-700 mb-6">
              Start preserving your family&apos;s memories today
            </p>
            <Link
              href="/interview"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your First Interview
            </Link>
          </div>
        )}

        {/* Stories Grid/List */}
        {stories.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Stories List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stories</h2>
              {stories.map((story) => (
                <div
                  key={story.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                    selectedStory?.id === story.id ? 'ring-4 ring-amber-500' : ''
                  }`}
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {formatDate(story.date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {story.answers.length} memories captured
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStory(story.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                  {story.blogPost && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span></span>
                      <span className="text-sm">Blog post generated</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Story Detail */}
            <div className="sticky top-8 h-fit">
              {selectedStory ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-h-[calc(100vh-8rem)] overflow-y-auto">
                  {selectedStory.blogPost ? (
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Generated Story
                        </h2>
                        <p className="text-sm text-gray-600">
                          Created on {formatDate(selectedStory.generatedAt || selectedStory.date)}
                        </p>
                      </div>
                      <div className="max-w-none text-gray-900 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-gray-900 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-gray-900 [&>p]:text-gray-800 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:text-gray-800 [&>ul]:mb-4 [&>ul]:pl-6 [&>ol]:text-gray-800 [&>ol]:mb-4 [&>ol]:pl-6 [&>li]:mb-2 [&>hr]:my-8 [&>hr]:border-gray-300">
                        <ReactMarkdown>{selectedStory.blogPost}</ReactMarkdown>
                      </div>
                      <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <button
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([selectedStory.blogPost!], { type: 'text/markdown' });
                            element.href = URL.createObjectURL(file);
                            element.download = `memory-${selectedStory.id}.md`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          🗑️ Download Story
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Interview Responses
                      </h2>
                      <div className="space-y-6">
                        {selectedStory.questions.map((question, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4">
                            <p className="font-semibold text-gray-900 mb-2">
                              {question}
                            </p>
                            <p className="text-gray-700">
                              {selectedStory.answers[index]}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <Link
                          href="/generate"
                          className="block text-center w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          Generate Blog Post
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl text-center">
                  <div className="text-4xl mb-4">👈</div>
                  <p className="text-gray-600">
                    Select a story to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
