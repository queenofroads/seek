'use client'

import Link from 'next/link'
import { use } from 'react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration_minutes?: number
  service_type: string
}

interface Profile {
  username: string
  full_name: string
  headline: string
  bio: string
  avatar_url?: string
  banner_image_url?: string
  twitter_url?: string
  linkedin_url?: string
  instagram_url?: string
}

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)

  // Mock data - will be replaced with actual Supabase data
  const profile: Profile = {
    username: username,
    full_name: 'Sarah Chen',
    headline: 'Design Consultant | Ex-Google',
    bio: 'I help founders and product teams design beautiful, user-friendly products. With 10+ years of experience at Google and various startups, I can help you with product design, UX strategy, and design systems.',
    avatar_url: undefined,
    banner_image_url: undefined,
    twitter_url: 'https://twitter.com/sarahchen',
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    instagram_url: undefined
  }

  const services: Service[] = [
    {
      id: '1',
      title: '30-min Design Review',
      description: 'Get expert feedback on your product design, UX flow, or design system.',
      price: 99,
      duration_minutes: 30,
      service_type: 'consultation'
    },
    {
      id: '2',
      title: '1-Hour Strategy Call',
      description: 'Discuss your product strategy, roadmap, and design approach in depth.',
      price: 199,
      duration_minutes: 60,
      service_type: 'consultation'
    },
    {
      id: '3',
      title: 'Design System Masterclass',
      description: 'Learn how to build and maintain scalable design systems for your team.',
      price: 49,
      service_type: 'digital_product'
    }
  ]

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      consultation: '💬',
      workshop: '🎓',
      digital_product: '💳',
      priority_dm: '💌'
    }
    return icons[type] || '📦'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              SEEK
            </Link>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800">
        {profile.banner_image_url && (
          <img
            src={profile.banner_image_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-black shadow-xl flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profile.full_name.charAt(0)}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
              <p className="text-gray-400 text-lg mb-4">{profile.headline}</p>

              {/* Social Links */}
              <div className="flex gap-3">
                {profile.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                  >
                    Twitter
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition group"
              >
                <div className="text-4xl mb-4">{getServiceIcon(service.service_type)}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">
                    ${service.price}
                    {service.duration_minutes && (
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        / {service.duration_minutes}min
                      </span>
                    )}
                  </p>
                </div>

                <button className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold">
                  Book Now
                </button>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 bg-black mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-400">
            Powered by{' '}
            <Link href="/" className="text-white hover:text-gray-300 font-semibold transition">
              SEEK
            </Link>
          </p>
          <p className="text-gray-500 text-sm mt-2">© 2025 SEEK. Build your creator business.</p>
        </div>
      </footer>
    </div>
  )
}
