-- SEEK Platform Database Schema
-- This schema supports a Topmate-like creator platform with services, bookings, and payments

-- ============================================
-- PROFILES TABLE
-- Extended user information beyond Supabase auth
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT, -- e.g., "Marketing Consultant | Ex-Google"

  -- Contact & Social
  email TEXT,
  phone TEXT,
  website_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,

  -- Customization
  theme_color TEXT DEFAULT '#000000',
  banner_image_url TEXT,

  -- Business settings
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',

  -- Stripe integration
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Index for fast username lookups
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================
-- SERVICES TABLE
-- Creator offerings (1:1, workshops, digital products)
-- ============================================
CREATE TYPE service_type AS ENUM ('consultation', 'workshop', 'digital_product', 'priority_dm', 'custom');
CREATE TYPE service_status AS ENUM ('draft', 'active', 'paused', 'archived');

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  service_type service_type NOT NULL,
  status service_status DEFAULT 'draft',

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- For consultations/workshops
  duration_minutes INTEGER, -- e.g., 30, 60, 90
  max_participants INTEGER DEFAULT 1, -- 1 for 1:1, >1 for workshops

  -- For digital products
  file_url TEXT, -- Download link for digital products
  file_type TEXT, -- pdf, zip, etc.

  -- Availability
  is_bookable BOOLEAN DEFAULT TRUE,
  booking_buffer_hours INTEGER DEFAULT 24, -- Minimum notice required

  -- Display
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Stats (denormalized for performance)
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0
);

CREATE INDEX idx_services_creator ON services(creator_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_type ON services(service_type);

-- ============================================
-- AVAILABILITY TABLE
-- When creators are available for bookings
-- ============================================
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Optional: service-specific availability
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_availability_creator ON availability(creator_id);
CREATE INDEX idx_availability_service ON availability(service_id);

-- ============================================
-- BOOKINGS TABLE
-- Customer bookings for services
-- ============================================
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'refunded');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Can be null for guest bookings

  -- Customer info (for guests)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,

  -- Booking details
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',

  -- Meeting details
  meeting_link TEXT, -- Zoom, Google Meet, etc.
  meeting_notes TEXT,

  -- Payment
  amount_paid DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,

  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT future_booking CHECK (scheduled_at > created_at)
);

CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_creator ON bookings(creator_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- REVIEWS TABLE
-- Customer reviews for completed services
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,

  -- Display control
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per booking
  CONSTRAINT unique_booking_review UNIQUE (booking_id)
);

CREATE INDEX idx_reviews_service ON reviews(service_id);
CREATE INDEX idx_reviews_creator ON reviews(creator_id);
CREATE INDEX idx_reviews_public ON reviews(is_public) WHERE is_public = TRUE;

-- ============================================
-- TRANSACTIONS TABLE
-- Financial transaction history
-- ============================================
CREATE TYPE transaction_type AS ENUM ('booking_payment', 'refund', 'payout', 'fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,

  -- Transaction details
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Platform fee
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(10, 2) NOT NULL,

  -- Payment provider
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,

  -- Metadata
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_creator ON transactions(creator_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ============================================
-- ANALYTICS TABLE
-- Aggregated analytics data
-- ============================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Time period
  date DATE NOT NULL,

  -- Metrics
  profile_views INTEGER DEFAULT 0,
  service_views INTEGER DEFAULT 0,
  bookings_created INTEGER DEFAULT 0,
  bookings_completed INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  new_customers INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_creator_date UNIQUE (creator_id, date)
);

CREATE INDEX idx_analytics_creator ON analytics(creator_id);
CREATE INDEX idx_analytics_date ON analytics(date DESC);

-- ============================================
-- NOTIFICATIONS TABLE
-- In-app notifications for users
-- ============================================
CREATE TYPE notification_type AS ENUM ('booking', 'review', 'payment', 'system');

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all public profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Services: Public can view active services, creators can manage their own
CREATE POLICY "Active services are viewable by everyone" ON services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Creators can manage own services" ON services
  FOR ALL USING (auth.uid() = creator_id);

-- Bookings: Creators and customers can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = creator_id OR
    auth.uid() = customer_id
  );

CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Creators and customers can update own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    auth.uid() = customer_id
  );

-- Reviews: Public reviews are viewable by everyone
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Customers can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Transactions: Users can only view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = creator_id);

-- Notifications: Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get creator's total earnings
CREATE OR REPLACE FUNCTION get_creator_earnings(creator_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(net_amount), 0)
  FROM transactions
  WHERE creator_id = creator_uuid
    AND status = 'completed'
    AND type = 'booking_payment';
$$ LANGUAGE SQL;

-- Function to get service average rating
CREATE OR REPLACE FUNCTION get_service_rating(service_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(rating), 0)
  FROM reviews
  WHERE service_id = service_uuid
    AND is_public = TRUE;
$$ LANGUAGE SQL;

-- Function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(creator_uuid UUID, view_date DATE)
RETURNS VOID AS $$
  INSERT INTO analytics (creator_id, date, profile_views)
  VALUES (creator_uuid, view_date, 1)
  ON CONFLICT (creator_id, date)
  DO UPDATE SET profile_views = analytics.profile_views + 1;
$$ LANGUAGE SQL;
