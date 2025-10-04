import Link from 'next/link';

export default function Home() {
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
              Memory Keeper
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Preserve your family&apos;s stories forever through AI-guided conversations
            </p>
          </div>

          {/* Value Proposition */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              Every grandparent has a lifetime of stories, wisdom, and memories.
              Don&apos;t let them fade away. Memory Keeper helps you capture these precious
              moments through thoughtful conversations and transforms them into beautiful
              blog posts for your entire family to cherish.
            </p>

            {/* CTA Button */}
            <Link href="/interview" className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Start Preserving Memories
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Guided Interviews
              </h3>
              <p className="text-gray-700">
                Thoughtful questions that help unlock memories and stories naturally
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Beautiful Blog Posts
              </h3>
              <p className="text-gray-700">
                Automatically transforms conversations into well-written stories
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Family Legacy
              </h3>
              <p className="text-gray-700">
                Share stories across generations and preserve your family&apos;s history
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
