import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { serviceId, customerEmail, customerName, scheduledAt } = await request.json()

    // Validate inputs
    if (!serviceId || !customerEmail || !customerName || !scheduledAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get service details from Supabase
    const supabase = await createClient()
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*, profiles!services_creator_id_fkey(username, full_name)')
      .eq('id', serviceId)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: service.currency.toLowerCase(),
            product_data: {
              name: service.title,
              description: `${service.duration_minutes} minutes with ${service.profiles.full_name}`,
            },
            unit_amount: Math.round(service.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/${service.profiles.username}`,
      customer_email: customerEmail,
      metadata: {
        serviceId,
        creatorId: service.creator_id,
        customerName,
        scheduledAt,
      },
    })

    // Create pending booking in database
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert({
        service_id: serviceId,
        creator_id: service.creator_id,
        customer_email: customerEmail,
        customer_name: customerName,
        scheduled_at: scheduledAt,
        status: 'pending',
        stripe_payment_intent_id: session.id,
      })

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
