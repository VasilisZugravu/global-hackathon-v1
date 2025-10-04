'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogPost, setBlogPost] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    generateBlogPost();
  }, []);

  const generateBlogPost = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const stories = JSON.parse(localStorage.getItem('memoryKeeperStories') || '[]');
      if (stories.length === 0) {
        setError('No stories found. Please complete an interview first.');
        setIsGenerating(false);
        return;
      }

      const latestStory = stories[stories.length - 1];

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: latestStory.questions,
          answers: latestStory.answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const data = await response.json();
      setBlogPost(data.blogPost);

      latestStory.blogPost = data.blogPost;
      latestStory.generatedAt = new Date().toISOString();
      localStorage.setItem('memoryKeeperStories', JSON.stringify(stories));

    } catch (err) {
      setError('Failed to generate blog post. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Memory Story</h1>
        </div>

        {isGenerating && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center">
            <div className="animate-spin text-6xl mb-6">Loading...</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Crafting Your Story...
            </h2>
            <p className="text-gray-600">
              We&apos;re weaving your memories into a beautiful narrative
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
            <div className="text-4xl mb-4">Warning</div>
            <h2 className="text-2xl font-semibold text-red-900 mb-3">Oops!</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={generateBlogPost}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold"
              >
                Try Again
              </button>
              <Link
                href="/interview"
                className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold"
              >
                New Interview
              </Link>
            </div>
          </div>
        )}

        {!isGenerating && !error && blogPost && (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="max-w-none text-gray-900 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-gray-900 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-gray-900 [&>p]:text-gray-800 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:text-gray-800 [&>ul]:mb-4 [&>ul]:pl-6 [&>ol]:text-gray-800 [&>ol]:mb-4 [&>ol]:pl-6 [&>li]:mb-2 [&>hr]:my-8 [&>hr]:border-gray-300">
                <ReactMarkdown>{blogPost}</ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([blogPost], { type: 'text/markdown' });
                  element.href = URL.createObjectURL(file);
                  element.download = 'memory-story.md';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Download Story
              </button>
              <button
                onClick={generateBlogPost}
                className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Regenerate
              </button>
              <Link
                href="/stories"
                className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                View All Stories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
