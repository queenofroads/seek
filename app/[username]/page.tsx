'use client'

import Link from 'next/link'
import { use, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration_minutes?: number
  service_type: string
  currency: string
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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Booking form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Fetch active services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('creator_id', profileData.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (servicesError) throw servicesError
        setServices(servicesData || [])
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  const handleBookNow = (service: Service) => {
    setSelectedService(service)
    setShowBookingModal(true)
    setBookingError(null)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingError(null)
    setBookingLoading(true)

    try {
      if (!selectedService) return

      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`)

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          customerEmail,
          customerName,
          scheduledAt: scheduledAt.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Booking failed')
      setBookingLoading(false)
    }
  }

  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      consultation: '💬',
      workshop: '🎓',
      digital_product: '💳',
      priority_dm: '💌'
    }
    return icons[type] || '📦'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-white text-xl mb-2">Profile not found</p>
          <Link href="/" className="text-gray-400 hover:text-white">← Back to home</Link>
        </div>
      </div>
    )
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

                <button
                  onClick={() => handleBookNow(service)}
                  className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
                >
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
          <p className="text-gray-500 text-sm mt-2">© 2025 SEEK.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Book {selectedService.title}</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-white transition text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-400 mt-2">
                ${selectedService.price} {selectedService.duration_minutes && `/ ${selectedService.duration_minutes} min`}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {bookingError && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {bookingError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  disabled={bookingLoading}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
                >
                  {bookingLoading ? 'Processing...' : 'Pay & Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
