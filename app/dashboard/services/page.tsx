'use client'

import Link from 'next/link'
import { useState } from 'react'

type ServiceType = 'consultation' | 'workshop' | 'digital_product' | 'priority_dm' | 'custom'
type ServiceStatus = 'draft' | 'active' | 'paused' | 'archived'

interface Service {
  id: string
  title: string
  description: string
  service_type: ServiceType
  status: ServiceStatus
  price: number
  currency: string
  duration_minutes?: number
  total_bookings: number
  total_revenue: number
}

export default function ServicesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock services - will be replaced with actual data from Supabase
  const services: Service[] = []

  const getServiceTypeLabel = (type: ServiceType) => {
    const labels = {
      consultation: '1:1 Consultation',
      workshop: 'Workshop',
      digital_product: 'Digital Product',
      priority_dm: 'Priority DM',
      custom: 'Custom'
    }
    return labels[type]
  }

  const getStatusColor = (status: ServiceStatus) => {
    const colors = {
      draft: 'bg-gray-700 text-gray-300',
      active: 'bg-green-900/50 text-green-300 border border-green-700',
      paused: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
      archived: 'bg-gray-800 text-gray-500'
    }
    return colors[status]
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 fixed h-full overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="text-3xl font-bold text-white">
            SEEK
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <span className="text-xl">🏠</span>
            Home
          </Link>
          <Link
            href="/dashboard/services"
            className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-black bg-white rounded-lg shadow-lg"
          >
            <span className="text-xl">📦</span>
            Services
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <span className="text-xl">📅</span>
            Bookings
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <span className="text-xl">📊</span>
            Analytics
          </Link>
          <Link
            href="/dashboard/community"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <span className="text-xl">👥</span>
            Community
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <span className="text-xl">⚙️</span>
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Creator</p>
              <p className="text-xs text-gray-400">View profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white">Services</h1>
                <p className="text-sm text-gray-400">Manage your offerings</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                + Create Service
              </button>
            </div>
          </div>
        </header>

        <div className="px-8 py-8">
          {services.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-6">📦</div>
                <h2 className="text-3xl font-bold text-white mb-4">Create Your First Service</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Start monetizing your expertise by creating a service. Offer 1:1 consultations, workshops, or digital products.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold text-lg"
                >
                  Create Your First Service
                </button>
              </div>
            </div>
          ) : (
            // Services grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {getServiceTypeLabel(service.service_type)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        ${service.price}
                        {service.duration_minutes && (
                          <span className="text-sm text-gray-400 font-normal ml-2">
                            / {service.duration_minutes}min
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500">Bookings</p>
                      <p className="text-lg font-semibold text-white">{service.total_bookings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-lg font-semibold text-white">${service.total_revenue}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition text-sm">
                      •••
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create New Service</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'consultation', label: '1:1 Consultation', icon: '💬' },
                      { value: 'workshop', label: 'Workshop', icon: '🎓' },
                      { value: 'digital_product', label: 'Digital Product', icon: '💳' },
                      { value: 'priority_dm', label: 'Priority DM', icon: '💌' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        className="p-4 bg-gray-800 border border-gray-700 hover:border-white rounded-lg transition text-left"
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-white">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 30-min Career Coaching Session"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what you'll cover in this service..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      placeholder="99"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Duration (minutes)
                    </label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white">
                      <option>15</option>
                      <option>30</option>
                      <option>45</option>
                      <option>60</option>
                      <option>90</option>
                      <option>120</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    Create Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
