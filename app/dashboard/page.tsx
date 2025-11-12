'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DashboardPage() {
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
            className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-black bg-white rounded-lg shadow-lg"
          >
            <span className="text-xl">🏠</span>
            Home
          </Link>
          <Link
            href="/dashboard/services"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
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
                <h1 className="text-4xl font-bold text-white">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-400">Power up your creator business</p>
              </div>
              <Link href="/" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold">
                View Public Page
              </Link>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="px-8 py-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl mb-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl">🚀</span>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to SEEK</h2>
                <p className="text-xl text-gray-400">Let's get your creator business started</p>
              </div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-300 text-lg mb-4">
                <strong className="text-white">Your account is active!</strong> Now it's time to set up your creator storefront and start making money.
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard/services" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold">
                  Create Your First Service →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-6">
              Quick Start Guide
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  icon: '⚡',
                  title: 'Create Services',
                  description: 'Add your 1:1 consultations, workshops, or digital products',
                  link: '/dashboard/services'
                },
                {
                  step: '2',
                  icon: '🎨',
                  title: 'Customize Profile',
                  description: 'Make your public page stand out with your brand',
                  link: '/dashboard/settings'
                },
                {
                  step: '3',
                  icon: '📣',
                  title: 'Share Your Link',
                  description: 'Start promoting your creator page and getting bookings',
                  link: '/dashboard'
                }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-gray-700/30 transition transform hover:scale-105 relative group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold">
                      {item.step}
                    </div>
                    <span className="text-5xl">{item.icon}</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Features Overview */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Your Superpowers
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '💰',
                  title: 'Start Earning',
                  description: 'Accept payments for consultations, workshops, and digital products'
                },
                {
                  icon: '📅',
                  title: 'Automated Booking',
                  description: 'Let clients book time with you automatically - no back and forth'
                },
                {
                  icon: '📊',
                  title: 'Track Everything',
                  description: 'See your revenue, bookings, and growth all in one place'
                },
                {
                  icon: '🔗',
                  title: 'One Link',
                  description: 'Share one simple link that showcases all your offerings'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 hover:shadow-xl transition"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
