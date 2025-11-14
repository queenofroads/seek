'use client'

import Link from 'next/link'

export default function Home() {
  const creators = [
    { name: 'Sarah Chen', role: 'Design Consultant', gradient: 'from-gray-700 to-gray-800' },
    { name: 'Marcus Johnson', role: 'Tech Coach', gradient: 'from-gray-800 to-gray-900' },
    { name: 'Alex Rivera', role: 'Business Strategist', gradient: 'from-gray-600 to-gray-800' },
    { name: 'Emma Wilson', role: 'Marketing Expert', gradient: 'from-gray-900 to-gray-700' },
    { name: 'David Kim', role: 'Finance Advisor', gradient: 'from-gray-700 to-gray-900' },
    { name: 'Sophie Martin', role: 'Career Coach', gradient: 'from-gray-800 to-gray-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <h1 className="text-3xl font-bold text-white">
                  SEEK
                </h1>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/search" className="text-gray-400 hover:text-white transition font-medium">
                  Search
                </Link>
                <Link href="/listing" className="text-gray-400 hover:text-white transition font-medium">
                  Listing
                </Link>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition font-medium">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition px-4 py-2 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg transition font-semibold"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="relative z-10">
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                One link.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Everything</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">you offer.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 mb-8 leading-relaxed">
                Share your knowledge. Get paid instantly. It just works.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="bg-white hover:bg-gray-200 text-black font-semibold px-10 py-5 rounded-lg text-xl transition inline-flex items-center justify-center gap-2"
                >
                  Get Started
                  <span className="text-2xl">→</span>
                </Link>
              </div>
            </div>

            {/* Right: Creator Grid with Scroll Animation */}
            <div className="relative overflow-hidden">
              <style jsx>{`
                @keyframes scroll-up {
                  0% {
                    transform: translateY(0);
                  }
                  100% {
                    transform: translateY(-50%);
                  }
                }
                .animate-scroll {
                  animation: scroll-up 20s linear infinite;
                }
                .animate-scroll:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="grid grid-cols-2 gap-4 animate-scroll">
                {[...creators, ...creators].map((creator, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl hover:shadow-gray-700/50 transition group cursor-pointer transform hover:scale-105"
                  >
                    <div className={`h-32 bg-gradient-to-br ${creator.gradient} relative flex items-center justify-center`}>
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/20"></div>
                    </div>
                    <div className="p-4 bg-gray-900/90">
                      <h3 className="font-semibold text-white mb-1">{creator.name}</h3>
                      <p className="text-sm text-gray-400">{creator.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Simple. Powerful.
            </h2>
            <p className="text-2xl text-gray-400">
              Everything you need. Nothing you don't.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📅',
                title: '1:1 Sessions',
                description: 'Book calls. Get paid. Automatically.'
              },
              {
                icon: '🎓',
                title: 'Workshops',
                description: 'Teach what you know. Scale your impact.'
              },
              {
                icon: '💳',
                title: 'Digital Products',
                description: 'Create once. Sell forever.'
              },
              {
                icon: '💰',
                title: 'Priority Access',
                description: 'Your time is valuable. Charge for it.'
              },
              {
                icon: '🔗',
                title: 'One Link',
                description: 'Everything in one place. Beautiful.'
              },
              {
                icon: '📊',
                title: 'Insights',
                description: 'Know what works. Grow faster.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-gray-700/30 transition transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready?
          </h2>
          <p className="text-2xl text-gray-400 mb-10">
            Start in minutes. Free.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white hover:bg-gray-200 text-black font-semibold px-12 py-6 rounded-lg text-2xl transition transform hover:scale-105"
          >
            Get Started →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white font-medium transition">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white font-medium transition">Pricing</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-white font-medium transition">Search</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white font-medium transition">Blog</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white font-medium transition">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white font-medium transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white font-medium transition">About</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white font-medium transition">Careers</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white font-medium transition">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white font-medium transition">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white font-medium transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 SEEK.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
