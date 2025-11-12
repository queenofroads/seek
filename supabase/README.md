# SEEK Database Schema Documentation

This document explains the database structure for the SEEK creator platform.

## Overview

The database is designed to support a Topmate-like platform where creators can:
- Create and manage services (consultations, workshops, digital products)
- Accept bookings from customers
- Manage their availability
- Track earnings and analytics
- Receive payments via Stripe

## Database Tables

### 1. **profiles**
Extended user information beyond Supabase's built-in auth.

**Key Fields:**
- `username` - Unique username for public profile URL (e.g., seek.com/sarah)
- `bio`, `headline` - Profile information
- `stripe_account_id` - Connected Stripe account
- Social links (Twitter, LinkedIn, Instagram)
- Theme customization

**Relationships:**
- One-to-many with `services`
- One-to-many with `bookings` (as creator or customer)

### 2. **services**
Creator offerings that can be booked or purchased.

**Service Types:**
- `consultation` - 1:1 video calls
- `workshop` - Group sessions/webinars
- `digital_product` - Downloadable content (ebooks, templates, courses)
- `priority_dm` - Paid direct messaging
- `custom` - Other custom offerings

**Key Fields:**
- `price`, `currency` - Pricing information
- `duration_minutes` - For time-based services
- `max_participants` - 1 for 1:1, >1 for workshops
- `file_url` - Download link for digital products
- `status` - draft, active, paused, archived

**Stats (Denormalized):**
- `total_bookings` - Count of all bookings
- `total_revenue` - Sum of all revenue from this service

### 3. **availability**
Creator availability schedule for bookings.

**Key Fields:**
- `day_of_week` - monday through sunday
- `start_time`, `end_time` - Available hours
- `service_id` - Optional service-specific availability

**Example:**
```sql
-- Creator available Monday-Friday, 9 AM - 5 PM
INSERT INTO availability (creator_id, day_of_week, start_time, end_time)
VALUES
  (creator_uuid, 'monday', '09:00', '17:00'),
  (creator_uuid, 'tuesday', '09:00', '17:00'),
  ...
```

### 4. **bookings**
Customer bookings for services.

**Booking Flow:**
1. Customer books → status: `pending`
2. Payment confirmed → status: `confirmed`
3. Service delivered → status: `completed`
4. Or cancelled → status: `cancelled`/`refunded`

**Key Fields:**
- `scheduled_at` - When the service is scheduled
- `customer_name`, `customer_email` - Customer info (supports guest bookings)
- `amount_paid` - Amount customer paid
- `meeting_link` - Video call link (Zoom, Google Meet, etc.)
- `stripe_payment_intent_id` - Stripe payment reference

### 5. **reviews**
Customer reviews for completed services.

**Key Fields:**
- `rating` - 1 to 5 stars
- `review_text` - Written feedback
- `is_public` - Whether review is shown publicly
- `is_featured` - Highlighted reviews on profile

**Constraints:**
- One review per booking
- Must reference a completed booking

### 6. **transactions**
Financial transaction history.

**Transaction Types:**
- `booking_payment` - Customer pays for booking
- `refund` - Refund issued to customer
- `payout` - Platform pays creator
- `fee` - Platform fees

**Key Fields:**
- `amount` - Total amount
- `platform_fee` - Platform's cut
- `net_amount` - Creator receives
- `stripe_charge_id`, `stripe_transfer_id` - Stripe references

### 7. **analytics**
Aggregated daily analytics per creator.

**Metrics Tracked:**
- `profile_views` - Profile page visits
- `service_views` - Service detail page visits
- `bookings_created` - New bookings
- `bookings_completed` - Completed services
- `revenue` - Daily revenue
- `new_customers` - First-time customers

**Usage:**
```sql
-- Get creator's revenue for last 30 days
SELECT date, revenue
FROM analytics
WHERE creator_id = creator_uuid
  AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;
```

### 8. **notifications**
In-app notifications for users.

**Notification Types:**
- `booking` - New booking, cancellation, reminder
- `review` - New review received
- `payment` - Payment received, payout processed
- `system` - Platform announcements

## Row Level Security (RLS)

All tables have RLS enabled with policies:

- **profiles**: Public profiles viewable by all, users can update own profile
- **services**: Active services viewable by all, creators manage own
- **bookings**: Users can only view/edit their own bookings
- **reviews**: Public reviews viewable by all
- **transactions**: Users can only view own transactions
- **notifications**: Users can only view own notifications

## Helper Functions

### `get_creator_earnings(creator_uuid UUID)`
Returns total earnings for a creator.

```sql
SELECT get_creator_earnings('creator-uuid-here');
-- Returns: 2450.00
```

### `get_service_rating(service_uuid UUID)`
Returns average rating for a service.

```sql
SELECT get_service_rating('service-uuid-here');
-- Returns: 4.5
```

### `increment_profile_views(creator_uuid UUID, view_date DATE)`
Increments profile view count in analytics.

```sql
SELECT increment_profile_views('creator-uuid-here', CURRENT_DATE);
```

## Setup Instructions

### 1. Run the Schema in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql`
4. Click **Run** to execute

### 2. Verify Tables

Go to **Table Editor** and verify all tables are created:
- profiles
- services
- availability
- bookings
- reviews
- transactions
- analytics
- notifications

### 3. Test RLS Policies

Create a test user and verify:
- They can create their own profile
- They can only see active services
- They can only access their own bookings

## TypeScript Types

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

## Common Queries

### Get Creator's Active Services
```sql
SELECT * FROM services
WHERE creator_id = 'creator-uuid'
  AND status = 'active'
ORDER BY display_order, created_at;
```

### Get Upcoming Bookings for Creator
```sql
SELECT
  b.*,
  s.title as service_title,
  s.duration_minutes
FROM bookings b
JOIN services s ON b.service_id = s.id
WHERE b.creator_id = 'creator-uuid'
  AND b.status IN ('pending', 'confirmed')
  AND b.scheduled_at > NOW()
ORDER BY b.scheduled_at ASC;
```

### Get Creator's Revenue This Month
```sql
SELECT
  COALESCE(SUM(net_amount), 0) as total_revenue
FROM transactions
WHERE creator_id = 'creator-uuid'
  AND status = 'completed'
  AND type = 'booking_payment'
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE);
```

### Get Service with Average Rating
```sql
SELECT
  s.*,
  get_service_rating(s.id) as avg_rating,
  COUNT(r.id) as review_count
FROM services s
LEFT JOIN reviews r ON r.service_id = s.id AND r.is_public = TRUE
WHERE s.id = 'service-uuid'
GROUP BY s.id;
```

## Migration Strategy

If you already have data and need to migrate:

1. **Backup existing data** from Supabase
2. **Run schema.sql** in a test project first
3. **Test thoroughly** with sample data
4. **Run in production** during low-traffic period
5. **Verify data integrity** after migration

## Next Steps

After setting up the database:

1. ✅ Update `lib/supabase/client.ts` to use TypeScript types
2. ✅ Create API routes for common operations
3. ✅ Build UI for creating services
4. ✅ Implement booking flow
5. ✅ Set up Stripe integration
6. ✅ Build analytics dashboard

## Support

For questions about the schema:
- Check Supabase docs: https://supabase.com/docs
- PostgreSQL docs: https://www.postgresql.org/docs/
